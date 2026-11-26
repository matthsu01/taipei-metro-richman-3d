import React, { useState } from 'react';
import {
  ExternalLink,
  Layers,
  Cpu,
  ShieldAlert,
  Play,
  Image as ImageIcon,
  CheckCircle2,
  FileArchive,
  Sparkles,
} from 'lucide-react';
import { TARGET_ARENA_SITE } from '../data/deploymentTemplates';

export const ArenaSiteInspector: React.FC = () => {
  const [previewMode, setPreviewMode] = useState<'screenshot' | 'live'>('screenshot');

  return (
    <section
      id="section-analysis"
      className="rounded-2xl border border-slate-800/90 bg-[#111827]/90 backdrop-blur-md p-6 sm:p-7 shadow-2xl space-y-6"
    >
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono font-medium bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>TARGET SITE VERIFIED · 目標網站實測結構分析</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight flex flex-wrap items-center gap-2.5">
            <span>🚇 {TARGET_ARENA_SITE.title}</span>
            <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-slate-800 text-sky-300 border border-slate-700">
              ID: 01a21590-8cf8
            </span>
          </h2>
          <p className="text-sm text-slate-400">
            我們已針對目標網址執行底層 HTML 與封裝檢測。部署至 GitHub Pages 前，請先了解 Arena 特有的雙層容器結構：
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <a
            href={TARGET_ARENA_SITE.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <span>開啟原始 Arena 網址</span>
            <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
          </a>
        </div>
      </div>

      {/* Critical Architecture Comparison: Outer Shell vs Inner Bundle */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left 7 cols: Dual-Layer Dissection + Stack */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Layer 1: Outer Wrapper (Trap) */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-300">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  外層網址 `/` (不可直接另存)
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">
                  13.4 KB
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                直接對根網址按「另存新檔」或單純 <code className="text-amber-300">curl</code> 只會拿到外層殼（含{' '}
                <code className="text-amber-300">Built with Arena</code> 橫幅、PostHog 統計與指向遠端的{' '}
                <code className="text-amber-300">&lt;iframe&gt;</code>），並非獨立遊戲本體。
              </p>
            </div>

            {/* Layer 2: Inner Singlefile Bundle (Real App) */}
            <div className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-emerald-300">
                  <FileArchive className="w-4 h-4 text-emerald-400" />
                  內層端點 `/?embed=true` (真正本體)
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200">
                  989.1 KB
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                由 <code className="text-emerald-300">vite-plugin-singlefile</code> 編譯的單一獨立{' '}
                <code className="text-emerald-300">index.html</code>（989,108 Bytes），已內嵌完整 3D 捷運棋盤、Three.js 引擎與合成音效，可直接部署至 GitHub Pages！
              </p>
            </div>
          </div>

          {/* Tech Stack Grid */}
          <div className="rounded-xl border border-slate-800 bg-[#0B0F17]/90 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold text-sky-400 uppercase tracking-wider">
                <Cpu className="w-4 h-4" />
                <span>實測封裝技術棧 (Detected Bundle Dependencies)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">100% 靜態無後端依賴</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TARGET_ARENA_SITE.stack.map((item) => (
                <div
                  key={item.name}
                  className="flex items-start justify-between gap-2 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80"
                >
                  <div>
                    <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                      <span>{item.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/15 text-sky-300">
                        {item.version}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 5 cols: Visual Preview / Live Embed */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#0B0F17] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-[#0F1624] border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-mono font-medium text-slate-200">
                目標專案預覽 (01a21590)
              </span>
            </div>
            <div className="inline-flex rounded-lg p-0.5 bg-slate-900 border border-slate-800">
              <button
                type="button"
                onClick={() => setPreviewMode('screenshot')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  previewMode === 'screenshot'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-3 h-3" />
                <span>OG 預覽圖</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('live')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  previewMode === 'live'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Play className="w-3 h-3" />
                <span>即時互動預覽</span>
              </button>
            </div>
          </div>

          <div className="relative flex-1 min-h-[250px] bg-slate-950 flex items-center justify-center overflow-hidden">
            {previewMode === 'screenshot' ? (
              <div className="relative w-full h-full group">
                <img
                  src={TARGET_ARENA_SITE.ogImage}
                  alt={TARGET_ARENA_SITE.title}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent flex flex-col justify-end p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-xs font-mono text-sky-400">
                        ?embed=true · 989,108 Bytes Single-File Build
                      </p>
                      <p className="text-sm font-bold text-white">
                        台北捷運大富翁 3D | Taipei Metro Richman XI
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPreviewMode('live')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg transition-all cursor-pointer shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>載入 3D 實機畫面</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <iframe
                title="台北捷運大富翁 3D Live Preview"
                src={TARGET_ARENA_SITE.embedUrl}
                className="w-full h-full min-h-[260px] border-0"
                allow="autoplay; fullscreen"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
