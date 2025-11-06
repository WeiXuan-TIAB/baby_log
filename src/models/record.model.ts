export type RecordType = 'feed' | 'diaper' | 'sleep';

export interface RecordBase {
  id?: string;
  type: RecordType;
  time: string;           // ISO 格式時間（Firestore 時間戳轉換後）
  note?: string;
}

// 各種紀錄細項（依 type 不同）
export interface FeedPayload {
  foodType: 'milk' | 'solid';
  amount?: number;
  duration?: number;      // 花費時間（分鐘）
}

export interface DiaperPayload {
  status: 'urine' | 'stool' | 'mixed';
  time: string;
}

export interface SleepPayload {
  duration: number;       // 睡多久（分鐘）
}

// 最終紀錄（統一型別）
export interface Record extends RecordBase {
  payload: FeedPayload | DiaperPayload | SleepPayload;
}
