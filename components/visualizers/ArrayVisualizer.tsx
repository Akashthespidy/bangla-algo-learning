"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ArrayVisualizerProps {
  state: number[];
  active: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  category?: string; // "sorting" | "searching" etc.
  markers?: { [key: string]: number }; // e.g. { left: 0, right: 6, mid: 3 }
}

export function ArrayVisualizer({
  state,
  active = [],
  comparing = [],
  swapping = [],
  sorted = [],
  category = "sorting",
  markers = {},
}: ArrayVisualizerProps) {
  const isSearching = category.toLowerCase().includes("search");

  if (!state || state.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500">
        কোনো ডাটা পাওয়া যায়নি
      </div>
    );
  }

  // Render search boxes
  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-8 px-4 w-full">
        <div className="flex flex-wrap items-center justify-center gap-3 w-full">
          <AnimatePresence mode="popLayout">
            {state.map((val, idx) => {
              const isActive = active.includes(idx);
              const isComparing = comparing.includes(idx);
              const isSorted = sorted.includes(idx);
              
              // Determine marker labels
              const markerLabels: string[] = [];
              Object.entries(markers).forEach(([label, index]) => {
                if (index === idx) {
                  if (label === "left") markerLabels.push("L");
                  if (label === "right") markerLabels.push("R");
                  if (label === "mid" || label === "middle") markerLabels.push("M");
                }
              });

              let borderClass = "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900";
              let textClass = "text-zinc-800 dark:text-zinc-200";

              if (isComparing) {
                borderClass = "border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20";
                textClass = "text-amber-600 dark:text-amber-400 font-bold";
              } else if (isActive) {
                borderClass = "border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/20";
                textClass = "text-indigo-600 dark:text-indigo-400 font-bold";
              } else if (isSorted) {
                borderClass = "border-emerald-500 bg-emerald-500/10";
                textClass = "text-emerald-600 dark:text-emerald-400 font-bold";
              }

              return (
                <motion.div
                  key={`block-${idx}-${val}`}
                  layout
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="flex flex-col items-center gap-1.5"
                >
                  {/* Marker indicators on top */}
                  <div className="h-6 flex items-end justify-center gap-0.5">
                    {markerLabels.map((lbl, lIdx) => (
                      <span
                        key={lIdx}
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          lbl === "M"
                            ? "bg-amber-500 text-white"
                            : lbl === "L"
                            ? "bg-indigo-600 text-white"
                            : "bg-rose-500 text-white"
                        }`}
                      >
                        {lbl}
                      </span>
                    ))}
                  </div>

                  {/* Value card */}
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center text-base sm:text-lg font-mono font-semibold shadow-sm transition-all duration-200 ${borderClass} ${textClass}`}
                  >
                    {val}
                  </div>

                  {/* Index marker */}
                  <span className="text-xs font-mono text-zinc-400 dark:text-zinc-600">
                    {idx}
                  </span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mt-8 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-indigo-500/10 border border-indigo-500" />
            <span>সক্রিয় সীমানা (Active Bounds)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-amber-500/10 border border-amber-500" />
            <span>তুলনা করা হচ্ছে (Comparing / Mid)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded bg-emerald-500/10 border border-emerald-500" />
            <span>খুঁজে পাওয়া গেছে (Target Found)</span>
          </div>
        </div>
      </div>
    );
  }

  // Render sorting bars
  const maxVal = Math.max(...state, 1);

  return (
    <div className="flex flex-col items-center justify-end w-full h-80 pt-10 pb-4 px-2 sm:px-6">
      <div className="flex items-end justify-center w-full h-full gap-1 sm:gap-2.5 max-w-2xl">
        {state.map((val, idx) => {
          const isComparing = comparing.includes(idx);
          const isSwapping = swapping.includes(idx);
          const isSorted = sorted.includes(idx);
          const heightPercent = (val / maxVal) * 85 + 15; // Min height 15%

          let barColor = "bg-indigo-500 dark:bg-indigo-600";
          let borderClass = "border-transparent";

          if (isSwapping) {
            barColor = "bg-rose-500 dark:bg-rose-600";
          } else if (isComparing) {
            barColor = "bg-amber-500 dark:bg-amber-600";
          } else if (isSorted) {
            barColor = "bg-emerald-500 dark:bg-emerald-600";
          }

          return (
            <motion.div
              key={`bar-${idx}-${val}`}
              layout
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="flex-1 flex flex-col items-center h-full justify-end max-w-[48px]"
            >
              {/* Value floating tooltip */}
              <div className="text-[10px] sm:text-xs font-mono font-semibold text-zinc-500 dark:text-zinc-400 mb-1">
                {val}
              </div>

              {/* Bar */}
              <motion.div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-lg shadow-sm transition-colors duration-200 ${barColor} ${borderClass}`}
                whileHover={{ scaleY: 1.05 }}
              />

              {/* Index label */}
              <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-600 mt-2">
                {idx}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-8 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-indigo-500" />
          <span>সাধারণ অবিকৃত (Default)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-amber-500" />
          <span>তুলনা করা হচ্ছে (Comparing)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-rose-500" />
          <span>স্থানান্তর হচ্ছে (Swapping)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-emerald-500" />
          <span>সর্ট সম্পন্ন (Sorted)</span>
        </div>
      </div>
    </div>
  );
}
