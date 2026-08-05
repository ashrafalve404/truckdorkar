"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

interface TruckFareInfo {
    id: string;
    nameEn: string;
    nameBn: string;
    minFare10km: number;
    capacityTon?: number;
    lengthFt?: number;
    isActive?: boolean;
}

export function Fleet() {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const [fleetTrucks, setFleetTrucks] = useState<TruckFareInfo[]>([]);

    useEffect(() => {
        const loadFleet = async () => {
            try {
                const response = await api.get("/cms/content/SYSTEM_SETTINGS");
                const meta = response.data?.data?.metaJson || {};
                const list = meta.truckFares;
                if (Array.isArray(list) && list.length > 0) {
                    // Filter active ones
                    const activeTrucks = list.filter((truck: any) => truck.isActive !== false);
                    setFleetTrucks(activeTrucks);
                }
            } catch (err) {
                console.error("Failed to load settings:", err);
            }
        };
        loadFleet();
    }, []);

    const fallbacks: TruckFareInfo[] = [
        { id: "T1_OPEN_7FT", nameEn: "1 Ton Open 7 Ft Truck", nameBn: "১ টন খোলা ৭ ফিট ট্রাক", minFare10km: 1000 },
        { id: "T1_COVER_7FT", nameEn: "1 Ton Cover 7 Ft Truck", nameBn: "১ টন কাভার ৭ ফিট ট্রাক", minFare10km: 1000 },
        { id: "T1_OPEN_9FT", nameEn: "1 Ton Open 9 Ft Truck", nameBn: "১ টন খোলা ৯ ফিট ট্রাক", minFare10km: 1200 },
        { id: "T1_COVER_9FT", nameEn: "1 Ton Cover 9 Ft Truck", nameBn: "১ টন কাভার ৯ ফিট ট্রাক", minFare10km: 1200 },
        { id: "T1_5_OPEN_12FT", nameEn: "1.5 Ton Open 12 Ft Truck", nameBn: "১.৫ টন খোলা ১২ ফিট ট্রাক", minFare10km: 1500 },
        { id: "T1_5_COVER_12FT", nameEn: "1.5 Ton Cover 12 Ft Truck", nameBn: "১.৫ টন কাভার ১২ ফিট ট্রাক", minFare10km: 1500 },
    ];

    const displayTrucks = fleetTrucks.length > 0 ? fleetTrucks : fallbacks;

    const getTruckImage = (id: string, name: string) => {
        // Standard matches
        if (id === "T1_OPEN_7FT" || id === "T1_OPEN_7_9FT") return "/images/1ton7feetopen.webp";
        if (id === "T1_COVER_7FT" || id === "T1_COVER_7_9FT") return "/images/1ton7feetcover.webp";
        if (id === "T1_OPEN_9FT" || id === "T1_5_OPEN_10_12FT") return "/images/1ton9feetopen.webp";
        if (id === "T1_COVER_9FT" || id === "T1_5_COVER_10_12FT") return "/images/9feetcoveredtruck.png";
        if (id === "T1_5_OPEN_12FT" || id === "T3_OPEN_16_14FT") return "/images/3ton12feet.png";
        if (id === "T1_5_COVER_12FT" || id === "T3_COVER_16_14FT") return "/images/12feetcoveredtruck.png";

        // Dynamic matches
        const idLower = id.toLowerCase();
        const nameLower = name.toLowerCase();

        const isOpen = idLower.includes("open") || nameLower.includes("open") || nameLower.includes("খোলা");
        const isCover = idLower.includes("cover") || idLower.includes("covered") || nameLower.includes("cover") || nameLower.includes("কাভার");

        if (isOpen) return "/images/3ton12feet.png";
        if (isCover) return "/images/12feetcoveredtruck.png";

        // Default fallback
        return "/images/3ton12feet.png";
    };

    return (
        <section id="fleet" className="py-24 bg-white text-black">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="text-black">
                        <div className="text-primary font-bold mb-4">{t("Truck Types", "ট্রাক এর ধরণ")}</div>
                        <h2 className={`font-black text-black ${lang === "bn" ? "text-3xl lg:text-4xl" : "text-4xl lg:text-5xl"}`}>
                            {t("Modern Logistics", "যেকোনো মালামালের জন্য")} <br /> {t("Trucks", "সঠিক ট্রাক")}
                        </h2>
                    </div>
                    <p className="text-gray-500 max-w-md text-black">
                        {t(
                            "Choose from our wide range of verified vehicles that suit your specific business or personal transportation needs.",
                            "আপনার ব্যবসা বা ব্যক্তিগত প্রয়োজনে আমাদের ভেরিফাইড ট্রাকগুলোর মধ্য থেকে সঠিকটি বেছে নিন।"
                        )}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                    {displayTrucks.map((truck, index) => (
                        <motion.div
                            key={truck.id}
                            initial={false}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="group bg-light-gray rounded-lg md:rounded-xl overflow-hidden transition-all duration-500 hover:shadow-premium"
                        >
                            <div className="relative bg-white m-2 md:m-4 rounded-md md:rounded-lg overflow-hidden aspect-square">
                                <Image
                                    src={getTruckImage(truck.id, truck.nameEn)}
                                    alt={t(truck.nameEn, truck.nameBn)}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    loading={index === 0 ? "eager" : "lazy"}
                                    className="object-contain transition-transform duration-700 group-hover:scale-110"
                                />
                                <span className="absolute top-2 left-2 z-10 flex items-center gap-1 text-[8px] md:text-[10px] font-bold text-primary bg-primary/10 backdrop-blur-md border border-primary/20 px-1.5 py-0.5 rounded-md shadow-xs">
                                    <ShieldCheck className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                    {t("Verified", "ভেরিফাইড")}
                                </span>
                            </div>
                            <div className="p-4 md:p-6 pt-2 md:pt-4 flex flex-col gap-3">
                                <div className="flex items-center justify-end">
                                    <Button
                                        variant="default"
                                        onClick={() => {
                                            const params = new URLSearchParams({ truckType: truck.id });
                                            router.push(`/bookings/new?${params.toString()}`);
                                        }}
                                        className="h-6 md:h-9 text-[9px] md:text-sm font-bold md:font-black px-2.5 md:px-4 rounded-sm md:rounded-md shadow-sm md:shadow-md bg-black hover:bg-primary text-white border-none transition-all active:scale-95 shrink-0"
                                    >
                                        {t("Book Now", "বুক করুন")}
                                    </Button>
                                </div>
                                <h3 className="text-sm md:text-lg font-bold text-black leading-tight min-h-[40px] flex items-center">
                                    {t(truck.nameEn, truck.nameBn)}
                                </h3>
                                <div className="flex justify-between items-center border-t border-slate-100 pt-2 mt-1">
                                    <span className="text-[9px] text-gray-400 font-bold uppercase">{t("Min. Fare (10km)", "ন্যূনতম ভাড়া (১০কিমি)")}</span>
                                    <span className="text-xs md:text-sm font-black text-primary">৳ {truck.minFare10km}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
