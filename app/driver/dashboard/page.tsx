"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import {
    Package,
    Truck,
    DollarSign,
    Star,
    MapPin,
    ArrowRight,
    Loader2
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function DriverDashboard() {
    const { t } = useLanguage();
    const [stats, setStats] = useState({
        totalTrips: 0,
        earnings: 0,
        rating: 4.8,
        activeJobs: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDriverData = async () => {
            try {
                // In reality, we'd fetch driver-specific stats
                const response = await api.get("/drivers/profile");
                const driver = response.data.data;
                setStats({
                    totalTrips: driver.totalTrips || 0,
                    earnings: driver.totalEarnings || 0,
                    rating: driver.rating || 5.0,
                    activeJobs: 0 // Fetch from bookings filtered by driverId and status
                });
            } catch (error) {
                console.error("Failed to fetch driver stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDriverData();
    }, []);

    const cards = [
        { label: t("Earnings", "উপার্জন"), value: `৳${stats.earnings.toLocaleString()}`, icon: DollarSign, color: "bg-green-500" },
        { label: t("Total Trips", "মোট ট্রিপ"), value: stats.totalTrips, icon: Truck, color: "bg-blue-500" },
        { label: t("Rating", "রেটিং"), value: stats.rating.toFixed(1), icon: Star, color: "bg-amber-500" },
    ];

    return (
        <DashboardLayout requiredRole="DRIVER">
            <header className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Driver Dashboard", "ড্রাইভার ড্যাশবোর্ড")}
                    </h1>
                    <p className="text-slate-500 font-medium font-bold">
                        {t("Manage your bookings, earnings, and vehicle status.", "আপনার বুকিং, উপার্জন এবং যানবাহনের অবস্থা পরিচালনা করুন।")}
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white p-1 rounded-full border border-slate-100 shadow-sm">
                    <div className="bg-green-500 w-3 h-3 rounded-full ml-4 animate-pulse"></div>
                    <span className="text-sm font-bold pr-4">{t("Available for Jobs", "কাজের জন্য প্রস্তুত")}</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm flex items-center gap-6">
                        <div className={`${card.color} w-14 h-14 rounded-lg flex items-center justify-center text-white`}>
                            <card.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{card.label}</p>
                            <p className="text-2xl font-black text-slate-900">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-primary/5 rounded-xl p-10 border border-primary/10 mb-10 relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">{t("Find New Jobs", "নতুন কাজ খুঁজুন")}</h2>
                        <p className="text-slate-600 font-medium">{t("There are 12 new booking requests in your current area.", "আপনার বর্তমান এলাকায় ১২টি নতুন বুকিং রিকোয়েস্ট আছে।")}</p>
                    </div>
                    <Button size="lg" className="rounded-lg h-14 px-8 font-black text-lg gap-3 text-white">
                        {t("View Job Feed", "জব ফিড দেখুন")}
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">{t("Upcoming Trips", "আসন্ন ট্রিপসমূহ")}</h3>
                    <button className="text-slate-400 font-bold text-sm hover:text-primary transition-colors">{t("History", "ইতিহাস")}</button>
                </div>
                <div className="p-20 text-center">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 text-slate-200" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-400 mb-1">{t("No assigned trips yet", "এখনও কোনো ট্রিপ বরাদ্দ করা হয়নি")}</h4>
                    <p className="text-slate-400 text-sm">{t("Requests you accept will appear here.", "আপনার গ্রহণ করা রিকোয়েস্টগুলো এখানে দেখা যাবে।")}</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
