'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Twitter, Youtube, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';

export function Footer() {
    const pathname = usePathname();

    // Sohbet sayfasında footer gizlenir
    if (pathname?.startsWith('/chat')) {
        return null;
    }

    return (
        <footer className="w-full bg-white border-t border-gray-200 mt-auto">
            {/* Üst Kısım: 5 Sütunlu Grid */}
            <div className="max-w-[1280px] mx-auto px-4 py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

                    {/* Sütun 1: Popüler Kategoriler */}
                    <div>
                        <h4 className="text-sm font-bold text-black mb-4 uppercase tracking-wide">Popüler Kategoriler</h4>
                        <ul className="space-y-2">
                            <li><Link href="/search?category=Elektronik" className="text-xs text-gray-500 hover:underline hover:text-[#D91E2B]">İkinci El Cep Telefonu</Link></li>
                            <li><Link href="/search?category=Elektronik" className="text-xs text-gray-500 hover:underline hover:text-[#D91E2B]">Bilgisayar & Tablet</Link></li>
                            <li><Link href="/search?category=Araba" className="text-xs text-gray-500 hover:underline hover:text-[#D91E2B]">Araba</Link></li>
                            <li><Link href="/search?category=Motosiklet" className="text-xs text-gray-500 hover:underline hover:text-[#D91E2B]">Motosiklet</Link></li>
                            <li><Link href="/search?category=Ev" className="text-xs text-gray-500 hover:underline hover:text-[#D91E2B]">Beyaz Eşya</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 2: Popüler Sayfalar */}
                    <div>
                        <h4 className="text-sm font-bold text-black mb-4 uppercase tracking-wide">Popüler Sayfalar</h4>
                        <ul className="space-y-2">
                            <li><Link href="/search?category=Giyim" className="text-xs text-gray-500 hover:underline hover:text-[#D91E2B]">Giyim & Aksesuar</Link></li>
                            <li><Link href="/search?category=Bebek" className="text-xs text-gray-500 hover:underline hover:text-[#D91E2B]">Bebek Araç Gereç</Link></li>
                            <li><Link href="/search?category=Elektronik" className="text-xs text-gray-500 hover:underline hover:text-[#D91E2B]">Elektronik</Link></li>
                            <li><Link href="/search?category=Ev" className="text-xs text-gray-500 hover:underline hover:text-[#D91E2B]">Mobilya</Link></li>
                            <li><Link href="/search" className="text-xs text-gray-500 hover:underline hover:text-[#D91E2B]">Tüm İlanlar</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 3: SatKolay (Kurumsal) */}
                    <div>
                        <h4 className="text-sm font-bold text-black mb-4 uppercase tracking-wide">SatKolay</h4>
                        <ul className="space-y-2">
                            <li><Link href="/hakkimizda" className="text-xs text-gray-500 hover:underline hover:text-[#D91E2B]">Hakkımızda</Link></li>
                            <li><Link href="/yardim" className="text-xs text-gray-500 hover:underline hover:text-[#D91E2B]">Yardım ve Destek</Link></li>
                            <li><Link href="/sozlesmeler" className="text-xs text-gray-500 hover:underline hover:text-[#D91E2B]">Kullanıcı Sözleşmesi</Link></li>
                            <li><Link href="/gizlilik" className="text-xs text-gray-500 hover:underline hover:text-[#D91E2B]">Gizlilik Politikası</Link></li>
                            <li><Link href="/sozlesmeler" className="text-xs text-gray-500 hover:underline hover:text-[#D91E2B]">Reklam Ver</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 4: Güven Damgası */}
                    <div className="flex flex-col items-center justify-start pt-2">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex flex-col items-center justify-center border-2 border-green-500 shadow-sm mb-2 group cursor-pointer hover:bg-green-50 transition-colors">
                            <ShieldCheck className="w-10 h-10 text-green-600 mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold text-green-700 uppercase tracking-tighter">Güven Damgası</span>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center max-w-[150px]">
                            SatKolay, güvenli e-ticaret altyapısı ile %100 korumalı alışveriş sunar.
                        </p>
                    </div>

                    {/* Sütun 5: Bizi Takip Et & İndir */}
                    <div>
                        <h4 className="text-sm font-bold text-black mb-4 uppercase tracking-wide">Bizi Takip Et</h4>
                        <div className="flex gap-4 mb-6">
                            <Link href="#" className="p-2 bg-gray-100 rounded-full hover:bg-blue-600 hover:text-white transition-colors"><Facebook className="w-4 h-4" /></Link>
                            <Link href="#" className="p-2 bg-gray-100 rounded-full hover:bg-pink-600 hover:text-white transition-colors"><Instagram className="w-4 h-4" /></Link>
                            <Link href="#" className="p-2 bg-gray-100 rounded-full hover:bg-blue-400 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></Link>
                            <Link href="#" className="p-2 bg-gray-100 rounded-full hover:bg-red-600 hover:text-white transition-colors"><Youtube className="w-4 h-4" /></Link>
                        </div>

                        <h4 className="text-sm font-bold text-black mb-3 uppercase tracking-wide">Uygulamayı İndir</h4>
                        <div className="flex flex-col gap-2">
                            {/* App Store Button (CSS Only) */}
                            <Link href="#" className="bg-black text-white hover:bg-gray-800 transition-colors rounded-lg px-4 py-2 flex items-center gap-3 w-40 shadow-md">
                                <div className="text-2xl">🍎</div> {/* Apple Icon Placeholder */}
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[9px] uppercase font-medium text-gray-300">Download on the</span>
                                    <span className="text-sm font-bold">App Store</span>
                                </div>
                            </Link>

                            {/* Google Play Button (CSS Only) */}
                            <Link href="#" className="bg-black text-white hover:bg-gray-800 transition-colors rounded-lg px-4 py-2 flex items-center gap-3 w-40 shadow-md">
                                <div className="text-2xl">🤖</div> {/* Android Icon Placeholder */}
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[9px] uppercase font-medium text-gray-300">GET IT ON</span>
                                    <span className="text-sm font-bold">Google Play</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

            {/* Alt Bar: Copyright & Legal */}
            <div className="border-t border-gray-200 bg-gray-50">
                <div className="max-w-[1280px] mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-[11px] text-gray-500 font-medium">
                        Türkiye'de ikinci el eşya al ve sat. <span className="font-bold">© 2025 SatKolay</span>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                        <Link href="/sozlesmeler" className="text-[11px] text-gray-500 hover:text-[#D91E2B] transition-colors">Şartlar ve Koşullar</Link>
                        <Link href="/gizlilik" className="text-[11px] text-gray-500 hover:text-[#D91E2B] transition-colors">Gizlilik Bildirimi</Link>
                        <Link href="/sozlesmeler" className="text-[11px] text-gray-500 hover:text-[#D91E2B] transition-colors">Reklam Politikası</Link>
                        <Link href="/yardim" className="text-[11px] text-gray-500 hover:text-[#D91E2B] transition-colors">Resmi Kurumlar için Kılavuz</Link>
                        <Link href="/gizlilik" className="text-[11px] text-gray-500 hover:text-[#D91E2B] transition-colors">Çerez Ayarları</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
