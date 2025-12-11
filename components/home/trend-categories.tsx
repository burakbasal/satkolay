'use client';

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { TreePine, Snowflake, Gift, Coffee, Laptop, Gamepad2, Shirt, Dumbbell, Baby, Zap } from 'lucide-react';

// Icon-based Categories
const categories = [
    { id: 1, title: 'Yılbaşı Ağacı', href: '/search?q=ağaç', icon: TreePine },
    { id: 2, title: 'Yılbaşı Süsü', href: '/search?q=süs', icon: Snowflake },
    { id: 3, title: 'Kar Küresi', href: '/search?q=kar küresi', icon: Snowflake },
    { id: 4, title: 'Oyun Konsolu', href: '/search?category=Elektronik', icon: Gamepad2 },
    { id: 5, title: 'Hediye', href: '/search?q=hediye', icon: Gift },
    { id: 6, title: 'Kahve Makinesi', href: '/search?q=kahve', icon: Coffee },
    { id: 7, title: 'Bilgisayar', href: '/search?category=Elektronik', icon: Laptop },
    { id: 8, title: 'Kış Giyim', href: '/search?category=Giyim', icon: Shirt },
    { id: 9, title: 'Fitness', href: '/search?category=Spor', icon: Dumbbell },
    { id: 10, title: 'Anne & Bebek', href: '/search?category=Bebek', icon: Baby }
];

export function TrendCategories() {
    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 mb-6 relative">
            {/* KAR EFEKTİ (Overlay) */}
            <div className="absolute inset-0 pointer-events-none z-20 opacity-60 overflow-hidden rounded-xl">
                <div className="snowflakes-mini" aria-hidden="true">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="snowflake-mini text-white/40 text-[8px]">●</div>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">🎄</span>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Sezonun Trendleri</h3>
            </div>

            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-3 pb-2 pl-1">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={cat.href}
                            className="flex-shrink-0 relative w-36 h-24 bg-[#D91E2B] rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all overflow-hidden cursor-pointer group"
                        >
                            {/* Parlaklık Efekti (Gradient Overlay) */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 pointer-events-none"></div>

                            {/* Dekoratif Yuvarlak (Hafif) */}
                            <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>

                            {/* İKON: Sağ Üst */}
                            <div className="absolute top-2 right-2 text-white opacity-90 group-hover:scale-110 transition-transform duration-300">
                                <cat.icon className="w-10 h-10 stroke-[1.5]" />
                            </div>

                            {/* YAZI: Sol Alt */}
                            <div className="absolute bottom-2 left-3 pr-2">
                                <span className="text-white text-xs font-semibold leading-tight block drop-shadow-sm max-w-[85px] whitespace-normal">
                                    {cat.title}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="hidden" />
            </ScrollArea>

            <style jsx global>{`
                /* Mini Snow Effect for Categories */
                .snowflake-mini {
                    position: absolute;
                    top: -10px;
                    animation: fall-mini linear infinite;
                }
                @keyframes fall-mini {
                    to { transform: translateY(120px); }
                }
                ${[...Array(8)].map((_, i) => `
                    .snowflake-mini:nth-child(${i + 1}) {
                        left: ${Math.random() * 100}%;
                        animation-duration: ${Math.random() * 2 + 3}s;
                        animation-delay: ${Math.random() * 5}s;
                    }
                `).join('')}
            `}</style>
        </div>
    );
}
