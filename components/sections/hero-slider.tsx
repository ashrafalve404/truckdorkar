"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const heroImages = [
    "/images/image1.png",
    "/images/image2.png"
];

export function HeroSlider() {
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroImages.length);
        }, 4600);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="w-full bg-black">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                <div className="relative h-[180px] sm:h-[280px] md:h-[380px] lg:h-[480px] rounded-lg md:rounded-xl overflow-hidden">
                    {/* Background Image Slider */}
                    <div className="absolute inset-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentImage}
                                initial={{ x: "100%", opacity: 0 }}
                                animate={{ x: 0, opacity: 0.6 }}
                                exit={{ x: "-100%", opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                className="absolute inset-0"
                            >
                                <Image
                                    src={heroImages[currentImage]}
                                    alt={`Banner ${currentImage + 1}`}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </motion.div>
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-black/20 z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}