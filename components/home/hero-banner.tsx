'use client';

import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";
import Link from "next/link";

export function HeroBanner() {
    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 mb-8">
            <div className="relative bg-gradient-to-r from-[#D91E2B] to-[#C1101D] rounded-2xl overflow-hidden shadow-lg border border-[#ff4d5a]">

                {/* Dekoratif Kar Taneleri (Basit CSS) */}
                <div className="absolute top-2 left-4 text-white/20 text-4xl animate-pulse">❄</div>
                <div className="absolute bottom-4 left-1/4 text-white/10 text-6xl">❄</div>
                <div className="absolute top-1/3 right-1/3 text-white/10 text-2xl">❄</div>

                <div className="flex flex-col md:flex-row items-center justify-between p-8 md:p-12 relative z-10">

                    {/* Sol: Metin Alanı */}
                    <div className="flex-1 text-center md:text-left text-white max-w-lg">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold mb-4">
                            <span className="bg-yellow-400 text-black text-[10px] font-bold px-1.5 rounded-sm">YENİ</span>
                            <span>Yılbaşı Kampanyası Başladı! 🎄</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight tracking-tight">
                            Yılbaşı hazırlığı için ne lazımsa, en uygunu <span className="text-yellow-300">SatKolay</span>'da!
                        </h2>
                        <p className="text-white/90 text-lg mb-8 font-medium">
                            Sevdiklerin için en güzel hediyeler ve dekorasyon ürünleri burada seni bekliyor.
                        </p>
                        <Link href="/search?q=yılbaşı">
                            <Button className="bg-white text-[#D91E2B] hover:bg-gray-100 hover:scale-105 transition-all font-bold text-lg px-8 py-6 rounded-full shadow-xl">
                                Hemen Al
                            </Button>
                        </Link>
                    </div>

                    {/* Sağ: Görsel Alanı (Temsili İkonlar/Görsel) */}
                    <div className="flex-1 flex justify-center md:justify-end mt-8 md:mt-0 relative">
                        {/* Arka Plan Glow Efekti */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/30 blur-[100px] rounded-full pointer-events-none"></div>

                        <div className="relative animate-bounce-slow">
                            {/* Hediye Paketi İkonu (Büyük) */}
                            <Gift className="w-48 h-48 md:w-64 md:h-64 text-white drop-shadow-2xl" strokeWidth={1} />

                            {/* Dekoratif Süsler */}
                            <div className="absolute -top-4 -right-4 bg-yellow-400 w-12 h-12 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-100">
                                <span className="text-2xl">⭐</span>
                            </div>
                            <div className="absolute bottom-0 -left-6 bg-green-600 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transform rotate-12">
                                <span className="text-3xl">🎄</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
