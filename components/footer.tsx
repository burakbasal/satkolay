'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export function Footer() {
    const pathname = usePathname();

    // Chat, Kategori ve Admin sayfalarında footer gizlensin
    if (pathname?.startsWith('/chat') || pathname?.startsWith('/categories') || pathname?.startsWith('/admin')) {
        return null;
    }

    return (
        <footer className="bg-white border-t border-gray-200 pt-16 pb-24 md:pb-8 mt-auto hidden md:block"> {/* pb-24: Mobil menü payı. Sadece Desktop'ta gösterelim mi? Kullanıcı "Footer geri gelsin" dedi, mobilde de olmalı. Ama bottom-nav var. Usually mobile apps don't have large footers. Let's keep it visible but maybe padding considerations. User didn't specify hidden on mobile. */}
            <div className="max-w-[1440px] mx-auto px-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-center md:text-left">

                    {/* Sütun 1: Kurumsal */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Kurumsal</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/hakkimizda" className="hover:underline">Hakkımızda</Link></li>
                            <li><Link href="/iletisim" className="hover:underline">İletişim</Link></li>
                            <li><Link href="/yardim" className="hover:underline">Yardım Merkezi</Link></li>
                            <li><Link href="/kariyer" className="hover:underline">Kariyer</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 2: Hizmetler */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Hizmetler</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/doping" className="hover:underline">Doping Al</Link></li>
                            <li><Link href="/guvenli-odeme" className="hover:underline">Güvenli Ödeme</Link></li>
                            <li><Link href="/reklam" className="hover:underline">Reklam Ver</Link></li>
                            <li><Link href="/mobil" className="hover:underline">Mobil Uygulama</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 3: Gizlilik ve Yasal */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Gizlilik ve Yasal</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/sozlesmeler/uyelik" className="hover:underline">Üyelik Sözleşmesi</Link></li>
                            <li><Link href="/sozlesmeler/gizlilik" className="hover:underline">Gizlilik Politikası</Link></li>
                            <li><Link href="/sozlesmeler/kullanim" className="hover:underline">Kullanım Koşulları</Link></li>
                            <li><Link href="/sozlesmeler/cerez" className="hover:underline">Çerez Politikası</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 4: Sosyal Medya & Uygulama */}
                    <div className="flex flex-col items-center md:items-start">
                        <h3 className="font-bold text-gray-900 mb-4">Bizi Takip Et</h3>
                        <div className="flex gap-4 mb-6">
                            <Link href="#" className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"><Facebook className="w-5 h-5 text-gray-700" /></Link>
                            <Link href="#" className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"><Instagram className="w-5 h-5 text-gray-700" /></Link>
                            <Link href="#" className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"><Twitter className="w-5 h-5 text-gray-700" /></Link>
                            <Link href="#" className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"><Youtube className="w-5 h-5 text-gray-700" /></Link>
                        </div>

                        <h3 className="font-bold text-gray-900 mb-4">Uygulamayı İndir</h3>
                        <div className="flex flex-col gap-3 w-full max-w-[150px]">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10 cursor-pointer hover:opacity-80" />
                            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10 cursor-pointer hover:opacity-80" />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
                    <p>Türkiye'de ikinci el eşya al ve sat. © 2025 SatKolay</p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="hover:text-gray-600">Şartlar</Link>
                        <Link href="/privacy" className="hover:text-gray-600">Gizlilik</Link>
                        <Link href="/about" className="hover:text-gray-600">Künye</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
