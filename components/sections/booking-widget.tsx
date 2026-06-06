"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Truck, Calendar, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export function BookingWidget() {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState("inter-city");
    const [selectedDate, setSelectedDate] = useState("");
    const dateInputRef = useRef<HTMLInputElement>(null);

    const handleDateClick = () => {
        if (dateInputRef.current) {
            dateInputRef.current.showPicker?.();
            dateInputRef.current.focus();
        }
    };

    const clearDate = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedDate("");
        setTimeout(() => dateInputRef.current?.focus(), 0);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="w-full max-w-5xl mx-auto mt-12 lg:-mt-32 relative z-30 px-4 lg:px-0"
        >
            <div className="bg-white rounded-md shadow-premium p-4 lg:p-8 border border-gray-100">
                {/* Tabs */}
                <div className="flex gap-3 mb-6 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                    {["Inter-City", "Intra-City", "Specialized"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all snap-start ${activeTab === tab.toLowerCase()
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                        >
                            {t(tab, tab === "Inter-City" ? "ইন্টার-সিটি" : tab === "Intra-City" ? "ইন্ট্রা-সিটি" : "স্পেশালাইজড")}
                        </button>
                    ))}
                </div>

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-primary" />
                            {t("Pickup Location", "পিকআপ লোকেশন")}
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t("From where?", "কোথা থেকে?")}
                                className="w-full h-14 bg-gray-200 border-none rounded-md px-6 text-black font-semibold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-secondary" />
                            {t("Drop Location", "ড্রপ লোকেশন")}
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t("To where?", "কোথায়?")}
                                className="w-full h-14 bg-gray-200 border-none rounded-md px-6 text-black font-semibold focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-600"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-xs font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                            <Truck className="w-3 h-3 text-primary" />
                            {t("Truck Type", "ট্রাকের ধরণ")}
                        </label>
                        <div className="relative">
                            <select className="w-full h-14 bg-gray-200 border-none rounded-md px-6 text-black font-semibold focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
                                <option value="">{t("Select Truck", "ট্রাক নির্বাচন করুন")}</option>
                                <option value="7ft">{t("7 Feet (1.5 Ton)", "৭ ফিট (১.৫ টন)")}</option>
                                <option value="12ft">{t("12 Feet (3.5 Ton)", "১২ ফিট (৩.৫ টন)")}</option>
                                <option value="18ft">{t("18 Feet (7 Ton)", "১৮ ফিট (৭ টন)")}</option>
                            </select>
                        </div>
                    </div>

                    <Button className="w-full h-14 rounded-md font-black text-lg gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-primary hover:bg-secondary border-none text-white">
                        <Search className="w-5 h-5" />
                        {t("Get Quotes", "ভাড়া দেখুন")}
                    </Button>
                </div>

                <div className="mt-6 flex flex-wrap gap-6 border-t border-gray-50 pt-6">
                    <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                        <Calendar className="w-4 h-4 text-primary" />
                        {t("Schedule for later?", "পরে বুক করবেন?")}
                        <div
                            onClick={handleDateClick}
                            className="flex items-center gap-1 text-primary hover:underline cursor-pointer bg-transparent"
                        >
                            {selectedDate ? (
                                <>
                                    <span>{formatDate(selectedDate)}</span>
                                    <button
                                        onClick={clearDate}
                                        className="ml-1 hover:text-red-500 transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </>
                            ) : (
                                <span>{t("Pick a date", "তারিখ নির্বাচন করুন")}</span>
                            )}
                        </div>
                        <input
                            ref={dateInputRef}
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="sr-only"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}