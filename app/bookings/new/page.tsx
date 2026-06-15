"use client";

import React, { useCallback, useState, Suspense, useRef, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { useLanguage } from "@/context/language-context";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, ArrowRight, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAuth } from "@/store/use-auth";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CustomSelectProps {
    value: string;
    onChange: (val: string) => void;
    options: { label: string; value: string }[];
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
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className={cn(
                                    "px-4 py-2.5 text-sm font-bold transition-all cursor-pointer flex items-center justify-between",
                                    value === opt.value
                                        ? "bg-primary/10 text-primary"
                                        : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                                )}
                            >
                                {opt.label}
                                {value === opt.value && <div className="w-1 h-1 rounded-full bg-primary" />}
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
    });

    const bookingTypes = [
        { label: t("Inter City", "আন্তঃশহর"), value: "INTER_CITY" },
        { label: t("Intra City", "শহরের ভিতরে"), value: "INTRA_CITY" },
        { label: t("Specialized", "বিশেষায়িত"), value: "SPECIALIZED" },
    ];

    const goodsTypes = [
        { label: t("General Goods", "সাধারণ পণ্য"), value: "GENERAL" },
        { label: t("House Shifting", "বাসা বদল"), value: "HOUSE_SHIFTING" },
        { label: t("Fragile", "ভঙ্গুর পণ্য"), value: "FRAGILE" },
        { label: t("Construction", "নির্মাণ সামগ্রী"), value: "CONSTRUCTION" },
    ];

    const truckTypes = [
        { value: "1_ton_open_7ft", label: t("1 Ton Open 7Ft", "১ টন খোলা ৭ফিট ট্রাক") },
        { value: "1_ton_cover_7ft", label: t("1 Ton Cover 7Ft", "১ টন কাভার ৭ফিট ট্রাক") },
        { value: "1.5_ton_open_9ft", label: t("1.5 Ton Open 9Ft", "১.৫ টন খোলা ৯ফিট ট্রাক") },
        { value: "1.5_ton_cover_9ft", label: t("1.5 Ton Cover 9Ft", "১.৫ টন কাভার ৯ফিট ট্রাক") },
        { value: "2_ton_open_9ft", label: t("2 Ton Open 9Ft", "২ টন খোলা ৯ফিট ট্রাক") },
        { value: "3_ton_open_12ft", label: t("3 Ton Open 12Ft", "৩ টন খোলা ১২ফিট ট্রাক") },
        { value: "3_ton_cover_12ft", label: t("3 Ton Cover 12Ft", "৩ টন কাভার ১২ফিট ট্রাক") },
        { value: "5_ton_open_17ft", label: t("5 Ton Open 17Ft Truck", "৫ টন খোলা ১৭ফিট ট্রাক") },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error(t("Please login to book a truck", "ট্রাক বুক করতে অনুগ্রহ করে লগইন করুন"));
            router.push(`/login?redirect=/bookings/new&${searchParams.toString()}`);
            return;
        }

        setLoading(true);
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
            });

            toast.success(t("Booking request submitted!", "বুকিং রিকোয়েস্ট জমা দেওয়া হয়েছে!"));
            router.push(`/bookings/success?bookingId=${data.data.id}`);
        } catch (error: unknown) {
            const message = error && typeof error === 'object' && 'response' in error && (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(typeof message === 'string' ? message : t("Booking failed", "বুকিং ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    };

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
                                {t("Provide more details to get accurate quotes from our drivers.", "সঠিক ভাড়া পেতে আরও বিস্তারিত তথ্য প্রদান করুন।")}
                            </p>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Form */}
                            <div className="lg:col-span-2">
                                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 lg:p-10 shadow-premium border border-gray-100 space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-primary" />
                                                {t("Pickup Address", "পিকআপ ঠিকানা")}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.pickupLocation}
                                                onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-950 font-bold placeholder:text-slate-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950 flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-secondary" />
                                                {t("Drop-off Address", "ড্রপ-অফ ঠিকানা")}
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.dropLocation}
                                                onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
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
                                        <CustomSelect
                                            label={t("Required Truck", "প্রয়োজনীয় ট্রাক")}
                                            value={formData.truckType}
                                            onChange={(val) => setFormData({ ...formData, truckType: val })}
                                            options={truckTypes}
                                            placeholder={t("Select Truck", "ট্রাক নির্বাচন করুন")}
                                        />
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
                                            <label className="text-sm font-bold text-slate-950">{t("Scheduled Date", "তারিখ")}</label>
                                            <input
                                                type="date"
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
                                                {t("Confirm Booking Request", "বুকিং রিকোয়েস্ট নিশ্চিত করুন")}
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </div>

                            {/* Sidebar Info */}
                            <div className="space-y-6">
                                <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6">
                                    <h3 className="font-bold text-primary mb-4">{t("How it works", "কিভাবে কাজ করে")}</h3>
                                    <ul className="space-y-4 text-sm text-slate-700 font-bold">
                                        <li className="flex gap-3">
                                            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold">1</span>
                                            <span>{t("Submit your request", "আপনার রিকোয়েস্ট জমা দিন")}</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center shrink-0 font-bold">2</span>
                                            <span>{t("Drivers will send quotes", "ড্রাইভাররা ভাড়া অফার করবে")}</span>
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
                        src="/images/bookingpagefoto.png"
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
