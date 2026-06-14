import type { Metadata } from "next";
import { Inter, Hind_Siliguri } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali"],
});

export const metadata: Metadata = {
  title: "এসো অ্যালগরিদম শিখি - Interactive Bangla Algorithm Learning Platform",
  description: "সহজ বাংলায় ভিজ্যুয়ালাইজেশন ও প্র্যাকটিসের মাধ্যমে ডেটা স্ট্রাকচার ও অ্যালগরিদম শিখুন।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="bn"
      className={`${inter.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
