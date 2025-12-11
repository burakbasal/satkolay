import { checkAdminAccess } from '@/utils/admin-auth';
import Link from 'next/link';
import { LayoutDashboard, Users, MessageSquare, Settings, LogOut, Package } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // 1. GÜVENLİK KONTROLÜ
    await checkAdminAccess();

    // 2. Çıkış fonksiyonu (Server Action olmadığı için basit form/route handler veya client comp gerekir ama şimdilik buton yeter)
    // Supabase auth signout client-side yapılmalı genelde. Server-side action da olur.
    // Şimdilik sadece linkler ve layout.

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">
            {/* SIDEBAR */}
            <div className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:block">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-black tracking-tighter text-white">SatKolay<span className="text-blue-500">Admin</span></h1>
                </div>

                <nav className="p-4 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                        <Package className="w-5 h-5" />
                        <span>İlanlar</span>
                    </Link>
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                        <Users className="w-5 h-5" />
                        <span>Kullanıcılar</span>
                    </Link>
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                        <MessageSquare className="w-5 h-5" />
                        <span>Mesajlar</span>
                    </Link>
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors">
                        <Settings className="w-5 h-5" />
                        <span>Ayarlar</span>
                    </Link>
                </nav>

                <div className="absolute bottom-0 w-64 p-4 border-t border-gray-800">
                    <form action={async () => {
                        'use server';
                        const supabase = await createClient();
                        await supabase.auth.signOut();
                        redirect('/login');
                    }}>
                        <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg w-full transition-colors">
                            <LogOut className="w-5 h-5" />
                            <span>Çıkış Yap</span>
                        </button>
                    </form>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b flex items-center justify-between px-8 shadow-sm">
                    <span className="font-bold text-gray-700">Yönetim Paneli</span>
                    <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                        A
                    </div>
                </header>
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

