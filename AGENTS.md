# Study Flow — AI 開發規則

## 專案目的
提供大學生管理作業、考試與讀書進度的繁體中文靜態網站。核心是快速記錄與追蹤，不需要帳號或後端。所有初始任務都是示範資料，不代表使用者真實行程。

## 技術與目錄
- 純 HTML、CSS、原生 JavaScript；禁止引入框架、CDN、追蹤工具或 API 金鑰。
- `index.html`：任務儀表板與新增表單。
- `assets/styles.css`：全站共用樣式與設計變數。
- `assets/app.js`：儀表板互動與 localStorage。
- `guides/index.html`：指南索引；新增指南時必須更新。
- `guides/<英文小寫-kebab-case>.html`：獨立指南頁。
- `tests/check.mjs`：不需套件的結構與功能檢查。
- `.github/workflows/pages.yml`：GitHub Pages 部署。

## 風格與共用結構
使用 `lang="zh-Hant"`、UTF-8、viewport。介面用繁體中文；程式識別字用英文。整體採米白底、深綠主色、橘色提示；色彩一律引用 CSS 變數。內容最大寬度 1120px，卡片圓角 18px，使用系統字型。每頁依序包含跳至主要內容連結、品牌導覽、唯一 h1、main、footer。導覽需標記目前頁面 `aria-current="page"`。手機 640px 以下維持單欄，不得橫向溢出。

## 任務資料規則
每筆任務格式：`{id, title, course, type, due, progress}`。
- id：唯一字串，使用 `crypto.randomUUID()`。
- title：去除空白後 1–80 字；course：1–40 字。
- type：只允許 `assignment`、`exam`。
- due：有效的 `YYYY-MM-DD` 本地日期；當日截止不能算逾期。
- progress：0–100 的整數，100 表示完成。
- localStorage key 固定為 `study-flow.tasks.v1`；不要未經遷移變更格式。
- 首次開啟載入示範任務；使用者刪到空陣列後重新整理必須仍為空。
- 排序：未完成優先，再按截止日期升冪。
- 統計以全部任務計算，不因搜尋／篩選改變；完成率為完成筆數／總筆數。

## 新增指南步驟
1. 複製 `guides/exam-preparation.html` 的共同骨架。
2. 檔名使用描述性的英文小寫與連字號，如 `weekly-review.html`。
3. 填入獨立 title、meta description、h1、一句摘要。
4. 正文至少有「適用情境」「操作步驟」「檢查清單」三個 h2；步驟要具體可執行。
5. 保留返回指南索引與儀表板連結；相對路徑必須支援 GitHub Pages 專案子目錄。
6. 在 `guides/index.html` 新增一張含標題、摘要與連結的卡片。
7. 更新 README 的頁面列表，執行檢查並確認手機版。

## AI 修改約束
- 動手前先閱讀本文件與相關檔案；只修改任務所需內容。
- 共用樣式放在 styles.css，不複製到每一頁；腳本不得有 inline onclick。
- 使用者文字必須用 `textContent` 輸出，禁止插入 innerHTML。
- 表單必須有 label、必填檢查與清楚錯誤；所有功能可用鍵盤操作，保留焦點外框。
- 儲存失敗與資料毀損要顯示提示，不得假裝已成功儲存，也不得直接覆蓋毀損資料。
- 不要自動刪除使用者資料；刪除單筆任務須確認。
- 不得宣稱有雲端同步、系統通知或尚未實作的功能。
- 不新增付費服務或後端，不提交個資、密碼、token、node_modules。

## 驗證與交付
執行 `node tests/check.mjs`；用 `python -m http.server 8000` 預覽並手動檢查：新增→搜尋→篩選→調整進度→重整保留→刪除；指南往返；360px 與桌面版；鍵盤 Tab。測試失敗先修正，不得刪掉測試來通過。交付時列出修改、已執行檢查與未驗證項目。
