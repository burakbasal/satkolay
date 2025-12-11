"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Package, Settings, LogOut, Shield, MessageSquare, FileText, Star, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const menuItems = [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/approval", label: "Onay Bekleyenler", icon: Shield },
        { href: "/admin/items", label: "Tüm İlanlar", icon: Package },
        { href: "/admin/users", label: "Kullanıcılar", icon: Users },
        { href: "/admin/messages", label: "Mesajlar", icon: MessageSquare },
        { href: "/admin/logs", label: "Aktivite Logları", icon: FileText }, // Shield'i Approval için kullandık, FileText logs için
        { href: "/admin/reviews", label: "Değerlendirmeler", icon: Star },
        { href: "/admin/reports", label: "Şikayetler", icon: AlertTriangle },
        { href: "/admin/settings", label: "Ayarlar", icon: Settings },
    ];

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login"); // or root
        router.refresh();
    };

    return (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed inset-y-0 left-0 z-50">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <Link href="/admin" className="flex items-center gap-2 font-black text-xl tracking-tight text-white hover:opacity-80 transition-opacity">
                    <Shield className="w-6 h-6 text-[#001e93] fill-current" />
                    <span>SatKolay<span className="text-[#001e93]">.Admin</span></span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-[#001e93] text-white shadow-lg shadow-blue-900/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                            )}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Çıkış Yap
                </button>
            </div>

            {/* User Info Minimal */}
            <div className="px-6 pb-6 pt-2">
                <p className="text-xs text-slate-600 font-mono">v2.1.0 • Stable</p>
            </div>
        </aside>
    );
}
