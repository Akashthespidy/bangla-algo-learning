"use client";

import React from "react";
import { motion } from "framer-motion";

interface GridVisualizerProps {
  state: any; // Can be a 1D array or a 2D grid
  active: number[]; // e.g. current index being filled
  comparing?: number[]; // e.g. indices used for the calculation
  sorted?: number[]; // e.g. already calculated indices
  label?: string; // Optional name prefix (e.g., "dp")
}

export function GridVisualizer({
  state,
  active = [],
  comparing = [],
  sorted = [],
  label = "dp",
}: GridVisualizerProps) {
  if (!state || (Array.isArray(state) && state.length === 0)) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500">
        টেবিল খালি রয়েছে
      </div>
    );
  }

  // Handle 1D DP array (like Fibonacci DP)
  const isArray = Array.isArray(state);

  if (isArray) {
    return (
      <div className="flex flex-col items-center justify-center py-6 px-4 w-full">
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl w-full">
          {state.map((val, idx) => {
            const isActive = active.includes(idx);
            const isComparing = comparing.includes(idx);
            const isFilled = val !== null && val !== undefined && val !== -1;
            const isSorted = sorted.includes(idx);

            let borderClass = "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900";
            let textClass = "text-zinc-400 dark:text-zinc-600";
            let scale = 1;

            if (isActive) {
              borderClass = "border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20";
              textClass = "text-indigo-600 dark:text-indigo-400 font-bold";
              scale = 1.05;
            } else if (isComparing) {
              borderClass = "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20";
              textClass = "text-amber-600 dark:text-amber-400 font-bold";
              scale = 1.05;
            } else if (isSorted || isFilled) {
              borderClass = "border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/10";
              textClass = "text-emerald-600 dark:text-emerald-400 font-semibold";
            }

            return (
              <motion.div
                key={`grid-cell-${idx}`}
                layout
                animate={{ scale }}
                className="flex flex-col items-center gap-1.5 min-w-[56px] sm:min-w-[64px]"
              >
                {/* Cell Variable label */}
                <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                  {label}[{idx}]
                </span>

                {/* Value Card */}
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 flex items-center justify-center text-sm sm:text-base font-mono shadow-sm transition-all duration-200 ${borderClass} ${textClass}`}
                >
                  {val === null || val === -1 ? "-" : val}
                </div>

                {/* Subtext description of role */}
                <span className="text-[10px] font-mono h-4 text-zinc-400">
                  {isActive ? "হিসাব হচ্ছে" : isComparing ? "ইনপুট" : isSorted ? "সংরক্ষিত" : ""}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* DP formula explanation for Fib */}
        {active.length > 0 && comparing.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl max-w-md w-full text-center"
          >
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-1.5 font-mono">
              Calculation Trace
            </h4>
            <p className="text-base font-mono font-bold text-indigo-600 dark:text-indigo-400">
              {label}[{active[0]}] = {comparing.map((c, i) => `${label}[${c}]`).join(" + ")}
            </p>
            <p className="text-sm font-mono text-zinc-600 dark:text-zinc-400 mt-1">
              = {comparing.map((c) => state[c] === null || state[c] === -1 ? "?" : state[c]).join(" + ")}
              {" = "}
              {state[active[0]] === null || state[active[0]] === -1 ? "?" : state[active[0]]}
            </p>
          </motion.div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-4 mt-8 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-indigo-500/10 border border-indigo-500" />
            <span>সক্রিয় সেল (Currently Computing)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-amber-500/10 border border-amber-500" />
            <span>উপাদান মান (Summing Inputs)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-emerald-500/10 border border-emerald-500" />
            <span>ইতিমধ্যে সংরক্ষিত (Saved in Table)</span>
          </div>
        </div>
      </div>
    );
  }

  // Fallback if we need to expand to 2D matrix
  return (
    <div className="flex items-center justify-center h-64 text-zinc-500">
      2D গ্রিড ভিজ্যুয়ালাইজার এখনও সমর্থিত নয়
    </div>
  );
}
