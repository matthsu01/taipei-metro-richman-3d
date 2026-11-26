import React, { useState } from 'react';
import { Check, Copy, Download, FileCode2 } from 'lucide-react';

interface CodeTerminalBlockProps {
  title: string;
  language: string;
  code: string;
  downloadFilename?: string;
  isTerminal?: boolean;
  badgeText?: string;
}

export const CodeTerminalBlock: React.FC<CodeTerminalBlockProps> = ({
  title,
  language,
  code,
  downloadFilename,
  isTerminal = false,
  badgeText,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!downloadFilename) return;
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const lines = code.split('\n');

  return (
    <div className="rounded-xl border border-slate-800/90 bg-[#070A10] overflow-hidden shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#0F1624] border-b border-slate-800/80">
        <div className="flex items-center gap-2.5 min-w-0">
          {isTerminal ? (
            <div className="flex items-center gap-1.5 mr-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>
          ) : (
            <FileCode2 className="w-4 h-4 text-sky-400 shrink-0" />
          )}
          <span className="font-mono text-xs sm:text-sm font-medium text-slate-200 truncate">
            {title}
          </span>
          {badgeText && (
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-sky-500/15 text-sky-300 border border-sky-500/30">
              {badgeText}
            </span>
          )}
          <span className="text-[11px] font-mono text-slate-400 uppercase px-1.5 py-0.5 rounded bg-slate-800/70">
            {language}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {downloadFilename && (
            <button
              type="button"
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700/70 transition-colors cursor-pointer"
              title={`下載 ${downloadFilename}`}
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>下載檔案</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-sky-500/15 hover:bg-sky-500/25 text-sky-300 border-sky-500/30'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>已複製！</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>複製程式碼</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-x-auto text-xs sm:text-[13px] leading-relaxed font-mono">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => {
              const trimmed = line.trim();
              const isComment = trimmed.startsWith('#') || trimmed.startsWith('//');
              const isEchoOrStep =
                trimmed.startsWith('echo ') || trimmed.startsWith('Write-Host ');
              return (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="select-none pr-4 text-right text-slate-600 w-8 align-top">
                    {idx + 1}
                  </td>
                  <td
                    className={`whitespace-pre ${
                      isComment
                        ? 'text-slate-400 italic'
                        : isEchoOrStep
                          ? 'text-emerald-300'
                          : 'text-slate-100'
                    }`}
                  >
                    {line || ' '}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
