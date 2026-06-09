"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { useSearchParams, useRouter } from "next/navigation";
import { MapPin, Truck, Calendar, ArrowRight, Loader2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAuth } from "@/store/use-auth";
import { toast } from "react-hot-toast";

function BookingContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        pickupLocation: searchParams.get("pickup") || "",
        dropLocation: searchParams.get("drop") || "",
        truckType: searchParams.get("truckType") || "",
        scheduledDate: searchParams.get("date") || "",
        contactPhone: user?.phone || "",
        cargoType: "GENERAL",
        weight: "",
        description: "",
    });

    useEffect(() => {
        if (user?.phone) {
            setFormData(prev => ({ ...prev, contactPhone: user.phone }));
        }
    }, [user]);

    const validatePhone = (phone: string) => {
        const regex = /^01[3-9]\d{8}$/;
        return regex.test(phone);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isAuthenticated) {
            toast.error(t("Please login to book a truck", "ট্রাক বুক করতে অনুগ্রহ করে লগইন করুন"));
            router.push(`/login?redirect=/bookings/new&${searchParams.toString()}`);
            return;
        }

        if (!validatePhone(formData.contactPhone)) {
            toast.error(t("Please enter a valid Bangladeshi phone number (e.g., 017xxxxxxxx)", "অনুগ্রহ করে একটি সঠিক বাংলাদেশী ফোন নম্বর দিন (যেমন: ০১৭১xxxxxxx)"));
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.post("/bookings", {
                ...formData,
                weight: Number(formData.weight) || 0,
                // Adjusting fields to match backend schema
                pickupAddress: formData.pickupLocation,
                dropoffAddress: formData.dropLocation,
                phone: formData.contactPhone,
                scheduledAt: formData.scheduledDate ? new Date(formData.scheduledDate).toISOString() : new Date().toISOString(),
            });

            toast.success(t("Booking request submitted!", "বুকিং রিকোয়েস্ট জমা দেওয়া হয়েছে!"));
            router.push(`/bookings/${data.data.id}/success`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("Booking failed", "বুকিং ব্যর্থ হয়েছে"));
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

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950 flex items-center gap-2">
                                                <Truck className="w-4 h-4 text-primary" />
                                                {t("Truck Type", "ট্রাকের ধরণ")}
                                            </label>
                                            <select
                                                required
                                                value={formData.truckType}
                                                onChange={(e) => setFormData({ ...formData, truckType: e.target.value })}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/20 text-slate-950 font-bold placeholder:text-slate-500"
                                            >
                                                <option value="">{t("Select Truck", "ট্রাক নির্বাচন করুন")}</option>
                                                <option value="1_ton_open_7ft">{t("1 Ton Open 7Ft", "১ টন খোলা ৭ফিট ট্রাক")}</option>
                                                <option value="1_ton_cover_7ft">{t("1 Ton Cover 7Ft", "১ টন কাভার ৭ফিট ট্রাক")}</option>
                                                <option value="1.5_ton_open_9ft">{t("1.5 Ton Open 9Ft", "১.৫ টন খোলা ৯ফিট ট্রাক")}</option>
                                                <option value="1.5_ton_cover_9ft">{t("1.5 Ton Cover 9Ft", "১.৫ টন কাভার ৯ফিট ট্রাক")}</option>
                                                <option value="3_ton_open_12ft">{t("3 Ton Open 12Ft", "৩ টন খোলা ১২ফিট ট্রাক")}</option>
                                                <option value="3_ton_cover_12ft">{t("3 Ton Cover 12Ft", "৩ টন কাভার ১২ফিট ট্রাক")}</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950 flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-primary" />
                                                {t("Schedule Date", "তারিখ")}
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={formData.scheduledDate}
                                                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 outline-none focus:ring-2 focus:ring-primary/20 text-slate-950 font-bold placeholder:text-slate-500"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950 flex items-center gap-2">
                                                <Info className="w-4 h-4 text-primary" />
                                                {t("Contact Phone", "যোগাযোগ নম্বর")}
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                placeholder="01xxxxxxxxx"
                                                value={formData.contactPhone}
                                                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-950 font-bold placeholder:text-slate-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950">{t("Cargo Type", "পণ্যের ধরণ")}</label>
                                            <select
                                                required
                                                value={formData.cargoType}
                                                onChange={(e) => setFormData({ ...formData, cargoType: e.target.value })}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 outline-none text-slate-950 font-bold"
                                            >
                                                <option value="GENERAL">{t("General Goods", "সাধারণ পণ্য")}</option>
                                                <option value="HOUSE_SHIFTING">{t("House Shifting", "বাসা বদল")}</option>
                                                <option value="FRAGILE">{t("Fragile", "ভঙ্গুর পণ্য")}</option>
                                                <option value="CONSTRUCTION">{t("Construction", "নির্মাণ সামগ্রী")}</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950">{t("Estimated Weight (Kg)", "আনুমানিক ওজন (কেজি)")}</label>
                                            <input
                                                type="number"
                                                required
                                                value={formData.weight}
                                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                                placeholder="e.g. 1500"
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-950 font-bold placeholder:text-slate-500"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-950">{t("Description", "বিস্তারিত")}</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                    <div className="flex items-center gap-3 mb-4 text-primary">
                                        <Info className="w-5 h-5" />
                                        <h3 className="font-bold">{t("How it works", "কিভাবে কাজ করে")}</h3>
                                    </div>
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

                                <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-100">
                                    <h3 className="font-bold mb-4">{t("Support", "সাপোর্ট")}</h3>
                                    <p className="text-sm text-slate-700 font-bold mb-4">{t("Need help with your booking?", "বুকিং নিয়ে সাহায্য প্রয়োজন?")}</p>
                                    <Button variant="outline" className="w-full rounded-xl border-primary text-primary hover:bg-primary/5">
                                        {t("Call Center", "কল সেন্টার")}
                                    </Button>
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
