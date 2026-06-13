import React from "react";

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  if (!content) return null;

  const parseInline = (text: string): React.ReactNode[] => {
    // Split the text by bold (**) and inline code (`) markers.
    const regex = /(\*\*.*?\*\*|`.*?`)/g;
    const tokens = text.split(regex);

    return tokens.map((token, idx) => {
      if (token.startsWith("**") && token.endsWith("**")) {
        return (
          <strong key={idx} className="font-semibold text-zinc-950 dark:text-white">
            {token.slice(2, -2)}
          </strong>
        );
      }
      if (token.startsWith("`") && token.endsWith("`")) {
        return (
          <code
            key={idx}
            className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800/80 text-rose-500 dark:text-rose-400 font-mono text-sm border border-zinc-200/50 dark:border-zinc-700/50"
          >
            {token.slice(1, -1)}
          </code>
        );
      }
      return token;
    });
  };

  // Normalize line endings and split into paragraphs/blocks by empty lines
  const normalized = content.replace(/\r\n/g, "\n");
  const blocks = normalized.split(/\n\s*\n/);

  return (
    <div className="space-y-4 font-sans antialiased text-base">
      {blocks.map((block, bIdx) => {
        const trimmed = block.trim();
        if (!trimmed) return null;

        // Code block
        if (trimmed.startsWith("```")) {
          const lines = trimmed.split("\n");
          const lang = lines[0].replace("```", "").trim();
          // Find ending ```, fallback to last line if not closed
          const endIndex = lines.lastIndexOf("```");
          const codeLines = endIndex > 0 ? lines.slice(1, endIndex) : lines.slice(1);
          const code = codeLines.join("\n");

          return (
            <pre
              key={bIdx}
              className="p-4 rounded-xl bg-zinc-950 dark:bg-zinc-900 border border-zinc-800/50 text-zinc-300 font-mono text-xs sm:text-sm overflow-x-auto my-4 shadow-sm"
            >
              <code className={lang ? `language-${lang}` : ""}>{code}</code>
            </pre>
          );
        }

        // Headings
        if (trimmed.startsWith("# ")) {
          return (
            <h1
              key={bIdx}
              className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 border-b border-zinc-100 dark:border-zinc-800/50 pb-2 mt-6 mb-4"
            >
              {parseInline(trimmed.slice(2))}
            </h1>
          );
        }
        if (trimmed.startsWith("## ")) {
          return (
            <h2
              key={bIdx}
              className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-8 mb-4 flex items-center gap-2"
            >
              <span className="w-1.5 h-6 bg-indigo-500 rounded-full inline-block"></span>
              {parseInline(trimmed.slice(3))}
            </h2>
          );
        }
        if (trimmed.startsWith("### ")) {
          return (
            <h3
              key={bIdx}
              className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-200 mt-6 mb-3"
            >
              {parseInline(trimmed.slice(4))}
            </h3>
          );
        }

        // Blockquote
        if (trimmed.startsWith("> ")) {
          const text = trimmed
            .split("\n")
            .map((line) => line.replace(/^>\s?/, ""))
            .join("\n");
          return (
            <blockquote
              key={bIdx}
              className="pl-4 border-l-4 border-indigo-500 italic my-4 text-zinc-600 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/30 py-2.5 pr-2 rounded-r-lg"
            >
              {parseInline(text)}
            </blockquote>
          );
        }

        // Bullet list
        if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
          const items = trimmed.split(/\n[*+-]\s/);
          return (
            <ul key={bIdx} className="list-disc pl-6 space-y-2 text-zinc-700 dark:text-zinc-300 my-4">
              {items.map((item, iIdx) => {
                const cleanedItem = iIdx === 0 ? item.replace(/^[*+-]\s/, "") : item;
                return <li key={iIdx} className="leading-relaxed">{parseInline(cleanedItem.trim())}</li>;
              })}
            </ul>
          );
        }

        // Ordered list
        if (/^\d+\.\s/.test(trimmed)) {
          const items = trimmed.split(/\n\d+\.\s/);
          return (
            <ol key={bIdx} className="list-decimal pl-6 space-y-2 text-zinc-700 dark:text-zinc-300 my-4">
              {items.map((item, iIdx) => {
                const cleanedItem = iIdx === 0 ? item.replace(/^\d+\.\s/, "") : item;
                return <li key={iIdx} className="leading-relaxed">{parseInline(cleanedItem.trim())}</li>;
              })}
            </ol>
          );
        }

        // Standard Paragraph
        const paragraphLines = trimmed.split("\n").join(" ");
        return (
          <p
            key={bIdx}
            className="leading-relaxed text-zinc-700 dark:text-zinc-300 text-sm sm:text-[15px] font-normal my-3.5"
          >
            {parseInline(paragraphLines)}
          </p>
        );
      })}
    </div>
  );
}
