'use client';

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Trees, Snowflake, Gamepad2, Gift, Shirt, Camera, Smartphone, Watch } from "lucide-react";
import Link from "next/link";

const categories = [
    { title: "Yılbaşı Ağacı", icon: Trees, color: "bg-green-600", href: "/search?q=ağaç" },
    { title: "Kar Küresi", icon: Snowflake, color: "bg-blue-400", href: "/search?q=kar küresi" },
    { title: "Oyun Konsolu", icon: Gamepad2, color: "bg-purple-600", href: "/search?category=Elektronik" },
    { title: "Hediye Kutusu", icon: Gift, color: "bg-red-500", href: "/search?q=hediye" },
    { title: "Kışlık Giyim", icon: Shirt, color: "bg-orange-500", href: "/search?category=Giyim" },
    { title: "Fotoğraf", icon: Camera, color: "bg-indigo-500", href: "/search?category=Elektronik" },
    { title: "Telefon", icon: Smartphone, color: "bg-gray-800", href: "/search?category=Telefon" },
    { title: "Saat", icon: Watch, color: "bg-teal-600", href: "/search?category=Elektronik" },
];

export function TrendCategories() {
    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 mb-8">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🔥</span>
                <h3 className="text-lg font-bold text-gray-900">Trend Kategoriler</h3>
            </div>

            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-4 pb-4">
                    {categories.map((cat, i) => (
                        <Link
                            key={i}
                            href={cat.href}
                            className={`flex flex-col items-center justify-center w-32 h-32 md:w-36 md:h-36 rounded-2xl ${cat.color} text-white shadow-md hover:scale-105 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden group`}
                        >
                            {/* Dekoratif Arkaplan Şekli */}
                            <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-white/20 rounded-full group-hover:scale-150 transition-transform duration-500"></div>

                            <cat.icon className="w-10 h-10 mb-2 drop-shadow-md z-10" />
                            <span className="font-semibold text-sm z-10">{cat.title}</span>
                        </Link>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
        </div>
    );
}
