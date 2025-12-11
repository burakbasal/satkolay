'use client';

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useRef } from "react";
import { TreePine, Snowflake, Gift, Coffee, Laptop, Gamepad2, Shirt, Dumbbell, Baby, Globe2, ChevronLeft, ChevronRight } from 'lucide-react';

// Icon-based Categories (10 Adet)
const categories = [
    { id: 1, title: 'Yılbaşı Ağacı', href: '/search?q=ağaç', icon: TreePine },
    { id: 2, title: 'Yılbaşı Süsü', href: '/search?q=süs', icon: Snowflake },
    { id: 3, title: 'Kar Küresi', href: '/search?q=kar küresi', icon: Globe2 },
    { id: 4, title: 'Hediye', href: '/search?q=hediye', icon: Gift },
    { id: 5, title: 'Kış Giyim', href: '/search?category=Giyim', icon: Shirt },
    { id: 6, title: 'Kahve Makinesi', href: '/search?q=kahve', icon: Coffee },
    { id: 7, title: 'Bilgisayar', href: '/search?category=Elektronik', icon: Laptop },
    { id: 8, title: 'Oyun Konsolu', href: '/search?category=Elektronik', icon: Gamepad2 },
    { id: 9, title: 'Fitness', href: '/search?category=Spor', icon: Dumbbell },
    { id: 10, title: 'Anne & Bebek', href: '/search?category=Bebek', icon: Baby }
];

export function TrendCategories() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 200;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 mb-6 relative group">
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

            {/* Sol Scroll Butonu */}
            <div className="absolute left-2 top-[60%] -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={() => scroll('left')}
                    className="bg-white/90 shadow-md rounded-full p-2 hover:bg-white hover:scale-110 transition-all cursor-pointer text-gray-700"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            </div>

            {/* Sağ Scroll Butonu */}
            <div className="absolute right-2 top-[60%] -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                    onClick={() => scroll('right')}
                    className="bg-white/90 shadow-md rounded-full p-2 hover:bg-white hover:scale-110 transition-all cursor-pointer text-gray-700"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-2 px-1 pl-1"
            >
                {categories.map((cat) => (
                    <Link
                        key={cat.id}
                        href={cat.href}
                        className="flex-shrink-0 relative min-w-[140px] h-[84px] bg-[#D91E2B] rounded-xl shadow-sm hover:shadow-lg hover:scale-105 transition-all overflow-hidden cursor-pointer group/item"
                    >
                        {/* Cam/Glossy Efekti (Gradient Overlay) */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/5 opacity-60 pointer-events-none"></div>

                        {/* Dekoratif Yuvarlak (Hafif) */}
                        <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-xl group-hover/item:scale-110 transition-transform"></div>

                        {/* İKON: Sağ Üst */}
                        <div className="absolute top-2 right-2 text-white opacity-90 group-hover/item:scale-110 transition-transform duration-300">
                            <cat.icon className="w-8 h-8 stroke-[1.5]" />
                        </div>

                        {/* YAZI: Sol Alt */}
                        <div className="absolute bottom-2 left-3 pr-2 z-10">
                            <span className="text-white text-[11px] font-bold leading-tight block drop-shadow-sm max-w-[90px] whitespace-normal">
                                {cat.title}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

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
