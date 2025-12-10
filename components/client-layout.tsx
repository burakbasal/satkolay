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
    const showFooter = !pathname?.startsWith('/chat');

    return (
        <div className="min-h-screen flex flex-col bg-[#F2F4F5]">
            <div className="w-full bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-[1440px] mx-auto px-4">
                    <Navbar />
                </div>
            </div>

            <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 mt-6 pb-16 md:pb-8">
                {children}
            </main>

            {showFooter && (
                <div className="w-full bg-white border-t mt-auto">
                    <div className="max-w-[1440px] mx-auto px-4">
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
