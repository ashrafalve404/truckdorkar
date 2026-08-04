"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { useRouter } from "next/navigation";

export function Hero() {
    const { t, lang } = useLanguage();
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
        <section className="relative flex items-center min-h-[75vh] lg:min-h-screen pt-6 pb-16 lg:pt-8 lg:pb-52 overflow-hidden bg-black">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/heroimage1.webp"
                    alt="Bangladesh Logistics"
                    fill
                    sizes="100vw"
                    className="object-cover lg:object-fill opacity-60"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-black/20 z-10" />
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-20">
                <div className="max-w-3xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        {/* Heading — smaller on mobile */}
                        <h1 className={`font-black text-white leading-[1.15] drop-shadow-2xl mb-4 lg:mb-8 ${lang === "bn" ? "text-2xl sm:text-3xl lg:text-5xl" : "text-3xl sm:text-4xl lg:text-6xl"}`}>
                            {t("Bangladesh's Most", "বাংলাদেশের সবচেয়ে")} <br />
                            <span className="text-primary italic">{t("Reliable", "নির্ভরযোগ্য")}</span> {t("Truck", "ট্রাক")} <br />
                            {t("Booking Platform", "বুকিং প্ল্যাটফর্ম")}
                        </h1>

                        {/* Paragraph — smaller + tighter on mobile */}
                        <p className="text-sm sm:text-base lg:text-xl text-gray-200/90 max-w-2xl mb-7 lg:mb-12 leading-relaxed drop-shadow-lg">
                            {t(
                                "Book trucks anywhere in the country quickly, safely, and affordably. Our skilled drivers will deliver your goods on time.",
                                "দেশের যেকোনো প্রান্তে দ্রুত, নিরাপদ ও সাশ্রয়ী মূল্যে ট্রাক বুকিং করুন। আমাদের দক্ষ ড্রাইভারা আপনার মালামাল সঠিক সময়ে গন্তব্যে পৌঁছে দিবে।"
                            )}
                        </p>

                        {/* Buttons — slimmer on mobile */}
                        <div className="flex flex-wrap gap-3 lg:gap-6 mb-8 lg:mb-16">
                            <Button
                                size="lg"
                                onClick={() => router.push("/bookings/new")}
                                className="rounded-md font-bold px-7 h-12 lg:px-10 lg:h-16 text-base lg:text-lg shadow-2xl hover:translate-y-[-4px] transition-all bg-primary hover:bg-secondary border-none text-white"
                            >
                                {t("Book a Truck", "ট্রাক বুক করুন")}
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                onClick={() => scrollToSection("fleet")}
                                className="rounded-md font-bold px-7 h-12 lg:px-10 lg:h-16 text-base lg:text-lg border-2 border-white text-white hover:bg-white hover:text-black hover:translate-y-[-4px] transition-all"
                            >
                                {t("Find Trucks", "ট্রাক খুঁজুন")}
                                <ArrowRight className="ml-2 w-5 h-5 lg:w-6 lg:h-6" />
                            </Button>
                        </div>

                        {/* Trust badges — compact 2-col on mobile */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 lg:gap-6">
                            {trustBadges.map((badge, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.6 + index * 0.1 }}
                                    className="flex items-center gap-2 text-xs sm:text-sm font-bold text-white/90"
                                >
                                    <div className="w-5 h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                                    </div>
                                    {t(badge.en, badge.bn)}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator — desktop only */}
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