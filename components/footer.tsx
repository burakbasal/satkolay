'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Youtube, ShieldCheck, Apple, Play } from 'lucide-react';

export function Footer() {
    const pathname = usePathname();

    // Sohbet sayfasında footer gizlenir
    if (pathname?.startsWith('/chat')) {
        return null;
    }

    // X Logo SVG Component
    const XIcon = ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );

    return (
        <footer className="w-full bg-white border-t border-gray-200 mt-auto">
            {/* Üst Kısım: 5 Sütunlu Grid */}
            <div className="max-w-[1280px] mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-center md:text-left">

                    {/* Sütun 1: Popüler Kategoriler */}
                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="text-sm font-bold text-black mb-4 uppercase tracking-wide">Popüler Kategoriler</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/search?category=Elektronik" className="text-sm text-gray-500 hover:underline hover:text-[#001e93] transition-colors">İkinci El Cep Telefonu</Link></li>
                            <li><Link href="/search?category=Elektronik" className="text-sm text-gray-500 hover:underline hover:text-[#001e93] transition-colors">Bilgisayar & Tablet</Link></li>
                            <li><Link href="/search?category=Araba" className="text-sm text-gray-500 hover:underline hover:text-[#001e93] transition-colors">Araba</Link></li>
                            <li><Link href="/search?category=Motosiklet" className="text-sm text-gray-500 hover:underline hover:text-[#001e93] transition-colors">Motosiklet</Link></li>
                            <li><Link href="/search?category=Ev" className="text-sm text-gray-500 hover:underline hover:text-[#001e93] transition-colors">Beyaz Eşya</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 2: Popüler Sayfalar */}
                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="text-sm font-bold text-black mb-4 uppercase tracking-wide">Popüler Sayfalar</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/search?category=Giyim" className="text-sm text-gray-500 hover:underline hover:text-[#001e93] transition-colors">Giyim & Aksesuar</Link></li>
                            <li><Link href="/search?category=Bebek" className="text-sm text-gray-500 hover:underline hover:text-[#001e93] transition-colors">Bebek Araç Gereç</Link></li>
                            <li><Link href="/search?category=Elektronik" className="text-sm text-gray-500 hover:underline hover:text-[#001e93] transition-colors">Elektronik</Link></li>
                            <li><Link href="/search?category=Ev" className="text-sm text-gray-500 hover:underline hover:text-[#001e93] transition-colors">Mobilya</Link></li>
                            <li><Link href="/search" className="text-sm text-gray-500 hover:underline hover:text-[#001e93] transition-colors">Tüm İlanlar</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 3: SatKolay (Kurumsal) */}
                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="text-sm font-bold text-black mb-4 uppercase tracking-wide">SatKolay</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/hakkimizda" className="text-sm text-gray-500 hover:underline hover:text-[#001e93] transition-colors">Hakkımızda</Link></li>
                            <li><Link href="/yardim" className="text-sm text-gray-500 hover:underline hover:text-[#001e93] transition-colors">Yardım ve Destek</Link></li>
                            <li><Link href="/sozlesmeler" className="text-sm text-gray-500 hover:underline hover:text-[#001e93] transition-colors">Kullanıcı Sözleşmesi</Link></li>
                            <li><Link href="/gizlilik" className="text-sm text-gray-500 hover:underline hover:text-[#001e93] transition-colors">Gizlilik Politikası</Link></li>
                            <li><Link href="/sozlesmeler" className="text-sm text-gray-500 hover:underline hover:text-[#001e93] transition-colors">Reklam Ver</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 4: Güven Damgası */}
                    <div className="flex flex-col items-center justify-start pt-2">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex flex-col items-center justify-center border-2 border-green-500 shadow-sm mb-3 group cursor-pointer hover:bg-green-50 transition-colors">
                            <ShieldCheck className="w-10 h-10 text-green-600 mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] font-bold text-green-700 uppercase tracking-tighter">Güven Damgası</span>
                        </div>
                        <p className="text-xs text-gray-400 text-center max-w-[180px] font-medium leading-relaxed">
                            SatKolay, güvenli e-ticaret altyapısı ile %100 korumalı alışveriş sunar.
                        </p>
                    </div>

                    {/* Sütun 5: Bizi Takip Et & İndir */}
                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="text-sm font-bold text-black mb-4 uppercase tracking-wide">Bizi Takip Et</h4>
                        <div className="flex gap-3 mb-8">
                            <Link href="#" className="p-2.5 bg-gray-100 rounded-full text-gray-600 hover:bg-blue-600 hover:text-white transition-all hover:scale-110 shadow-sm"><Facebook className="w-5 h-5" /></Link>
                            <Link href="#" className="p-2.5 bg-gray-100 rounded-full text-gray-600 hover:bg-pink-600 hover:text-white transition-all hover:scale-110 shadow-sm"><Instagram className="w-5 h-5" /></Link>
                            <Link href="#" className="p-2.5 bg-gray-100 rounded-full text-gray-600 hover:bg-black hover:text-white transition-all hover:scale-110 shadow-sm"><XIcon className="w-5 h-5" /></Link>
                            <Link href="#" className="p-2.5 bg-gray-100 rounded-full text-gray-600 hover:bg-red-600 hover:text-white transition-all hover:scale-110 shadow-sm"><Youtube className="w-5 h-5" /></Link>
                        </div>

                        <h4 className="text-sm font-bold text-black mb-4 uppercase tracking-wide">Uygulamayı İndir</h4>
                        <div className="flex flex-col gap-3 w-full max-w-[180px]">
                            {/* App Store Button */}
                            <Link href="#" className="bg-black text-white hover:bg-gray-900 hover:border-[#001e93] border border-transparent transition-all rounded-xl px-4 py-2.5 flex items-center gap-3 w-full shadow-lg group">
                                <Apple className="w-8 h-8 fill-current group-hover:scale-105 transition-transform" />
                                <div className="flex flex-col items-start leading-none">
                                    <span className="text-[10px] font-medium text-gray-300 mb-1">Download on the</span>
                                    <span className="text-base font-bold tracking-tight">App Store</span>
                                </div>
                            </Link>

                            {/* Google Play Button */}
                            <Link href="#" className="bg-black text-white hover:bg-gray-900 hover:border-[#001e93] border border-transparent transition-all rounded-xl px-4 py-2.5 flex items-center gap-3 w-full shadow-lg group">
                                <Play className="w-7 h-7 fill-current group-hover:scale-105 transition-transform ml-0.5" />
                                <div className="flex flex-col items-start leading-none ml-0.5">
                                    <span className="text-[10px] font-medium text-gray-300 mb-1">GET IT ON</span>
                                    <span className="text-base font-bold tracking-tight">Google Play</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>

            {/* Alt Bar: Copyright & Legal */}
            <div className="border-t border-gray-200 bg-gray-50">
                <div className="max-w-[1280px] mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-[#001e93]">İkinci Elin Yeni Adresi.</span>
                        <div className="text-xs text-gray-500 font-medium">
                            © 2025 SatKolay. Tüm hakları saklıdır.
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
                        <Link href="/sozlesmeler" className="text-xs text-gray-500 hover:text-[#001e93] hover:underline transition-colors">Şartlar ve Koşullar</Link>
                        <Link href="/gizlilik" className="text-xs text-gray-500 hover:text-[#001e93] hover:underline transition-colors">Gizlilik Bildirimi</Link>
                        <Link href="/sozlesmeler" className="text-xs text-gray-500 hover:text-[#001e93] hover:underline transition-colors">Reklam Politikası</Link>
                        <Link href="/yardim" className="text-xs text-gray-500 hover:text-[#001e93] hover:underline transition-colors">Kılavuz</Link>
                        <Link href="/gizlilik" className="text-xs text-gray-500 hover:text-[#001e93] hover:underline transition-colors">Çerez Ayarları</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
