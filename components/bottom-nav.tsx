'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutGrid, Camera, MessageCircle, User } from 'lucide-react';

export function BottomNav() {
    const pathname = usePathname();

    // Basit aktiflik kontrolü
    const isActive = (path: string) => {
        // Profil için özel durum: URL /profile ile başlıyorsa (örn: /profile/burak) aktif yak.
        if (path === '/profile' && pathname.startsWith('/profile')) return 'text-[#ff3f55]';
        return pathname === path ? 'text-[#ff3f55]' : 'text-gray-500';
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4 pb-safe flex justify-between items-center z-50 md:hidden h-16">

            <Link href="/" className={`flex flex-col items-center gap-1 w-16 ${isActive('/')}`}>
                <Home className="w-6 h-6" />
                <span className="text-[10px] font-medium">Vitrin</span>
            </Link>

            <Link href="/categories" className={`flex flex-col items-center gap-1 w-16 ${isActive('/categories')}`}>
                <LayoutGrid className="w-6 h-6" />
                <span className="text-[10px] font-medium">Kategoriler</span>
            </Link>

            <div className="relative -top-5">
                <Link href="/sell" className="flex items-center justify-center w-14 h-14 bg-[#ff3f55] rounded-full text-white shadow-lg border-4 border-white hover:scale-105 transition-transform">
                    <Camera className="w-7 h-7" />
                </Link>
            </div>

            <Link href="/chat" className={`flex flex-col items-center gap-1 w-16 ${isActive('/chat')}`}>
                <MessageCircle className="w-6 h-6" />
                <span className="text-[10px] font-medium">Sohbet</span>
            </Link>

            {/* İSTEĞİNİZ ÜZERE: SADECE /profile LİNKİ */}
            <Link href="/profile" className={`flex flex-col items-center gap-1 w-16 ${isActive('/profile')}`}>
                <User className="w-6 h-6" />
                <span className="text-[10px] font-medium">Profil</span>
            </Link>

        </div>
    );
}
