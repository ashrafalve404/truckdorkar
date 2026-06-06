"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck, Truck } from "lucide-react";
import { useLanguage } from "@/context/language-context";

const trucks = [
    { title: "7 Feet Truck", bn: "৭ ফিট ট্রাক", capacity: "1.5 Tons", cap_bn: "১.৫ টন", icon: "/images/7feet truck.png" },
    { title: "12 Feet Truck", bn: "১২ ফিট ট্রাক", capacity: "3.5 Tons", cap_bn: "৩.৫ টন", icon: "/images/12feet truck.png" },
    { title: "18 Feet Truck", bn: "১৮ ফিট ট্রাক", capacity: "7 Tons", cap_bn: "৭ টন", icon: "/images/18feettruck.png" },
    { title: "Trailer Truck", bn: "ট্রেইলার ট্রাক", capacity: "20 Tons", cap_bn: "২০ টন", icon: "/images/trailer truck.png" },
];

export function Fleet() {
    const { t } = useLanguage();
    return (
        <section id="fleet" className="py-24 bg-white text-black">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="text-black">
                        <div className="text-primary font-bold uppercase tracking-[0.2em] mb-4">{t("Our Fleet", "আমাদের ফ্লিট")}</div>
                        <h2 className="text-4xl lg:text-5xl font-black text-black">
                            {t("Modern Logistics", "যেকোনো মালামালের জন্য")} <br /> {t("Fleet", "সঠিক ট্রাক")}
                        </h2>
                    </div>
                    <p className="text-gray-500 max-w-md text-black">
                        {t(
                            "Choose from our wide range of verified vehicles that suit your specific business or personal transportation needs.",
                            "আপনার ব্যবসা বা ব্যক্তিগত প্রয়োজনে আমাদের ভেরিফাইড ট্রাকগুলোর মধ্য থেকে সঠিকটি বেছে নিন।"
                        )}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {trucks.map((truck, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group bg-light-gray rounded-3xl overflow-hidden hover:shadow-premium transition-all duration-500"
                        >
                            <div className="p-8 aspect-square relative bg-white m-4 rounded-2xl overflow-hidden">
                                <Image
                                    src={truck.icon}
                                    alt={truck.title}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    loading={index === 0 ? "eager" : "lazy"}
                                    className="object-contain group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 right-4 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    {t("Verified", "ভেরিফাইড")}
                                </div>
                            </div>
                            <div className="p-8 pt-4">
                                <h3 className="text-xl font-bold text-black mb-2">{t(truck.title, truck.bn)}</h3>
                                <div className="flex items-center gap-3 text-gray-500 font-medium">
                                    <Truck className="w-4 h-4 text-primary" />
                                    {t("Capacity:", "ধারণক্ষমতা:")} {t(truck.capacity, truck.cap_bn)}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
