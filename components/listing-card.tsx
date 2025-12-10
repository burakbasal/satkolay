'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { FavoriteButton } from './favorite-button';

export function ListingCard({ item }: { item: any }) {
    if (!item || !item.id) return null;

    const isRejected = item.status === 'rejected';
    const isPending = item.status === 'pending';
    const isSold = item.status === 'sold';

    return (
        <div className={`group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all relative flex flex-col h-full ${isRejected || isSold ? 'grayscale opacity-75' : ''}`}>

            {/* DURUM ETİKETLERİ */}
            {isRejected && (
                <div className="absolute top-0 left-0 right-0 bg-red-600 text-white text-center text-xs font-bold py-1 z-30 shadow-sm">
                    REDDEDİLDİ
                </div>
            )}
            {isPending && (
                <div className="absolute top-0 left-0 right-0 bg-yellow-500 text-black text-center text-xs font-bold py-1 z-30 shadow-sm">
                    ONAY BEKLİYOR
                </div>
            )}
            {isSold && (
                <div className="absolute top-0 left-0 right-0 bg-gray-800 text-white text-center text-xs font-bold py-1 z-30 shadow-sm">
                    SATILDI
                </div>
            )}

            {/* RESİM ALANI */}
            <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <Link href={`/item/${item.id}`} className="block w-full h-full">
                    <Image
                        src={item.image_urls?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500'}
                        alt={item.title || 'İlan'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 25vw, 16vw"
                    />
                </Link>

                {/* Fiyat */}
                <div className={`absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white text-[11px] font-bold px-1.5 py-0.5 rounded pointer-events-none z-20 ${isSold ? 'line-through opacity-70' : ''}`}>
                    {item.price?.toLocaleString('tr-TR')} TL
                </div>

                {/* Favori Butonu (Bağımsız) */}
                <div className="absolute top-1.5 right-1.5 z-20 scale-75">
                    <FavoriteButton itemId={item.id} />
                </div>
            </div>

            {/* BİLGİ ALANI */}
            <Link href={`/item/${item.id}`} className="p-2 flex flex-col flex-1 justify-between">
                <div>
                    <h4 className="text-gray-900 font-medium text-[13px] line-clamp-1 mb-0 z-10 group-hover:text-[#ff3f55] transition-colors">
                        {item.title}
                    </h4>
                    <p className="text-[10px] text-gray-500 truncate">{item.city || 'Konum Yok'}</p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1.5 pt-1.5 border-t border-gray-50">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-2.5 h-2.5" />
                        <span className="truncate max-w-[80px]">{item.city} {item.district ? `/ ${item.district}` : ''}</span>
                    </div>
                    <span>{item.created_at ? new Date(item.created_at).toLocaleDateString('tr-TR') : ''}</span>
                </div>
            </Link>
        </div>
    );
}
