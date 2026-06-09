"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/language-context";

import { useRouter } from "next/navigation";

export function Hero() {
    const { t } = useLanguage();
    const router = useRouter();

    const trustBadges = [
        { en: "Verified Drivers", bn: "ভেরিফাইড ড্রাইভার" },
        { en: "Nationwide Coverage", bn: "দেশব্যাপী সার্ভিস" },
        { en: "24/7 Support", bn: "২৪/৭ সাপোর্ট" },
        { en: "Real-Time Tracking", bn: "রিয়েল-টাইম ট্র্যাকিং" },
    ];

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section className="relative min-h-screen flex items-center py-20 pb-40 lg:pb-52 overflow-hidden bg-black">
            {/* Background Image - Now Still */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/image1.png"
                    alt="Bangladesh Logistics"
                    fill
                    className="object-cover opacity-60"
                    priority
                />
                {/* Global Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-black/20 z-10" />
            </div>

            <div className="w-full pl-8 lg:pl-[12%] pr-6 relative z-20">
                <div className="max-w-4xl text-left">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <h1 className="text-4xl lg:text-6xl font-black text-white leading-[1.1] mb-8 drop-shadow-2xl">
                            {t("Bangladesh's Most", "বাংলাদেশের সবচেয়ে")} <br />
                            <span className="text-primary italic">{t("Reliable", "নির্ভরযোগ্য")}</span> <span className="tracking-wider"> {t("Truck", "ট্রাক")}</span> <br />
                            {t("Booking Platform", "বুকিং প্ল্যাটফর্ম")}
                        </h1>

                        <p className="text-lg lg:text-xl text-gray-200/90 max-w-2xl mb-12 leading-relaxed drop-shadow-lg">
                            {t(
                                "Book trucks anywhere in the country quickly, safely, and affordably. Our skilled drivers will deliver your goods on time.",
                                "দেশের যেকোনো প্রান্তে দ্রুত, নিরাপদ ও সাশ্রয়ী মূল্যে ট্রাক বুকিং করুন। আমাদের দক্ষ ড্রাইভারা আপনার মালামাল সঠিক সময়ে গন্তব্যে পৌঁছে দিবে।"
                            )}
                        </p>

                        <div className="flex flex-wrap gap-6 mb-16">
                            <Button
                                size="lg"
                                onClick={() => router.push("/bookings/new")}
                                className="rounded-md font-bold px-10 h-16 text-lg shadow-2xl hover:translate-y-[-4px] transition-all bg-primary hover:bg-secondary border-none text-white"
                            >
                                {t("Book a Truck", "ট্রাক বুক করুন")}
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => scrollToSection("fleet")}
                                className="rounded-md font-bold px-10 h-16 text-lg border-2 border-white text-white hover:bg-white hover:text-black hover:translate-y-[-4px] transition-all"
                            >
                                {t("Find Trucks", "ট্রাক খুঁজুন")}
                                <ArrowRight className="ml-2 w-6 h-6" />
                            </Button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {trustBadges.map((badge, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className="flex items-center gap-3 text-sm font-bold text-white/90"
                                >
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    </div>
                                    {t(badge.en, badge.bn)}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/30 hidden lg:block"
            >
                <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>
            </motion.div>
        </section>
    );
}