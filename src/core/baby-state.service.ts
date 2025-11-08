import { Injectable, computed, effect, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { environment } from '../environments/environment';

// -------- 型別區 --------
export type Gender = 'male' | 'female' | 'other';
type RecordType = 'feed' | 'diaper' | 'sleep';
type Baby = {
  id: string;
  name: string;
  birth?: string;
  gender: Gender;
  records: any[];
};

// -------- 日期工具 --------
function localDayRange(d = new Date()) {
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
  const end = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  return {
    startTs: Timestamp.fromDate(start),
    endTs: Timestamp.fromDate(end),
    iso: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`,
  };
}

// -------- 主服務 --------
@Injectable({ providedIn: 'root' })
export class BabyStateService {
  // Firebase 初始化
  private app = initializeApp(environment.firebase);
  private db = getFirestore(this.app);

  // signals 狀態
  readonly babies = signal<Baby[]>([]);
  readonly currentBabyId = signal<string | null>(null);
  readonly todayISO = signal<string>(localDayRange().iso);
  readonly todayRecords = signal<any[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly currentBaby = computed(
    () => this.babies().find((b) => b.id === this.currentBabyId()) ?? null
  );

  private persist = effect(() => {
    const id = this.currentBabyId();
    if (id) localStorage.setItem('currentBabyId', id);
  });

  constructor() {
    const cached = localStorage.getItem('currentBabyId');
    if (cached) this.currentBabyId.set(cached);
    this.loadBabies().then(() => {
      if (this.currentBabyId()) this.loadTodayRecords();
    });
  }

  // -------- 讀取寶寶列表 --------
  async loadBabies() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const snap = await getDocs(collection(this.db, 'babies'));
      const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Baby, 'id'>) }));
      this.babies.set(list);
      if (!this.currentBabyId() && list.length) this.currentBabyId.set(list[0].id);
    } catch (e: any) {
      this.error.set(e?.message ?? 'loadBabies failed');
    } finally {
      this.loading.set(false);
    }
  }

  // -------- 新增寶寶 --------
  async addBaby(input: Omit<Baby, 'id' | 'records'>) {
    await addDoc(collection(this.db, 'babies'), { ...input, records: [] });
    await this.loadBabies();
  }

  // -------- 切換寶寶 --------
  selectBaby(id: string) {
    this.currentBabyId.set(id);
    this.loadTodayRecords();
  }

  // -------- 新增紀錄 --------
  async addRecord(record: { type: RecordType; payload: any; time?: string }) {
    const babyId = this.currentBabyId();
    if (!babyId) throw new Error('No baby selected');

    // 樂觀更新（先顯示在前端）
    const optimistic = {
      id: 'optimistic-' + Math.random(),
      time: new Date().toISOString(),
      ...record,
    };
    this.todayRecords.update((rs) => [...rs, optimistic]);

    try {
      await addDoc(collection(this.db, `babies/${babyId}/records`), {
        type: record.type,
        payload: record.payload,
        time: serverTimestamp(), // 實際寫入由伺服器填時間
      });
      await this.loadTodayRecords(); // 重新同步 Firestore 資料
    } catch (e) {
      this.todayRecords.update((rs) => rs.filter((r) => r !== optimistic));
      throw e;
    }
  }

  // -------- 載入「今天」的紀錄 --------
  async loadTodayRecords() {
    const babyId = this.currentBabyId();
    if (!babyId) return;

    const { startTs, endTs } = localDayRange();
    this.loading.set(true);
    this.error.set(null);

    try {
      const q = query(
        collection(this.db, `babies/${babyId}/records`),
        where('time', '>=', startTs),
        where('time', '<=', endTs),
        orderBy('time', 'asc')
      );
      const snap = await getDocs(q);
      this.todayRecords.set(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e: any) {
      this.error.set(e?.message ?? 'loadTodayRecords failed');
    } finally {
      this.loading.set(false);
    }
  }
}
