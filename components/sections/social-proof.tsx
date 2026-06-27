"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/language-context";

export function MobileApp() {
    const { t } = useLanguage();
    return (
        <section className="py-24 bg-white overflow-hidden text-black">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="bg-light-gray rounded-lg relative overflow-hidden min-h-[500px] flex items-center">
                    <div className="grid lg:grid-cols-2 gap-12 items-center w-full h-full">
                        <div className="relative z-10 text-black p-12 lg:p-24">
                            <div className="text-primary font-bold mb-4">{t("Mobile Experience (Coming Soon)", "মোবাইল এক্সপেরিয়েন্স (শীঘ্রই আসছে)")}</div>
                            <h2 className="text-3xl lg:text-4xl font-black text-black mb-6">
                                {t("Entire Logistics Company", "আপনার পকেটে")} <br /> {t("in Your Pocket", "পুরো লজিস্টিক কোম্পানি")}
                            </h2>
                            <p className="text-lg text-gray-500 mb-10 max-w-md">
                                {t(
                                    "Truck booking and tracking will now be easier through the Truck Dorkar app. Download today!",
                                    "ট্রাক দরকার অ্যাপের মাধ্যমে এখন ট্রাক বুকিং এবং ট্র্যাকিং হবে আরও সহজ। ডাউনলোড করুন আজই!"
                                )}
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Button size="lg" variant="secondary" className="gap-3 px-6 py-7 rounded-lg border border-gray-100 hover:border-primary transition-all text-black">
                                    <Image src="/icons/playstoreicon.png" alt="Play Store" width={24} height={24} />
                                    <div className="text-left">
                                        <div className="text-[10px] uppercase font-bold text-gray-400 leading-none">Get it on</div>
                                        <div className="text-lg font-black leading-none text-white">Google Play</div>
                                    </div>
                                </Button>
                                <Button size="lg" variant="secondary" className="gap-3 px-6 py-7 rounded-lg border border-gray-100 hover:border-primary transition-all text-black">
                                    <Image src="/icons/App_Store.png" alt="App Store" width={24} height={24} />
                                    <div className="text-left">
                                        <div className="text-[10px] uppercase font-bold text-gray-400 leading-none">Download on</div>
                                        <div className="text-lg font-black leading-none text-white">App Store</div>
                                    </div>
                                </Button>
                            </div>
                        </div>

                        <div className="relative h-full w-full min-h-[500px] rounded-lg">
                            <Image
                                src="/images/appscreen1.png"
                                alt="Truck Dorkar Mobile App"
                                fill
                                className="object-contain rounded-lg"
                                sizes="(max-width: 1024px) 100vw, 50vw"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function Testimonials() {
    const { t } = useLanguage();
    const [isPaused, setIsPaused] = useState(false);

    const reviews = [
        { name: "Sajid Islam", bn: "সাজিদ ইসলাম", comment_en: "The best truck booking service in Bangladesh. Very fast and reliable.", comment_bn: "বাংলাদেশের সেরা ট্রাক বুকিং সার্ভিস। অনেক দ্রুত এবং নির্ভরযোগ্য।" },
        { name: "Rafiqul Islam", bn: "রফিকুল ইসলাম", comment_en: "Low fare and efficient service. Tracking feature is amazing.", comment_bn: "কম ভাড়া এবং দক্ষ সার্ভিস। ট্র্যাকিং ফিচারটি অসাধারণ।" },
        { name: "Sumaiya Akter", bn: "সুমাইয়া আক্তার", comment_en: "Corporate business's best choice. Their drivers are professional.", comment_bn: "কর্পোরেট বিজনেসের জন্য তারা সেরা। তাদের ড্রাইভারা অনেক বেশি প্রফেশনাল এবং দক্ষ।" },
        { name: "Tanvir Ahmed", bn: "তানভীর আহমেদ", comment_en: "Excellent experience for inter-city shifting. Highly recommended.", comment_bn: "আন্তঃশহর স্থানান্তরের জন্য চমৎকার অভিজ্ঞতা। দারুণ সার্ভিস।" },
    ];

    const marqueeReviews = [...reviews, ...reviews, ...reviews];

    return (
        <section className="py-24 bg-white text-black overflow-hidden select-none">
            <div className="container mx-auto px-6 lg:px-12 text-center mb-16">
                <h2 className="text-4xl font-black text-black">{t("What Our Clients Say", "আমাদের গ্রাহকেরা কি বলছেন")}</h2>
            </div>

            <div className="relative flex overflow-hidden">
                {/* Continuous Marquee Container */}
                <motion.div
                    className="flex whitespace-nowrap"
                    initial={{ x: 0 }}
                    animate={{ x: isPaused ? undefined : ["0%", "-50%"] }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 30,
                            ease: "linear",
                        },
                    }}
                >
                    {marqueeReviews.map((rev, index) => (
                        <div
                            key={index}
                            className="inline-block w-[350px] mx-4 whitespace-normal cursor-pointer"
                            onMouseDown={() => setIsPaused(true)}
                            onMouseUp={() => setIsPaused(false)}
                            onTouchStart={() => setIsPaused(true)}
                            onTouchEnd={() => setIsPaused(false)}
                        >
                            <div className="p-10 border border-gray-100 rounded-2xl text-left bg-light-gray/30 hover:bg-white hover:shadow-premium transition-all h-full flex flex-col active:scale-95 duration-200">
                                <div className="flex gap-1 text-primary mb-6">
                                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-gray-600 mb-8 italic leading-relaxed text-black grow pointer-events-none">
                                    &quot;{t(rev.comment_en, rev.comment_bn)}&quot;
                                </p>
                                <div className="pointer-events-none">
                                    <div className="text-black font-black">{t(rev.name, rev.bn)}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>

                {/* Gradient Masks */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            </div>
        </section>
    );
}
