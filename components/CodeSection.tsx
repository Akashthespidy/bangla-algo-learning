"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeSectionProps {
  code: {
    cpp: string;
    javascript: string;
    python: string;
  };
}

export function CodeSection({ code }: CodeSectionProps) {
  const [activeTab, setActiveTab] = useState<"cpp" | "javascript" | "python">("cpp");
  const [copied, setCopied] = useState(false);

  const activeCode = code[activeTab] || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderHighlightedLine = (line: string) => {
    if (!line.trim()) return <span>&nbsp;</span>;

    // Fast check for pure comment lines
    if (line.trim().startsWith("//") || line.trim().startsWith("#")) {
      return <span className="text-zinc-500 italic">{line}</span>;
    }

    // Tokenize strings, comments, keywords, types, functions, and numbers
    const tokenRegex = /(\/\/.*|#.*|"(?:\\.|[^\\"])*"|'(?:\\.|[^\\'])*'|`[^`]*`|\b(?:const|let|var|function|return|for|while|if|else|class|def|import|export|from|int|float|double|char|void|struct|public|private|protected|using|namespace|include|std|vector|cout|cin|endl)\b|\b(?:true|false|null|undefined|self|None|print|printf|size_t|bool)\b|\b[a-zA-Z_]\w*(?=\()|\b\d+\b)/g;

    const parts = line.split(tokenRegex);
    const matches = line.match(tokenRegex) || [];

    let matchIdx = 0;
    return parts.map((part, pIdx) => {
      // Find matches in sequence
      if (
        matchIdx < matches.length &&
        line.indexOf(matches[matchIdx], parts.slice(0, pIdx).join("").length) === parts.slice(0, pIdx).join("").length
      ) {
        const token = matches[matchIdx];
        matchIdx++;

        // Color coding tokens
        if (token.startsWith("//") || token.startsWith("#")) {
          return <span key={pIdx} className="text-zinc-500 italic">{token}</span>;
        }
        if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`")) {
          return <span key={pIdx} className="text-amber-500 dark:text-amber-400">{token}</span>;
        }
        if (
          /\b(?:const|let|var|function|return|for|while|if|else|class|def|import|export|from|int|float|double|char|void|struct|public|private|protected|using|namespace|include|std|vector|cout|cin|endl)\b/.test(
            token
          )
        ) {
          return (
            <span key={pIdx} className="text-rose-500 dark:text-rose-400 font-medium">
              {token}
            </span>
          );
        }
        if (/\b(?:true|false|null|undefined|self|None|print|printf|size_t|bool)\b/.test(token)) {
          return <span key={pIdx} className="text-indigo-400 dark:text-indigo-400 font-medium">{token}</span>;
        }
        if (/\b\d+\b/.test(token)) {
          return <span key={pIdx} className="text-amber-500 dark:text-yellow-500">{token}</span>;
        }
        // Function names
        return <span key={pIdx} className="text-sky-400 dark:text-sky-400">{token}</span>;
      }
      return <span key={pIdx} className="text-zinc-300 dark:text-zinc-300">{part}</span>;
    });
  };

  const codeLines = activeCode.split("\n");

  return (
    <div className="border border-zinc-200 dark:border-zinc-800/80 bg-zinc-950 dark:bg-zinc-900 rounded-2xl overflow-hidden flex flex-col shadow-sm">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-200/5 dark:border-zinc-800 bg-zinc-900/60 px-4 h-12 shrink-0">
        <div className="flex items-center gap-1.5">
          {(["cpp", "javascript", "python"] as const).map((lang) => {
            const label = lang === "cpp" ? "C++" : lang === "javascript" ? "JavaScript" : "Python";
            const isActive = activeTab === lang;
            return (
              <button
                key={lang}
                onClick={() => setActiveTab(lang)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-colors cursor-pointer ${
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "bg-transparent text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg border border-zinc-800 hover:bg-zinc-850 text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-medium"
        >
          {copied ? (
            <>
              <Check size={14} className="text-emerald-500" />
              <span className="text-emerald-500">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code viewer with custom scrolling */}
      <div className="p-4 font-mono text-xs sm:text-sm overflow-x-auto flex-1 h-[420px] bg-[#070b13]">
        <table className="w-full border-collapse">
          <tbody>
            {codeLines.map((line, idx) => (
              <tr key={idx} className="hover:bg-zinc-850/35 group leading-6">
                <td className="w-8 text-right select-none text-zinc-600 dark:text-zinc-700 pr-4 text-xs font-mono">
                  {idx + 1}
                </td>
                <td className="whitespace-pre pl-2 text-left font-mono">
                  {renderHighlightedLine(line)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
