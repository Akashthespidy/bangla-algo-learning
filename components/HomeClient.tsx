"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Search, ArrowRight, Bookmark, Clock, Code, Award, Layers, Sparkles } from "lucide-react";
import { AlgorithmMetadata } from "@/lib/algorithms";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useAtom } from "jotai";
import { bookmarksAtom, recentlyViewedAtom } from "@/lib/store";

interface HomeClientProps {
  initialAlgorithms: AlgorithmMetadata[];
}

export default function HomeClient({ initialAlgorithms }: HomeClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [bookmarks] = useAtom(bookmarksAtom);
  const [recentlyViewed] = useAtom(recentlyViewedAtom);
  const [mounted, setMounted] = useState(false);

  const searchParams = useSearchParams();
  const urlSearch = searchParams ? searchParams.get("search") || "" : "";

  // Sync url search param with search input state
  useEffect(() => {
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = [
    { id: "all", name: "সব বিষয়", count: initialAlgorithms.length },
    { id: "Sorting", name: "সর্টিং (Sorting)", count: initialAlgorithms.filter(a => a.category === "Sorting").length },
    { id: "Searching", name: "সার্চিং (Searching)", count: initialAlgorithms.filter(a => a.category === "Searching").length },
    { id: "Dynamic Programming", name: "ডাইনামিক প্রোগ্রামিং (DP)", count: initialAlgorithms.filter(a => a.category === "Dynamic Programming").length },
    { id: "Graph", name: "গ্রাফ (Graph)", count: initialAlgorithms.filter(a => a.category === "Graph").length },
    { id: "Tree", name: "ট্রি (Tree)", count: initialAlgorithms.filter(a => a.category === "Tree").length },
  ];

  // Filter algorithms by category and search query
  const filteredAlgorithms = initialAlgorithms.filter((algo) => {
    const matchesCategory = selectedCategory === "all" || algo.category === selectedCategory;
    const matchesSearch =
      algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-gradient-to-b from-indigo-50/20 via-transparent to-transparent dark:from-indigo-950/10">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/10 dark:[mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.05))]" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-6 border border-indigo-500/20">
              <Sparkles size={12} />
              সহজ বাংলায় কম্পিউটার অ্যালগরিদম শিক্ষা
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-950 dark:text-white mb-6 leading-[1.15]">
              অ্যালগরিদম শিখুন <br />
              <span className="bg-gradient-to-r from-indigo-600 via-violet-500 to-purple-500 bg-clip-text text-transparent">
                সহজে এবং ভিজ্যুয়ালি
              </span>
            </h1>
            <p className="text-base sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
              সহজ বাংলায় লিখা বিস্তারিত ব্যাখ্যা, ও জীবন্ত অ্যানিমেশনের মাধ্যমে ডাটা স্ট্রাকচার এবং অ্যালগরিদমের কনসেপ্টগুলো সহজে আত্মস্থ করুন।
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="#explore-section"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/20 hover:bg-indigo-750 hover:shadow-indigo-600/30 transition-all gap-2"
              >
                শুরু করুন
                <ArrowRight size={16} />
              </a>
              {mounted && recentlyViewed.length > 0 && (
                <Link
                  href={`/algorithms/${recentlyViewed[0]}`}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 font-semibold transition-all"
                >
                  সর্বশেষ পঠিত
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <main id="explore-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-3 font-mono">
                  ক্যাটাগরি
                </h3>
                <div className="flex flex-row md:flex-col flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left cursor-pointer ${
                        selectedCategory === cat.id
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                          : "bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900/80 hover:text-zinc-900 dark:hover:text-zinc-200"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          selectedCategory === cat.id
                            ? "bg-indigo-700/50 text-indigo-100"
                            : "bg-zinc-200/50 dark:bg-zinc-800/85 text-zinc-500 dark:text-zinc-400"
                        }`}
                      >
                        {cat.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Algorithm Grid */}
          <section className="flex-1">
            <div className="flex items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-zinc-950 dark:text-white">
                  {categories.find((c) => c.id === selectedCategory)?.name || "সব বিষয়"}
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  মোট {filteredAlgorithms.length} টি অ্যালগরিদম খুঁজে পাওয়া গেছে
                </p>
              </div>

              {/* Quick Search */}
              <div className="relative w-48 sm:w-64">
                <input
                  type="text"
                  placeholder="এখানে ফিল্টার করুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-9 pl-8 pr-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-zinc-800 dark:text-zinc-200"
                />
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400" />
              </div>
            </div>

            {filteredAlgorithms.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredAlgorithms.map((algo) => (
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
              <div className="py-24 text-center border border-dashed border-zinc-200 dark:border-zinc-850 rounded-2xl">
                <p className="text-zinc-500">কোনো ফলাফল পাওয়া যায়নি। ভিন্ন কিছু সার্চ করে দেখুন!</p>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="mt-auto py-6 border-t border-zinc-200/50 dark:border-zinc-800/50 bg-white dark:bg-[#070a11] text-center text-xs text-zinc-500 dark:text-zinc-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© {new Date().getFullYear()} এসো অ্যালগরিদম শিখি। অল রাইটস রিজার্ভড।</p>
        </div>
      </footer>
    </div>
  );
}
