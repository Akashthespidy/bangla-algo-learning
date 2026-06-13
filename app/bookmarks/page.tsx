import { getAllAlgorithms } from "@/lib/algorithms";
import BookmarksClient from "@/components/BookmarksClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "বুকমার্ক করা তালিকা | এসো অ্যালগরিদম শিখি",
  description: "আপনার বুকমার্ক করা অ্যালগরিदमসমূহের তালিকা দেখুন ও সহজে অনুশীলন করুন।",
};

export default function BookmarksPage() {
  const allAlgorithms = getAllAlgorithms();
  return <BookmarksClient allAlgorithms={allAlgorithms} />;
}
