'use client';

import React from "react";
import Slider from "react-slick";
import { Button } from "@/components/ui/button";
import { PiggyBank, Rocket, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function HeroSlider() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        arrows: false
    };

    const slides = [
        {
            id: 1,
            bg: "bg-gradient-to-r from-[#D91E2B] to-[#C1101D]",
            title: "Aynısını SatKolay'dan al, binlerce liran cebinde kalsın!",
            desc: "İhtiyacın olan her şeyin temiz ikinci eli burada.",
            icon: <PiggyBank className="w-32 h-32 md:w-64 md:h-64 text-white drop-shadow-lg" />,
            buttonText: "Fırsatları Gör",
            buttonLink: "/search",
            badge: "BÜYÜK TASARRUF"
        },
        {
            id: 2,
            bg: "bg-gradient-to-r from-blue-600 to-blue-800",
            title: "Sıfır kadar hızlı, çok daha hesaplı!",
            desc: "Oyun konsollarından bilgisayarlara en iyi teknoloji fırsatları.",
            icon: <Rocket className="w-32 h-32 md:w-64 md:h-64 text-white drop-shadow-lg" />,
            buttonText: "Teknolojiyi Keşfet",
            buttonLink: "/search?category=Elektronik",
            badge: "HIZLI & GÜÇLÜ"
        },
        {
            id: 3,
            bg: "bg-gradient-to-r from-green-600 to-green-800",
            title: "Elden al, kartla öde, güvende kal.",
            desc: "Güvenli Ödeme Sistemi ile paran güvende, için rahat olsun.",
            icon: <ShieldCheck className="w-32 h-32 md:w-64 md:h-64 text-white drop-shadow-lg" />,
            buttonText: "Güvenli Alışveriş",
            buttonLink: "/guvenli-odeme",
            badge: "GÜVENLİ ÖDEME"
        }
    ];

    return (
        <div className="w-full max-w-[1280px] mx-auto px-4 mb-8">
            <div className="rounded-2xl overflow-hidden shadow-lg relative">
                <Slider {...settings}>
                    {slides.map((slide) => (
                        <div key={slide.id} className="outline-none">
                            <div className={`${slide.bg} h-[380px] md:h-[350px] flex items-center relative overflow-hidden`}>

                                {/* Dekoratif Arkaplan Efektleri */}
                                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                                <div className="container mx-auto px-8 md:px-16 flex flex-col-reverse md:flex-row items-center justify-between relative z-10 gap-8">

                                    {/* Sol: Yazı Alanı */}
                                    <div className="flex-1 text-center md:text-left text-white">
                                        <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold mb-4 tracking-wider">
                                            {slide.badge}
                                        </div>
                                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-4 leading-tight">
                                            {slide.title}
                                        </h2>
                                        <p className="text-white/90 text-sm md:text-lg mb-6 font-medium max-w-lg mx-auto md:mx-0">
                                            {slide.desc}
                                        </p>
                                        <Link href={slide.buttonLink}>
                                            <Button className="bg-white text-gray-900 hover:bg-gray-100 font-bold px-8 py-6 rounded-full shadow-xl transition-transform hover:scale-105">
                                                {slide.buttonText}
                                            </Button>
                                        </Link>
                                    </div>

                                    {/* Sağ: İkon Alanı */}
                                    <div className="flex-1 flex justify-center md:justify-end animate-float">
                                        {slide.icon}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>

            {/* Custom Styles for Dots */}
            <style jsx global>{`
                .slick-dots {
                    bottom: 15px;
                }
                .slick-dots li button:before {
                    color: white;
                    opacity: 0.5;
                    font-size: 10px;
                }
                .slick-dots li.slick-active button:before {
                    color: white;
                    opacity: 1;
                }
            `}</style>
        </div>
    );
}
