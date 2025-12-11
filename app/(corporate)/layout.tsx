'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Building2, FileText, Shield, HelpCircle } from "lucide-react";

export default function CorporateLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const sidebarLinks = [
        { title: "Hakkımızda", href: "/hakkimizda", icon: Building2 },
        { title: "Sözleşmeler", href: "/sozlesmeler", icon: FileText },
        { title: "Gizlilik Politikası", href: "/gizlilik", icon: Shield },
        { title: "Yardım Merkezi", href: "/yardim", icon: HelpCircle },
    ];

    return (
        <div className="max-w-[1280px] mx-auto py-10 px-4 flex flex-col md:flex-row gap-8 min-h-[600px]">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm border p-4 sticky top-24">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 px-2">Kurumsal</h2>
                    <nav className="flex flex-col space-y-1">
                        {sidebarLinks.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-red-50 text-[#D91E2B]"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                    )}
                                >
                                    <item.icon className={cn("w-4 h-4", isActive ? "text-[#D91E2B]" : "text-gray-400")} />
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-white rounded-lg shadow-sm border p-6 md:p-10">
                <div className="prose prose-red max-w-none">
                    {children}
                </div>
            </main>
        </div>
    );
}
