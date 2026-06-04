"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Truck, Calendar, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export function BookingWidget() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState("inter-city");

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-5xl mx-auto mt-12 lg:-mt-32 relative z-30 px-4 lg:px-0"
        >
            <div className="bg-white rounded-lg shadow-premium p-4 lg:p-8 border border-gray-100">
                {/* Tabs */}
                <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                    {["Inter-City", "Intra-City", "Specialized"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`px-8 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.toLowerCase()
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                                }`}
                        >
                            {t(tab, tab === "Inter-City" ? "ইন্টার-সিটি" : tab === "Intra-City" ? "ইন্ট্রা-সিটি" : "স্পেশালাইজড")}
                        </button>
                    ))}
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-primary" />
                            {t("Pickup Location", "পিকআপ লোকেশন")}
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t("From where?", "কোথা থেকে?")}
                                className="w-full h-14 bg-gray-50 border-none rounded-lg px-6 text-black font-semibold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-secondary" />
                            {t("Drop Location", "ড্রপ লোকেশন")}
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t("To where?", "কোথায়?")}
                                className="w-full h-14 bg-gray-50 border-none rounded-lg px-6 text-black font-semibold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-400"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <Truck className="w-3 h-3 text-primary" />
                            {t("Truck Type", "ট্রাকের ধরণ")}
                        </label>
                        <select className="w-full h-14 bg-gray-50 border-none rounded-lg px-6 text-black font-semibold focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
                            <option value="">{t("Select Truck", "ট্রাক নির্বাচন করুন")}</option>
                            <option value="7ft">{t("7 Feet (1.5 Ton)", "৭ ফিট (১.৫ টন)")}</option>
                            <option value="12ft">{t("12 Feet (3.5 Ton)", "১২ ফিট (৩.৫ টন)")}</option>
                            <option value="18ft">{t("18 Feet (7 Ton)", "১৮ ফিট (৭ টন)")}</option>
                        </select>
                    </div>

                    <Button className="w-full h-14 rounded-lg font-black text-lg gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-primary hover:bg-secondary border-none text-white">
                        <Search className="w-5 h-5" />
                        {t("Get Quotes", "ভাড়া দেখুন")}
                    </Button>
                </div>

                <div className="mt-6 flex flex-wrap gap-6 border-t border-gray-50 pt-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                        <Calendar className="w-4 h-4 text-primary" />
                        {t("Schedule for later?", "পরে বুক করবেন?")}
                        <button className="text-primary hover:underline ml-2">{t("Pick a date", "তারিখ নির্বাচন করুন")}</button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
