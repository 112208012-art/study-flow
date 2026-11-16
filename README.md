# Study Flow｜作業與考試進度管理

[開啟網站](https://112208012-art.github.io/study-flow/) · [GitHub Repository](https://github.com/112208012-art/study-flow)

以大學生為對象的學習管理靜態網站，集中記錄課程作業、考試日期與完成進度。以 AGENTS.md 定義一致的樣式、檔案結構、資料格式與擴充流程，讓 AI 能持續新增指南內容，而非只製作單一網頁。

## 功能
- 新增作業與考試，依截止日期排序。
- 搜尋課程或任務、依類型或完成狀態篩選。
- 調整進度、刪除確認、統計待完成與未來七天任務。
- localStorage 本機保存；不提供雲端同步或通知。
- 響應式版面、鍵盤操作與讀書指南。

## 頁面與規則
- `index.html`：任務儀表板。
- `guides/index.html`：讀書指南索引。
- `guides/exam-preparation.html`：七天考前複習指南。
- [AGENTS.md](AGENTS.md)：AI 修改與擴充規則。

## 預覽與檢查
不需 npm install。執行 `python -m http.server 8000`，開啟 http://localhost:8000 。直接開 HTML 亦可瀏覽，但建議以 HTTP 使用本機儲存。執行 `node tests/check.mjs` 檢查資料驗證、日期邊界、排序與內部連結。瀏覽器互動與手機版另依 AGENTS.md 的清單驗證。

## 上傳 GitHub 與部署
1. 在 GitHub 建立公開 Repository，名稱建議 `study-flow`。
2. 上傳本資料夾內的全部檔案，包含 `.github/workflows/pages.yml`，讓 index.html 位於 repository 根目錄。
3. 進入 Settings → Pages → Source，選 GitHub Actions。
4. 在 Actions 執行 Deploy GitHub Pages；若第一次 push 時尚未啟用 Pages，啟用後手動 Run workflow。
5. 工作完成後，從 Settings → Pages 複製實際網址。通常為 `https://你的帳號.github.io/study-flow/`，以 GitHub 顯示結果為準。

## 如何擴充
對 AI 下指令：「先閱讀 AGENTS.md，新增每週回顧指南，並更新索引與 README。」文件會引導 AI 複用共同骨架、採用規定的三段內容、維持繁體中文與相對連結，最後執行相同驗證。這能讓不同頁面保持一致並降低漏更新導覽的機率。

## 資料限制
資料只保存在使用中的瀏覽器。清除網站資料、無痕模式結束或更換裝置可能失去任務。首次載入的資料是示範內容。瀏覽器儲存不可用時顯示提示，不會宣稱儲存成功。
