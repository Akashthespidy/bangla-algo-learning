"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { AlgorithmMetadata } from "@/lib/algorithms";

interface BookmarksClientProps {
  allAlgorithms: AlgorithmMetadata[];
}

export default function BookmarksClient({ allAlgorithms }: BookmarksClientProps) {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bookmarks");
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const bookmarkedAlgos = allAlgorithms.filter((algo) => bookmarks.includes(algo.slug));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
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

      <section className="bg-white dark:bg-[#0c121e] border-b border-zinc-200/60 dark:border-zinc-800/60 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-indigo-600 dark:text-zinc-400 dark:hover:text-indigo-400 mb-4 transition-colors"
          >
            <ArrowLeft size={14} />
            মূল পাতায় ফিরুন
          </Link>
          <h2 className="text-3xl font-black text-zinc-950 dark:text-white flex items-center gap-2">
            <Bookmark size={26} className="text-indigo-600 dark:text-indigo-400 fill-current" />
            বুকমার্ক করা তালিকা
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            আপনার পরবর্তীতে পড়ার জন্য সংরক্ষণ করে রাখা অ্যালগরিদম সমূহ
          </p>
        </div>
      </section>

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        {bookmarkedAlgos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {bookmarkedAlgos.map((algo) => (
              <Link
                href={`/algorithms/${algo.slug}`}
                key={algo.slug}
                className="group flex flex-col justify-between p-5 bg-white dark:bg-[#0c121e] border border-zinc-200/80 dark:border-zinc-800/80 rounded-2xl hover:shadow-lg hover:border-zinc-300 dark:hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-lg">
                      {algo.categoryBn}
                    </span>
                    <span
                      className={`text-[11px] font-medium border px-2 py-0.5 rounded-md ${getDifficultyColor(
                        algo.difficulty
                      )}`}
                    >
                      {algo.difficultyBn}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {algo.nameBn} <span className="text-xs text-zinc-400 font-normal">({algo.name})</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                    {algo.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/40 flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-3">
                    <span className="font-mono">Time: {algo.timeComplexity.average}</span>
                    <span className="font-mono">Space: {algo.spaceComplexity}</span>
                  </div>
                  <div className="flex items-center gap-1 text-indigo-500 font-semibold group-hover:translate-x-0.5 transition-transform">
                    <span>শিখুন</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-zinc-200 dark:border-zinc-805 rounded-2xl">
            <p className="text-zinc-500 dark:text-zinc-400 mb-4">আপনার বুকমার্ক তালিকায় কোনো অ্যালগরিদম নেই।</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-750 transition-all text-xs sm:text-sm"
            >
              অ্যালগরিদম সমূহ দেখতে যান
            </Link>
          </div>
        )}
      </main>

      <footer className="py-6 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-[#070a11] text-center text-xs text-zinc-500 dark:text-zinc-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} এসো অ্যালগরিদম শিখি। অল রাইটস রিজার্ভড।</p>
        </div>
      </footer>
    </div>
  );
}
