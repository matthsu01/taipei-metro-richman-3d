import React, { useState } from 'react';
import {
  Zap,
  GitPullRequest,
  Terminal,
  CheckCircle2,
  Circle,
  ExternalLink,
  AlertTriangle,
  Sparkles,
  FolderCheck,
} from 'lucide-react';
import {
  DeployConfig,
  DeployMethodId,
  getComputedUrls,
  generateViteConfig,
  generateGithubActionsWorkflow,
  generateDirectExtractBashScript,
  generateDirectExtractPowerShellScript,
  generateGhPagesPackageJson,
} from '../data/deploymentTemplates';
import { CodeTerminalBlock } from './CodeTerminalBlock';

interface DeploymentStepsProps {
  config: DeployConfig;
  activeMethod: DeployMethodId;
  onSelectMethod: (method: DeployMethodId) => void;
}

export const DeploymentSteps: React.FC<DeploymentStepsProps> = ({
  config,
  activeMethod,
  onSelectMethod,
}) => {
  const [osTab, setOsTab] = useState<'bash' | 'powershell'>('bash');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  const computed = getComputedUrls(config);

  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({ ...prev, [stepKey]: !prev[stepKey] }));
  };

  const gitPushSourceCommands = `# 在解壓縮後的 Arena 專案資料夾內執行：
git init
git branch -M ${config.branch}
git add .
git commit -m "feat: initial commit of Taipei Metro Richman 3D (01a21590)"
git remote add origin ${computed.gitRemoteUrl}
git push -u origin ${config.branch}`;

  const ghPagesCliCommands = `# 1. 安裝專案相依套件與 gh-pages 部署工具
npm install
npm install -D gh-pages

# 2. 編譯生產環境檔案並一鍵推送至 gh-pages 分支 (--dotfiles 會連同 .nojekyll 一起上傳)
npx vite build --base=${computed.basePath}
touch dist/.nojekyll
npx gh-pages -d dist --dotfiles`;

  return (
    <section id="section-methods" className="space-y-6">
      {/* Method Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Method 1: Direct Single-File Extract */}
        <button
          type="button"
          onClick={() => onSelectMethod('direct-singlefile')}
          className={`text-left rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
            activeMethod === 'direct-singlefile'
              ? 'bg-sky-500/15 border-sky-400 shadow-lg shadow-sky-500/10'
              : 'bg-[#111827]/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <Zap className="w-3.5 h-3.5" />
                方案 A · 60 秒極速上線
              </span>
              <span className="text-xs font-mono text-slate-400">免裝 Node.js</span>
            </div>
            <h3 className="text-base font-bold text-slate-100">
              直接擷取 989KB 純淨單一檔部署
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              直接從 <code className="text-sky-300">?embed=true</code> 抽出已打包完成的單一{' '}
              <code className="text-sky-300">index.html</code>（自動去除 Arena 頂部橫幅），推送至分支即刻上線。
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-sky-400">適用：不需改 Code、快速鏡像部署</span>
            <span>→</span>
          </div>
        </button>

        {/* Method 2: Full Vite Source + GitHub Actions */}
        <button
          type="button"
          onClick={() => onSelectMethod('actions-source')}
          className={`text-left rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
            activeMethod === 'actions-source'
              ? 'bg-sky-500/15 border-sky-400 shadow-lg shadow-sky-500/10'
              : 'bg-[#111827]/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                <GitPullRequest className="w-3.5 h-3.5" />
                方案 B · 官方標準 CI/CD
              </span>
              <span className="text-xs font-mono text-slate-400">支援二次開發</span>
            </div>
            <h3 className="text-base font-bold text-slate-100">
              React + Vite 原始碼 + GitHub Actions
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              下載 Arena 完整專案原始碼，配置 <code className="text-sky-300">vite.config.ts</code> 與{' '}
              <code className="text-sky-300">deploy.yml</code>，每次 Push 自動雲端編譯並發布。
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-sky-400">適用：需修改遊戲參數、長期維護</span>
            <span>→</span>
          </div>
        </button>

        {/* Method 3: gh-pages NPM CLI */}
        <button
          type="button"
          onClick={() => onSelectMethod('gh-pages-cli')}
          className={`text-left rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
            activeMethod === 'gh-pages-cli'
              ? 'bg-sky-500/15 border-sky-400 shadow-lg shadow-sky-500/10'
              : 'bg-[#111827]/80 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                <Terminal className="w-3.5 h-3.5" />
                方案 C · 本機指令發布
              </span>
              <span className="text-xs font-mono text-slate-400">gh-pages 分支</span>
            </div>
            <h3 className="text-base font-bold text-slate-100">
              使用 `gh-pages` 套件本機編譯上傳
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              在本機執行 <code className="text-sky-300">npm run deploy</code>，將編譯後的{' '}
              <code className="text-sky-300">dist/</code> 資料夾自動推送至獨立的{' '}
              <code className="text-sky-300">gh-pages</code> 分支。
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-sky-400">適用：習慣本機 Build 後手動發布</span>
            <span>→</span>
          </div>
        </button>
      </div>

      {/* =====================================================================
          METHOD A CONTENT: DIRECT SINGLE-FILE BUNDLE EXTRACT
         ===================================================================== */}
      {activeMethod === 'direct-singlefile' && (
        <div className="rounded-2xl border border-slate-800 bg-[#111827]/90 p-6 sm:p-7 space-y-7 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-xs font-mono font-semibold text-emerald-400 uppercase tracking-wider">
                METHOD A · ZERO-BUILD SINGLE-FILE DEPLOYMENT
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                方案 A：直接擷取《台北捷運大富翁 3D》989KB 單一封裝檔部署至 GitHub Pages
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                因為該專案已由 <code className="text-sky-300">vite-plugin-singlefile</code> 將所有 React 19、Three.js 與 CSS 打包進單一 HTML，您只需擷取內層端點並推送至 GitHub 即可完成部署。
              </p>
            </div>

            {/* OS Switcher */}
            <div className="inline-flex rounded-xl p-1 bg-[#070A10] border border-slate-800 shrink-0 self-start">
              <button
                type="button"
                onClick={() => setOsTab('bash')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  osTab === 'bash'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                macOS / Linux / Git Bash
              </button>
              <button
                type="button"
                onClick={() => setOsTab('powershell')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer ${
                  osTab === 'powershell'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Windows PowerShell
              </button>
            </div>
          </div>

          {/* Step A1 */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <button
                type="button"
                onClick={() => toggleStep('a1')}
                className="flex items-center gap-2.5 text-left cursor-pointer group"
              >
                {completedSteps['a1'] ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500 group-hover:text-sky-400 shrink-0" />
                )}
                <span className="text-base font-bold text-slate-100">
                  步驟 1：在 GitHub 建立空白倉庫 <code className="text-sky-400 font-mono">{computed.cleanRepo}</code>
                </span>
              </button>
              <a
                href="https://github.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors shrink-0"
              >
                <span>前往 github.com/new</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 pl-7">
              Repository name 填入 <code className="text-slate-200 font-mono">{computed.cleanRepo}</code>，可見度設為{' '}
              <strong className="text-slate-200">Public</strong>（免費版 GitHub Pages 要求 Public 倉庫），點擊{' '}
              <strong className="text-slate-200">Create repository</strong>。
            </p>
          </div>

          {/* Step A2 */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => toggleStep('a2')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              {completedSteps['a2'] ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-500 group-hover:text-sky-400 shrink-0" />
              )}
              <span className="text-base font-bold text-slate-100">
                步驟 2：執行一鍵擷取與 Git 推送腳本（自動帶入防擋標頭）
              </span>
            </button>

            <div className="pl-7 space-y-3">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200/90 leading-relaxed">
                  <strong>關鍵技術提示：</strong>Arena 的 <code className="text-amber-300">?embed=true</code> 端點會檢查{' '}
                  <code className="text-amber-300">Sec-Fetch-Dest: iframe</code> 與{' '}
                  <code className="text-amber-300">Referer</code> 標頭。下方腳本已預先配置好這兩個標頭與檔案大小驗證（確保下載到完整的 989,108 bytes 遊戲本體，而非 0 bytes）。
                </p>
              </div>

              {osTab === 'bash' ? (
                <CodeTerminalBlock
                  title="deploy-singlefile.sh (macOS / Linux / Git Bash)"
                  language="bash"
                  code={generateDirectExtractBashScript(config)}
                  downloadFilename="deploy-singlefile.sh"
                  isTerminal
                  badgeText="推薦一鍵執行"
                />
              ) : (
                <CodeTerminalBlock
                  title="deploy-singlefile.ps1 (Windows PowerShell)"
                  language="powershell"
                  code={generateDirectExtractPowerShellScript(config)}
                  downloadFilename="deploy-singlefile.ps1"
                  isTerminal
                  badgeText="Windows 專用"
                />
              )}
            </div>
          </div>

          {/* Step A3 */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <button
                type="button"
                onClick={() => toggleStep('a3')}
                className="flex items-center gap-2.5 text-left cursor-pointer group"
              >
                {completedSteps['a3'] ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500 group-hover:text-sky-400 shrink-0" />
                )}
                <span className="text-base font-bold text-slate-100">
                  步驟 3：至 GitHub Settings → Pages 啟用分支部署
                </span>
              </button>
              <a
                href={computed.settingsPagesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors shrink-0"
              >
                <span>開啟倉庫 Pages 設定</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="pl-7 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded-xl bg-[#070A10] border border-slate-800 p-3.5">
                <div className="text-xs font-mono text-sky-400">1. Build and deployment</div>
                <div className="text-sm font-semibold text-slate-100 mt-1">
                  Source 選擇「Deploy from a branch」
                </div>
              </div>
              <div className="rounded-xl bg-[#070A10] border border-slate-800 p-3.5">
                <div className="text-xs font-mono text-sky-400">2. Branch 分支與目錄</div>
                <div className="text-sm font-semibold text-slate-100 mt-1">
                  選擇 <code className="text-emerald-400">{config.branch}</code> 分支 +{' '}
                  <code className="text-emerald-400">/ (root)</code> 資料夾，點擊 Save
                </div>
              </div>
              <div className="rounded-xl bg-[#070A10] border border-emerald-500/30 p-3.5">
                <div className="text-xs font-mono text-emerald-400">3. 部署完成上線</div>
                <div className="text-xs font-mono text-slate-200 mt-1 break-all">
                  {computed.liveUrl}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          METHOD B CONTENT: FULL SOURCE CODE + GITHUB ACTIONS CI/CD
         ===================================================================== */}
      {activeMethod === 'actions-source' && (
        <div className="rounded-2xl border border-slate-800 bg-[#111827]/90 p-6 sm:p-7 space-y-7 shadow-2xl">
          <div className="border-b border-slate-800 pb-5">
            <span className="text-xs font-mono font-semibold text-sky-400 uppercase tracking-wider">
              METHOD B · VITE + REACT + GITHUB ACTIONS WORKFLOW
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              方案 B：匯出完整 React + Vite 原始碼並透過 GitHub Actions 自動編譯部署
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              適合希望修改《台北捷運大富翁 3D》站點票價、AI 對手策略或 3D 材質，並讓 GitHub 每次收到{' '}
              <code className="text-sky-300">git push</code> 時自動執行 <code className="text-sky-300">npm run build</code> 的開發者。
            </p>
          </div>

          {/* Project File Structure Preview */}
          <div className="rounded-xl border border-slate-800 bg-[#070A10] p-4">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-sky-400 mb-2.5">
              <FolderCheck className="w-4 h-4" />
              <span>標準專案目錄結構 (確認以下兩個關鍵檔案位置)</span>
            </div>
            <pre className="text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
{`${computed.cleanRepo}/
├── .github/
│   └── workflows/
│       └── deploy.yml       # 👈 [新增] GitHub Actions 自動化建置與部署腳本
├── src/
│   ├── App.tsx              # 台北捷運大富翁 3D 主程式與 Three.js 棋盤
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts           # 👈 [關鍵檢查] 確認 base 設為 "${computed.basePath}"`}
            </pre>
          </div>

          {/* Step B1: vite.config.ts */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => toggleStep('b1')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              {completedSteps['b1'] ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-500 group-hover:text-sky-400 shrink-0" />
              )}
              <span className="text-base font-bold text-slate-100">
                步驟 1：設定 <code className="text-sky-400 font-mono">vite.config.ts</code> 的 GitHub Pages 子路徑 (<code className="text-emerald-400 font-mono">base: &quot;{computed.basePath}&quot;</code>)
              </span>
            </button>
            <div className="pl-7 space-y-2.5">
              <p className="text-xs sm:text-sm text-slate-400">
                在 GitHub Pages 專案網址（<code className="text-slate-200">{computed.liveUrl}</code>）下，設定正確的{' '}
                <code className="text-sky-300">base</code> 路徑可防止部署後找不到 JS/CSS 資源而出現白畫面：
              </p>
              <CodeTerminalBlock
                title="vite.config.ts"
                language="typescript"
                code={generateViteConfig(config)}
                downloadFilename="vite.config.ts"
                badgeText={`base: "${computed.basePath}"`}
              />
            </div>
          </div>

          {/* Step B2: .github/workflows/deploy.yml */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => toggleStep('b2')}
              className="flex items-center gap-2.5 text-left cursor-pointer group"
            >
              {completedSteps['b2'] ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-slate-500 group-hover:text-sky-400 shrink-0" />
              )}
              <span className="text-base font-bold text-slate-100">
                步驟 2：建立 <code className="text-sky-400 font-mono">.github/workflows/deploy.yml</code> 自動化工作流
              </span>
            </button>
            <div className="pl-7 space-y-2.5">
              <p className="text-xs sm:text-sm text-slate-400">
                在專案根目錄下建立 <code className="text-slate-200">.github/workflows/deploy.yml</code>（可點擊右上角「下載檔案」直接放入資料夾）：
              </p>
              <CodeTerminalBlock
                title=".github/workflows/deploy.yml"
                language="yaml"
                code={generateGithubActionsWorkflow(config)}
                downloadFilename="deploy.yml"
                badgeText="GitHub Actions 官方推薦"
              />
            </div>
          </div>

          {/* Step B3: Configure GitHub Pages Source = GitHub Actions & Push */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <button
                type="button"
                onClick={() => toggleStep('b3')}
                className="flex items-center gap-2.5 text-left cursor-pointer group"
              >
                {completedSteps['b3'] ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-500 group-hover:text-sky-400 shrink-0" />
                )}
                <span className="text-base font-bold text-slate-100">
                  步驟 3：將 GitHub Pages 來源改為「GitHub Actions」並推送原始碼
                </span>
              </button>
              <a
                href={computed.settingsPagesUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-sky-300 border border-slate-700 transition-colors shrink-0"
              >
                <span>前往 Pages 設定頁</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
            <div className="pl-7 space-y-3">
              <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 p-3.5 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <p className="text-xs text-sky-100 leading-relaxed">
                  <strong>必做設定：</strong>進入 GitHub 倉庫的 <strong>Settings → Pages</strong>，在{' '}
                  <strong>Build and deployment → Source</strong> 下拉選單將預設的「Deploy from a branch」改為{' '}
                  <strong className="text-emerald-300">「GitHub Actions」</strong>。接著執行下方指令推送程式碼即可自動觸發部署：
                </p>
              </div>

              <CodeTerminalBlock
                title="Terminal — 初始化並推送完整原始碼至 GitHub"
                language="bash"
                code={gitPushSourceCommands}
                isTerminal
              />
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          METHOD C CONTENT: GH-PAGES NPM PACKAGE CLI DEPLOY
         ===================================================================== */}
      {activeMethod === 'gh-pages-cli' && (
        <div className="rounded-2xl border border-slate-800 bg-[#111827]/90 p-6 sm:p-7 space-y-7 shadow-2xl">
          <div className="border-b border-slate-800 pb-5">
            <span className="text-xs font-mono font-semibold text-purple-400 uppercase tracking-wider">
              METHOD C · LOCAL BUILD & GH-PAGES BRANCH CLI
            </span>
            <h3 className="text-xl font-bold text-white mt-1">
              方案 C：使用 `gh-pages` NPM 套件從本機一鍵編譯並發布至 `gh-pages` 分支
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              若您不想設定 GitHub Actions YAML，可以直接在自己電腦編譯出 <code className="text-sky-300">dist/</code> 並透過{' '}
              <code className="text-sky-300">npx gh-pages -d dist</code> 發布。
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-100">
              1. 參考或更新 <code className="text-sky-400 font-mono">package.json</code>（加入 <code className="text-emerald-400 font-mono">homepage</code> 與 <code className="text-emerald-400 font-mono">deploy</code> 指令）
            </h4>
            <CodeTerminalBlock
              title="package.json"
              language="json"
              code={generateGhPagesPackageJson(config)}
              downloadFilename="package.json"
              badgeText="已含 Three.js 與 gh-pages"
            />
          </div>

          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-100">
              2. 在終端機執行本機建置與一鍵發布
            </h4>
            <CodeTerminalBlock
              title="Terminal — 本機打包並發布至 gh-pages 分支"
              language="bash"
              code={ghPagesCliCommands}
              isTerminal
            />
          </div>
        </div>
      )}
    </section>
  );
};
