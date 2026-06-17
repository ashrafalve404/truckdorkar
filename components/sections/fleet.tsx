"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Truck } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const trucks = [
    { title_en: "1 Ton Open 7Ft Truck", title_bn: "১ টন খোলা ৭ফিট ট্রাক", icon: "/images/1ton7feet.png", value: "T1_OPEN_7FT" },
    { title_en: "1 Ton Cover 7Ft Truck", title_bn: "১ টন কাভার ৭ফিট ট্রাক", icon: "/images/7feet_coveredvan.png", value: "T1_COVER_7FT" },
    { title_en: "1.5 Ton Open 9Ft Truck", title_bn: "১.৫ টন খোলা ৯ফিট ট্রাক", icon: "/images/9feet truck.png", value: "T1_5_OPEN_9FT" },
    { title_en: "1.5 Ton Cover 9Ft Truck", title_bn: "১.৫ টন কাভার ৯ফিট ট্রাক", icon: "/images/9feetcoveredtruck.png", value: "T1_5_COVER_9FT" },
    { title_en: "2 Ton Open 9Ft Truck", title_bn: "২ টন খোলা ৯ফিট ট্রাক", icon: "/images/2ton9feet.png", value: "T2_OPEN_9FT" },
    { title_en: "3 Ton Open 12Ft Truck", title_bn: "৩ টন খোলা ১২ফিট ট্রাক", icon: "/images/3ton12feet.png", value: "T3_OPEN_12FT" },
    { title_en: "3 Ton Cover 12Ft Truck", title_bn: "৩ টন কাভার ১২ফিট ট্রাক", icon: "/images/12feetcoveredtruck.png", value: "T3_COVER_12FT" },
    { title_en: "5 Ton Open 17Ft Truck", title_bn: "৫ টন খোলা ১৭ফিট ট্রাক", icon: "/images/5tonopentruck.png", value: "T5_OPEN_17FT" },
];

export function Fleet() {
    const { t } = useLanguage();
    const router = useRouter();
    return (
        <section id="fleet" className="py-24 bg-white text-black">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="text-black">
                        <div className="text-primary font-bold uppercase tracking-[0.2em] mb-4">{t("Truck Types", "ট্রাক এর ধরণ")}</div>
                        <h2 className="text-4xl lg:text-5xl font-black text-black">
                            {t("Modern Logistics", "যেকোনো মালামালের জন্য")} <br /> {t("Trucks", "সঠিক ট্রাক")}
                        </h2>
                    </div>
                    <p className="text-gray-500 max-w-md text-black">
                        {t(
                            "Choose from our wide range of verified vehicles that suit your specific business or personal transportation needs.",
                            "আপনার ব্যবসা বা ব্যক্তিগত প্রয়োজনে আমাদের ভেরিফাইড ট্রাকগুলোর মধ্য থেকে সঠিকটি বেছে নিন।"
                        )}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {trucks.map((truck, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group bg-light-gray rounded-lg md:rounded-xl overflow-hidden hover:shadow-premium transition-all duration-500"
                        >
                            <div className="relative bg-white m-2 md:m-4 rounded-md md:rounded-lg overflow-hidden aspect-square">
                                <Image
                                    src={truck.icon}
                                    alt={t(truck.title_en, truck.title_bn)}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    loading={index === 0 ? "eager" : "lazy"}
                                    className="object-contain group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="p-4 md:p-6 pt-2 md:pt-4 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
<span className="flex items-center gap-1 text-[8px] md:text-[10px] font-semibold text-primary bg-primary/10 px-1 md:px-1.5 py-0 rounded-sm">
                                            <ShieldCheck className="w-2.5 h-2.5" />
                                            {t("Verified", "ভেরিফাইড")}
                                        </span>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            onClick={() => {
                                                const params = new URLSearchParams({ truckType: truck.value });
                                                router.push(`/bookings/new?${params.toString()}`);
                                            }}
                                            className="h-5 md:h-6 text-[7px] md:text-[9px] font-bold uppercase tracking-wider px-1.5 md:px-2 rounded-sm shadow-sm bg-black hover:bg-primary text-white border-none transition-colors"
                                        >
                                            {t("Book Now", "বুক করুন")}
                                        </Button>
                                </div>
                                <h3 className="text-sm md:text-lg font-bold text-black leading-tight">{t(truck.title_en, truck.title_bn)}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
