export interface DeployConfig {
  githubUsername: string;
  repoName: string;
  branch: 'main' | 'master';
  customDomain: string;
  keepSingleFilePlugin: boolean;
}

export type DeployMethodId = 'actions-source' | 'direct-singlefile' | 'gh-pages-cli';

export const TARGET_ARENA_SITE = {
  url: 'https://01a21590-8cf8-78a9-a673-8fca7891bfa9.arena.site/',
  embedUrl: 'https://01a21590-8cf8-78a9-a673-8fca7891bfa9.arena.site/?embed=true',
  ogImage:
    'https://screenshot-taker-prod.weichiang.workers.dev/message/01a21590-8cf8-78a9-a673-8fca7891bfa9/og-image.png',
  messageId: '01a21590-8cf8-78a9-a673-8fca7891bfa9',
  sessionId: '01a21590-8cc7-7b4a-8a19-40ff6ab7dc09',
  title: '台北捷運大富翁 3D | Taipei Metro Richman XI',
  outerHtmlSize: '13.4 KB (Arena 外層 Iframe 容器 + 橫幅)',
  innerBundleSize: '989,108 Bytes (約 965.9 KB 單一封裝檔)',
  stack: [
    { name: 'React', version: '19.2.6', role: 'UI 狀態與遊戲回合邏輯' },
    { name: 'Vite', version: '7.3.7', role: '前端建置工具與模組打包' },
    { name: 'Tailwind CSS', version: '4.1.17', role: '現代化介面樣式系統 (@tailwindcss/vite)' },
    { name: 'Three.js', version: 'WebGLRenderer', role: '3D 棋盤、台北捷運列車與立體建築渲染' },
    { name: 'vite-plugin-singlefile', version: '2.3.0', role: '將 JS/CSS 內嵌為單一可攜式 index.html' },
    { name: 'Web Audio API', version: 'Native', role: '無外部音檔之程序化合成音效 (AudioContext)' },
  ],
};

export function getComputedUrls(config: DeployConfig) {
  const cleanUser = (config.githubUsername || 'your-username').trim();
  const cleanRepo = (config.repoName || 'taipei-metro-richman-3d').trim();
  const cleanDomain = config.customDomain.trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');

  const isUserSite = cleanRepo.toLowerCase() === `${cleanUser.toLowerCase()}.github.io`;
  const basePath = cleanDomain || isUserSite ? '/' : `/${cleanRepo}/`;
  const liveUrl = cleanDomain
    ? `https://${cleanDomain}/`
    : isUserSite
      ? `https://${cleanUser}.github.io/`
      : `https://${cleanUser}.github.io/${cleanRepo}/`;

  const repoUrl = `https://github.com/${cleanUser}/${cleanRepo}`;
  const gitRemoteUrl = `https://github.com/${cleanUser}/${cleanRepo}.git`;
  const settingsPagesUrl = `https://github.com/${cleanUser}/${cleanRepo}/settings/pages`;
  const actionsUrl = `https://github.com/${cleanUser}/${cleanRepo}/actions`;

  return {
    cleanUser,
    cleanRepo,
    cleanDomain,
    isUserSite,
    basePath,
    liveUrl,
    repoUrl,
    gitRemoteUrl,
    settingsPagesUrl,
    actionsUrl,
  };
}

export function generateViteConfig(config: DeployConfig): string {
  const { basePath } = getComputedUrls(config);

  if (config.keepSingleFilePlugin) {
    return `import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GitHub Pages 部署專用設定 — 對應專案：台北捷運大富翁 3D
export default defineConfig({
  // 使用相對路徑 './' 或倉庫子路徑 '${basePath}'，確保在 GitHub Pages 子目錄下正常讀取資源
  base: "${basePath}",
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile(), // 將所有 JS 與 CSS 內嵌至單一 dist/index.html (與 Arena 原生環境一致)
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});`;
  }

  return `import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// GitHub Pages 標準分塊打包設定 (移除 viteSingleFile 以啟用瀏覽器快取與 Code Splitting)
export default defineConfig({
  // 關鍵設定：必須與 GitHub 倉庫名稱一致，否則部署後會出現白畫面 (404 找不到 assets)
  base: "${basePath}",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
  },
});`;
}

export function generateGithubActionsWorkflow(config: DeployConfig): string {
  const { cleanDomain } = getComputedUrls(config);
  const cnameStep = cleanDomain
    ? `\n      - name: 寫入自訂網域 CNAME 檔案\n        run: echo "${cleanDomain}" > ./dist/CNAME\n`
    : '';

  return `# 檔案路徑：.github/workflows/deploy.yml
# 功能：當推送至 ${config.branch} 分支時，自動編譯「台北捷運大富翁 3D」並部署至 GitHub Pages
name: Deploy Taipei Metro Richman 3D to GitHub Pages

on:
  push:
    branches: ["${config.branch}"]
  workflow_dispatch:

# 授權 GitHub Actions 部署至 GitHub Pages 所需的權限
permissions:
  contents: read
  pages: write
  id-token: write

# 同時僅允許一個部署工作進行，避免舊的排程覆蓋最新部署
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build-and-deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest

    steps:
      - name: 1. 檢出倉庫原始碼 (Checkout)
        uses: actions/checkout@v4

      - name: 2. 安裝 Node.js 22 環境與設定 NPM 快取
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: "npm"

      - name: 3. 安裝專案相依套件 (Dependencies)
        run: npm install

      - name: 4. 執行 Vite 生產環境建置 (產生 dist/index.html)
        run: npm run build

      - name: 5. 建立 .nojekyll 避免 GitHub Jekyll 過濾底線檔案
        run: touch ./dist/.nojekyll${cnameStep}
      - name: 6. 設定 GitHub Pages 環境配置
        uses: actions/configure-pages@v5

      - name: 7. 上傳 dist 建置產物 (Upload Artifact)
        uses: actions/upload-pages-artifact@v3
        with:
          path: "./dist"

      - name: 8. 正式部署至 GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4`;
}

export function generateDirectExtractBashScript(config: DeployConfig): string {
  const { gitRemoteUrl, liveUrl, cleanDomain } = getComputedUrls(config);
  const cnameLine = cleanDomain ? `echo "${cleanDomain}" > CNAME\n` : '';

  return `#!/usr/bin/env bash
# ==============================================================================
# 台北捷運大富翁 3D (01a21590) — 免編譯單一檔案直接擷取與 GitHub Pages 部署腳本
# 原理：Arena 根網址為外層 Iframe 容器 (13.4KB)，真正的完整遊戲應用位於 ?embed=true
#       且必須攜帶 Sec-Fetch-Dest: iframe 與 Referer 標頭才會回傳 989KB 完整應用。
# ==============================================================================
set -e

mkdir -p taipei-metro-richman-ghpages
cd taipei-metro-richman-ghpages

echo "⏳ [1/4] 正在從 Arena 擷取純淨版《台北捷運大富翁 3D》單一封裝檔 (約 989 KB)..."
curl -sSL \\
  -H "Sec-Fetch-Dest: iframe" \\
  -H "Referer: https://01a21590-8cf8-78a9-a673-8fca7891bfa9.arena.site/" \\
  "https://01a21590-8cf8-78a9-a673-8fca7891bfa9.arena.site/?embed=true" \\
  -o index.html

# 驗證檔案大小是否大於 500,000 bytes (確保不是 0 bytes 或 13KB 外殼)
FILE_SIZE=$(wc -c < index.html | tr -d ' ')
if [ "$FILE_SIZE" -lt 500000 ]; then
  echo "❌ 擷取異常：檔案大小僅 $FILE_SIZE bytes，請確認網路連線或標頭是否正確！"
  exit 1
fi
echo "✅ 擷取成功！index.html 大小為 $FILE_SIZE bytes (無 Arena 外層橫幅、已內嵌完整 3D 遊戲)"

echo "⏳ [2/4] 正在建立 GitHub Pages 靜態設定檔 (.nojekyll 與 404.html)..."
touch .nojekyll
cp index.html 404.html
${cnameLine}
echo "⏳ [3/4] 正在初始化 Git 倉庫並提交檔案..."
git init
git checkout -B ${config.branch}
git add index.html 404.html .nojekyll ${cleanDomain ? 'CNAME ' : ''}
git commit -m "feat: deploy Taipei Metro Richman 3D (01a21590) to GitHub Pages"

echo "⏳ [4/4] 正在推送至 GitHub 遠端倉庫..."
git remote remove origin 2>/dev/null || true
git remote add origin ${gitRemoteUrl}
git push -u origin ${config.branch} --force

echo "🎉 推送完成！請至 GitHub Settings -> Pages 將 Source 設為「Deploy from a branch (${config.branch} / root)」"
echo "🌐 預計上線網址：${liveUrl}"`;
}

export function generateDirectExtractPowerShellScript(config: DeployConfig): string {
  const { gitRemoteUrl, liveUrl, cleanDomain } = getComputedUrls(config);
  const cnameLine = cleanDomain ? `"${cleanDomain}" | Out-File -Encoding ascii CNAME\n` : '';

  return `# ==============================================================================
# Windows PowerShell 專用：擷取《台北捷運大富翁 3D》純淨單一檔並推送至 GitHub Pages
# ==============================================================================
$ErrorActionPreference = "Stop"

New-Item -ItemType Directory -Force -Path "taipei-metro-richman-ghpages" | Out-Null
Set-Location "taipei-metro-richman-ghpages"

Write-Host "⏳ [1/4] 正在從 Arena ?embed=true 擷取完整 989KB 單一封裝檔..." -ForegroundColor Cyan
$headers = @{
    "Sec-Fetch-Dest" = "iframe"
    "Referer"        = "https://01a21590-8cf8-78a9-a673-8fca7891bfa9.arena.site/"
}
Invoke-WebRequest -Uri "https://01a21590-8cf8-78a9-a673-8fca7891bfa9.arena.site/?embed=true" \`
    -Headers $headers \`
    -OutFile "index.html"

$size = (Get-Item "index.html").Length
if ($size -lt 500000) {
    throw "❌ 檔案大小異常 ($size bytes)，請確認標頭設定是否正確！"
}
Write-Host "✅ 成功下載 index.html ($size bytes)" -ForegroundColor Green

Write-Host "⏳ [2/4] 建立 .nojekyll 與 404.html..." -ForegroundColor Cyan
New-Item -ItemType File -Force -Path ".nojekyll" | Out-Null
Copy-Item "index.html" "404.html"
${cnameLine}
Write-Host "⏳ [3/4] 初始化 Git 並提交..." -ForegroundColor Cyan
git init
git checkout -B ${config.branch}
git add .
git commit -m "feat: deploy Taipei Metro Richman 3D to GitHub Pages"

Write-Host "⏳ [4/4] 推送至 GitHub..." -ForegroundColor Cyan
git remote add origin ${gitRemoteUrl}
git push -u origin ${config.branch} --force

Write-Host "🎉 部署完成！預計網址：${liveUrl}" -ForegroundColor Green`;
}

export function generateGhPagesPackageJson(config: DeployConfig): string {
  const { cleanRepo, liveUrl } = getComputedUrls(config);

  return `{
  "name": "${cleanRepo}",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "homepage": "${liveUrl}",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist --dotfiles"
  },
  "dependencies": {
    "clsx": "^2.1.1",
    "lucide-react": "^1.16.0",
    "react": "19.2.6",
    "react-dom": "19.2.6",
    "tailwind-merge": "^3.4.0",
    "three": "^0.174.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "4.1.17",
    "@types/node": "^22.19.17",
    "@types/react": "19.2.7",
    "@types/react-dom": "19.2.3",
    "@types/three": "^0.174.0",
    "@vitejs/plugin-react": "5.1.1",
    "gh-pages": "^6.3.0",
    "tailwindcss": "4.1.17",
    "typescript": "5.9.3",
    "vite": "7.3.7",
    "vite-plugin-singlefile": "2.3.0"
  }
}`;
}

export function generateFullMarkdownGuide(config: DeployConfig): string {
  const { cleanUser, cleanRepo, basePath, liveUrl, gitRemoteUrl, settingsPagesUrl } =
    getComputedUrls(config);

  return `# 🚇 台北捷運大富翁 3D (\`01a21590\`) — GitHub Pages 完整部署說明

- **原始 Arena 專案網址**：https://01a21590-8cf8-78a9-a673-8fca7891bfa9.arena.site/
- **內嵌純淨應用端點**：https://01a21590-8cf8-78a9-a673-8fca7891bfa9.arena.site/?embed=true
- **目標 GitHub 倉庫**：\`${cleanUser}/${cleanRepo}\`
- **目標 GitHub Pages 網址**：${liveUrl}

---

## ⚠️ 部署前必讀：Arena 網站架構關鍵解析

直接對根網址 \`https://01a21590-8cf8-78a9-a673-8fca7891bfa9.arena.site/\` 按右鍵「另存新檔」或單純執行 \`curl\`，只會下載到 **13.4 KB 的 Arena 外層容器頁面**（內含 \`Built with Arena\` 橫幅、PostHog 追蹤碼與指向 \`?embed=true\` 的 \`<iframe>\`）。

本專案是由 **Vite 7 + React 19 + Tailwind CSS v4 + Three.js + \`vite-plugin-singlefile\`** 打包而成，所有 3D 幾何模型與 Web Audio 音效皆為程序化生成（無外部圖檔或音檔依賴）。因此您有以下 **兩種最佳部署路線** 可供選擇：

---

## 🚀 方案 A：免編譯！直接擷取 989KB 純淨單一檔部署（最快，60 秒完成）

如果您不需修改 TypeScript 原始碼，只想將該網站原封不動（且移除 Arena 頂部橫幅）發布到自己的 GitHub Pages：

### 步驟 1：使用包含完整 Header 的指令下載純淨版 \`index.html\`
> **注意**：Arena 的 \`?embed=true\` 端點有檢查 \`Sec-Fetch-Dest: iframe\` 與 \`Referer\`，若未帶入標頭會回傳 \`0 bytes\`。

\`\`\`bash
${generateDirectExtractBashScript(config)}
\`\`\`

### 步驟 2：在 GitHub 啟用 Pages
1. 前往 [${settingsPagesUrl}](${settingsPagesUrl})
2. 在 **Build and deployment** > **Source** 選擇 **Deploy from a branch**
3. Branch 選擇 **\`${config.branch}\`**，資料夾選擇 **\`/ (root)\`**，點擊 **Save**。
4. 等待約 30–60 秒後，即可透過 **${liveUrl}** 遊玩！

---

## 🛠️ 方案 B：完整 React + Vite 原始碼 + GitHub Actions 自動化 CI/CD 部署（推薦需要二次開發者）

如果您已在 Arena 點擊右上角下載完整專案原始碼（包含 \`src/\`, \`package.json\`, \`vite.config.ts\`），請依照以下步驟設定：

### 步驟 1：確認或修改 \`vite.config.ts\` 的 \`base\` 路徑
在 GitHub Pages 子路徑（\`${basePath}\`）下，請確認 \`vite.config.ts\` 設定如下：

\`\`\`ts
${generateViteConfig(config)}
\`\`\`

### 步驟 2：新增 GitHub Actions 自動部署設定檔
在專案根目錄建立 \`.github/workflows/deploy.yml\`：

\`\`\`yaml
${generateGithubActionsWorkflow(config)}
\`\`\`

### 步驟 3：修改 GitHub Pages 設定並推送程式碼
1. 前往 GitHub 倉庫的 **Settings** → **Pages**（${settingsPagesUrl}）
2. 將 **Build and deployment** → **Source** 改為 **GitHub Actions**
3. 在本機終端機執行推送：

\`\`\`bash
git init
git branch -M ${config.branch}
git add .
git commit -m "chore: configure GitHub Actions deployment for Taipei Metro Richman 3D"
git remote add origin ${gitRemoteUrl}
git push -u origin ${config.branch}
\`\`\`

---

## 🔧 方案 C：使用 \`gh-pages\` 套件從本機一鍵發布

1. 安裝 \`gh-pages\`：
   \`\`\`bash
   npm install -D gh-pages
   \`\`\`
2. 在 \`package.json\` 的 \`scripts\` 加入：
   \`\`\`json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist --dotfiles"
   \`\`\`
3. 執行發布（會自動編譯 \`dist\` 並推送到 \`gh-pages\` 分支）：
   \`\`\`bash
   npm run deploy
   \`\`\`
`;
}

export interface TroubleshootItem {
  id: string;
  symptom: string;
  badge: string;
  cause: string;
  solution: string;
  snippet?: string;
}

export const TROUBLESHOOTING_ITEMS: TroubleshootItem[] = [
  {
    id: 'zero-bytes-embed',
    symptom: '為什麼直接 curl ?embed=true 下載下來是 0 bytes 空白檔？',
    badge: 'Arena 專屬陷阱',
    cause:
      'Arena 的 Cloudflare Worker 防護機制會檢查請求標頭。若直接從瀏覽器網址列開啟或未帶入 Iframe 標頭，伺服器會拒絕回傳內嵌組件。',
    solution:
      '在 curl 或 PowerShell 請求時，必須同時加上 -H "Sec-Fetch-Dest: iframe" 以及 -H "Referer: https://01a21590-8cf8-78a9-a673-8fca7891bfa9.arena.site/"，即可完整取得 989,108 bytes 的純淨單一檔。',
    snippet: `curl -sSL -H "Sec-Fetch-Dest: iframe" \\
  -H "Referer: https://01a21590-8cf8-78a9-a673-8fca7891bfa9.arena.site/" \\
  "https://01a21590-8cf8-78a9-a673-8fca7891bfa9.arena.site/?embed=true" -o index.html`,
  },
  {
    id: 'outer-wrapper-saved',
    symptom: '部署後網頁上方仍然出現「Built with Arena」橫幅，或離線時無法載入？',
    badge: '外層容器問題',
    cause:
      '您下載到了根網址 (13.4 KB) 的外層包裝頁，該頁面內部只是用 <iframe src="...arena.site/?embed=true"> 載入遠端網頁，並非真正獨立部署。',
    solution:
      '請改用「方案 A」的擷取腳本下載 ?embed=true 端點 (檔案大小約 989 KB)，或從 Arena 介面匯出完整 React 原始碼重新執行 npm run build。',
  },
  {
    id: 'blank-screen-subpath',
    symptom: '部署到 https://<username>.github.io/<repo>/ 後畫面全白，Console 報 404 Not Found',
    badge: 'Vite 路徑配置',
    cause:
      'Vite 預設以根目錄 base: "/" 編譯資源。當部署在 GitHub Pages 的專案子目錄 /<repo>/ 時，瀏覽器會去根網域尋找 /assets/index-xxx.js 導致 404。',
    solution:
      '在 vite.config.ts 中設定 base: "/<您的倉庫名稱>/"（或者保留 viteSingleFile() 外掛，將所有 JS/CSS 直接內嵌進 index.html 即可徹底免疫路徑問題）。',
    snippet: `// vite.config.ts
export default defineConfig({
  base: './', // 或 '/taipei-metro-richman-3d/'
  plugins: [react(), tailwindcss(), viteSingleFile()],
});`,
  },
  {
    id: 'actions-permission-403',
    symptom: 'GitHub Actions 執行到 deploy-pages 時報錯：Error: HttpError: Resource not accessible by integration',
    badge: 'CI/CD 權限',
    cause:
      'GitHub 倉庫預設未開啟 Actions 對 Pages 的寫入權限，或是未將 Pages 來源切換為 GitHub Actions。',
    solution:
      '1. 確認 .github/workflows/deploy.yml 內包含 permissions: { pages: write, id-token: write }。\n2. 前往倉庫 Settings → Pages → Build and deployment，將 Source 從「Deploy from a branch」改為「GitHub Actions」。',
  },
  {
    id: 'webgl-context-lost',
    symptom: '3D 捷運棋盤在部分行動裝置或舊瀏覽器無法顯示立體場景',
    badge: 'Three.js / WebGL',
    cause:
      '《台北捷運大富翁 3D》使用 Three.js WebGLRenderer 進行即時 3D 渲染，若瀏覽器停用硬體加速或分頁開啟過多 WebGL 實例可能觸發 Context Lost。',
    solution:
      'GitHub Pages 全站強制啟用 HTTPS 與標準安全標頭，相較於 iframe 沙盒環境能獲得更穩定的 GPU WebGL 上下文；請確認瀏覽器已開啟「使用圖形加速功能」。',
  },
];
