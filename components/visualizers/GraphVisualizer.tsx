"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, CheckCircle2, CircleDot, AlertTriangle, Terminal, CornerDownLeft } from "lucide-react";

export interface GraphNode {
  id: string;
  label: string;
  roomBn?: string;
  status: "unvisited" | "visiting" | "visited" | "backtrack";
  x?: number;
  y?: number;
}

export interface GraphEdge {
  from: string;
  to: string;
  status: "unvisited" | "active" | "visited" | "skipped" | "backtrack";
}

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  activeVertex?: string;
  activeChild?: string;
  callStack?: Array<{
    vertex: string;
    par?: string;
    status: "active" | "waiting";
  }>;
  vis?: { [key: string]: boolean };
  akkasAction?: {
    type: "enter" | "explore" | "skip" | "backtrack" | "finish";
    message: string;
    badge: string;
  };
  logs?: string[];
  stack?: string[]; // fallback
}

interface GraphVisualizerProps {
  state: GraphState;
}

// Fallback positions if not specified in node
const FALLBACK_POSITIONS: { [key: string]: { x: number; y: number } } = {
  "1": { x: 100, y: 75 },
  "2": { x: 300, y: 75 },
  "4": { x: 500, y: 75 },
  "3": { x: 100, y: 225 },
  "6": { x: 300, y: 225 },
  "5": { x: 500, y: 225 },
  A: { x: 250, y: 45 },
  B: { x: 130, y: 110 },
  C: { x: 370, y: 110 },
  D: { x: 180, y: 195 },
  E: { x: 320, y: 195 },
};

export function GraphVisualizer({ state }: GraphVisualizerProps) {
  if (!state || !state.nodes || state.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500 font-mono text-sm">
        গ্রাফের তথ্য লোড হচ্ছে...
      </div>
    );
  }

  const width = 600;
  const height = 300;

  // Active vertex position for Akkas Bhai
  const activeNode = state.nodes.find((n) => n.id === state.activeVertex) || state.nodes[0];
  const akkasPos = {
    x: activeNode?.x ?? FALLBACK_POSITIONS[activeNode?.id]?.x ?? 300,
    y: activeNode?.y ?? FALLBACK_POSITIONS[activeNode?.id]?.y ?? 150,
  };

  const action = state.akkasAction;

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 1. Akkas Bhai Live Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-emerald-500/10 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl px-4 py-2.5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg shadow-inner">
            🏃‍♂️
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-zinc-600 dark:text-zinc-400 tracking-wider">
              আক্কাস ভাইয়ের অবস্থান
            </div>
            <div className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <span>{activeNode?.roomBn || `ঘর ${activeNode?.label}`}</span>
              <span className="text-[11px] font-mono text-indigo-700 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                vertex: {activeNode?.label}
              </span>
            </div>
          </div>
        </div>

        {/* Live Action Pill */}
        {action && (
          <motion.div
            key={action.badge + action.message}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border shadow-sm ${
              action.type === "skip"
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30"
                : action.type === "backtrack"
                ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                : action.type === "finish"
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40"
                : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30"
            }`}
          >
            <span>{action.badge}</span>
          </motion.div>
        )}
      </div>

      {/* 2. Interactive SVG Graph Canvas */}
      <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-[#070c16] shadow-sm">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          style={{ maxHeight: "360px" }}
        >
          <defs>
            {/* Glow filter for active elements */}
            <filter id="glow-blue" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-green" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Edges (Tunnels) */}
          {state.edges.map((edge, index) => {
            const nodeFrom = state.nodes.find((n) => n.id === edge.from);
            const nodeTo = state.nodes.find((n) => n.id === edge.to);

            const p1 = {
              x: nodeFrom?.x ?? FALLBACK_POSITIONS[edge.from]?.x ?? 0,
              y: nodeFrom?.y ?? FALLBACK_POSITIONS[edge.from]?.y ?? 0,
            };
            const p2 = {
              x: nodeTo?.x ?? FALLBACK_POSITIONS[edge.to]?.x ?? 0,
              y: nodeTo?.y ?? FALLBACK_POSITIONS[edge.to]?.y ?? 0,
            };

            let strokeColor = "#d4d4d8"; // light gray
            let strokeWidth = 2.5;
            let strokeDasharray = "none";
            let filter = "";

            if (edge.status === "visited") {
              strokeColor = "#10b981"; // emerald-500
              strokeWidth = 3.5;
            } else if (edge.status === "active") {
              strokeColor = "#3b82f6"; // blue-500
              strokeWidth = 4.5;
              filter = "url(#glow-blue)";
            } else if (edge.status === "skipped") {
              strokeColor = "#f43f5e"; // rose-500
              strokeWidth = 3;
              strokeDasharray = "5,4";
            } else if (edge.status === "backtrack") {
              strokeColor = "#f59e0b"; // amber-500
              strokeWidth = 3.5;
              strokeDasharray = "6,4";
            }

            return (
              <g key={`edge-${edge.from}-${edge.to}-${index}`}>
                <line
                  x1={p1.x}
                  y1={p1.y}
                  x2={p2.x}
                  y2={p2.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  filter={filter}
                  className="transition-all duration-300"
                />

                {/* Animated traveling indicator for active edge */}
                {edge.status === "active" && (
                  <motion.circle
                    r="4"
                    fill="#38bdf8"
                    initial={{ cx: p1.x, cy: p1.y }}
                    animate={{ cx: [p1.x, p2.x], cy: [p1.y, p2.y] }}
                    transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                  />
                )}
              </g>
            );
          })}

          {/* Render Nodes (Rooms) */}
          {state.nodes.map((node) => {
            const pos = {
              x: node.x ?? FALLBACK_POSITIONS[node.id]?.x ?? 300,
              y: node.y ?? FALLBACK_POSITIONS[node.id]?.y ?? 150,
            };

            const isCurrent = state.activeVertex === node.id;
            const isVisiting = node.status === "visiting";
            const isVisited = node.status === "visited";

            let fillColor = "#ffffff";
            let strokeColor = "#94a3b8"; // slate-400
            let textColor = "#0f172a";

            if (isCurrent || isVisiting) {
              fillColor = "#3b82f6";
              strokeColor = "#2563eb";
              textColor = "#ffffff";
            } else if (isVisited) {
              fillColor = "#10b981";
              strokeColor = "#059669";
              textColor = "#ffffff";
            }

            return (
              <g key={`node-${node.id}`} className="cursor-default">
                {/* Active ripple wave */}
                {isCurrent && (
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r="32"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: [1, 1.4, 1.6], opacity: [0.8, 0.3, 0] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
                  />
                )}

                {/* Node Outer Ring */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="24"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="3.5"
                  className="transition-colors duration-300 drop-shadow-sm"
                  filter={isVisited ? "url(#glow-green)" : ""}
                />

                {/* Node Number Label */}
                <text
                  x={pos.x}
                  y={pos.y + 5}
                  textAnchor="middle"
                  fontSize="15"
                  fontWeight="bold"
                  fill={textColor}
                  className="font-mono pointer-events-none"
                >
                  {node.label}
                </text>

                {/* Room sub-label under node */}
                <text
                  x={pos.x}
                  y={pos.y + 38}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  className="fill-zinc-600 dark:fill-zinc-400 pointer-events-none font-sans"
                >
                  {node.roomBn || `ঘর ${node.label}`}
                </text>
              </g>
            );
          })}

          {/* Animated Akkas Bhai Avatar (Glides to the active node) */}
          <motion.g
            animate={{ x: akkasPos.x, y: akkasPos.y }}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            {/* Speech bubble above Akkas Bhai */}
            <g transform="translate(0, -36)">
              <rect
                x="-40"
                y="-18"
                width="80"
                height="20"
                rx="6"
                fill="#1e1b4b"
                stroke="#6366f1"
                strokeWidth="1.5"
              />
              <polygon
                points="-4,2 4,2 0,6"
                fill="#1e1b4b"
                stroke="#6366f1"
                strokeWidth="1.5"
              />
              <text
                x="0"
                y="-4"
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="#e0e7ff"
                className="font-sans"
              >
                আক্কাস ভাই 🏃‍♂️
              </text>
            </g>
          </motion.g>
        </svg>

        {/* Legend */}
        <div className="flex items-center gap-3.5 p-3 border-t border-zinc-150 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/50 text-[11px] text-zinc-600 dark:text-zinc-400 flex-wrap justify-center font-medium">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-white border-2 border-slate-400 dark:bg-zinc-800" />
            <span>অস্পর্শিত ঘর (Unvisited)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-blue-500 border border-blue-600 shadow-sm" />
            <span>বর্তমান ঘর (Active Vertex)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600 shadow-sm" />
            <span>ঘোরা শেষ (Visited)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-1 border-t-2 border-dashed border-rose-500" />
            <span>ইউ-টার্ন / চক্র (Visited Edge)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-1 border-t-2 border-dashed border-amber-500" />
            <span>ব্যাকট্র্যাক (Backtrack)</span>
          </div>
        </div>
      </div>

      {/* 3. Dual Panels: Recursion Call Stack & Visited Array */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left: Call Stack Panel */}
        <div className="md:col-span-6 bg-white dark:bg-[#0c121e] border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-2 mb-3">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Layers size={14} className="text-indigo-500" />
                রিকার্শন কল স্ট্যাক (Recursion Call Stack)
              </h4>
              <span className="text-[10px] text-zinc-400 font-mono">
                {state.callStack ? `${state.callStack.length} টি ফ্রেম` : "LIFO"}
              </span>
            </div>

            <div className="space-y-1.5 min-h-[110px] flex flex-col-reverse justify-start">
              {state.callStack && state.callStack.length > 0 ? (
                state.callStack.map((frame, idx) => {
                  const isTop = idx === state.callStack!.length - 1;
                  return (
                    <motion.div
                      key={`frame-${frame.vertex}-${idx}`}
                      initial={{ scale: 0.95, opacity: 0, y: 5 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      className={`px-3 py-1.5 rounded-xl border flex items-center justify-between text-xs font-mono transition-colors ${
                        isTop
                          ? "bg-indigo-600 text-white border-indigo-700 shadow-md font-bold"
                          : "bg-zinc-50 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-800"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${
                            isTop ? "bg-white text-indigo-600" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span>dfs({frame.vertex})</span>
                      </div>
                      <span className={`text-[10px] ${isTop ? "text-indigo-100" : "text-zinc-400"}`}>
                        {frame.par ? `par: ${frame.par}` : "root"} {isTop && "← TOP"}
                      </span>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-xs text-zinc-400 font-mono py-8 text-center">
                  স্ট্যাক খালি (Stack Empty)
                </div>
              )}
            </div>
          </div>

          <div className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-2 font-mono flex items-center gap-1 border-t border-zinc-100 dark:border-zinc-800/60 pt-2">
            <CornerDownLeft size={11} className="text-indigo-500" />
            ব্যাকট্র্যাক করলে উপরের ফ্রেম Pop হয় এবং আগের ঘরে ফেরে।
          </div>
        </div>

        {/* Right: Visited Array Table */}
        <div className="md:col-span-6 bg-white dark:bg-[#0c121e] border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-150 dark:border-zinc-800 pb-2 mb-3">
              <h4 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500" />
                দেয়াল লিখন: vis[] অ্যারে ট্র্যাকার
              </h4>
              <span className="text-[10px] text-zinc-400 font-mono">vis[N]</span>
            </div>

            {/* Visited Array Cells */}
            <div className="grid grid-cols-6 gap-2">
              {state.nodes.map((node) => {
                const isVisited = state.vis ? state.vis[node.id] : node.status === "visited";
                const isCurrent = state.activeVertex === node.id;

                return (
                  <div
                    key={`vis-${node.id}`}
                    className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all duration-300 ${
                      isVisited
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                        : "bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800 text-zinc-400"
                    } ${isCurrent ? "ring-2 ring-indigo-500/50" : ""}`}
                  >
                    <span className="text-[10px] font-mono font-bold text-zinc-500 dark:text-zinc-400">
                      [{node.id}]
                    </span>
                    <span className="text-[11px] font-mono font-bold mt-0.5">
                      {isVisited ? "true" : "false"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Console Output Log */}
          <div className="mt-3 bg-zinc-950 dark:bg-zinc-950/90 rounded-xl p-2.5 border border-zinc-800/80 font-mono text-[11px] text-emerald-400 max-h-[72px] overflow-y-auto">
            <div className="flex items-center gap-1.5 text-zinc-500 text-[10px] mb-1 font-sans border-b border-zinc-800 pb-1">
              <Terminal size={12} className="text-zinc-400" />
              <span>কনসোল আউটপুট (cout / console.log)</span>
            </div>
            {state.logs && state.logs.length > 0 ? (
              <div className="space-y-0.5">
                {state.logs.map((log, lIdx) => (
                  <div key={lIdx} className="leading-tight">
                    <span className="text-zinc-600 select-none">&gt; </span>
                    {log}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-zinc-600 italic text-[10px]">
                এখনো কোনো কল হয়নি...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
