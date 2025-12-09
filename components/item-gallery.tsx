'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { toggleFavoriteAction } from '@/app/actions';

interface ItemGalleryProps {
    images: string[];
    title: string;
    isFavorite: boolean;
    itemId: string;
    isOwner: boolean;
}

export function ItemGallery({ images, title, isFavorite, itemId, isOwner }: ItemGalleryProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isFav, setIsFav] = useState(isFavorite);

    const handlePrev = () => {
        setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    const handleFavorite = async () => {
        if (isOwner) return;
        // Optimistic update
        setIsFav(!isFav);
        await toggleFavoriteAction(itemId, !isFav);
    };

    const displayImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80'];

    return (
        <div className="flex flex-col">
            {/* Main Image */}
            <div className="relative aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden group">
                <Image
                    src={displayImages[selectedImageIndex]}
                    alt={`${title} - Görsel ${selectedImageIndex + 1}`}
                    fill
                    className="object-contain"
                    priority
                />

                {/* Navigation Arrows */}
                {displayImages.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight className="w-6 h-6 text-gray-800" />
                        </button>
                    </>
                )}

                {/* Favorite Button */}
                {!isOwner && (
                    <button
                        onClick={handleFavorite}
                        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:scale-105 transition-transform"
                    >
                        <Heart className={`w-6 h-6 ${isFav ? 'fill-[#ff3f55] text-[#ff3f55]' : 'text-gray-400'}`} />
                    </button>
                )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto bg-white border-t border-gray-100">
                    {displayImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedImageIndex(idx)}
                            className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === idx ? 'border-[#ff3f55] opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
