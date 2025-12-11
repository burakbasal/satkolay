'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { FavoriteButton } from './favorite-button';

export function ListingCard({ item }: { item: any }) {
    if (!item || !item.id) return null;

    const isLarge = item.is_large === true;
    const isRejected = item.status === 'rejected';
    const isPending = item.status === 'pending';
    const isSold = item.status === 'sold';

    return (
        <div className={`group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all relative flex flex-col h-full ${isLarge ? 'col-span-2' : 'col-span-1'} ${isRejected || isSold ? 'grayscale opacity-75' : ''}`}>

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

            {/* ÖNE ÇIKAN (FEATURED) ROZETİ */}
            {item.is_featured && !isSold && !isRejected && !isPending && (
                <div className="absolute top-2 left-2 z-30 bg-yellow-400 text-black text-[10px] font-black px-2 py-0.5 rounded shadow-sm flex items-center gap-1 uppercase tracking-wider">
                    ⚡ ÖNE ÇIKAN
                </div>
            )}

            {/* RESİM ALANI */}
            <div className={`relative bg-gray-100 overflow-hidden ${isLarge ? 'aspect-[2/1]' : 'aspect-[4/3]'}`}>
                <Link href={`/item/${item.id}`} className="block w-full h-full">
                    <Image
                        src={item.image_urls?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500'}
                        alt={item.title || 'İlan'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes={isLarge ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"}
                        priority={isLarge}
                    />
                </Link>

                {/* BÜYÜK İLAN ETİKETİ (Sadece Large ise) */}
                {isLarge && (
                    <div className="absolute bottom-3 right-3 z-20 bg-primary text-white text-xs font-bold px-3 py-1 rounded shadow-md">
                        BÜYÜK FIRSAT
                    </div>
                )}

                {/* Fiyat */}
                <div className={`absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-lg font-bold px-2 py-1 rounded pointer-events-none z-20 ${isSold ? 'line-through opacity-70' : ''}`}>
                    {item.price?.toLocaleString('tr-TR')} TL
                </div>

                {/* Favori Butonu (Bağımsız) */}
                <div className="absolute top-2 right-2 z-20">
                    <FavoriteButton itemId={item.id} />
                </div>
            </div>

            {/* BİLGİ ALANI */}
            <Link href={`/item/${item.id}`} className="p-3 flex flex-col flex-1 justify-between">
                <div>
                    <h4 className="text-gray-900 font-medium text-[15px] line-clamp-1 mb-1 group-hover:text-[#001e93] transition-colors">
                        {item.title}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">{item.city || 'Konum Yok'}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mt-2 pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{item.city} {item.district ? `/ ${item.district}` : ''}</span>
                    </div>
                    <span>{item.created_at ? new Date(item.created_at).toLocaleDateString('tr-TR') : ''}</span>
                </div>
            </Link>
        </div>
    );
}
