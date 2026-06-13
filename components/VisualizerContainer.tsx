"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Sliders, PlayCircle, HelpCircle } from "lucide-react";
import { ArrayVisualizer } from "./visualizers/ArrayVisualizer";
import { GridVisualizer } from "./visualizers/GridVisualizer";
import { TreeVisualizer } from "./visualizers/TreeVisualizer";
import { GraphVisualizer } from "./visualizers/GraphVisualizer";

interface VisualizerContainerProps {
  slug: string;
  visualizerType: "array" | "grid" | "tree" | "graph";
  category: string;
  defaultInput: string;
}

export function VisualizerContainer({
  slug,
  visualizerType,
  category,
  defaultInput,
}: VisualizerContainerProps) {
  const [generateStepsFn, setGenerateStepsFn] = useState<any>(null);
  const [inputText, setInputText] = useState(defaultInput);
  const [targetVal, setTargetVal] = useState("5"); // default for search algorithms
  
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800); // ms
  const [error, setError] = useState("");

  const isSearching = category.toLowerCase().includes("search");
  const isDP = visualizerType === "grid";

  // Parse input depending on the type
  const parseInput = (text: string, searchTarget?: string) => {
    if (isDP) {
      const val = parseInt(text.trim(), 10);
      if (isNaN(val) || val < 1 || val > 12) {
        throw new Error("অনুগ্রহ করে ১ থেকে ১২ এর মধ্যে একটি সংখ্যা দিন।");
      }
      return val;
    }

    // Graph/Tree check - usually they have fixed custom inputs or general graph parsing,
    // but we can offer a simplified flow where we work with comma separated lists or just use defaults.
    const arr = text
      .split(",")
      .map((x) => parseInt(x.trim(), 10))
      .filter((x) => !isNaN(x));

    if (arr.length === 0) {
      throw new Error("অনুগ্রহ করে কমা দিয়ে আলাদা করা সংখ্যা দিন। যেমন: ৫, ২, ৯");
    }

    if (isSearching) {
      const target = parseInt(searchTarget || targetVal, 10);
      if (isNaN(target)) {
        throw new Error("অনুগ্রহ করে একটি সঠিক লক্ষ্য সংখ্যা দিন।");
      }
      // Return both sorted array and target for search
      const sortedArr = [...arr].sort((a, b) => a - b);
      return { array: sortedArr, target };
    }

    return arr;
  };

  // Load the visualizer steps generator dynamically
  useEffect(() => {
    import(`../content/algorithms/${slug}/visualizer`)
      .then((mod) => {
        setGenerateStepsFn(() => mod.generateSteps);
        setError("");
        try {
          const parsed = parseInput(defaultInput, "5");
          const generatedSteps = mod.generateSteps(parsed);
          setSteps(generatedSteps);
          setCurrentStepIndex(0);
          setIsPlaying(false);
        } catch (e: any) {
          setError(e.message);
        }
      })
      .catch((err) => {
        console.error(`Failed to load visualizer for ${slug}:`, err);
        setError("ভিজ্যুয়ালাইজার লোд করতে ব্যর্থ হয়েছে।");
      });
  }, [slug, defaultInput]);

  // Interval playback control
  useEffect(() => {
    let timer: any = null;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < steps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, speed);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPlaying, steps.length, speed]);

  // Form submit handler to update state arrays
  const handleRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generateStepsFn) return;
    setError("");

    try {
      const parsed = parseInput(inputText, targetVal);
      const generatedSteps = generateStepsFn(parsed);
      setSteps(generatedSteps);
      setCurrentStepIndex(0);
      setIsPlaying(false);
    } catch (err: any) {
      setError(err.message || "ভুল ইনপুট দেওয়া হয়েছে।");
    }
  };

  // Controls actions
  const handlePlayPause = () => setIsPlaying(!isPlaying);
  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };
  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const currentStep = steps[currentStepIndex] || null;

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Visualization Screen Box */}
      <div className="relative w-full border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/20 rounded-2xl overflow-hidden min-h-[340px] flex flex-col justify-between p-4 sm:p-6 shadow-inner">
        {/* Step description */}
        <div className="min-h-[50px] bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/60 rounded-xl px-4 py-3 text-sm text-zinc-800 dark:text-zinc-200 font-medium shadow-sm transition-all duration-300">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wider text-indigo-500 font-semibold font-mono">
              ধাপ {currentStepIndex + 1} / {steps.length || 1}
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500">
              {currentStep ? currentStep.action || "অপারেশন" : ""}
            </span>
          </div>
          <p className="leading-relaxed">
            {currentStep?.description || "অ্যালগরিদম শুরু করতে প্লে বাটনে ক্লিক করুন।"}
          </p>
        </div>

        {/* Dynamic visualizer renderer */}
        <div className="flex-1 flex items-center justify-center py-4 w-full">
          {currentStep && (
            <>
              {visualizerType === "array" && (
                <ArrayVisualizer
                  state={currentStep.state}
                  active={currentStep.active || []}
                  comparing={currentStep.comparing || []}
                  swapping={currentStep.swapping || []}
                  sorted={currentStep.sorted || []}
                  category={category}
                  markers={currentStep.markers || {}}
                />
              )}
              {visualizerType === "grid" && (
                <GridVisualizer
                  state={currentStep.state}
                  active={currentStep.active || []}
                  comparing={currentStep.comparing || []}
                  sorted={currentStep.sorted || []}
                  label="dp"
                />
              )}
              {visualizerType === "tree" && (
                <TreeVisualizer
                  state={currentStep.state}
                />
              )}
              {visualizerType === "graph" && (
                <GraphVisualizer
                  state={currentStep.state}
                />
              )}
            </>
          )}
          {!currentStep && (
            <div className="text-zinc-400 text-sm flex flex-col items-center gap-2">
              <PlayCircle size={40} className="text-indigo-500 animate-pulse" />
              <span>শুরু করতে প্লে করুন</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Playback Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-white dark:bg-zinc-900/40 p-4 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm">
        {/* Execution buttons */}
        <div className="flex items-center justify-center md:justify-start gap-2.5">
          <button
            onClick={handleReset}
            disabled={steps.length === 0}
            className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 disabled:opacity-50 transition-all cursor-pointer"
            title="পুনরায় শুরু করুন (Reset)"
          >
            <RotateCcw size={18} />
          </button>
          <button
            onClick={handlePrev}
            disabled={steps.length === 0 || currentStepIndex === 0}
            className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 disabled:opacity-50 transition-all cursor-pointer"
            title="পূর্ববর্তী ধাপ (Prev Step)"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handlePlayPause}
            disabled={steps.length === 0}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-200 hover:scale-105 cursor-pointer ${
              isPlaying
                ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20"
            }`}
            title={isPlaying ? "থামুন (Pause)" : "চালু করুন (Play)"}
          >
            {isPlaying ? <Pause size={20} className="fill-white" /> : <Play size={20} className="fill-white ml-0.5" />}
          </button>
          <button
            onClick={handleNext}
            disabled={steps.length === 0 || currentStepIndex === steps.length - 1}
            className="w-10 h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 disabled:opacity-50 transition-all cursor-pointer"
            title="পরবর্তী ধাপ (Next Step)"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Speed Slider controls */}
        <div className="flex items-center gap-3 justify-center md:justify-end">
          <Sliders size={16} className="text-zinc-400" />
          <span className="text-xs text-zinc-500 font-mono w-14">
            {(speed / 1000).toFixed(1)}s
          </span>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-32 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
            title="গতি পরিবর্তন করুন (Speed)"
          />
        </div>
      </div>

      {/* 3. Input & Timeline Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Custom Input Block */}
        <div className="lg:col-span-5 bg-white dark:bg-zinc-900/40 p-5 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-1.5">
            নিজে ইনপুট দিন (Customize Input)
          </h3>
          <form onSubmit={handleRun} className="flex flex-col gap-3">
            <div>
              <label className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 block mb-1">
                {isDP ? "ধনাত্মক সংখ্যা (N)" : isSearching ? "কমা দিয়ে আলাদা করা সংখ্যা তালিকা" : "এলোমেলো সংখ্যা তালিকা (Comma-separated)"}
              </label>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                placeholder={isDP ? "যেমন: ৬" : "যেমন: ৮, ২, ৫, ১, ৪"}
              />
            </div>

            {isSearching && (
              <div>
                <label className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 block mb-1">
                  খোঁজার মান (Target Value)
                </label>
                <input
                  type="number"
                  value={targetVal}
                  onChange={(e) => setTargetVal(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                  placeholder="যেমন: ৫"
                />
              </div>
            )}

            {error && (
              <p className="text-xs text-rose-500 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full h-10 mt-1 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-semibold tracking-wider transition-colors cursor-pointer"
            >
              রান করুন (Run Algorithm)
            </button>
          </form>
        </div>

        {/* Step Timeline Block */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900/40 p-5 border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl shadow-sm flex flex-col max-h-[250px]">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3 flex items-center gap-1.5 shrink-0">
            ধাপের তালিকা (Step Timeline)
          </h3>
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {steps.map((st, sIdx) => {
              const isCurrent = sIdx === currentStepIndex;
              return (
                <button
                  key={sIdx}
                  onClick={() => {
                    setIsPlaying(false);
                    setCurrentStepIndex(sIdx);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-xs transition-all border font-sans cursor-pointer ${
                    isCurrent
                      ? "bg-indigo-600/5 dark:bg-indigo-500/10 border-indigo-500/50 text-indigo-700 dark:text-indigo-400 font-medium"
                      : "bg-transparent border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] shrink-0 font-bold ${
                      isCurrent ? "bg-indigo-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500"
                    }`}
                  >
                    {sIdx + 1}
                  </span>
                  <span className="truncate flex-1">
                    {st.action || `ধাপ ${sIdx + 1}`} - {st.description.replace(/^Compare\s.*?:\s/i, "")}
                  </span>
                </button>
              );
            })}
            {steps.length === 0 && (
              <div className="text-zinc-400 text-xs text-center py-8">
                ধাপ লোড হচ্ছে...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
