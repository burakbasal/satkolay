'use client';

import dynamic from 'next/dynamic';
import { Toaster } from "@/components/ui/sonner";

// SSR: false yaparak mobil hydration hatasını engelliyoruz
const Navbar = dynamic(() => import('@/components/navbar').then(m => m.Navbar), { ssr: false });
const BottomNav = dynamic(() => import('@/components/bottom-nav').then(m => m.BottomNav), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            <main className="max-w-[1440px] mx-auto px-4 w-full min-h-screen pb-16 md:pb-0">{children}</main>
            <BottomNav />
            <Toaster />
        </>
    );
}
