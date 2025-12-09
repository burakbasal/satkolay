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

                    {/* Sütun 1 */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Popüler Kategoriler</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/search?category=Telefon" className="hover:underline">İkinci El Cep Telefonu</Link></li>
                            <li><Link href="/search?category=Elektronik" className="hover:underline">İkinci El Bilgisayar</Link></li>
                            <li><Link href="/search?category=Araba" className="hover:underline">İkinci El Araba</Link></li>
                            <li><Link href="/search?category=Motosiklet" className="hover:underline">İkinci El Motosiklet</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 2 */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">Popüler Sayfalar</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/search?category=Giyim" className="hover:underline">İkinci El Giyim & Aksesuar</Link></li>
                            <li><Link href="/search?category=Bebek" className="hover:underline">İkinci El Bebek Eşyaları</Link></li>
                            <li><Link href="/search?category=Ev" className="hover:underline">İkinci El Ev Eşyası</Link></li>
                            <li><Link href="/search?category=Elektronik" className="hover:underline">İkinci El Elektronik</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 3 */}
                    <div>
                        <h3 className="font-bold text-gray-900 mb-4">SatKolay</h3>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/about" className="hover:underline">Hakkımızda</Link></li>
                            <li><Link href="/help" className="hover:underline">Yardım ve Destek</Link></li>
                            <li><Link href="/terms" className="hover:underline">Sözleşmeler</Link></li>
                            <li><Link href="/privacy" className="hover:underline">Güvenlik Önerileri</Link></li>
                        </ul>
                    </div>

                    {/* Sütun 4 */}
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
