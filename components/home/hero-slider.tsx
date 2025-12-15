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
            bg: "bg-[#D91E2B]",
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
            bg: "bg-[#2196F3]",
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
            {/* CLS FIX: Fixed Height Container with relative positioning */}
            <div className="w-full relative min-h-[250px] sm:min-h-[350px] md:min-h-[450px] bg-gray-100 rounded-xl overflow-hidden shadow-sm group" role="region" aria-label="Kampanya Slider">

                {/* KAR EFEKTİ (CSS Animation) */}
                <div className="absolute inset-0 pointer-events-none z-20 opacity-80" aria-hidden="true">
                    <div className="snowflakes">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="snowflake text-white/50 text-xs">●</div>
                        ))}
                    </div>
                </div>

                <Slider {...settings}>
                    {slides.map((slide, index) => (
                        <div key={slide.id} className="outline-none" tabIndex={-1}>
                            <div className={`${slide.bg} h-[160px] md:h-[300px] flex items-center relative overflow-hidden px-4 md:px-12`}>

                                <div className="flex flex-row items-center justify-between w-full relative z-10 gap-4">

                                    {/* Sol: Yazı Alanı - LCP Text Optimization is inherently fast with fonts */}
                                    <div className="flex-1 text-left text-white">
                                        <div className="inline-block px-1.5 py-0.5 bg-white/20 backdrop-blur-sm rounded text-[10px] font-bold mb-1 tracking-wider">
                                            {slide.badge}
                                        </div>
                                        <h2 className="text-sm md:text-3xl font-black mb-1 leading-tight tracking-tight max-w-[200px] md:max-w-none">
                                            {slide.title}
                                        </h2>
                                        <Link href={slide.buttonLink} className="hidden md:inline-block mt-4" tabIndex={0}>
                                            <Button size="sm" className="bg-white text-black hover:bg-gray-100 font-bold rounded-full text-xs px-4">
                                                {slide.buttonText}
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Sağ: İkon Alanı */}
                                    <div className="flex-none flex justify-end animate-bounce-slow" aria-hidden="true">
                                        {slide.icon}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

            <style jsx global>{`
                .slick-dots {
                    bottom: 8px;
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
