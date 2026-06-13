"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Bookmark, Share2, Award, Clock, Cpu, HelpCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { VisualizerContainer } from "@/components/VisualizerContainer";
import { CodeSection } from "@/components/CodeSection";
import { PracticeSection } from "@/components/PracticeSection";
import { Markdown } from "@/lib/markdown";
import { AlgorithmDetails } from "@/lib/algorithms";

interface AlgorithmPageClientProps {
  algorithm: AlgorithmDetails;
}

export default function AlgorithmPageClient({ algorithm }: AlgorithmPageClientProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    // Save to recently viewed
    try {
      const recent = localStorage.getItem("recentlyViewed") 
        ? JSON.parse(localStorage.getItem("recentlyViewed")!) 
        : [];
      const newRecent = [algorithm.slug, ...recent.filter((s: string) => s !== algorithm.slug)].slice(0, 6);
      localStorage.setItem("recentlyViewed", JSON.stringify(newRecent));
    } catch (e) {
      console.error(e);
    }

    // Check if bookmarked
    try {
      const bookmarks = localStorage.getItem("bookmarks") 
        ? JSON.parse(localStorage.getItem("bookmarks")!) 
        : [];
      setIsBookmarked(bookmarks.includes(algorithm.slug));
    } catch (e) {
      console.error(e);
    }
  }, [algorithm.slug]);

  const toggleBookmark = () => {
    try {
      const bookmarks = localStorage.getItem("bookmarks") 
        ? JSON.parse(localStorage.getItem("bookmarks")!) 
        : [];
      let updated;
      if (bookmarks.includes(algorithm.slug)) {
        updated = bookmarks.filter((s: string) => s !== algorithm.slug);
        setIsBookmarked(false);
      } else {
        updated = [...bookmarks, algorithm.slug];
        setIsBookmarked(true);
      }
      localStorage.setItem("bookmarks", JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  // Determine difficulty styling
  const getDiffBadge = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "medium":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "hard":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-zinc-500/10 text-zinc-600 border-zinc-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-[#080c14] dark:text-zinc-100 flex flex-col transition-colors duration-300">
      <Navbar />

      {/* Main Header / Breadcrumb area */}
      <section className="bg-white dark:bg-[#0c121e] border-b border-zinc-200/60 dark:border-zinc-800/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 mb-4 transition-colors"
          >
            <ArrowLeft size={14} />
            মূল পাতায় ফিরুন
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-md">
                  {algorithm.categoryBn}
                </span>
                <span className={`text-xs font-medium border px-2 py-0.5 rounded-md ${getDiffBadge(algorithm.difficulty)}`}>
                  {algorithm.difficultyBn}
                </span>
              </div>
              <h2 className="text-3xl font-black text-zinc-950 dark:text-white flex items-baseline gap-2">
                {algorithm.nameBn}
                <span className="text-sm font-normal text-zinc-400 font-mono">({algorithm.name})</span>
              </h2>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleBookmark}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border rounded-xl transition-all cursor-pointer ${
                  isBookmarked
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300"
                }`}
              >
                <Bookmark size={14} className={isBookmarked ? "fill-current text-white" : ""} />
                <span>{isBookmarked ? "বুকমার্কড" : "বুকমার্ক করুন"}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-zinc-200 dark:border-zinc-850 bg-white dark:bg-zinc-900 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer"
              >
                <Share2 size={14} />
                <span>{copiedShare ? "লিংক কপি হয়েছে!" : "শেয়ার"}</span>
              </button>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-4">
            {algorithm.tags.map((tag, i) => (
              <span
                key={i}
                className="text-[10px] sm:text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-0.5 rounded-md font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Main Grid Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Visualizer & Text Explanation */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white dark:bg-[#0c121e] border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-5 sm:p-6 shadow-sm">
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
                ইন্টারেক্টিভ সিমুলেশন (Simulation)
              </h3>
              <VisualizerContainer
                slug={algorithm.slug}
                visualizerType={algorithm.visualizerType}
                category={algorithm.category}
                defaultInput={
                  algorithm.visualizerType === "grid"
                    ? "6"
                    : "8, 3, 1, 9, 6, 2"
                }
              />
            </section>

            {/* Explanation Section */}
            <section className="bg-white dark:bg-[#0c121e] border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
                বাংলায় আলোচনা (Explanation)
              </h3>
              <div className="prose dark:prose-invert max-w-none">
                <Markdown content={algorithm.explanation} />
              </div>
            </section>
          </div>

          {/* Right Column: Complexity, Code, Practice */}
          <div className="lg:col-span-5 space-y-8">
            {/* Complexity Cards */}
            <section className="bg-white dark:bg-[#0c121e] border border-zinc-200/80 dark:border-zinc-800/80 rounded-3xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-4 flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-2">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
                জটিলতা বিশ্লেষণ (Complexity)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-850 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 font-mono">Time (Avg)</span>
                    <p className="text-lg font-mono font-bold text-zinc-900 dark:text-white">{algorithm.timeComplexity.average}</p>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-150 dark:border-zinc-850 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                    <Cpu size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-zinc-400 font-mono">Space (Worst)</span>
                    <p className="text-lg font-mono font-bold text-zinc-900 dark:text-white">{algorithm.spaceComplexity}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Complexity Breakdown */}
              <div className="mt-4 space-y-2.5 text-xs sm:text-sm">
                <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-400 font-mono">
                  <span>Best Case Time</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{algorithm.timeComplexity.best}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-100 dark:border-zinc-800/60 text-zinc-600 dark:text-zinc-400 font-mono">
                  <span>Worst Case Time</span>
                  <span className="font-bold text-zinc-900 dark:text-white">{algorithm.timeComplexity.worst}</span>
                </div>
              </div>
            </section>

            {/* Code Implementations */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center gap-2 border-b border-zinc-150 dark:border-zinc-800 pb-2">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
                কোড ইমপ্লিমেন্টেশন
              </h3>
              <CodeSection code={algorithm.code} />
            </section>

            {/* Practice Exercises */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center gap-2 border-b border-zinc-150 dark:border-zinc-800 pb-2">
                <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
                অনুশীলন ও কুইজ
              </h3>
              <PracticeSection slug={algorithm.slug} exercises={algorithm.practiceExercises} />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
