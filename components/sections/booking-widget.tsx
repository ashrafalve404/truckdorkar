"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Truck, Calendar, Search, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

import { useRouter } from "next/navigation";

export function BookingWidget() {
    const { t, lang } = useLanguage();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("inter-city");
    const [selectedDate, setSelectedDate] = useState("");
    const [pickup, setPickup] = useState("");
    const [drop, setDrop] = useState("");
    const [truckType, setTruckType] = useState("");
    const [isTruckDropdownOpen, setIsTruckDropdownOpen] = useState(false);
    const dateInputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const truckTypes = [
        { value: "1_ton_open_7ft", en: "1 Ton Open 7Ft", bn: "১ টন খোলা ৭ফিট ট্রাক" },
        { value: "1_ton_cover_7ft", en: "1 Ton Cover 7Ft", bn: "১ টন কাভার ৭ফিট ট্রাক" },
        { value: "1.5_ton_open_9ft", en: "1.5 Ton Open 9Ft", bn: "১.৫ টন খোলা ৯ফিট ট্রাক" },
        { value: "1.5_ton_cover_9ft", en: "1.5 Ton Cover 9Ft", bn: "১.৫ টন কাভার ৯ফিট ট্রাক" },
        { value: "2_ton_open_9ft", en: "2 Ton Open 9Ft", bn: "২ টন খোলা ৯ফিট ট্রাক" },
        { value: "3_ton_open_12ft", en: "3 Ton Open 12Ft", bn: "৩ টন খোলা ১২ফিট ট্রাক" },
        { value: "3_ton_cover_12ft", en: "3 Ton Cover 12Ft", bn: "৩ টন কাভার ১২ফিট ট্রাক" },
        { value: "5_ton_open_17ft", en: "5 Ton Open 17Ft Truck", bn: "৫ টন খোলা ১৭ফিট ট্রাক" },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsTruckDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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

    const handleSearch = () => {
        const params = new URLSearchParams({
            pickup,
            drop,
            truckType,
            date: selectedDate,
            category: activeTab
        });
        router.push(`/bookings/new?${params.toString()}`);
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
    };

    const selectedTruckLabel = truckTypes.find(t => t.value === truckType);

    return (
        <motion.div
            id="booking-form"
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
                            {t(tab, tab === "Inter-City" ? "আন্তঃশহর" : tab === "Intra-City" ? "শহরের ভিতরে" : "বিশেষায়িত")}
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
                                value={pickup}
                                onChange={(e) => setPickup(e.target.value)}
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
                                value={drop}
                                onChange={(e) => setDrop(e.target.value)}
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
                        <div className="relative" ref={dropdownRef}>
                            <div
                                onClick={() => setIsTruckDropdownOpen(!isTruckDropdownOpen)}
                                className="w-full h-14 bg-gray-200 rounded-md px-6 flex items-center justify-between cursor-pointer group hover:bg-gray-300/80 transition-all"
                            >
                                <span className={cn("font-semibold", truckType ? "text-black" : "text-gray-600")}>
                                    {truckType
                                        ? (lang === 'en' ? selectedTruckLabel?.en : selectedTruckLabel?.bn)
                                        : t("Select Truck", "ট্রাক নির্বাচন করুন")}
                                </span>
                                <ChevronDown className={cn("w-5 h-5 text-gray-400 transition-transform duration-300", isTruckDropdownOpen && "rotate-180")} />
                            </div>

                            <AnimatePresence>
                                {isTruckDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 5, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-2xl z-50 py-2 max-h-72 overflow-y-auto scrollbar-hide"
                                    >
                                        {truckTypes.map((type) => (
                                            <div
                                                key={type.value}
                                                onClick={() => {
                                                    setTruckType(type.value);
                                                    setIsTruckDropdownOpen(false);
                                                }}
                                                className={cn(
                                                    "px-6 py-3 text-sm font-semibold transition-all cursor-pointer flex items-center justify-between",
                                                    truckType === type.value
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-gray-700 hover:bg-gray-50 hover:text-primary"
                                                )}
                                            >
                                                {lang === 'en' ? type.en : type.bn}
                                                {truckType === type.value && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <Button
                        onClick={handleSearch}
                        className="w-full h-14 rounded-md font-black text-lg gap-3 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all bg-primary hover:bg-secondary border-none text-white"
                    >
                        <Search className="w-5 h-5" />
                        {t("Book Now", "বুক করুন")}
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