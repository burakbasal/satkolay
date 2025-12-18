'use client';

import React, { useEffect } from "react";
import Slider from "react-slick";
import { Button } from "@/components/ui/button";
import { TreePine, Shirt, Laptop } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function HeroSlider() {
    // A11y Hack: Remove focus from cloned slides to prevent Focus Trap
    useEffect(() => {
        const fixFocus = () => {
            // Find all cloned slides
            const clones = document.querySelectorAll('.slick-cloned a, .slick-cloned button');
            // Remove them from tab order
            clones.forEach(el => el.setAttribute('tabindex', '-1'));
        };
        // Run after mount and potentially after slide change if needed
        const timer = setTimeout(fixFocus, 500);
        return () => clearTimeout(timer);
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false,
        accessibility: true,
        focusOnSelect: false,
        pauseOnFocus: true
    };

    const slides = [
        {
            id: 1,
            bg: "bg-[#001e93]",
            title: "İkinci Elin Yeni Adresi.",
            desc: "Binlerce liran cebinde kalsın.",
            icon: <TreePine className="w-24 h-24 md:w-48 md:h-48 text-white drop-shadow-md" />,
            buttonText: "Fırsatları Gör",
            buttonLink: "/search?q=yılbaşı",
            badge: "YILBAŞI FIRSATI"
        },
        {
            id: 2,
            bg: "bg-[#E91E63]",
            title: "Sıfırı daha sıcak tutmaz ama SatKolay'dan alırsan cebin yanmaz!",
            desc: "Kışlık giyimde büyük indirimler.",
            icon: <Shirt className="w-24 h-24 md:w-48 md:h-48 text-white drop-shadow-md" />,
            buttonText: "Kışlık Giyim",
            buttonLink: "/search?category=Giyim",
            badge: "TASARRUF ZAMANI"
        },
        {
            id: 3,
            bg: "bg-[#001e93]",
            title: "Sıfır kadar hızlı, çok daha hesaplı!",
            desc: "En yeni teknoloji ürünleri.",
            icon: <Laptop className="w-24 h-24 md:w-48 md:h-48 text-white drop-shadow-md" />,
            buttonText: "Teknolojiyi Keşfet",
            buttonLink: "/search?category=Elektronik",
            badge: "HIZLI & GÜÇLÜ"
        }
    ];

    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 mb-4 mt-2">
            {/* STRICT HEIGHT WRAPPER */}
            <div className="w-full relative h-[180px] md:h-[260px] bg-gray-100 rounded-xl overflow-hidden shadow-sm group">

                {/* KAR EFEKTİ (CSS Animation) */}
                <div className="absolute inset-0 pointer-events-none z-20 opacity-80" aria-hidden="true">
                    <div className="snowflakes">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="snowflake text-white/50 text-xs">●</div>
                        ))}
                    </div>
                </div>

                <Slider {...settings} className="h-full">
                    {slides.map((slide, index) => (
                        <div key={slide.id} className="outline-none h-full" tabIndex={-1}>
                            <div className={`${slide.bg} w-full h-full flex items-center relative overflow-hidden px-4 md:px-12`}>

                                <div className="flex flex-row items-center justify-between w-full h-full relative z-10 gap-4">

                                    {/* Sol: Yazı Alanı */}
                                    <div className="flex-1 text-left text-white z-20 flex flex-col justify-center">
                                        <div className="inline-block px-1.5 py-0.5 bg-white/20 backdrop-blur-sm rounded text-[10px] font-bold mb-1 tracking-wider">
                                            {slide.badge}
                                        </div>
                                        <h2 className="text-lg md:text-2xl font-black mb-1 leading-tight tracking-tight max-w-[200px] md:max-w-none">
                                            {slide.title}
                                        </h2>
                                        <p className="text-white/90 text-xs md:text-sm mb-2 hidden md:block">
                                            {slide.desc}
                                        </p>
                                        <Link href={slide.buttonLink} className="hidden md:inline-block mt-2" tabIndex={0}>
                                            <Button size="sm" className="bg-white text-black hover:bg-gray-100 font-bold rounded-full text-xs px-4">
                                                {slide.buttonText}
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Sağ: İkon Alanı - Strictly Constrained */}
                                    <div className="flex-none flex justify-end animate-bounce-slow relative z-10" aria-hidden="true">
                                        {/* Constraint Wrapper for Icon */}
                                        <div className="w-20 h-20 md:w-32 md:h-32 flex items-center justify-center">
                                            {React.cloneElement(slide.icon as any, { className: "w-full h-full text-white drop-shadow-md" })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

            <style jsx global>{`
                .slick-slider, .slick-list, .slick-track, .slick-slide, .slick-slide > div {
                    height: 100%;
                }
                .slick-dots {
                    bottom: 8px;
                    z-index: 30;
                }
                .slick-dots li button:before {
                    color: white;
                    opacity: 0.5;
                    font-size: 6px;
                }
                .slick-dots li.slick-active button:before {
                    color: white;
                    opacity: 1;
                }
                
                /* Simple Snow Effect */
                .snowflake {
                    position: absolute;
                    top: -10px;
                    animation: fall linear infinite;
                }
                @keyframes fall {
                    to { transform: translateY(300px); }
                }
                ${[...Array(10)].map((_, i) => `
                    .snowflake:nth-child(${i + 1}) {
                        left: ${Math.random() * 100}%;
                        animation-duration: ${Math.random() * 3 + 2}s;
                        animation-delay: ${Math.random() * 5}s;
                    }
                `).join('')}
            `}</style>
        </div>
    );
}
