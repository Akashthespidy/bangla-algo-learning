"use client";

import React, { useState } from "react";
import { Check, Copy } from "lucide-react";

type Language = "cpp" | "c" | "javascript" | "python";

interface CodeSectionProps {
  code: {
    cpp?: string;
    c?: string;
    javascript?: string;
    python?: string;
  };
}

const LANGUAGE_LABELS: Record<Language, string> = {
  cpp: "C++",
  c: "C",
  javascript: "JavaScript",
  python: "Python",
};

export function CodeSection({ code }: CodeSectionProps) {
  const availableLangs = (["cpp", "c", "javascript", "python"] as Language[]).filter(
    (lang) => Boolean(code[lang]?.trim())
  );

  const [activeTab, setActiveTab] = useState<Language>(
    availableLangs[0] || "cpp"
  );
  const [copied, setCopied] = useState(false);

  const activeCode = code[activeTab] || "";

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderHighlightedLine = (line: string) => {
    if (!line.trim()) return <span>&nbsp;</span>;

    const isPython = activeTab === "python";

    // Fast check for pure comment lines
    if (line.trim().startsWith("//") || (isPython && line.trim().startsWith("#"))) {
      return <span className="text-zinc-500 italic">{line}</span>;
    }

    // Comprehensive token pattern without group split duplication
    const tokenRegex = isPython
      ? /(#.*|"(?:\\.|[^\\"\n])*"|'(?:\\.|[^\\'\n])*'|`[^`]*`|\b(?:def|class|return|for|while|if|elif|else|in|is|not|and|or|import|from|as|pass|break|continue|try|except|finally|raise|with|lambda|yield|global|nonlocal)\b|\b(?:True|False|None|self|print|len|range|int|float|str|list|dict|set|tuple|bool)\b|\b[a-zA-Z_]\w*(?=\s*\()|\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)/g
      : /(\/\/.*|#(?:include|define|undef|ifdef|ifndef|endif|pragma)\b|<[a-zA-Z0-9_.\/]+>|"(?:\\.|[^\\"\n])*"|'(?:\\.|[^\\'\n])*'|`[^`]*`|\b(?:const|let|var|function|return|for|while|if|else|class|import|export|from|using|namespace|public|private|protected|struct|continue|break|switch|case|default|new|delete|typedef)\b|\b(?:int|float|double|char|void|bool|size_t|vector|string|long|short|unsigned|signed|auto|Array|Set|Map)\b|\b(?:std|cout|cin|endl|true|false|null|undefined|None|print|printf|scanf|require|console|push_back|push|pop|fill|length|size)\b|\b[a-zA-Z_]\w*(?=\s*\()|\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b)/g;

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(line)) !== null) {
      const matchIndex = match.index;
      const token = match[0];

      // Add preceding plain text
      if (matchIndex > lastIndex) {
        elements.push(
          <span key={`plain-${lastIndex}`} className="text-zinc-300 dark:text-zinc-300">
            {line.slice(lastIndex, matchIndex)}
          </span>
        );
      }

      // Add highlighted token
      if (token.startsWith("//") || (isPython && token.startsWith("#"))) {
        elements.push(
          <span key={`tok-${matchIndex}`} className="text-zinc-500 italic">
            {token}
          </span>
        );
      } else if (token.startsWith("#")) {
        elements.push(
          <span key={`tok-${matchIndex}`} className="text-purple-400 dark:text-purple-400 font-semibold">
            {token}
          </span>
        );
      } else if (token.startsWith("<") && token.endsWith(">")) {
        elements.push(
          <span key={`tok-${matchIndex}`} className="text-emerald-400 dark:text-emerald-400 font-mono">
            {token}
          </span>
        );
      } else if (token.startsWith('"') || token.startsWith("'") || token.startsWith("`")) {
        elements.push(
          <span key={`tok-${matchIndex}`} className="text-amber-400 dark:text-amber-400">
            {token}
          </span>
        );
      } else if (
        /\b(?:const|let|var|function|return|for|while|if|elif|else|class|def|import|export|from|using|namespace|public|private|protected|struct|continue|break|switch|case|default|new|delete|typedef|in|is|not|and|or|as|pass|try|except|finally|raise|with|lambda|yield|global|nonlocal)\b/.test(
          token
        )
      ) {
        elements.push(
          <span key={`tok-${matchIndex}`} className="text-rose-400 dark:text-rose-400 font-medium">
            {token}
          </span>
        );
      } else if (
        /\b(?:int|float|double|char|void|bool|size_t|vector|string|long|short|unsigned|signed|auto|Array|Set|Map|str|list|dict|tuple)\b/.test(
          token
        )
      ) {
        elements.push(
          <span key={`tok-${matchIndex}`} className="text-sky-400 dark:text-sky-400 font-medium">
            {token}
          </span>
        );
      } else if (
        /\b(?:std|cout|cin|endl|true|false|True|False|null|undefined|self|None|print|printf|scanf|require|console|push_back|push|pop|fill|length|size|len|range)\b/.test(
          token
        )
      ) {
        elements.push(
          <span key={`tok-${matchIndex}`} className="text-indigo-400 dark:text-indigo-400 font-medium">
            {token}
          </span>
        );
      } else if (/\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/.test(token)) {
        elements.push(
          <span key={`tok-${matchIndex}`} className="text-amber-400 dark:text-yellow-400">
            {token}
          </span>
        );
      } else {
        // Function names
        elements.push(
          <span key={`tok-${matchIndex}`} className="text-sky-300 dark:text-sky-300">
            {token}
          </span>
        );
      }

      lastIndex = tokenRegex.lastIndex;
    }

    // Add trailing plain text
    if (lastIndex < line.length) {
      elements.push(
        <span key={`plain-${lastIndex}`} className="text-zinc-300 dark:text-zinc-300">
          {line.slice(lastIndex)}
        </span>
      );
    }

    return elements;
  };

  const codeLines = activeCode.split("\n");

  return (
    <div className="border border-zinc-200 dark:border-zinc-800/80 bg-zinc-950 dark:bg-zinc-900 rounded-2xl overflow-hidden flex flex-col shadow-sm">
      {/* Header Tabs */}
      <div className="flex items-center justify-between border-b border-zinc-200/5 dark:border-zinc-800 bg-zinc-900/60 px-4 h-12 shrink-0">
        <div className="flex items-center gap-1.5">
          {availableLangs.map((lang) => {
            const label = LANGUAGE_LABELS[lang];
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
