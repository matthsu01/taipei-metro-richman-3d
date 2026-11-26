import React, { useState } from 'react';
import {
  Wrench,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  ShieldCheck,
} from 'lucide-react';
import { TROUBLESHOOTING_ITEMS, DeployConfig, getComputedUrls } from '../data/deploymentTemplates';
import { CodeTerminalBlock } from './CodeTerminalBlock';

interface TroubleshootingSectionProps {
  config: DeployConfig;
}

export const TroubleshootingSection: React.FC<TroubleshootingSectionProps> = ({ config }) => {
  const [openId, setOpenId] = useState<string>(TROUBLESHOOTING_ITEMS[0].id);
  const computed = getComputedUrls(config);

  const checklistItems = [
    {
      id: 'chk-1',
      label: `確認下載的是 989 KB 的內嵌封裝檔 (?embed=true) 或完整 React 原始碼，而非 13.4 KB 的根網址外殼`,
    },
    {
      id: 'chk-2',
      label: `GitHub 倉庫 (${computed.cleanUser}/${computed.cleanRepo}) 可見度已設為 Public（或您擁有 GitHub Pro 帳號）`,
    },
    {
      id: 'chk-3',
      label: `若使用 Vite 原始碼編譯，vite.config.ts 的 base 已設定為 "${computed.basePath}"`,
    },
    {
      id: 'chk-4',
      label: `輸出目錄中包含 .nojekyll 空檔案，防止 GitHub Pages 預設 Jekyll 引擎忽略底線開頭資源`,
    },
    {
      id: 'chk-5',
      label: `已至倉庫 Settings → Pages 確認 Source 設定與您的部署方案一致（Deploy from a branch 或 GitHub Actions）`,
    },
  ];

  const [checked, setChecked] = useState<Record<string, boolean>>({
    'chk-1': true,
    'chk-4': true,
  });

  const toggleCheck = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <section id="section-troubleshooting" className="space-y-6">
      {/* Pre-Flight Checklist Card */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827]/90 p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-100">
              部署前最終檢查清單 (Pre-Flight Verification Checklist)
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            已完成 {checkedCount} / {checklistItems.length} 項檢查
          </span>
        </div>

        <div className="space-y-2.5">
          {checklistItems.map((item) => {
            const isDone = !!checked[item.id];
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleCheck(item.id)}
                className={`w-full flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isDone
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-100'
                    : 'bg-[#0B0F17] border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                {isDone ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                )}
                <span className="text-xs sm:text-sm leading-relaxed">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Troubleshooting Accordion */}
      <div className="rounded-2xl border border-slate-800 bg-[#111827]/90 p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="border-b border-slate-800 pb-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-amber-400 uppercase tracking-wider">
            <Wrench className="w-4 h-4" />
            <span>TROUBLESHOOTING & FAQ · 常見錯誤排解指南</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-100 mt-1">
            遇到 0 Bytes、白畫面 404 或權限錯誤？點選下方狀況立即排解
          </h3>
        </div>

        <div className="space-y-3">
          {TROUBLESHOOTING_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-800 bg-[#0B0F17] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? '' : item.id)}
                  className="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left hover:bg-slate-900/60 transition-colors cursor-pointer"
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {item.badge}
                    </span>
                    <span className="text-sm font-semibold text-slate-100">
                      {item.symptom}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 space-y-3 text-xs sm:text-sm">
                    <div className="space-y-1">
                      <span className="font-mono text-xs text-rose-400 font-semibold">
                        [原因分析]
                      </span>
                      <p className="text-slate-300 leading-relaxed">{item.cause}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="font-mono text-xs text-emerald-400 font-semibold">
                        [解決方法]
                      </span>
                      <p className="text-slate-200 leading-relaxed whitespace-pre-line">
                        {item.solution}
                      </p>
                    </div>
                    {item.snippet && (
                      <CodeTerminalBlock
                        title="修復範例指令 / 設定"
                        language="bash"
                        code={item.snippet}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
