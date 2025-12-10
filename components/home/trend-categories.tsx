'use client';

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { Trees, Snowflake, Gamepad2, Gift, Shirt, Camera, Smartphone, Watch, Coffee, Laptop } from "lucide-react";

const categories = [
    { title: "Yılbaşı Ağacı", icon: Trees, href: "/search?q=ağaç" },
    { title: "Yılbaşı Süsü", icon: Snowflake, href: "/search?q=süs" },
    { title: "Kar Küresi", icon: Snowflake, href: "/search?q=kar küresi" },
    { title: "Oyun Konsolu", icon: Gamepad2, href: "/search?category=Elektronik" },
    { title: "Hediye", icon: Gift, href: "/search?q=hediye" },
    { title: "Kahve Makinesi", icon: Coffee, href: "/search?q=kahve" },
    { title: "Bilgisayar", icon: Laptop, href: "/search?category=Elektronik" },
    { title: "Kış Giyim", icon: Shirt, href: "/search?category=Giyim" },
];

export function TrendCategories() {
    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">🎄</span>
                <h3 className="text-lg font-bold text-gray-900">Sezonun Trendleri</h3>
            </div>

            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-4 pb-2">
                    {categories.map((cat, i) => (
                        <Link
                            key={i}
                            href={cat.href}
                            className="flex-shrink-0 relative w-32 h-24 bg-[#D91E2B] rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all overflow-hidden group cursor-pointer"
                        >
                            {/* Dekoratif Daire */}
                            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/20 rounded-full group-hover:scale-125 transition-transform duration-500"></div>

                            {/* İkon / Resim Yeri */}
                            <div className="absolute top-2 right-2 text-white/90">
                                <cat.icon className="w-10 h-10 drop-shadow-sm" />
                            </div>

                            {/* Yazı */}
                            <div className="absolute bottom-2 left-3 text-white font-semibold text-xs leading-tight max-w-[80px] whitespace-normal">
                                {cat.title}
                            </div>
                        </Link>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>
        </div>
    );
}
