import React, { useState } from 'react';
import {
  Settings2,
  Globe,
  GitBranch,
  User,
  FolderGit2,
  Check,
  Copy,
  Download,
  RotateCcw,
} from 'lucide-react';
import {
  DeployConfig,
  getComputedUrls,
  generateFullMarkdownGuide,
} from '../data/deploymentTemplates';

interface RepoConfiguratorProps {
  config: DeployConfig;
  onChange: (next: DeployConfig) => void;
}

export const RepoConfigurator: React.FC<RepoConfiguratorProps> = ({ config, onChange }) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const computed = getComputedUrls(config);

  const handleCopyLiveUrl = async () => {
    await navigator.clipboard.writeText(computed.liveUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 1800);
  };

  const handleCopyFullMarkdown = async () => {
    const md = generateFullMarkdownGuide(config);
    await navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadFullMarkdown = () => {
    const md = generateFullMarkdownGuide(config);
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `GITHUB_DEPLOY_GUIDE_${computed.cleanRepo}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    onChange({
      githubUsername: 'your-github-id',
      repoName: 'taipei-metro-richman-3d',
      branch: 'main',
      customDomain: '',
      keepSingleFilePlugin: true,
    });
  };

  return (
    <section
      id="section-configurator"
      className="rounded-2xl border border-sky-500/30 bg-gradient-to-br from-[#111827] via-[#0F172A] to-[#0B0F17] p-6 sm:p-7 shadow-2xl space-y-5"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-sky-400 uppercase tracking-wider">
            <Settings2 className="w-4 h-4" />
            <span>INTERACTIVE REPO CONFIGURATOR · 動態倉庫參數產生器</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-100">
            輸入您的 GitHub 帳號與倉庫名稱，全頁指令與設定檔將即時同步更新
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>重設預設值</span>
          </button>

          <button
            type="button"
            onClick={handleCopyFullMarkdown}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              copiedMd
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border-sky-500/30'
            }`}
          >
            {copiedMd ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>已複製完整 Markdown 指南！</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>一鍵複製完整 Markdown 說明</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownloadFullMarkdown}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>下載完整 .md 部署手冊</span>
          </button>
        </div>
      </div>

      {/* Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GitHub Username */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
            <User className="w-3.5 h-3.5 text-sky-400" />
            <span>GitHub 帳號 (Username)</span>
          </label>
          <input
            type="text"
            value={config.githubUsername}
            onChange={(e) => onChange({ ...config, githubUsername: e.target.value })}
            placeholder="例如：octocat"
            className="w-full px-3.5 py-2 rounded-xl text-sm font-mono bg-[#070A10] border border-slate-700/80 text-slate-100 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40"
          />
        </div>

        {/* Repository Name */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
            <FolderGit2 className="w-3.5 h-3.5 text-sky-400" />
            <span>倉庫名稱 (Repository Name)</span>
          </label>
          <input
            type="text"
            value={config.repoName}
            onChange={(e) => onChange({ ...config, repoName: e.target.value })}
            placeholder="taipei-metro-richman-3d"
            className="w-full px-3.5 py-2 rounded-xl text-sm font-mono bg-[#070A10] border border-slate-700/80 text-slate-100 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40"
          />
        </div>

        {/* Default Branch */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
            <GitBranch className="w-3.5 h-3.5 text-sky-400" />
            <span>部署分支 (Default Branch)</span>
          </label>
          <select
            value={config.branch}
            onChange={(e) =>
              onChange({ ...config, branch: e.target.value as 'main' | 'master' })
            }
            className="w-full px-3.5 py-2 rounded-xl text-sm font-mono bg-[#070A10] border border-slate-700/80 text-slate-100 focus:outline-none focus:border-sky-400"
          >
            <option value="main">main (GitHub 預設推薦)</option>
            <option value="master">master</option>
          </select>
        </div>

        {/* Custom Domain */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>自訂網域 CNAME (選填)</span>
          </label>
          <input
            type="text"
            value={config.customDomain}
            onChange={(e) => onChange({ ...config, customDomain: e.target.value })}
            placeholder="留空則使用 github.io"
            className="w-full px-3.5 py-2 rounded-xl text-sm font-mono bg-[#070A10] border border-slate-700/80 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/40"
          />
        </div>
      </div>

      {/* Live Output Summary Bar */}
      <div className="rounded-xl bg-[#070A10]/90 border border-slate-800 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div>
            <span className="text-slate-400 mr-1.5">預計上線網址 (Live URL):</span>
            <span className="text-emerald-400 font-semibold break-all">{computed.liveUrl}</span>
          </div>
          <span className="hidden sm:inline text-slate-700">|</span>
          <div>
            <span className="text-slate-400 mr-1.5">Vite Base 路徑:</span>
            <code className="px-2 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
              base: &quot;{computed.basePath}&quot;
            </code>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.keepSingleFilePlugin}
              onChange={(e) =>
                onChange({ ...config, keepSingleFilePlugin: e.target.checked })
              }
              className="rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500/40"
            />
            <span>保留 `viteSingleFile()` 單一檔案內嵌打包</span>
          </label>

          <button
            type="button"
            onClick={handleCopyLiveUrl}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>已複製網址</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-sky-400" />
                <span>複製預計網址</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
