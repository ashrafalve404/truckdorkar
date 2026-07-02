"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { motion } from "framer-motion";
import { ShieldCheck, Users } from "lucide-react";
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
            icon: "/icons/productsafety.png"
        },
        {
            title: "Customer Trust",
            bn: "গ্রাহকের আস্থা",
            desc_en: "The trust of thousands of customers is our core strength.",
            desc_bn: "হাজারো গ্রাহকের আস্থাই আমাদের এগিয়ে চলার মূল শক্তি।",
            icon: "/icons/trust.png"
        },
        {
            title: "Our Mission",
            bn: "আমাদের লক্ষ্য",
            desc_en: "To digitize and make the logistics sector of Bangladesh affordable.",
            desc_bn: "বাংলাদেশের লজিস্টিক সেক্টরকে ডিজিটালাইজ করা এবং সাশ্রয়ী করা।",
            icon: "/icons/ourmission.png"
        },
        {
            title: "Innovation",
            bn: "উদ্ভাবন",
            desc_en: "Providing modern solutions to transport problems through technology.",
            desc_bn: "প্রযুক্তির মাধ্যমে পরিবহন সমস্যার আধুনিক সমাধান প্রদান।",
            icon: "/icons/innovation.png"
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-24 md:pt-32">
                {/* Hero section */}
                <section
                    className="relative py-24 md:py-40 bg-cover bg-center overflow-hidden"
                    style={{ backgroundImage: "url('/images/corporate.png')" }}
                >
                    <div className="absolute inset-0 bg-white/70" />

                    <div className="container mx-auto px-4 sm:px-6 lg:px-12 text-center text-black relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-black mb-6 md:mb-8">
                                {t("About Us", "আমাদের সম্পর্কে জানুন")}
                            </h1>
                            <p className="text-lg md:text-xl text-black font-bold max-w-4xl mx-auto leading-relaxed">
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
                                            "আমরা বিশ্বাস করি প্রতিটি ব্যবসার সাফল্যের পেছনে দক্ষ লজিসিক সাপোর্ট থাকা প্রয়োজন। তাই আমরা দেশব্যাপী বিস্তৃত নেটওয়ার্ক এবং দক্ষ ড্রাইভারদের মাধ্যমে আপনার যেকোনো মালামাল সঠিক সময়ে গন্তব্যে পৌঁছানোর নিশ্চয়তা দেই।"
                                        )}
                                    </p>
                                </div>
                            </motion.div>

                            <div className="w-full overflow-hidden">
                                <img
                                    src="/images/footerimagebanner.png"
                                    alt="TruckDorkar"
                                    className="w-full h-auto object-contain"
                                    style={{ maxHeight: '300px' }}
                                />
                            </div>
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
                                    className="p-6 md:p-8 bg-black border border-white/5 hover:border-primary/50 transition-all text-center rounded-md"
                                >
                                    <Image src={v.icon} alt={v.title} width={48} height={48} className="w-12 h-12 object-contain mx-auto mb-4 md:mb-6" />
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
