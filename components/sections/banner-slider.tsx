"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api, { getFileUrl } from "@/lib/api";

interface BannerItem {
    id: string | number;
    image: string;
    titleEn: string;
    titleBn?: string;
}

const fallbackBanners: BannerItem[] = [
    {
        id: 1,
        image: "/images/slidingbanner001.webp",
        titleEn: "Nationwide Logistics",
        titleBn: "দেশব্যাপী লজিস্টিকস",
    },
    {
        id: 2,
        image: "/images/slidingbanner02.webp",
        titleEn: "Become a Driver Partner",
        titleBn: "ড্রাইভার পার্টনার হোন",
    },
    {
        id: 3,
        image: "/images/slidingbanner03.webp",
        titleEn: "Reliable Truck Booking",
        titleBn: "বিশ্বস্ত ট্রাক বুকিং",
    },
];

export function BannerSlider() {
    const [banners, setBanners] = useState<BannerItem[]>(fallbackBanners);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const res = await api.get("/cms/banners");
                const apiBanners = res.data?.data;
                if (Array.isArray(apiBanners) && apiBanners.length > 0) {
                    const mapped = apiBanners.map((b: any) => ({
                        id: b.id,
                        image: getFileUrl(b.imageUrl),
                        titleEn: b.titleEn || "Truck Dorkar",
                        titleBn: b.titleBn || "ট্রাক দরকার",
                    }));
                    setBanners(mapped);
                }
            } catch (error) {
                console.error("Failed to load CMS banners, using fallback", error);
            }
        };
        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [banners.length]);

    const next = () => setCurrent((prev) => (prev + 1) % banners.length);
    const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

    const activeBanner = banners[current] || banners[0];

    return (
        <section className="relative w-full h-[280px] lg:h-[650px] overflow-hidden bg-white pt-24 pb-2 px-4 sm:px-10">
            <div className="relative h-full max-w-[1400px] mx-auto rounded-sm md:rounded-md overflow-hidden shadow-2xl border border-slate-100">
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
                            src={activeBanner.image}
                            alt={activeBanner.titleEn}
                            fill
                            sizes="100vw"
                            className="object-fill"
                            priority
                            unoptimized
                        />
                        {/* Subtle Gradient for depth */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                {banners.length > 1 && (
                    <>
                        <div className="absolute inset-y-0 left-2 sm:left-4 z-20 flex items-center">
                            <button onClick={prev} className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-black/10 sm:bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/30 transition-all border border-white/10 sm:border-white/20">
                                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                            </button>
                        </div>
                        <div className="absolute inset-y-0 right-2 sm:right-4 z-20 flex items-center">
                            <button onClick={next} className="w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-black/10 sm:bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/30 transition-all border border-white/10 sm:border-white/20">
                                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
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
                    </>
                )}
            </div>
        </section>
    );
}
