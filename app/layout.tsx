import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientLayout } from "@/components/client-layout";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SatKolay - İkinci Elin En Kolay Hali",
  description: "Türkiye'nin en hızlı büyüyen ikinci el pazar yeri.",
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <ClientLayout />
        <main className="min-h-screen pb-16 md:pb-0">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}