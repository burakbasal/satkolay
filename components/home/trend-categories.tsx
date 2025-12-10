'use client';

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import Image from "next/image";

// Unsplash Dynamic Image Sources
const categories = [
    { id: 1, title: 'Yılbaşı Ağacı', href: '/search?q=ağaç', imageSrc: 'https://source.unsplash.com/featured/300x200/?christmas,tree' },
    { id: 2, title: 'Yılbaşı Süsü', href: '/search?q=süs', imageSrc: 'https://source.unsplash.com/featured/300x200/?christmas,ornament' },
    { id: 3, title: 'Kar Küresi', href: '/search?q=kar küresi', imageSrc: 'https://source.unsplash.com/featured/300x200/?snowglobe' },
    { id: 4, title: 'Hediye', href: '/search?q=hediye', imageSrc: 'https://source.unsplash.com/featured/300x200/?gift,box' },
    { id: 5, title: 'Kış Giyim', href: '/search?category=Giyim', imageSrc: 'https://source.unsplash.com/featured/300x200/?winter,coat' },
    { id: 6, title: 'Kahve Makinesi', href: '/search?q=kahve', imageSrc: 'https://source.unsplash.com/featured/300x200/?coffee,machine' },
    { id: 7, title: 'Bilgisayar', href: '/search?category=Elektronik', imageSrc: 'https://source.unsplash.com/featured/300x200/?laptop,computer' },
    { id: 8, title: 'Oyun Konsolu', href: '/search?category=Elektronik', imageSrc: 'https://source.unsplash.com/featured/300x200/?gaming,console' },
    { id: 9, title: 'Fitness', href: '/search?category=Spor', imageSrc: 'https://source.unsplash.com/featured/300x200/?fitness,gym' },
    { id: 10, title: 'Anne & Bebek', href: '/search?category=Bebek', imageSrc: 'https://source.unsplash.com/featured/300x200/?baby,toys' }
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
                <span className="text-xl">🔥</span>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Trend Kategoriler</h3>
            </div>

            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex w-max space-x-3 pb-2 pl-1">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={cat.href}
                            className="flex-shrink-0 relative w-36 h-24 bg-[#D91E2B] rounded-xl shadow-sm hover:shadow-md hover:scale-105 transition-all overflow-hidden cursor-pointer flex flex-col group border border-gray-100/10"
                        >
                            {/* Üst Kısım: Görsel Area (%70) */}
                            <div className="h-[70%] w-full relative bg-white overflow-hidden">
                                {/* Next Image with Unsplash Source */}
                                <Image
                                    src={cat.imageSrc}
                                    alt={cat.title}
                                    fill
                                    sizes="144px"
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    unoptimized // Unsplash redirects sometimes cause issues with Next.js Image Optimization
                                />
                            </div>

                            {/* Alt Kısım: Yazı Alanı (%30) */}
                            <div className="h-[30%] w-full bg-[#D91E2B] flex items-center justify-center relative z-10">
                                <span className="text-white text-[10px] sm:text-xs font-medium text-center px-1 truncate w-full drop-shadow-sm">
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
