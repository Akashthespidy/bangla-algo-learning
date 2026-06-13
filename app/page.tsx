import { Suspense } from "react";
import { getAllAlgorithms } from "@/lib/algorithms";
import HomeClient from "@/components/HomeClient";

export default function Home() {
  const algorithms = getAllAlgorithms();
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-[#080c14] text-zinc-600 dark:text-zinc-400">
        লোডিং হচ্ছে...
      </div>
    }>
      <HomeClient initialAlgorithms={algorithms} />
    </Suspense>
  );
}

