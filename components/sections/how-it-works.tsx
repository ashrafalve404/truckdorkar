"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, ClipboardCheck, Truck, ThumbsUp } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const steps = [
    { title_en: "Find Truck", title_bn: "ট্রাক খুঁজুন", icon: Search, desc_en: "Enter your pickup and drop location to find available trucks.", desc_bn: "আপনার পিকআপ এবং ড্রপ লোকেশন দিয়ে উপযুক্ত ট্রাক খুঁজুন।" },
    { title_en: "Compare Quotes", title_bn: "ভাড়া যাচাই করুন", icon: ClipboardCheck, desc_en: "Get instant price quotes and compare for the best deal.", desc_bn: "ইনস্ট্যান্ট ভাড়ার কোটেশন পান এবং আপনার জন্য সেরাটি বেছে নিন।" },
    { title_en: "Book & Track", title_bn: "বুক ও ট্র্যাক", icon: Truck, desc_en: "Book your truck and track your shipment in real-time.", desc_bn: "সহজেই ট্রাক বুক করুন এবং রিয়েল-টাইমে মালামাল ট্র্যাক করুন।" },
    { title_en: "Safe Delivery", title_bn: "নিরাপদ ডেলিভারি", icon: ThumbsUp, desc_en: "Receive your goods safely and confirm completion.", desc_bn: "নিরাপদ ডেলিভারি বুঝে নিন এবং আপনার ট্রিপ সম্পন্ন করুন।" },
];

export function HowItWorks() {
    const { t } = useLanguage();
    return (
        <section id="how-it-works" className="py-24 bg-white text-black relative">
            <div className="container mx-auto px-6 lg:px-12 relative z-10">
                <div className="flex flex-col items-center text-center mb-20">
                    <div className="text-primary font-bold uppercase tracking-[0.2em] mb-4">{t("Simple Process", "সহজ প্রক্রিয়া")}</div>
                    <h2 className="text-4xl lg:text-5xl font-black text-black mb-6">
                        {t("How Truck Dorkar Works", "কিভাবে কাজ করে ট্রাক দরকার")}
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
                    {/* Connection lines for desktop */}
                    <div className="hidden lg:block absolute top-1/4 left-1/4 right-1/4 h-[2px] bg-gray-100 -z-10" />

                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className="w-24 h-24 bg-light-gray rounded-3xl flex items-center justify-center mb-8 group-hover:bg-primary transition-all duration-500 relative">
                                <step.icon className="w-10 h-10 text-primary group-hover:text-white transition-colors" />
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm">
                                    0{index + 1}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-black mb-4">{t(step.title_en, step.title_bn)}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">
                                {t(step.desc_en, step.desc_bn)}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Bottom Graphic */}
            <div className="container mx-auto px-6 lg:px-12 mt-10 md:mt-20">
                <div className="w-full h-auto overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                    <img
                        src="/images/howitworksimage.png"
                        alt="How Truck Dorkar Works Graphic"
                        className="w-full h-auto block"
                    />
                </div>
            </div>
        </section>
    );
}
