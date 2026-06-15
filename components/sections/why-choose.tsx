"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, CreditCard, Map, Headphones, Clock } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const features = [
    { title_en: "Real-Time Tracking", title_bn: "রিয়েল-টাইম ট্র্যাকিং", icon: Map, desc_en: "See where your goods are at any moment with GPS tracking.", desc_bn: "জিপিএস ট্র্যাকিংয়ের মাধ্যমে যেকোনো মুহূর্তে আপনার মালামাল কোথায় আছে তা দেখুন।" },
    { title_en: "Verified Drivers", title_bn: "ভেরিফাইড ড্রাইভার", icon: ShieldCheck, desc_en: "All our drivers go through rigorous background checks.", desc_bn: "আমাদের সকল চালক কঠোর ব্যাকগ্রাউন্ড চেক এবং যাচাইকরণের মাধ্যমে নিযুক্ত হন।" },
    { title_en: "Secure Payments", title_bn: "নিরাপদ পেমেন্ট", icon: CreditCard, desc_en: "Transparent pricing and secure digital payment options.", desc_bn: "স্বচ্ছ মূল্য নির্ধারণ এবং নিরাপদ ডিজিটাল পেমেন্ট সুবিধা।" },
    { title_en: "Nationwide Service", title_bn: "দেশব্যাপী সার্ভিস", icon: Zap, desc_en: "We cover all 64 districts of Bangladesh with efficiency.", desc_bn: "আমরা দক্ষতার সাথে বাংলাদেশের ৬৪টি জেলাই কভার করি।" },
    { title_en: "Dedicated Support", title_bn: "ডেডিকেটেড সাপোর্ট", icon: Headphones, desc_en: "Our support team is available 24/7 to help you.", desc_bn: "আপনাকে সাহায্য করার জন্য আমাদের সাপোর্ট টিম ২৪/৭ প্রস্তুত।" },
    { title_en: "Instant Quotations", title_bn: "ইনস্ট্যান্ট কোটেশন", icon: Clock, desc_en: "Get accurate price quotes within seconds on our app.", desc_bn: "আমাদের অ্যাপে কয়েক সেকেন্ডের মধ্যে সঠিক ভাড়ার ধারণা পান।" },
];

export function WhyChoose() {
    const { t } = useLanguage();

    return (
        <section className="py-24 bg-dark-gray text-white">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="text-primary font-bold uppercase tracking-[0.2em] mb-4">{t("Why Truck Dorkar", "কেন ট্রাক দরকার")}</div>
                    <h2 className="text-4xl lg:text-5xl font-black mb-6">
                        {t("Why Choose Us?", "কেন আমাদের পছন্দ করবেন?")}
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 bg-black border border-white/5 hover:border-primary/50 transition-colors rounded-md"
                        >
                            <feature.icon className="w-10 h-10 text-primary mb-6" />
                            <h3 className="text-xl font-bold mb-2">{t(feature.title_en, feature.title_bn)}</h3>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-tighter mb-4">
                                {t(feature.title_en, feature.title_bn)}
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">{t(feature.desc_en, feature.desc_bn)}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
