'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageGalleryProps { images: string[] | null; }

export function ImageGallery({ images }: ImageGalleryProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on('select', onSelect);
    }, [emblaApi, onSelect]);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
    const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

    if (!images || images.length === 0) return <div className="bg-gray-100 rounded-xl aspect-[4/3]"></div>;

    return (
        <>
            <div className="space-y-4">
                {/* SLIDER */}
                <div className="relative group rounded-xl overflow-hidden bg-black border border-gray-200">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex">
                            {images.map((src, idx) => (
                                <div key={idx} className="relative flex-[0_0_100%] aspect-[4/3] cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
                                    <Image src={src} alt="" fill className="object-contain" sizes="(max-width: 768px) 100vw, 800px" priority={idx === 0} />
                                </div>
                            ))}
                        </div>
                    </div>
                    {images.length > 1 && (
                        <>
                            <button onClick={(e) => { e.stopPropagation(); scrollPrev() }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full text-black z-10 hover:bg-white"><ChevronLeft className="w-6 h-6" /></button>
                            <button onClick={(e) => { e.stopPropagation(); scrollNext() }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full text-black z-10 hover:bg-white"><ChevronRight className="w-6 h-6" /></button>
                        </>
                    )}
                    <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1 rounded-full z-10">{selectedIndex + 1} / {images.length}</div>
                </div>

                {/* THUMBS */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {images.map((src, idx) => (
                            <button key={idx} onClick={() => scrollTo(idx)} className={cn("relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all", selectedIndex === idx ? "border-[#ff3f55] opacity-100" : "border-transparent opacity-60 hover:opacity-100")}>
                                <Image src={src} alt="" fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* LIGHTBOX */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center animate-in fade-in duration-200">
                    <button onClick={() => setIsLightboxOpen(false)} className="absolute top-5 right-5 text-white p-2 z-50 bg-white/10 rounded-full"><X className="w-8 h-8" /></button>
                    <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
                        <Image src={images[selectedIndex]} alt="" fill className="object-contain" />
                    </div>
                    {images.length > 1 && (
                        <>
                            <button onClick={scrollPrev} className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-4 bg-white/10 rounded-full hover:bg-white/20"><ChevronLeft className="w-10 h-10" /></button>
                            <button onClick={scrollNext} className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-4 bg-white/10 rounded-full hover:bg-white/20"><ChevronRight className="w-10 h-10" /></button>
                        </>
                    )}
                </div>
            )}
        </>
    );
}