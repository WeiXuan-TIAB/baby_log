# Baby Log 萌芽誌 — 五日 MVP（Spec-Driven Development）

## Phase 1：Specify（規格定義）

### 核心價值主張
讓保母能以最少步驟，快速記錄多名寶寶的日常（飲食、尿布、睡眠），並即時查看同日紀錄。

### 目標使用者
- 主要：保母（同時照顧多名寶寶）
- 次要：寶寶父母或主要照顧者（以查看為主）

### 使用者旅程（MVP 範圍）
1. 切換到目標寶寶。
2. 一鍵開啟表單（飲食／尿布／睡眠）並完成填寫。
3. 立即在「當日紀錄列表」看到新增紀錄。
4. 手機操作為主，整個流程 5–10 秒內完成。

### 成功指標（MVP）
- 單次紀錄操作 ≤ 5 秒
- 新增後列表即時顯示
- 行動端主要流程幾乎無捲動
- 五天內可上線 Demo（含資料持久化與錯誤提示）

---

## Phase 2：Plan（技術規劃）

### 技術棧
- 前端：Angular 20 + TypeScript（standalone）
- 樣式：Tailwind CSS v4（Mobile-first）
- 後端／資料庫：Firebase（Firestore）
- 部署：Vercel（前端）

### 架構與限制（MVP）
- 不做登入與角色分權（單一使用者情境）
- Firestore 結構：`babies/{babyId}/records/{recordId}`
- `records.type ∈ {feed, diaper, sleep}`
- 僅實作即時讀寫與「今日列表」
- 先加 manifest（可安裝到主畫面），不做離線快取

### Firestore 結構（MVP）
babies
└── {babyId} // { name, birth }
└── records
└── {recordId} // { type, time, payload }
- type: "feed" | "diaper" | "sleep"
- time: ISOString
- payload:
· feed: { foodType: "milk"|"solid", amount?: number, note?: string }
· diaper: { status: "urine"|"stool"|"mixed", note?: string }
· sleep: { start: ISOString, end?: ISOString, durationMin?: number }


---

## Phase 3：Tasks（五天任務拆解）

### Day 1：初始化與資料模型
- T001 初始化 Angular、Tailwind、路由
- T002 串接 Firebase（Firestore），建立最小 CRUD
- T003 設計 babies / records 型別與欄位
- T004 寶寶清單頁（列表 + 新增寶寶：姓名、生日）

### Day 2：飲食紀錄（奶量／副食品）
- T005 Feeding 表單（milk/solid、amount、time、note）
- T006 寫入 Firestore（babies/{id}/records）
- T007 當日紀錄列表（日期分組，含飲食）
- T008 基礎 Loading／Error 提示

### Day 3：尿布紀錄
- T009 Diaper 表單（urine/stool/mixed、time、note）
- T010 寫入與列表顯示
- T011 列表樣式優化（卡片化、標籤化）

### Day 4：睡眠紀錄
- T012 Sleep 表單（start、end，自動算 duration）
- T013 寫入與展示（區間＋時長）
- T014 多寶寶切換（切換器＋狀態保持）

### Day 5：RWD、安裝與上線
- T015 全站 RWD 微調（大按鈕、短表單）
- T016 manifest（名稱、icons、display=standalone）
- T017 文案、空狀態、錯誤邊界
- T018 Vercel 部署、環境變數、最終驗收

---

## Phase 4：Implement（實作與審查）

### 開發準則
- 一任務一 PR，改動集中（表單／列表模組）
- Firestore 操作集中於 service，元件負責驗證與 UI
- 表單最小驗證（必要欄位、時間格式）
- 樂觀更新：先更新 UI，再同步後端，失敗回滾

### 驗收清單（MVP）
- 寶寶：可新增、列出、切換；切換後自動載入該寶寶紀錄
- 飲食：milk/solid、time、amount（milk 需 amount）、note；新增後進列表
- 尿布：urine/stool/mixed；即時顯示
- 睡眠：start/end，自動計算分鐘數；顯示區間與時長
- 列表：預設顯示「今日」紀錄，type 顯示清楚
- RWD：iPhone 13 寬度可單手操作（可點擊 ≥44px）
- 安裝：可加入主畫面，standalone 開啟
- 部署：公開 URL 可 Demo，Loading/Error 不阻斷流程

---

## 未來預計開發（Post-MVP）
- 帳號與權限：Firebase Auth；保母可編輯、父母僅檢視
- 一鍵複製分享：將當日摘要生成人類可讀文字
- 統計與報表：日／週／月趨勢（奶量、副食品次數、睡眠總時長）
- 離線能力：Service Worker 快取、IndexedDB 同步
- 通知提醒：餵奶、尿布、就寢提醒
- 圖片與附件：寶寶頭像、特殊事件照片
- 進階睡眠：計時器模式（懸浮計時 → 一鍵存檔）
- 可用性：多語系、深色模式、鍵盤快捷

---

# Baby Log — 5-Day MVP (Spec-Driven Development)

## Phase 1: Specify

### Core Value Proposition
Enable babysitters to record multiple babies’ daily activities (feeding, diaper, sleep) with the fewest steps and see the daily log instantly.

### Target Users
- Primary: Babysitters (caring for multiple babies)
- Secondary: Parents/main caregivers (view-only)

### MVP User Journey
1. Switch to the target baby
2. Open a form (feeding/diaper/sleep) and submit
3. See the new record in “Today” list immediately
4. Mobile-first, 5–10 seconds end-to-end

### Success Metrics (MVP)
- Record entry ≤ 5s
- Immediate list refresh after adding a record
- Minimal scrolling on mobile
- Online demo within 5 days (with persistence and error UI)

---

## Phase 2: Plan

### Tech Stack
- Frontend: Angular 20 + TypeScript (standalone)
- Styling: Tailwind CSS v4 (mobile-first)
- Backend/DB: Firebase (Firestore)
- Deployment: Vercel (frontend)

### Architecture & Constraints
- No auth/roles for MVP (single user)
- Firestore path: `babies/{babyId}/records/{recordId}`
- `records.type ∈ {feed, diaper, sleep}`
- Only real-time R/W and “Today” list
- Add manifest (install to home screen); skip offline cache

---

## Phase 3: Tasks (5-Day Plan)
- Day 1: Init & data model (Angular, Tailwind, router, Firebase, types, baby list/create)
- Day 2: Feeding (form, Firestore write, Today list, loading/error UI)
- Day 3: Diaper (form, write, list, list visual polish)
- Day 4: Sleep (form with duration calc, list), multi-baby switcher
- Day 5: RWD polish, manifest, empty/error states, Vercel deploy

---

## Phase 4: Implement

### Principles
- One task per PR (focused scope)
- Firestore calls in services; components handle validation/UI
- Minimal validation (required fields, time format)
- Optimistic UI updates with rollback on failure

### Acceptance Criteria
- Babies: create/list/switch; list reloads per baby
- Feeding: milk/solid, time, amount (required for milk), note; appears in Today list
- Diaper: urine/stool/mixed; appears instantly
- Sleep: start/end, auto duration; show interval + minutes
- List: “Today” by default; clear type tags
- RWD: one-hand friendly (hit areas ≥ 44px)
- Install: Add-to-Home-Screen; standalone
- Deploy: public demo URL; loading/error UI doesn’t block flow

---

## Post-MVP
Auth & roles, one-tap share (text summary), charts/reports, offline (SW + IndexedDB), reminders, images/attachments, advanced sleep timer, i18n/dark mode/shortcuts.

