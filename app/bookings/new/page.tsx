"use client";

import React, { useCallback, useState, Suspense, useRef, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { useLanguage } from "@/context/language-context";
import { useSearchParams, useRouter } from "next/navigation";
import {
    MapPin,
    ArrowRight,
    Loader2,
    ChevronDown,
    TrendingUp,
    LocateFixed
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAuth } from "@/store/use-auth";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/mapping/MapComponent"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 animate-pulse rounded-3xl" />
});

interface CustomSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: { label: string; value: string; icon?: string; upcoming?: boolean }[];
    placeholder: string;
    label?: string;
}

function CustomSelect({ value, onChange, options, placeholder, label }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="space-y-2 relative" ref={containerRef}>
            {label && <label className="text-sm font-bold text-slate-950">{label}</label>}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 flex items-center justify-between cursor-pointer group hover:border-primary/30 transition-all font-bold text-slate-950 shadow-sm"
            >
                <span className={cn(value ? "text-slate-950" : "text-slate-500")}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-300", isOpen && "rotate-180")} />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 4, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute top-full left-0 right-0 bg-white border border-slate-100 rounded-xl shadow-2xl z-50 py-2 mt-1 overflow-hidden"
                    >
                        {options.map((opt) => (
                            <div
                                key={opt.value}
                                onClick={() => {
                                    if (opt.upcoming) return;
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "px-4 py-2.5 text-sm font-bold transition-all flex items-center justify-between",
                                    opt.upcoming
                                        ? "opacity-50 cursor-not-allowed"
                                        : value === opt.value
                                            ? "bg-primary/10 text-primary cursor-pointer"
                                            : "text-slate-700 hover:bg-slate-50 hover:text-primary cursor-pointer"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    {opt.icon && <img src={opt.icon} alt="" className="w-8 h-8 object-contain" />}
                                    {opt.label}
                                </div>
                                {opt.upcoming ? (
                                    <span className="text-[9px] font-black bg-orange-100 text-orange-500 px-2 py-0.5 rounded-full uppercase tracking-wide">Upcoming</span>
                                ) : value === opt.value ? (
                                    <div className="w-1 h-1 rounded-full bg-primary" />
                                ) : null}
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function BookingContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        pickupLocation: searchParams.get("pickup") || "",
        dropLocation: searchParams.get("drop") || "",
        type: searchParams.get("category")?.toUpperCase() === "INTRA-CITY" ? "INTRA_CITY" :
            searchParams.get("category")?.toUpperCase() === "SPECIALIZED" ? "SPECIALIZED" : "INTER_CITY",
        scheduledAt: searchParams.get("date") || "",
        goodsType: "GENERAL",
        goodsWeight: "",
        specialNote: "",
        truckType: searchParams.get("truckType") || "",
        estimatedFare: "",
        distance: searchParams.get("distance") || "",
    });
    const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
    const [coords, setCoords] = useState<{ pickup?: [number, number], drop?: [number, number] }>({});

    // --- Fare calculation helper ---
    // Base: 1000 TK for up to 10km; +50 TK per extra km beyond 10km
    const calcMinFare = (distanceKm: number | string): number => {
        const km = Number(distanceKm) || 0;
        if (km <= 10) return 1000;
        return 1000 + Math.ceil(km - 10) * 50;
    };

    // --- Geolocation: Use My Location ---
    const [isGeolocating, setIsGeolocating] = useState(false);

    const handleUseMyLocation = () => {
        if (!navigator.geolocation) {
            toast.error(t("Geolocation is not supported by your browser.", "আপনার ব্রাউজার লোকেশন সাপোর্ট করে না।"));
            return;
        }
        setIsGeolocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`
                    );
                    const data = await res.json();
                    const addr = data.address;
                    // Build a readable address: neighbourhood/suburb, city/district, state
                    const parts = [
                        addr.neighbourhood || addr.suburb || addr.village || addr.hamlet,
                        addr.city || addr.town || addr.county || addr.district,
                        addr.state || addr.region,
                    ].filter(Boolean);
                    const readable = parts.join(", ") || data.display_name;
                    setFormData(prev => ({ ...prev, pickupLocation: readable }));
                    toast.success(t("Location detected!", "লোকেশন শনাক্ত হয়েছে!"));
                } catch {
                    toast.error(t("Could not read your address.", "আপনার ঠিকানা পড়তে ব্যর্থ হয়েছে।"));
                } finally {
                    setIsGeolocating(false);
                }
            },
            () => {
                toast.error(t("Location access denied. Please allow location permission.", "লোকেশন লোড হয়নি। অনুগ্রহ করে লোকেশন পারমিশন দিন।"));
                setIsGeolocating(false);
            },
            { timeout: 10000 }
        );
    };

    // Auto-detect distance when locations change
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (formData.pickupLocation.length > 5 && formData.dropLocation.length > 5) {
                setIsCalculatingDistance(true);
                try {
                    // 1. Geocode Pickup
                    const pRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.pickupLocation)}&limit=1`);
                    const pData = await pRes.json();

                    // 2. Geocode Drop
                    const dRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.dropLocation)}&limit=1`);
                    const dData = await dRes.json();

                    if (pData[0] && dData[0]) {
                        const pCoord: [number, number] = [parseFloat(pData[0].lat), parseFloat(pData[0].lon)];
                        const dCoord: [number, number] = [parseFloat(dData[0].lat), parseFloat(dData[0].lon)];
                        setCoords({ pickup: pCoord, drop: dCoord });

                        // 3. Get OSRM Distance
                        const osrmRes = await fetch(`https://router.project-osrm.org/route/v1/driving/${pCoord[1]},${pCoord[0]};${dCoord[1]},${dCoord[0]}?overview=false`);
                        const osrmData = await osrmRes.json();

                        if (osrmData.routes && osrmData.routes[0]) {
                            const distanceKm = Math.round(osrmData.routes[0].distance / 1000);
                            const minFare = calcMinFare(distanceKm);
                            setFormData(prev => ({
                                ...prev,
                                distance: distanceKm.toString(),
                                estimatedFare: minFare.toString(),
                            }));
                        }
                    }
                } catch (error) {
                    console.error("Distance detection failed", error);
                } finally {
                    setIsCalculatingDistance(false);
                }
            }
        }, 1500); // Debounce for 1.5 seconds

        return () => clearTimeout(timer);
    }, [formData.pickupLocation, formData.dropLocation]);

    const bookingTypes = [
        { label: t("Inter City", "আন্তঃশহর"), value: "INTER_CITY" },
        { label: t("Intra City", "শহরের ভিতরে"), value: "INTRA_CITY" },
        { label: t("Specialized", "বিশেষায়িত"), value: "SPECIALIZED" },
    ];

    const goodsTypes = [
        { label: t("General Goods", "সাধারণ পণ্য"), value: "GENERAL" },
        { label: t("House Shifting", "বাসা বদল"), value: "HOUSE_SHIFTING" },
        { label: t("Fragile", "ভঙ্গুর পণ্য"), value: "FRAGILE" },
        { label: t("Construction", "নির্মাণ সামগ্রী"), value: "CONSTRUCTION" },
    ];

    const truckTypes = [
        { value: "T1_OPEN_7FT", label: t("1 Ton Open 7Ft", "১ টন খোলা ৭ফিট ট্রাক"), icon: "/icons/1ton7feeticon.png" },
        { value: "T1_COVER_7FT", label: t("1 Ton Cover 7Ft", "১ টন কাভার ৭ফিট ট্রাক"), icon: "/icons/1ton7feetcovericon.png" },
        { value: "T1_5_OPEN_9FT", label: t("1.5 Ton Open 9Ft", "১.৫ টন খোলা ৯ফিট ট্রাক"), icon: "/icons/1.5ton9feeticon.png" },
        { value: "T1_5_COVER_9FT", label: t("1.5 Ton Cover 9Ft", "১.৫ টন কাভার ৯ফিট ট্রাক"), icon: "/icons/1.5on9feetcovericon.png" },
        { value: "T2_OPEN_9FT", label: t("2 Ton Open 9Ft", "২ টন খোলা ৯ফিট ট্রাক"), icon: "/icons/2ton9feeticon.png", upcoming: true },
        { value: "T3_OPEN_12FT", label: t("3 Ton Open 12Ft", "৩ টন খোলা ১২ফিট ট্রাক"), icon: "/icons/3ton12feeticon.png", upcoming: true },
        { value: "T3_COVER_12FT", label: t("3 Ton Cover 12Ft", "৩ টন কাভার ১২ফিট ট্রাক"), icon: "/icons/3ton12feetcovericon.png", upcoming: true },
        { value: "T5_OPEN_17FT", label: t("5 Ton Open 17Ft Truck", "৫ টন খোলা ১৭ফিট ট্রাক"), icon: "/icons/5ton17feeticon.png", upcoming: true },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error(t("Please login to book a truck", "ট্রাক বুক করতে অনুগ্রহ করে লগইন করুন"));
            router.push(`/login?redirect=/bookings/new&${searchParams.toString()}`);
            return;
        }

        if (!formData.pickupLocation || !formData.dropLocation) {
            toast.error(t("Please enter both pickup and drop-off addresses", "অনুগ্রহ করে পিকআপ এবং ড্রপ-অফ ঠিকানা উভয়ই লিখুন"));
            setLoading(false);
            return;
        }

        if (!formData.truckType) {
            toast.error(t("Please select a required truck", "অনুগ্রহ করে একটি প্রয়োজনীয় ট্রাক নির্বাচন করুন"));
            setLoading(false);
            return;
        }

        if (!formData.scheduledAt) {
            toast.error(t("Please select a scheduled date", "অনুগ্রহ করে একটি নির্ধারিত তারিখ নির্বাচন করুন"));
            setLoading(false);
            return;
        }

        const minFare = calcMinFare(formData.distance);
        if (Number(formData.estimatedFare) < minFare) {
            toast.error(t(`Minimum fare for this trip is ${minFare} TK`, `এই ট্রিপের সর্বনিম্ন ভাড়া ${minFare} টাকা`));
            setLoading(false);
            return;
        }

        try {
            const { data } = await api.post("/bookings", {
                type: formData.type,
                pickupAddress: formData.pickupLocation,
                dropAddress: formData.dropLocation,
                scheduledAt: formData.scheduledAt || undefined,
                goodsType: formData.goodsType,
                goodsWeight: Number(formData.goodsWeight) || undefined,
                specialNote: formData.specialNote || undefined,
                truckType: formData.truckType || undefined,
                estimatedFare: Number(formData.estimatedFare) || undefined,
                distance: formData.distance ? Number(formData.distance) : 0,
            });

            toast.success(t("Booking request submitted!", "বুকিং রিকোয়েস্ট জমা দেওয়া হয়েছে!"));
            router.push(`/bookings/success?bookingId=${data.data.id}`);
        } catch (error: unknown) {
            const message = error && typeof error === 'object' && 'response' in error && (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(typeof message === 'string' ? message : t("Booking failed", "বুকিং ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    };

    const minFare = calcMinFare(formData.distance);

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="pt-28 pb-16">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="max-w-4xl mx-auto">
                        <header className="mb-10 text-center">
                            <h1 className="text-3xl lg:text-4xl font-black text-black mb-4">
                                {t("Complete Your Booking", "আপনার বুকিং সম্পূর্ণ করুন")}
                            </h1>
                            <p className="text-slate-700 font-bold">
                                {t("Provide more details to get accurate quotes from our drivers.", "সঠিক ভাড়া পেতে আরও বিস্তারিত তথ্য প্রদান করুন।")}
                            </p>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Form */}
                            <div className="lg:col-span-2">
                                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 lg:p-10 shadow-premium border border-gray-100 space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950 flex items-center justify-between">
                                                <span className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 text-primary" />
                                                    {t("Pickup Address", "পিকআপ ঠিকানা")}
                                                    <span className="text-red-500 ml-1">*</span>
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={handleUseMyLocation}
                                                    disabled={isGeolocating}
                                                    className="flex items-center gap-1 text-[10px] font-black text-primary hover:text-primary/70 transition-colors disabled:opacity-50"
                                                >
                                                    {isGeolocating
                                                        ? <Loader2 className="w-3 h-3 animate-spin" />
                                                        : <LocateFixed className="w-3 h-3" />
                                                    }
                                                    {t("Use My Location", "আমার লোকেশন")}
                                                </button>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.pickupLocation}
                                                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                                                placeholder={t("From where?", "কোথা থেকে?")}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-950 font-bold placeholder:text-slate-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-secondary" />
                                                {t("Drop-off Address", "ড্রপ-অফ ঠিকানা")}
                                                <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.dropLocation}
                                                onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                                                placeholder={t("To where?", "কোথায়?")}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-950 font-bold placeholder:text-slate-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <CustomSelect
                                            label={t("Booking Type", "বুকিং ধরন")}
                                            value={formData.type}
                                            onChange={(val) => setFormData({ ...formData, type: val })}
                                            options={bookingTypes}
                                            placeholder={t("Select Type", "নির্বাচন করুন")}
                                        />
                                        <CustomSelect
                                            label={t("Goods Type", "পণ্যের ধরণ")}
                                            value={formData.goodsType}
                                            onChange={(val) => setFormData({ ...formData, goodsType: val })}
                                            options={goodsTypes}
                                            placeholder={t("Select Goods", "নির্বাচন করুন")}
                                        />
                                        <div className="space-y-1">
                                            <CustomSelect
                                                label={t("Required Truck", "প্রয়োজনীয় ট্রাক")}
                                                value={formData.truckType}
                                                onChange={(val) => setFormData({ ...formData, truckType: val })}
                                                options={truckTypes}
                                                placeholder={t("Select Truck", "ট্রাক নির্বাচন করুন")}
                                            />
                                            <div className="flex items-center gap-1">
                                                <span className="text-red-500 text-xs ml-1">* {t("Required", "প্রয়োজনীয়")}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950 flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-primary" />
                                                {t("Trip Distance (KM)", "ট্রিপ দূরত্ব (কিমি)")}
                                                {isCalculatingDistance && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                                            </label>
                                            <input
                                                type="number"
                                                value={formData.distance}
                                                onChange={(e) => {
                                                    const newDist = e.target.value;
                                                    const newMin = calcMinFare(newDist);
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        distance: newDist,
                                                        estimatedFare: newMin.toString(),
                                                    }));
                                                }}
                                                placeholder={t("Distance in KM", "কিমি-এ দূরত্ব")}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-950 font-bold placeholder:text-slate-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-sm font-bold text-slate-950">{t("Your Fare Offer (TK)", "আপনার ভাড়ার অফার (টাকা)")}</label>
                                                {formData.estimatedFare !== "" && Number(formData.estimatedFare) < minFare && (
                                                    <span className="text-[10px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-black animate-pulse">
                                                        Min {minFare} TK
                                                    </span>
                                                )}
                                            </div>
                                            <input
                                                type="number"
                                                required
                                                value={formData.estimatedFare}
                                                onChange={(e) => setFormData({ ...formData, estimatedFare: e.target.value })}
                                                placeholder={`e.g. ${minFare}`}
                                                className={cn(
                                                    "w-full h-12 bg-slate-50 border rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-950 font-bold placeholder:text-slate-500",
                                                    formData.estimatedFare !== "" && Number(formData.estimatedFare) < minFare ? "border-red-300" : "border-slate-200"
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950">{t("Trip Distance (KM)", "ট্রিপের দূরত্ব (কিমি)")}</label>
                                            <div className="w-full h-12 bg-slate-100/50 border border-slate-200 rounded-xl px-4 flex items-center text-slate-500 font-bold">
                                                {formData.distance ? `${formData.distance} KM` : "—"}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950">{t("Estimated Weight (Kg)", "আনুমানিক ওজন (কেজি)")}</label>
                                            <input
                                                type="number"
                                                required
                                                value={formData.goodsWeight}
                                                onChange={(e) => setFormData({ ...formData, goodsWeight: e.target.value })}
                                                placeholder="e.g. 1500"
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-950 font-bold placeholder:text-slate-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950">
                                                {t("Scheduled Date", "তারিখ")}
                                                <span className="text-red-500 ml-1">*</span>
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.scheduledAt}
                                                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/20 text-slate-950 font-bold placeholder:text-slate-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-950">{t("Special Note", "বিস্তারিত")}</label>
                                        <textarea
                                            value={formData.specialNote}
                                            onChange={(e) => setFormData({ ...formData, specialNote: e.target.value })}
                                            placeholder={t("Anything else we should know?", "আরও কিছু বলার আছে?")}
                                            className="w-full h-32 bg-slate-50 border border-slate-200 rounded-xl p-4 outline-none resize-none text-slate-950 font-bold placeholder:text-slate-500"
                                        />
                                    </div>

                                    <Button disabled={loading} className="w-full h-14 rounded-xl font-bold text-lg gap-3 text-white">
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <>
                                                {t("Confirm Booking Request", "বুকিং রিকোয়েস্ট নিশ্চিত করুন")}
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-6">
                                <div className="h-80 w-full overflow-hidden rounded-3xl border border-slate-100 shadow-sm relative z-0">
                                    <MapComponent pickup={coords.pickup} drop={coords.drop} />
                                </div>

                                <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6">
                                    <h3 className="font-bold text-primary mb-4">{t("How it works", "কিভাবে কাজ করে")}</h3>
                                    <ul className="space-y-4 text-sm text-slate-700 font-bold">
                                        <li className="flex gap-3">
                                            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold">1</span>
                                            <span>{t("Submit your request", "আপনার রিকোয়েস্ট জমা দিন")}</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold">2</span>
                                            <span>{t("Drivers will confirm the booking", "ড্রাইভাররা বুকিং নিশ্চিত করবে")}</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold">3</span>
                                            <span>{t("Accept the best offer", "সেরা অফারটি গ্রহণ করুন")}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <section className="container mx-auto px-4 lg:px-12 mb-16">
                <div className="w-full h-auto overflow-hidden rounded-xl border border-slate-100 shadow-sm">
                    <img
                        src="/images/bookingpagephoto.png"
                        alt="Truck on road"
                        className="w-full h-full object-cover"
                    />
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default function NewBookingPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>}>
            <BookingContent />
        </Suspense>
    );
}
