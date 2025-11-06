// src/models/baby.model.ts
export interface Baby {
  id?: string;          // Firestore 自動產生的文件 ID
  name: string;         // 寶寶暱稱
  gender?: 'male' | 'female' | 'other'; // 性別，可選
  birthday?: string;    // 出生日期（ISO 字串或 Firestore Timestamp 轉換後）
}
