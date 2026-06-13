"use client";

import React from "react";
import { motion } from "framer-motion";

export interface TreeNode {
  id: string;
  val: number;
  x: number;
  y: number;
  parentId?: string;
  parentX?: number;
  parentY?: number;
  status?: "normal" | "comparing" | "active" | "inserted";
}

interface TreeVisualizerProps {
  state: TreeNode[];
}

export function TreeVisualizer({ state = [] }: TreeVisualizerProps) {
  if (!state || state.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500">
        বৃক্ষ (Tree) খালি রয়েছে
      </div>
    );
  }

  // Determine SVG box bounds
  const width = 500;
  const height = 260;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full max-w-lg h-auto border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl bg-white/50 dark:bg-zinc-950/20"
      >
        {/* Render connections/edges */}
        {state.map((node) => {
          if (node.parentId && node.parentX !== undefined && node.parentY !== undefined) {
            return (
              <motion.line
                key={`line-${node.id}`}
                x1={node.parentX}
                y1={node.parentY}
                x2={node.x}
                y2={node.y}
                stroke="#6366f1"
                strokeWidth="2.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
                className="opacity-70 dark:opacity-50"
              />
            );
          }
          return null;
        })}

        {/* Render nodes */}
        {state.map((node) => {
          const isComparing = node.status === "comparing";
          const isActive = node.status === "active";
          const isInserted = node.status === "inserted";

          let fillColor = "#ffffff";
          let strokeColor = "#6366f1";
          let textColor = "#0f172a";

          if (isComparing) {
            fillColor = "#f59e0b"; // Amber
            strokeColor = "#d97706";
            textColor = "#ffffff";
          } else if (isActive) {
            fillColor = "#3b82f6"; // Blue
            strokeColor = "#2563eb";
            textColor = "#ffffff";
          } else if (isInserted) {
            fillColor = "#10b981"; // Emerald
            strokeColor = "#059669";
            textColor = "#ffffff";
          }

          return (
            <g key={node.id}>
              {/* Outer ring for highlight */}
              {(isComparing || isActive || isInserted) && (
                <motion.circle
                  cx={node.x}
                  cy={node.y}
                  r="24"
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              )}

              {/* Node Circle */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="18"
                fill={fillColor}
                stroke={strokeColor}
                strokeWidth="3"
                className="dark:fill-zinc-900 transition-colors duration-200"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />

              {/* Node Value */}
              <text
                x={node.x}
                y={node.y + 4}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                className="fill-current pointer-events-none font-mono"
                style={{ fill: (isComparing || isActive || isInserted) ? "#fff" : "currentColor" }}
              >
                {node.val}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-6 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-white border-2 border-indigo-500" />
          <span>সাধারণ নোড (Default Node)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-500 border border-amber-600" />
          <span>তুলনা চলছে (Comparing)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600" />
          <span>নতুন যুক্ত (Just Inserted)</span>
        </div>
      </div>
    </div>
  );
}
