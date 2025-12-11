'use client';

import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Toaster } from "@/components/ui/sonner";
import { Footer } from '@/components/footer';

// SSR: false to prevent hydration mismatch on mobile
const Navbar = dynamic(() => import('@/components/navbar').then(m => m.Navbar), { ssr: false });
const BottomNav = dynamic(() => import('@/components/bottom-nav').then(m => m.BottomNav), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isChat = pathname?.startsWith('/chat');
    const isAdmin = pathname?.startsWith('/admin');

    // ADMIN ROUTE FIX: Return children directly (admin layout handles the shell)
    if (isAdmin) {
        return <>{children}<Toaster /></>;
    }

    const showFooter = !isChat;

    // KULLANICI İSTEĞİ: Alt boşluk tamamen SIFIR olacak.
    const mainClasses = isChat
        ? "flex-grow w-full max-w-[1280px] mx-auto px-1 mt-1 pb-1"
        : "flex-grow w-full max-w-[1280px] mx-auto px-4 mt-6 pb-[calc(60px+env(safe-area-inset-bottom))] mb-0 min-h-[calc(100dvh-60px)] md:pb-10";

    return (
        <div className="min-h-screen flex flex-col bg-[#F2F4F5]">
            <div className="w-full bg-white border-b sticky top-0 z-50">
                <div className="max-w-[1280px] mx-auto px-4">
                    <Navbar />
                </div>
            </div>

            <main className={mainClasses}>
                {children}
            </main>

            {showFooter && (
                <div className="w-full bg-white border-t mt-4 md:mt-24">
                    <div className="max-w-[1280px] mx-auto px-4">
                        <Footer />
                    </div>
                </div>
            )}

            <div className="md:hidden">
                <BottomNav />
            </div>
            <Toaster />
        </div>
    );
}
