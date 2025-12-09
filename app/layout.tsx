import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { BottomNav } from "@/components/bottom-nav";
import { Toaster } from "@/components/ui/sonner";

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
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-50`}>
        {/* Üst Menü */}
        <Navbar />

        {/* Ana İçerik */}
        <main className="flex-1 pb-20 md:pb-0">
          {children}
        </main>

        {/* Alt Menü (Sadece Masaüstü) */}
        <Footer />

        {/* Mobil Alt Navigasyon (Sadece Mobil) */}
        <BottomNav />

        {/* Bildirimler */}
        <Toaster
          position="top-center"
          richColors
          closeButton
          theme="light"
          toastOptions={{
            classNames: {
              toast: 'bg-white border-border shadow-lg rounded-xl',
              title: 'text-gray-900 font-bold',
              description: 'text-gray-500',
              actionButton: 'bg-red-500 text-white',
            },
          }}
        />
      </body>
    </html>
  );
}
