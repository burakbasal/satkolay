'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

export function Footer() {
    const pathname = usePathname();

    // Sohbet sayfasında footer gizlenir
    if (pathname?.startsWith('/chat')) {
        return null;
    }

    // Custom X (Twitter) Logo
    const XIcon = ({ className }: { className?: string }) => (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    );

    return (
        <footer className="w-full bg-[#0f172a] text-gray-300 border-t border-gray-800 mt-auto pb-28 md:pb-0">
            {/* 
               CRITICAL MOBILE FIX: pb-28 added above to prevent overlap with Bottom Navigation.
               On Desktop (md:), it resets to pb-0.
            */}

            <div className="max-w-[1280px] mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 text-center md:text-left">

                    {/* Sütun 1: Marka Kimliği */}
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <Link href="/" className="text-3xl font-black text-white tracking-tighter">
                            SatKolay
                        </Link>
                        <p className="text-sm font-medium text-gray-400">
                            İkinci Elin Yeni Adresi.
                        </p>
                        <div className="text-xs text-gray-500 pt-4">
                            © 2025 SatKolay. Tüm hakları saklıdır.
                        </div>
                    </div>

                    {/* Sütun 2: Kurumsal */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="text-white font-bold text-lg">Kurumsal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/hakkimizda" className="hover:text-white transition-colors">Hakkımızda</Link></li>
                            <li><Link href="/iletisim" className="hover:text-white transition-colors">İletişim</Link></li>
                            <li><Link href="/yardim" className="hover:text-white transition-colors">Yardım Merkezi</Link></li>
                            <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 3: Yasal */}
                    <div className="flex flex-col space-y-4">
                        <h4 className="text-white font-bold text-lg">Yasal</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/sozlesmeler" className="hover:text-white transition-colors">Kullanıcı Sözleşmesi</Link></li>
                            <li><Link href="/gizlilik" className="hover:text-white transition-colors">Gizlilik Bildirimi</Link></li>
                            <li><Link href="/gizlilik" className="hover:text-white transition-colors">Çerez Ayarları</Link></li>
                            <li><Link href="/sozlesmeler" className="hover:text-white transition-colors">Reklam Politikası</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 4: İndir & Sosyal */}
                    <div className="flex flex-col items-center md:items-start space-y-6">
                        <div className="flex flex-col items-center md:items-start space-y-4">
                            <h4 className="text-white font-bold text-lg">Uygulamayı İndir</h4>
                            <div className="flex flex-col gap-3">
                                {/* App Store Badge */}
                                <Link href="#" className="hover:opacity-80 transition-opacity">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                                        alt="Download on the App Store"
                                        className="h-10 w-auto"
                                    />
                                </Link>
                                {/* Google Play Badge */}
                                <Link href="#" className="hover:opacity-80 transition-opacity">
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                                        alt="Get it on Google Play"
                                        className="h-10 w-auto"
                                    />
                                </Link>
                            </div>
                        </div>

                        <div className="flex flex-col items-center md:items-start space-y-4 pt-4">
                            <h4 className="text-white font-bold text-lg">Bizi Takip Et</h4>
                            <div className="flex gap-4">
                                <Link href="#" className="p-2 bg-gray-800 rounded-full hover:bg-[#001e93] hover:text-white transition-all text-gray-400">
                                    <Instagram className="w-5 h-5" />
                                </Link>
                                <Link href="#" className="p-2 bg-gray-800 rounded-full hover:bg-black hover:text-white transition-all text-gray-400">
                                    <XIcon className="w-5 h-5" />
                                </Link>
                                <Link href="#" className="p-2 bg-gray-800 rounded-full hover:bg-blue-600 hover:text-white transition-all text-gray-400">
                                    <Facebook className="w-5 h-5" />
                                </Link>
                                <Link href="#" className="p-2 bg-gray-800 rounded-full hover:bg-red-600 hover:text-white transition-all text-gray-400">
                                    <Youtube className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}
