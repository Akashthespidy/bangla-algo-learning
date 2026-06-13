"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle, CheckCircle, XCircle, Info, Sparkles } from "lucide-react";

interface Exercise {
  question: string;
  options: string[];
  answer: string;
  hint: string;
}

interface PracticeSectionProps {
  slug: string;
  exercises: Exercise[];
}

export function PracticeSection({ slug, exercises = [] }: PracticeSectionProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<{ [key: number]: boolean }>({});
  const [showHints, setShowHints] = useState<{ [key: number]: boolean }>({});
  const [savedProgress, setSavedProgress] = useState<{ [key: string]: boolean }>({});

  // Load progress from LocalStorage
  useEffect(() => {
    const progress = localStorage.getItem("practice-progress");
    if (progress) {
      try {
        setSavedProgress(JSON.parse(progress));
      } catch (e) {
        console.error("Failed to parse progress:", e);
      }
    }
  }, []);

  const handleSelectOption = (qIdx: number, option: string) => {
    if (submittedAnswers[qIdx]) return; // locked once submitted
    setSelectedAnswers({
      ...selectedAnswers,
      [qIdx]: option,
    });
  };

  const handleSubmit = (qIdx: number) => {
    const selected = selectedAnswers[qIdx];
    if (!selected) return;

    setSubmittedAnswers({
      ...submittedAnswers,
      [qIdx]: true,
    });

    const isCorrect = selected === exercises[qIdx].answer;
    
    // Save to LocalStorage if correct
    if (isCorrect) {
      const updated = {
        ...savedProgress,
        [`${slug}-${qIdx}`]: true,
      };
      setSavedProgress(updated);
      localStorage.setItem("practice-progress", JSON.stringify(updated));
    }
  };

  const handleReset = (qIdx: number) => {
    const updatedSubmitted = { ...submittedAnswers };
    delete updatedSubmitted[qIdx];
    setSubmittedAnswers(updatedSubmitted);

    const updatedSelected = { ...selectedAnswers };
    delete updatedSelected[qIdx];
    setSelectedAnswers(updatedSelected);

    const updatedProgress = { ...savedProgress };
    delete updatedProgress[`${slug}-${qIdx}`];
    setSavedProgress(updatedProgress);
    localStorage.setItem("practice-progress", JSON.stringify(updatedProgress));
  };

  const toggleHint = (qIdx: number) => {
    setShowHints({
      ...showHints,
      [qIdx]: !showHints[qIdx],
    });
  };

  if (!exercises || exercises.length === 0) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl p-6 text-center text-zinc-500 text-sm">
        এই অ্যালগরিদমের জন্য কোনো অনুশীলন যোগ করা হয়নি।
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {exercises.map((ex, qIdx) => {
        const selected = selectedAnswers[qIdx];
        const isSubmitted = submittedAnswers[qIdx];
        const isCorrect = selected === ex.answer;
        const showHint = showHints[qIdx];
        const isSavedSolved = savedProgress[`${slug}-${qIdx}`];

        return (
          <div
            key={qIdx}
            className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
              isSubmitted
                ? isCorrect
                  ? "bg-emerald-50/20 dark:bg-emerald-950/5 border-emerald-500/30"
                  : "bg-rose-50/20 dark:bg-rose-950/5 border-rose-500/30"
                : isSavedSolved
                ? "bg-emerald-50/10 dark:bg-emerald-950/5 border-emerald-500/20"
                : "bg-white dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/80"
            }`}
          >
            {/* Top solved banner decoration */}
            {(isSavedSolved || (isSubmitted && isCorrect)) && (
              <div className="absolute top-0 right-0 bg-emerald-500 text-white px-3 py-1 rounded-bl-xl text-[10px] font-bold tracking-wider flex items-center gap-1 shadow-sm">
                <Sparkles size={10} />
                <span>সমাধান সম্পন্ন</span>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
                {qIdx + 1}
              </div>
              <div className="flex-1">
                <h4 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-50 leading-relaxed pr-12">
                  {ex.question}
                </h4>

                {/* Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-4">
                  {ex.options.map((opt, oIdx) => {
                    const isSelected = selected === opt;
                    const isCorrectOption = opt === ex.answer;
                    
                    let buttonClass = "border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-950/15 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 text-zinc-700 dark:text-zinc-300";
                    
                    if (isSubmitted) {
                      if (isCorrectOption) {
                        buttonClass = "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold ring-2 ring-emerald-500/10";
                      } else if (isSelected) {
                        buttonClass = "border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-semibold ring-2 ring-rose-500/10";
                      } else {
                        buttonClass = "border-zinc-200 dark:border-zinc-800 opacity-60 text-zinc-400 dark:text-zinc-500";
                      }
                    } else if (isSelected) {
                      buttonClass = "border-indigo-600 bg-indigo-600/5 text-indigo-600 dark:text-indigo-400 font-semibold ring-2 ring-indigo-600/10";
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleSelectOption(qIdx, opt)}
                        disabled={isSubmitted}
                        className={`px-4 py-3 rounded-xl border text-left text-xs sm:text-sm transition-all cursor-pointer ${buttonClass}`}
                      >
                        <span className="font-mono mr-2 text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-200/50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                          {String.fromCharCode(65 + oIdx)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Bottom interactive action bar */}
                <div className="flex items-center justify-between gap-4 mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
                  <button
                    onClick={() => toggleHint(qIdx)}
                    className="text-xs text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 flex items-center gap-1.5 cursor-pointer font-medium"
                  >
                    <Info size={14} />
                    <span>{showHint ? "হিন্ট লুকান" : "হিন্ট দেখুন"}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    {isSubmitted && (
                      <button
                        onClick={() => handleReset(qIdx)}
                        className="px-3.5 h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer"
                      >
                        আবার চেষ্টা করুন
                      </button>
                    )}
                    
                    {!isSubmitted && (
                      <button
                        onClick={() => handleSubmit(qIdx)}
                        disabled={!selected}
                        className="px-4 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-950 text-xs font-semibold disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        সাবমিট করুন
                      </button>
                    )}
                  </div>
                </div>

                {/* Hint slide down box */}
                {showHint && (
                  <div className="mt-3 p-3 bg-indigo-50/30 dark:bg-indigo-950/10 border border-indigo-200/40 dark:border-indigo-800/40 rounded-xl text-xs sm:text-sm text-indigo-700 dark:text-indigo-400 leading-relaxed flex items-start gap-2 animate-fadeIn">
                    <HelpCircle size={16} className="shrink-0 mt-0.5" />
                    <p>{ex.hint}</p>
                  </div>
                )}

                {/* Result Message box */}
                {isSubmitted && (
                  <div className="mt-3 flex items-start gap-2.5 p-3 rounded-xl border text-xs sm:text-sm font-medium">
                    {isCorrect ? (
                      <>
                        <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                        <span className="text-emerald-700 dark:text-emerald-400 leading-relaxed">
                          চমৎকার! আপনার উত্তরটি সঠিক হয়েছে।
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="text-rose-500 shrink-0 mt-0.5" size={16} />
                        <div className="text-rose-700 dark:text-rose-400 leading-relaxed flex-1">
                          <span>দুঃখিত, উত্তরটি ভুল হয়েছে। আবার চেষ্টা করে দেখতে পারেন।</span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
