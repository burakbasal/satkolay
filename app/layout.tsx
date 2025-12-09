import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { BottomNav } from "@/components/bottom-nav";
import { Suspense } from "react"; // <--- BU SATIR EKLENDİ

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SatKolay - İkinci Elin En Kolay Hali",
  description: "Türkiye'nin en hızlı büyüyen ikinci el pazar yeri.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>

        {/* Navbar'ı Suspense içine aldık (Hata Çözücü) */}
        <Suspense fallback={<div className="h-16 bg-white border-b" />}>
          <Navbar />
        </Suspense>

        <main className="min-h-screen pb-16 md:pb-0">
          {children}
        </main>

        {/* BottomNav'ı Suspense içine aldık (Hata Çözücü) */}
        <Suspense fallback={null}>
          <BottomNav />
        </Suspense>

      </body>
    </html>
  );
}