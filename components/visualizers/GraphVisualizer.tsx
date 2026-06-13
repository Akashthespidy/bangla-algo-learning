"use client";

import React from "react";
import { motion } from "framer-motion";

export interface GraphNode {
  id: string;
  label: string;
  status: "unvisited" | "visiting" | "visited" | "stack";
}

export interface GraphEdge {
  from: string;
  to: string;
  status: "unvisited" | "visiting" | "visited";
}

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  stack?: string[];
}

interface GraphVisualizerProps {
  state: GraphState;
}

// Fixed positions for the graph nodes so it renders predictably and beautifully
const NODE_POSITIONS: { [key: string]: { x: number; y: number } } = {
  A: { x: 250, y: 45 },
  B: { x: 130, y: 110 },
  C: { x: 370, y: 110 },
  D: { x: 180, y: 195 },
  E: { x: 320, y: 195 },
};

export function GraphVisualizer({ state }: GraphVisualizerProps) {
  if (!state || !state.nodes) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500">
        গ্রাফ (Graph) খালি রয়েছে
      </div>
    );
  }

  const width = 500;
  const height = 260;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative w-full max-w-lg">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl bg-white/50 dark:bg-zinc-950/20"
        >
          {/* Render edges */}
          {state.edges.map((edge, index) => {
            const p1 = NODE_POSITIONS[edge.from];
            const p2 = NODE_POSITIONS[edge.to];
            if (!p1 || !p2) return null;

            let strokeColor = "#e4e4e7"; // zinc-200
            let strokeWidth = 2;

            if (edge.status === "visited") {
              strokeColor = "#10b981"; // emerald-500
              strokeWidth = 3;
            } else if (edge.status === "visiting") {
              strokeColor = "#3b82f6"; // blue-500
              strokeWidth = 3.5;
            }

            return (
              <line
                key={`edge-${index}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                className="transition-colors duration-300"
              />
            );
          })}

          {/* Render nodes */}
          {state.nodes.map((node) => {
            const pos = NODE_POSITIONS[node.id];
            if (!pos) return null;

            const isVisiting = node.status === "visiting";
            const isVisited = node.status === "visited";
            const isStack = node.status === "stack";

            let fillColor = "#ffffff";
            let strokeColor = "#94a3b8"; // slate-400
            let textColor = "#0f172a";

            if (isVisiting) {
              fillColor = "#3b82f6";
              strokeColor = "#2563eb";
              textColor = "#ffffff";
            } else if (isVisited) {
              fillColor = "#10b981";
              strokeColor = "#059669";
              textColor = "#ffffff";
            } else if (isStack) {
              fillColor = "#f59e0b";
              strokeColor = "#d97706";
              textColor = "#ffffff";
            }

            return (
              <g key={`node-${node.id}`}>
                {/* Ping/glow effect for active nodes */}
                {(isVisiting || isStack) && (
                  <motion.circle
                    cx={pos.x}
                    cy={pos.y}
                    r="24"
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: [1, 1.25, 1], opacity: [0.6, 0.2, 0] }}
                    transition={{ repeat: Infinity, duration: 1.6 }}
                  />
                )}

                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r="18"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="3"
                  className="dark:fill-zinc-900 transition-colors duration-300"
                />

                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  className="fill-current pointer-events-none"
                  style={{ fill: (isVisiting || isVisited || isStack) ? "#fff" : "currentColor" }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Stack visualization */}
        {state.stack && state.stack.length > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-2 bg-white/90 dark:bg-zinc-900/90 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs shadow-sm">
            <span className="font-semibold text-zinc-400">STACK:</span>
            <div className="flex items-center gap-1 font-mono">
              {state.stack.map((item, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-white border-2 border-slate-400" />
          <span>Unvisited</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-amber-50 border border-amber-600" />
          <span>In Stack</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-blue-500 border border-blue-600" />
          <span>Visiting</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-600" />
          <span>Visited</span>
        </div>
      </div>
    </div>
  );
}
