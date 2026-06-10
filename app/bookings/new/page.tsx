"use client";

import React, { useCallback, useState, Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { useLanguage } from "@/context/language-context";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAuth } from "@/store/use-auth";
import { toast } from "react-hot-toast";

function BookingContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        pickupLocation: searchParams.get("pickup") || "",
        dropLocation: searchParams.get("drop") || "",
        type: "INTER_CITY",
        scheduledAt: searchParams.get("date") || "",
        goodsType: "GENERAL",
        goodsWeight: "",
        specialNote: "",
    });

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
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950">{t("Booking Type", "বুকিং ধরন")}</label>
                                            <select
                                                required
                                                value={formData.type}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/20 text-slate-950 font-bold"
                                            >
                                                <option value="INTER_CITY">{t("Inter City", "আন্তঃশহর")}</option>
                                                <option value="INTRA_CITY">{t("Intra City", "শহরের ভিতরে")}</option>
                                                <option value="SPECIALIZED">{t("Specialized", "বিশেষায়িত")}</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950">{t("Goods Type", "পণ্যের ধরণ")}</label>
                                            <select
                                                required
                                                value={formData.goodsType}
                                                onChange={(e) => setFormData({ ...formData, goodsType: e.target.value })}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 outline-none text-slate-950 font-bold"
                                            >
                                                <option value="GENERAL">{t("General Goods", "সাধারণ পণ্য")}</option>
                                                <option value="HOUSE_SHIFTING">{t("House Shifting", "বাসা বদল")}</option>
                                                <option value="FRAGILE">{t("Fragile", "ভঙ্গুর পণ্য")}</option>
                                                <option value="CONSTRUCTION">{t("Construction", "নির্মাণ সামগ্রী")}</option>
                                            </select>
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
