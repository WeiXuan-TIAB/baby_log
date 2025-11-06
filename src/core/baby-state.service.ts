import { Injectable, computed, effect, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

type Baby = { id: string; name: string; birth?: string; gender: Gender; records: any[] };
type Gender = 'male' | 'female' | 'other';
type RecordType = 'feed' | 'diaper' | 'sleep';

@Injectable({ providedIn: 'root' })
export class BabyStateService {
  // Firebase 初始化
  private app = initializeApp(environment.firebase);
  private db = getFirestore(this.app);

  // signals 狀態
  readonly babies = signal<Baby[]>([]);
  readonly currentBabyId = signal<string | null>(null);
  readonly todayISO = signal<string>(new Date().toISOString().slice(0, 10));
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

  async loadBabies() {
    this.loading.set(true);
    this.error.set(null);
    try {
      const snap = await getDocs(collection(this.db, 'babies'));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Baby[];
      this.babies.set(list);
      if (!this.currentBabyId() && list.length) this.currentBabyId.set(list[0].id);
    } catch (e: any) {
      this.error.set(e?.message ?? 'loadBabies failed');
    } finally {
      this.loading.set(false);
    }
  }

  async addBaby(input: { name: string; birth?: string }) {
    await addDoc(collection(this.db, 'babies'), input);
    await this.loadBabies();
  }

  selectBaby(id: string) {
    this.currentBabyId.set(id);
    this.loadTodayRecords();
  }

  async addRecord(record: { type: RecordType; time: string; payload: any }) {
    const babyId = this.currentBabyId();
    if (!babyId) throw new Error('No baby selected');

    // 樂觀更新
    const optimistic = { id: 'optimistic-' + Math.random(), ...record };
    this.todayRecords.update((rs) => [...rs, optimistic]);

    try {
      await addDoc(collection(this.db, `babies/${babyId}/records`), record);
      await this.loadTodayRecords(); // 重新拉取，確保排序落庫正確
    } catch (e) {
      this.todayRecords.update((rs) => rs.filter((r) => r !== optimistic));
      throw e;
    }
  }

  async loadTodayRecords() {
    const babyId = this.currentBabyId();
    if (!babyId) return;

    const dayISO = this.todayISO();
    const start = new Date(`${dayISO}T00:00:00`);
    const end = new Date(`${dayISO}T23:59:59`);

    this.loading.set(true);
    this.error.set(null);
    try {
      const q = query(
        collection(this.db, `babies/${babyId}/records`),
        where('time', '>=', start.toISOString()),
        where('time', '<=', end.toISOString()),
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
