"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Banner {
    id: number;
    image: string;
    titleEn: string;
    titleBn: string;
    subtitleEn: string;
    subtitleBn: string;
    ctaEn: string;
    ctaBn: string;
    color: string;
}

const banners: Banner[] = [
    {
        id: 1,
        image: "/images/image1.png",
        titleEn: "Nationwide Logistics",
        titleBn: "দেশব্যাপী লজিস্টিকস",
        subtitleEn: "Moving goods across Bangladesh with safety and speed.",
        subtitleBn: "নিরাপদ ও দ্রুত গতিতে পণ্য পৌঁছান দেশজুড়ে।",
        ctaEn: "Learn More",
        ctaBn: "আরও জানুন",
        color: "from-red-600 to-red-800",
    },
    {
        id: 2,
        image: "/images/image2.png",
        titleEn: "Become a Driver Partner",
        titleBn: "ড্রাইভার পার্টনার হোন",
        subtitleEn: "Join our fleet and start earning daily with TruckDorkar.",
        subtitleBn: "আমাদের সাথে যোগ দিন এবং প্রতিদিন আয় শুরু করুন।",
        ctaEn: "Join Now",
        ctaBn: "এখনই যোগ দিন",
        color: "from-slate-800 to-black",
    },
    {
        id: 3,
        image: "/images/image1.png",
        titleEn: "Enterprise Solutions",
        titleBn: "এন্টারপ্রাইজ সমাধান",
        subtitleEn: "Reliable logistics solutions for businesses of all sizes.",
        subtitleBn: "সব ধরণের ব্যবসার জন্য নির্ভরযোগ্য লজিস্টিক সমাধান।",
        ctaEn: "Get a Quote",
        ctaBn: "কোটেশন পান",
        color: "from-blue-700 to-blue-900",
    },
];

export function BannerSlider() {
    const { t, lang } = useLanguage();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    const next = () => setCurrent((prev) => (prev + 1) % banners.length);
    const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

    return (
        <section className="relative w-full h-[500px] lg:h-[700px] overflow-hidden bg-white pt-24 pb-8 px-6">
            <div className="relative h-full max-w-7xl mx-auto rounded-xl overflow-hidden shadow-2xl border border-slate-100">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-100%", opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        {/* Image Only - No Text Overlays */}
                        <Image
                            src={banners[current].image}
                            alt={banners[current].titleEn}
                            fill
                            className="object-cover"
                            priority
                        />
                        {/* Subtle Gradient for depth but no heavy overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="absolute inset-y-0 left-4 z-20 flex items-center">
                    <button onClick={prev} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-all border border-white/20">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                </div>
                <div className="absolute inset-y-0 right-4 z-20 flex items-center">
                    <button onClick={next} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-all border border-white/20">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Pagination Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {banners.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-1.5 rounded-full transition-all ${current === idx ? "w-8 bg-white" : "w-2 bg-white/40"}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
