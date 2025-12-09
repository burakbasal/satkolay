import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import dynamic from 'next/dynamic';

const Navbar = dynamic(() => import('@/components/navbar').then(mod => mod.Navbar), { ssr: false });
const BottomNav = dynamic(() => import('@/components/bottom-nav').then(mod => mod.BottomNav), { ssr: false });

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

        <Navbar />

        <main className="min-h-screen pb-16 md:pb-0">
          {children}
        </main>

        <BottomNav />

      </body>
    </html>
  );
}