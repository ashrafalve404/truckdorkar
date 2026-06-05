"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { motion } from "framer-motion";
import { ShieldCheck, Users, Target, Rocket } from "lucide-react";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";

export default function AboutPage() {
    const { t } = useLanguage();

    const values = [
        {
            title: "Safety First",
            bn: "নিরাপত্তা সবার আগে",
            desc_en: "We ensure maximum safety of goods on every trip.",
            desc_bn: "আমরা প্রতিটি ট্রিপে মালামালের সর্বোচ্চ নিরাপত্তা নিশ্চিত করি।",
            icon: ShieldCheck
        },
        {
            title: "Customer Trust",
            bn: "গ্রাহকের আস্থা",
            desc_en: "The trust of thousands of customers is our core strength.",
            desc_bn: "হাজারো গ্রাহকের আস্থাই আমাদের এগিয়ে চলার মূল শক্তি।",
            icon: Users
        },
        {
            title: "Our Mission",
            bn: "আমাদের লক্ষ্য",
            desc_en: "To digitize and make the logistics sector of Bangladesh affordable.",
            desc_bn: "বাংলাদেশের লজিস্টিক সেক্টরকে ডিজিটালাইজ করা এবং সাশ্রয়ী করা।",
            icon: Target
        },
        {
            title: "Innovation",
            bn: "উদ্ভাবন",
            desc_en: "Providing modern solutions to transport problems through technology.",
            desc_bn: "প্রযুক্তির মাধ্যমে পরিবহন সমস্যার আধুনিক সমাধান প্রদান।",
            icon: Rocket
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-24 md:pt-32">
                {/* Hero section */}
                <section className="py-16 md:py-20 bg-light-gray">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-12 text-center text-black">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-2xl md:text-3xl lg:text-5xl font-black text-black mb-6 md:mb-8">
                                {t("About Us", "আমাদের সম্পর্কে জানুন")}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
                                {t(
                                    "TruckDorkar is working to revolutionize the logistics sector in Bangladesh. We are making product transportation easier and safer through the combination of technology and humanity.",
                                    "ট্রাক দরকার বাংলাদেশের লজিস্টিক সেক্টরে বিপ্লব আনার জন্য কাজ করছে। আমরা প্রযুক্তি এবং মানবতার সমন্বয়ে পণ্য পরিবহনকে করছি আরও সহজ ও নিরাপদ।"
                                )}
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-12 text-black">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-black mb-6 md:mb-8">
                                    {t("Reliable Partner for Logistics", "বাংলাদেশের লজিস্টিক সার্ভিসের নির্ভরযোগ্য পার্টনার")}
                                </h2>
                                <div className="space-y-4 md:space-y-6 text-base md:text-lg text-gray-600 leading-relaxed">
                                    <p>
                                        {t(
                                            "TruckDorkar is a modern digital platform that directly connects shippers and truck owners. Our goal is to reduce transportation costs and ensure transparency in Bangladesh.",
                                            "ট্রাক দরকার একটি আধুনিক ডিজিটাল প্ল্যাটফর্ম যা সরাসরি মালামাল পরিবহনকারী এবং ট্রাক মালিকদের মধ্যে সংযোগ স্থাপন করে। আমাদের লক্ষ্য বাংলাদেশে পণ্য পরিবহনের খরচ কমানো এবং স্বচ্ছতা নিশ্চিত করা।"
                                        )}
                                    </p>
                                    <p>
                                        {t(
                                            "We believe every business's success requires efficient logistics support. Therefore, we guarantee on-time delivery of your goods anywhere in the country.",
                                            "আমরা বিশ্বাস করি প্রতিটি ব্যবসার সাফল্যের পেছনে দক্ষ লজিস্টিক সাপোর্ট থাকা প্রয়োজন। তাই আমরা দেশব্যাপী বিস্তৃত নেটওয়ার্ক এবং দক্ষ ড্রাইভারদের মাধ্যমে আপনার যেকোনো মালামাল সঠিক সময়ে গন্তব্যে পৌঁছানোর নিশ্চয়তা দেই।"
                                        )}
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="relative h-[300px] sm:h-[350px] md:h-[400px] rounded-2xl md:rounded-3xl overflow-hidden shadow-premium"
                            >
                                <Image
                                    src="/images/image1.png"
                                    alt="TruckDorkar Team"
                                    fill
                                    className="object-cover"
                                />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-16 md:py-24 bg-dark-gray text-white">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                        <div className="text-center mb-12 md:mb-16">
                            <h2 className="text-xl md:text-2xl lg:text-3xl font-black mb-3 md:mb-4">{t("Our Core Values", "আমাদের মূল মূল্যবোধ")}</h2>
                            <div className="w-16 md:w-20 h-1 bg-primary mx-auto"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                            {values.map((v, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="p-6 md:p-8 bg-black border border-white/5 rounded-2xl hover:border-primary/50 transition-all text-center"
                                >
                                    <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                                        <v.icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">{t(v.title, v.bn)}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{t(v.desc_en, v.desc_bn)}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
