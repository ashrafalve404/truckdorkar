"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Truck, Calendar as CalendarIcon, Search, X, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import { LocationSelector } from "@/components/ui/location-selector";

import { useRouter } from "next/navigation";
import api from "@/lib/api";

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

    const STATIC_TRUCK_ICONS: Record<string, string> = {
        T1_OPEN_7FT: "/icons/1ton7feeticon.png",
        T1_COVER_7FT: "/icons/1ton7feetcovericon.png",
        T1_OPEN_9FT: "/icons/1ton7feeticon.png",
        T1_COVER_9FT: "/icons/1ton7feetcovericon.png",
        T1_5_OPEN_12FT: "/icons/1.5ton9feeticon.png",
        T1_5_COVER_12FT: "/icons/1.5on9feetcovericon.png",
    };

    const getTruckIcon = (id: string) => {
        if (STATIC_TRUCK_ICONS[id]) return STATIC_TRUCK_ICONS[id];
        const lower = id.toLowerCase();
        if (lower.includes("cover")) return "/icons/3ton12feetcovericon.png";
        return "/icons/3ton12feeticon.png";
    };

    const FALLBACK_TRUCKS = [
        { value: "T1_OPEN_7FT", en: "1 Ton Open 7 Ft", bn: "১ টন খোলা ৭ ফিট ট্রাক", icon: STATIC_TRUCK_ICONS.T1_OPEN_7FT },
        { value: "T1_COVER_7FT", en: "1 Ton Cover 7 Ft", bn: "১ টন কাভার ৭ ফিট ট্রাক", icon: STATIC_TRUCK_ICONS.T1_COVER_7FT },
        { value: "T1_OPEN_9FT", en: "1 Ton Open 9 Ft", bn: "১ টন খোলা ৯ ফিট ট্রাক", icon: STATIC_TRUCK_ICONS.T1_OPEN_9FT },
        { value: "T1_COVER_9FT", en: "1 Ton Cover 9 Ft", bn: "১ টন কাভার ৯ ফিট ট্রাক", icon: STATIC_TRUCK_ICONS.T1_COVER_9FT },
        { value: "T1_5_OPEN_12FT", en: "1.5 Ton Open 12 Ft", bn: "১.৫ টন খোলা ১২ ফিট ট্রাক", icon: STATIC_TRUCK_ICONS.T1_5_OPEN_12FT },
        { value: "T1_5_COVER_12FT", en: "1.5 Ton Cover 12 Ft", bn: "১.৫ টন কাভার ১২ ফিট ট্রাক", icon: STATIC_TRUCK_ICONS.T1_5_COVER_12FT },
    ];

    const [dynamicTrucks, setDynamicTrucks] = useState<any[]>([]);

    useEffect(() => {
        const loadTrucks = async () => {
            try {
                const response = await api.get("/cms/content/SYSTEM_SETTINGS");
                const meta = response.data?.data?.metaJson || {};
                const list = meta.truckFares;
                if (Array.isArray(list) && list.length > 0) {
                    const active = list.filter((tc: any) => tc.isActive !== false);
                    setDynamicTrucks(active.map((tc: any) => ({
                        value: tc.id,
                        en: tc.nameEn,
                        bn: tc.nameBn,
                        icon: getTruckIcon(tc.id)
                    })));
                }
            } catch (err) {
                /* silently use fallback */
            }
        };
        loadTrucks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const truckTypes = dynamicTrucks.length > 0 ? dynamicTrucks : FALLBACK_TRUCKS;


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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <LocationSelector
                        label="Pickup Location"
                        labelBn="পিকআপ লোকেশন"
                        value={pickup}
                        onChange={setPickup}
                        iconColor="text-primary"
                        compact
                    />

                    <LocationSelector
                        label="Drop Location"
                        labelBn="ড্রপ লোকেশন"
                        value={drop}
                        onChange={setDrop}
                        iconColor="text-secondary"
                        compact
                    />

                </div>

                {/* Second row: Truck Type + Book Now */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 items-end">
                    <div className="space-y-3">
                        <label className="text-xs font-black text-slate-800 flex items-center gap-2">
                            <Truck className="w-3 h-3 text-primary" />
                            {t("Truck Type", "ট্রাকের ধরণ")}
                        </label>
                        <div className="relative" ref={dropdownRef}>
                            <div
                                onClick={() => setIsTruckDropdownOpen(!isTruckDropdownOpen)}
                                className="w-full h-14 bg-white border border-slate-300 rounded-md px-6 flex items-center justify-between cursor-pointer group hover:border-primary/30 transition-all shadow-sm"
                            >
                                <span className={cn("font-medium", truckType ? "text-slate-900" : "text-slate-500")}>
                                    {truckType
                                        ? (lang === 'en' ? selectedTruckLabel?.en : selectedTruckLabel?.bn)
                                        : t("Select Truck", "ট্রাক নির্বাচন করুন")}
                                </span>
                                <ChevronDown className={cn("w-5 h-5 text-slate-400 transition-transform duration-300", isTruckDropdownOpen && "rotate-180")} />
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
                                                    if (type.upcoming) return;
                                                    setTruckType(type.value);
                                                    setIsTruckDropdownOpen(false);
                                                }}
                                                className={cn(
                                                    "px-6 py-3 text-sm font-semibold transition-all flex items-center justify-between",
                                                    type.upcoming
                                                        ? "opacity-50 cursor-not-allowed"
                                                        : truckType === type.value
                                                            ? "bg-primary/10 text-primary cursor-pointer"
                                                            : "text-gray-700 hover:bg-gray-50 hover:text-primary cursor-pointer"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img src={type.icon} alt="" className="w-8 h-8 object-contain" />
                                                    {lang === 'en' ? type.en : type.bn}
                                                </div>
                                                {type.upcoming ? (
                                                    <span className="text-[9px] font-black bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full uppercase tracking-wide">Upcoming</span>
                                                ) : truckType === type.value ? (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                                ) : null}
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
                        <CalendarIcon className="w-4 h-4 text-primary" />
                        {t("Schedule for later?", "পরে বুক করবেন?")}

                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="flex items-center gap-1 text-primary hover:underline cursor-pointer bg-transparent">
                                    {selectedDate ? (
                                        <>
                                            <span>{formatDate(selectedDate)}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedDate("");
                                                }}
                                                className="ml-1 hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        </>
                                    ) : (
                                        <span>{t("Booking Date", "বুকিংয়ের তারিখ")}</span>
                                    )}
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate ? new Date(selectedDate) : undefined}
                                    onSelect={(date) => {
                                        if (date) {
                                            setSelectedDate(format(date, "yyyy-MM-dd"));
                                        }
                                    }}
                                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}