"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon, Bookmark, Search, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavbarProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
}

export function Navbar({ searchQuery: externalSearchQuery, onSearchChange }: NavbarProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const router = useRouter();

  const isControlled = externalSearchQuery !== undefined && onSearchChange !== undefined;
  const searchQuery = isControlled ? externalSearchQuery : localSearchQuery;
  const setSearchQuery = isControlled ? onSearchChange : setLocalSearchQuery;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      localStorage.setItem("theme", "light");
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isControlled && searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };


  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-[#080c14]/85 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform duration-200">
            <GraduationCap size={22} className="stroke-[2.5]" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50 font-sans">
              এসো অ্যালগরিদম শিখি
            </h1>
            <p className="text-[9px] sm:text-[10px] text-zinc-500 dark:text-zinc-400 font-light -mt-1">
              Bangla Algorithm Platform
            </p>
          </div>
        </Link>

        {/* Search Input bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-sm sm:max-w-md relative mx-2">
          <div className="relative group">
            <input
              type="text"
              placeholder="অ্যালগরিদম খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-xs sm:text-sm placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-500 transition-colors" size={15} />
          </div>
        </form>

        {/* Actions panel */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/bookmarks"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
            title="পছন্দের তালিকা (Bookmarks)"
          >
            <Bookmark size={17} />
          </Link>
          <button
            onClick={toggleTheme}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all"
            title={theme === "light" ? "ডার্ক মোড" : "লাইট মোড"}
          >
            {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}
