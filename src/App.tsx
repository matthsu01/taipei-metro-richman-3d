import { useState } from 'react';
import {
  Rocket,
  BookOpen,
  Settings2,
  Wrench,
  Cpu,
  ExternalLink,
  Copy,
  Check,
  FileText,
  X,
  Zap,
  GitPullRequest,
  Terminal,
} from 'lucide-react';
import {
  DeployConfig,
  DeployMethodId,
  TARGET_ARENA_SITE,
  getComputedUrls,
  generateFullMarkdownGuide,
} from './data/deploymentTemplates';
import { ArenaSiteInspector } from './components/ArenaSiteInspector';
import { RepoConfigurator } from './components/RepoConfigurator';
import { DeploymentSteps } from './components/DeploymentSteps';
import { TroubleshootingSection } from './components/TroubleshootingSection';
import { CodeTerminalBlock } from './components/CodeTerminalBlock';

export function App() {
  const [config, setConfig] = useState<DeployConfig>({
    githubUsername: 'your-github-id',
    repoName: 'taipei-metro-richman-3d',
    branch: 'main',
    customDomain: '',
    keepSingleFilePlugin: true,
  });

  const [activeMethod, setActiveMethod] = useState<DeployMethodId>('direct-singlefile');
  const [showMarkdownModal, setShowMarkdownModal] = useState(false);
  const [copiedQuickCmd, setCopiedQuickCmd] = useState(false);

  const computed = getComputedUrls(config);

  const quickOneLiner = `curl -sSL -H "Sec-Fetch-Dest: iframe" -H "Referer: https://01a21590-8cf8-78a9-a673-8fca7891bfa9.arena.site/" "https://01a21590-8cf8-78a9-a673-8fca7891bfa9.arena.site/?embed=true" -o index.html && touch .nojekyll`;

  const handleCopyQuickOneLiner = async () => {
    await navigator.clipboard.writeText(quickOneLiner);
    setCopiedQuickCmd(true);
    setTimeout(() => setCopiedQuickCmd(false), 2000);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-[#F1F5F9] bg-dev-grid relative">
      {/* Subtle Top Radial Spotlight */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-96 opacity-40 z-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -15%, rgba(56, 189, 248, 0.22), transparent)',
        }}
      />

      {/* Sticky Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-[#0B0F17]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-400 to-emerald-400 p-0.5 shrink-0 shadow-lg shadow-sky-500/20">
              <div className="w-full h-full bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
                <Rocket className="w-4 h-4 text-sky-400" />
              </div>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base text-white truncate">
                  GitHub Pages 部署說明與配置中心
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  01a21590.arena.site
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-400 truncate">
                Target: 台北捷運大富翁 3D | Taipei Metro Richman XI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowMarkdownModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>檢視純文字 Markdown 全文</span>
            </button>

            <a
              href={TARGET_ARENA_SITE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 transition-colors"
            >
              <span>開啟目標網站</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Summary Banner */}
      <div className="relative z-10 border-b border-slate-800/80 bg-[#0E1420]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-3">
              <div className="inline-flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold">
                  DEPLOYMENT DOCUMENTATION
                </span>
                <span className="text-slate-400">
                  https://01a21590-8cf8-78a9-a673-8fca7891bfa9.arena.site/
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                《台北捷運大富翁 3D》GitHub Pages 完整部署指南
              </h1>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                本指南針對目標網站 <code className="text-sky-300 font-mono">01a21590-8cf8-78a9-a673-8fca7891bfa9.arena.site</code> 進行實測解析，提供{' '}
                <strong className="text-emerald-300">「方案 A：60 秒直接擷取 989KB 單一封裝檔」</strong>、
                <strong className="text-sky-300">「方案 B：完整 React + Vite 原始碼 + GitHub Actions 自動化 CI/CD」</strong> 與{' '}
                <strong className="text-purple-300">「方案 C：本機 gh-pages 發布」</strong> 三種完整步驟與一鍵腳本下載。
              </p>
            </div>

            {/* Quick Extract One-Liner Card */}
            <div className="lg:col-span-4 rounded-2xl border border-emerald-500/30 bg-[#070A10]/95 p-4 space-y-2.5 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  極速擷取純淨單一檔指令 (989 KB)
                </span>
                <button
                  type="button"
                  onClick={handleCopyQuickOneLiner}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-mono bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition-colors cursor-pointer"
                >
                  {copiedQuickCmd ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>已複製</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>複製指令</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="text-[11px] font-mono text-slate-300 bg-slate-900/90 p-2.5 rounded-lg overflow-x-auto border border-slate-800">
                {quickOneLiner}
              </pre>
              <p className="text-[11px] text-slate-400">
                💡 自動帶入 <code className="text-slate-300">Sec-Fetch-Dest: iframe</code> 標頭，直接取得無橫幅之獨立{' '}
                <code className="text-slate-300">index.html</code>。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column Workbench Layout */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sticky Navigation Sidebar (3 cols on lg) */}
          <aside className="lg:col-span-3 lg:sticky lg:top-24 space-y-5">
            {/* Section Navigation */}
            <nav className="rounded-2xl border border-slate-800 bg-[#111827]/90 p-4 space-y-1.5 shadow-xl">
              <div className="px-2.5 py-1 text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
                部署說明章節導覽
              </div>
              <button
                type="button"
                onClick={() => scrollToSection('section-analysis')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer text-left"
              >
                <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>1. 目標網站架構與封裝分析</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('section-configurator')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer text-left"
              >
                <Settings2 className="w-4 h-4 text-sky-400 shrink-0" />
                <span>2. 動態 GitHub 倉庫參數設定</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('section-methods')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer text-left"
              >
                <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
                <span>3. 三種部署方案完整步驟</span>
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('section-troubleshooting')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800/80 transition-colors cursor-pointer text-left"
              >
                <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
                <span>4. 檢查清單與常見錯誤排解</span>
              </button>
            </nav>

            {/* Quick Method Switcher in Sidebar */}
            <div className="rounded-2xl border border-slate-800 bg-[#111827]/90 p-4 space-y-2.5 shadow-xl">
              <div className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider px-1">
                快速切換部署方案
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveMethod('direct-singlefile');
                  scrollToSection('section-methods');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  activeMethod === 'direct-singlefile'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-[#0B0F17] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5" />
                  <span>方案 A：單一檔直接部署</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20">
                  最快
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMethod('actions-source');
                  scrollToSection('section-methods');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  activeMethod === 'actions-source'
                    ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                    : 'bg-[#0B0F17] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <GitPullRequest className="w-3.5 h-3.5" />
                  <span>方案 B：GitHub Actions</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/20">
                  CI/CD
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveMethod('gh-pages-cli');
                  scrollToSection('section-methods');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  activeMethod === 'gh-pages-cli'
                    ? 'bg-purple-500/15 border-purple-500/40 text-purple-300'
                    : 'bg-[#0B0F17] border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>方案 C：gh-pages 套件</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20">
                  CLI
                </span>
              </button>
            </div>

            {/* Target Output Status Card */}
            <div className="rounded-2xl border border-slate-800 bg-[#070A10] p-4 space-y-2.5 text-xs font-mono">
              <div className="text-slate-400 font-semibold">目前設定對應路徑</div>
              <div className="space-y-1">
                <div className="text-[11px] text-slate-500">GitHub 倉庫：</div>
                <div className="text-slate-200 truncate">
                  {computed.cleanUser}/{computed.cleanRepo}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] text-slate-500">預計 Pages 網址：</div>
                <div className="text-emerald-400 break-all">{computed.liveUrl}</div>
              </div>
            </div>
          </aside>

          {/* Right Main Documentation & Workbench Column (9 cols on lg) */}
          <div className="lg:col-span-9 space-y-8">
            <ArenaSiteInspector />
            <RepoConfigurator config={config} onChange={setConfig} />
            <DeploymentSteps
              config={config}
              activeMethod={activeMethod}
              onSelectMethod={setActiveMethod}
            />
            <TroubleshootingSection config={config} />
          </div>
        </div>
      </main>

      {/* Full Raw Markdown Modal */}
      {showMarkdownModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[88vh] rounded-2xl border border-slate-700 bg-[#0B0F17] shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-[#111827]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-400" />
                <span className="text-sm font-bold text-white">
                  GITHUB_DEPLOY_GUIDE.md — 完整純文字 Markdown 部署說明
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowMarkdownModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto">
              <CodeTerminalBlock
                title={`GITHUB_DEPLOY_GUIDE_${computed.cleanRepo}.md`}
                language="markdown"
                code={generateFullMarkdownGuide(config)}
                downloadFilename={`GITHUB_DEPLOY_GUIDE_${computed.cleanRepo}.md`}
                badgeText="完整 Markdown 手冊"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
