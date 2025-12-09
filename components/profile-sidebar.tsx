'use client';

import Link from 'next/link';
import { User, List, Heart, Settings, LogOut, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from 'next/navigation';

export function ProfileSidebar({ user, profile }: { user: any, profile: any }) {
    const pathname = usePathname();
    const displayName = profile?.full_name || user.email?.split('@')[0];
    const displayHandle = profile?.username ? `@${profile.username}` : user.email;

    const isActive = (path: string) => pathname === path ? "bg-red-50 text-red-600 font-medium" : "text-gray-700 hover:bg-gray-50";

    return (
        <aside className="w-full md:w-64 shrink-0 space-y-6">
            {/* Profil Kartı */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
                <div className="relative w-24 h-24 mx-auto mb-4">
                    <Avatar className="w-full h-full border-4 border-gray-50">
                        <AvatarImage src={profile?.avatar_url} className="object-cover" />
                        <AvatarFallback className="text-2xl bg-gray-100 text-gray-400">{displayName?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>
                <h2 className="font-bold text-gray-900 text-lg truncate">{displayName}</h2>
                <p className="text-sm text-gray-500 truncate mb-4">{displayHandle}</p>
                <Link href={`/profile/${profile?.username}`} className="text-xs text-[#ff3f55] hover:underline font-medium">Herkese Açık Profili Gör</Link>
            </div>

            {/* Menü Linkleri */}
            <nav className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden p-2">
                <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">İşlemler</div>
                <Link href="/profile/listings" className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition ${isActive('/profile/listings')}`}><List className="w-4 h-4" /> İlanlarım</Link>
                <Link href="/profile/favorites" className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition ${isActive('/profile/favorites')}`}><Heart className="w-4 h-4" /> Favorilerim</Link>

                <div className="border-t my-2"></div>

                <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Hesap</div>
                <Link href="/profile/settings" className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition ${isActive('/profile/settings')}`}><Settings className="w-4 h-4" /> Ayarlar</Link>
                <form action="/auth/signout" method="post">
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition text-left"><LogOut className="w-4 h-4" /> Çıkış Yap</button>
                </form>
            </nav>
        </aside>
    );
}
