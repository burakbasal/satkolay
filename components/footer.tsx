'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Youtube, Linkedin, ShieldCheck } from 'lucide-react';

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
        <footer className="w-full bg-white border-t border-gray-100 mt-auto pb-32 md:pb-10">
            {/* 
               CRITICAL MOBILE FIX: pb-32 added above to prevent overlap with Bottom Navigation.
            */}

            <div className="max-w-[1280px] mx-auto px-6 py-12 md:py-16">

                {/* 4-Column Grid (Removed Mobil Column) */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-8 text-center md:text-left">

                    {/* Sütun 1: Kurumsal */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Kurumsal</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link href="/kurumsal/hakkimizda" className="hover:text-[#001e93] transition-colors">Hakkımızda</Link></li>
                            <li><Link href="/blog" className="hover:text-[#001e93] transition-colors">Blog</Link></li>
                            <li><Link href="/kurumsal/basin" className="hover:text-[#001e93] transition-colors">Basın/Medya</Link></li>
                            <li><Link href="/kurumsal/kariyer" className="hover:text-[#001e93] transition-colors">Kariyer</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 2: Yardım & Destek */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Yardım & Destek</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link href="/destek/sss" className="hover:text-[#001e93] transition-colors">Sıkça Sorulan Sorular</Link></li>
                            <li><Link href="/yasal/kullanim-kosullari" className="hover:text-[#001e93] transition-colors">Kullanım Koşulları</Link></li>
                            <li><Link href="/yasal/gizlilik" className="hover:text-[#001e93] transition-colors">Gizlilik Politikası</Link></li>
                            <li><Link href="/iletisim" className="hover:text-[#001e93] transition-colors">İletişim</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 3: Alışveriş & Satış */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Rehber</h4>
                        <ul className="space-y-3 text-sm text-gray-600">
                            <li><Link href="/rehber/nasil-satilir" className="hover:text-[#001e93] transition-colors">Nasıl Satılır?</Link></li>
                            <li><Link href="/rehber/nasil-alinir" className="hover:text-[#001e93] transition-colors">Nasıl Alınır?</Link></li>
                            <li><Link href="/rehber/guvenlik" className="hover:text-[#001e93] transition-colors">Güvenli Alışveriş</Link></li>
                            <li><Link href="/rehber/ipuclari" className="hover:text-[#001e93] transition-colors">Satış İpuçları</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 4: Topluluk & Ekstra (Merged) */}
                    <div className="flex flex-col space-y-4 items-center md:items-start">
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Sosyal Medya</h4>
                        <div className="flex gap-4 mt-1">
                            <Link href="#" aria-label="Facebook" className="text-gray-400 hover:text-[#1877F2] transition-colors duration-200 transform hover:scale-110"><Facebook className="w-6 h-6" /></Link>
                            <Link href="#" aria-label="Instagram" className="text-gray-400 hover:text-[#E4405F] transition-colors duration-200 transform hover:scale-110"><Instagram className="w-6 h-6" /></Link>
                            <Link href="#" aria-label="Twitter / X" className="text-gray-400 hover:text-black transition-colors duration-200 transform hover:scale-110"><XIcon className="w-6 h-6" /></Link>
                            <Link href="#" aria-label="YouTube" className="text-gray-400 hover:text-[#FF0000] transition-colors duration-200 transform hover:scale-110"><Youtube className="w-6 h-6" /></Link>
                            <Link href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-[#0A66C2] transition-colors duration-200 transform hover:scale-110"><Linkedin className="w-6 h-6" /></Link>
                        </div>

                        <div className="flex flex-col space-y-2 mt-6 text-sm text-gray-600 w-full md:w-auto">
                            <Link href="/kampanyalar" className="hover:text-[#001e93] transition-colors font-medium">Kampanyalar</Link>
                            <Link href="/site-haritasi" className="hover:text-[#001e93] transition-colors">Site Haritası</Link>
                        </div>

                        <div className="flex items-center gap-2 mt-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                            <ShieldCheck className="w-4 h-4" />
                            <span className="text-xs font-bold">Güvenli Ticaret</span>
                        </div>
                    </div>

                </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-100 bg-gray-50/50">
                <div className="max-w-[1280px] mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
                    <div>
                        <span className="block text-sm font-bold text-[#001e93]">SatKolay</span>
                        <span className="text-xs text-gray-500">İkinci Elin Yeni Adresi.</span>
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                        © 2025 SatKolay. Tüm hakları saklıdır.
                    </div>
                </div>
            </div>
        </footer>
    );
}
