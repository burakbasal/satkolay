'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function CorporateLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const links = [
        { href: '/hakkimizda', label: 'Hakkımızda' }, // Hakkimizda is root level but we link it
        { href: '/sozlesmeler/uyelik', label: 'Üyelik Sözleşmesi' },
        { href: '/sozlesmeler/gizlilik', label: 'Gizlilik Politikası' },
        { href: '/sozlesmeler/kullanim', label: 'Kullanım Koşulları' },
    ];

    return (
        <div className="max-w-[1280px] mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* SOL MENÜ */}
                <aside className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                        <div className="p-4 bg-gray-50 border-b border-gray-100 font-bold text-gray-900">
                            Kurumsal
                        </div>
                        <nav className="flex flex-col">
                            {links.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={`px-4 py-3 text-sm font-medium border-l-4 hover:bg-gray-50 transition-colors ${isActive ? 'border-[#ff3f55] text-[#ff3f55] bg-red-50' : 'border-transparent text-gray-600'}`}
                                    >
                                        {link.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* SAĞ İÇERİK */}
                <div className="flex-1">
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 min-h-[500px] prose max-w-none">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
