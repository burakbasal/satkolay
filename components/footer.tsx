'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Youtube, ShieldCheck, Linkedin } from 'lucide-react';

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
        <footer className="w-full bg-white mt-auto pb-32 md:pb-0">
            {/* 
               CRITICAL MOBILE FIX: pb-32 added above to prevent overlap with Bottom Navigation.
               On Desktop (md:), it resets to pb-0.
            */}

            <div className="max-w-[1280px] mx-auto px-4 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 text-center md:text-left">

                    {/* Sütun 1: Popüler Kategoriler */}
                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Popüler Kategoriler</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/search?category=Elektronik" className="text-sm text-gray-600 hover:underline hover:text-[#001e93] transition-colors">İkinci El Cep Telefonu</Link></li>
                            <li><Link href="/search?category=Elektronik" className="text-sm text-gray-600 hover:underline hover:text-[#001e93] transition-colors">Bilgisayar & Tablet</Link></li>
                            <li><Link href="/search?category=Araba" className="text-sm text-gray-600 hover:underline hover:text-[#001e93] transition-colors">Araba</Link></li>
                            <li><Link href="/search?category=Motosiklet" className="text-sm text-gray-600 hover:underline hover:text-[#001e93] transition-colors">Motosiklet</Link></li>
                            <li><Link href="/search?category=Ev" className="text-sm text-gray-600 hover:underline hover:text-[#001e93] transition-colors">Beyaz Eşya</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 2: Popüler Sayfalar */}
                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Popüler Sayfalar</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/search?category=Giyim" className="text-sm text-gray-600 hover:underline hover:text-[#001e93] transition-colors">Giyim & Aksesuar</Link></li>
                            <li><Link href="/search?category=Bebek" className="text-sm text-gray-600 hover:underline hover:text-[#001e93] transition-colors">Bebek Araç Gereç</Link></li>
                            <li><Link href="/search?category=Elektronik" className="text-sm text-gray-600 hover:underline hover:text-[#001e93] transition-colors">Elektronik</Link></li>
                            <li><Link href="/search?category=Ev" className="text-sm text-gray-600 hover:underline hover:text-[#001e93] transition-colors">Mobilya</Link></li>
                            <li><Link href="/search" className="text-sm text-gray-600 hover:underline hover:text-[#001e93] transition-colors">Tüm İlanlar</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 3: Kurumsal */}
                    <div className="flex flex-col items-center md:items-start">
                        <h4 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Kurumsal</h4>
                        <ul className="space-y-2.5">
                            <li><Link href="/hakkimizda" className="text-sm text-gray-600 hover:underline hover:text-[#001e93] transition-colors">Hakkımızda</Link></li>
                            <li><Link href="/yardim" className="text-sm text-gray-600 hover:underline hover:text-[#001e93] transition-colors">Yardım ve Destek</Link></li>
                            <li><Link href="/sozlesmeler" className="text-sm text-gray-600 hover:underline hover:text-[#001e93] transition-colors">Kullanıcı Sözleşmesi</Link></li>
                            <li><Link href="/gizlilik" className="text-sm text-gray-600 hover:underline hover:text-[#001e93] transition-colors">Gizlilik Politikası</Link></li>
                            <li><Link href="/sozlesmeler" className="text-sm text-gray-600 hover:underline hover:text-[#001e93] transition-colors">Reklam Ver</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 4: Güven & Sosyal */}
                    <div className="flex flex-col items-center justify-start">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex flex-col items-center justify-center border-2 border-green-500 shadow-sm mb-4 group cursor-pointer hover:bg-green-50 transition-colors">
                            <ShieldCheck className="w-8 h-8 text-green-600 mb-0.5 group-hover:scale-110 transition-transform" />
                            <span className="text-[8px] font-bold text-green-700 uppercase tracking-tighter">Güvenli</span>
                        </div>

                        <h4 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Bizi Takip Et</h4>
                        <div className="flex gap-4">
                            <Link href="#" className="text-gray-400 hover:text-[#1877F2] transition-colors duration-200 transform hover:scale-110"><Facebook className="w-5 h-5" /></Link>
                            <Link href="#" className="text-gray-400 hover:text-[#E4405F] transition-colors duration-200 transform hover:scale-110"><Instagram className="w-5 h-5" /></Link>
                            <Link href="#" className="text-gray-400 hover:text-black transition-colors duration-200 transform hover:scale-110"><XIcon className="w-5 h-5" /></Link>
                            <Link href="#" className="text-gray-400 hover:text-[#FF0000] transition-colors duration-200 transform hover:scale-110"><Youtube className="w-5 h-5" /></Link>
                            <Link href="https://www.linkedin.com/company/satkolay/about/" className="text-gray-400 hover:text-[#0A66C2] transition-colors duration-200 transform hover:scale-110"><Linkedin className="w-5 h-5" /></Link>
                        </div>
                    </div>

                </div>
            </div>

            {/* Alt Bar */}
            <div className="border-t border-gray-100">
                <div className="max-w-[1280px] mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-[#001e93]">İkinci Elin Yeni Adresi.</span>
                        <div className="text-xs text-gray-500 font-medium">
                            © 2025 SatKolay. Tüm hakları saklıdır.
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
                        <Link href="/sozlesmeler" className="text-xs text-gray-500 hover:text-[#001e93] hover:underline transition-colors">Kullanıcı Sözleşmesi</Link>
                        <Link href="/gizlilik" className="text-xs text-gray-500 hover:text-[#001e93] hover:underline transition-colors">Gizlilik Politikası</Link>
                        <Link href="/yardim" className="text-xs text-gray-500 hover:text-[#001e93] hover:underline transition-colors">Kılavuz</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
