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
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DriverDashboard() {
    const { t } = useLanguage();
    const [stats, setStats] = useState({
        totalTrips: 0,
        earnings: 0,
        rating: 4.8,
        activeJobs: 0
    });
    const [trucks, setTrucks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const fetchDriverData = async () => {
            try {
                // Fetch driver profile and trucks
                const [profileRes, trucksRes] = await Promise.all([
                    api.get("/drivers/profile"),
                    api.get("/trucks/mine")
                ]);

                const driver = profileRes.data.data;
                const driverTrucks = trucksRes.data.data;

                setStats({
                    totalTrips: driver.totalTrips || 0,
                    earnings: driver.totalEarnings || 0,
                    rating: driver.rating || 5.0,
                    activeJobs: 0
                });
                setTrucks(driverTrucks);
            } catch (error) {
                console.error("Failed to fetch driver stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDriverData();
    }, []);

    const hasApprovedTruck = trucks.some(t => t.status === 'APPROVED');
    const hasPendingTruck = trucks.some(t => t.status === 'PENDING');

    const cards = [
        { label: t("Earnings", "উপার্জন"), value: `৳${stats.earnings.toLocaleString()}`, icon: DollarSign, color: "bg-green-500", href: "/driver/earnings" },
        { label: t("Total Trips", "মোট ট্রিপ"), value: stats.totalTrips, icon: Truck, color: "bg-blue-500", href: "/driver/bookings" },
        { label: t("Rating", "রেটিং"), value: stats.rating.toFixed(1), icon: Star, color: "bg-amber-500", href: "/driver/settings" },
    ];

    return (
        <DashboardLayout requiredRole="DRIVER">
            <header className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Driver Dashboard", "ড্রাইভার ড্যাশবোর্ড")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Manage your bookings, earnings, and vehicle status.", "আপনার বুকিং, উপার্জন এবং যানবাহনের অবস্থা পরিচালনা করুন।")}
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-white p-1 rounded-full border border-slate-100 shadow-sm">
                    <div className="bg-green-500 w-3 h-3 rounded-full ml-4 animate-pulse"></div>
                    <span className="text-sm font-bold pr-4 text-slate-900">{t("Available for Jobs", "কাজের জন্য প্রস্তুত")}</span>
                </div>
            </header>

            {!loading && !hasApprovedTruck && (
                <div className="mb-10 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-center gap-4 text-center md:text-left">
                        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                            <Truck className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-slate-900 mb-1">
                                {hasPendingTruck
                                    ? t("Truck Verification Pending", "ট্রাক ভেরিফিকেশন পেন্ডিং")
                                    : t("No Approved Truck Found", "কোনো অনুমোদিত ট্রাক খুঁজে পাওয়া যায়নি")
                                }
                            </h2>
                            <p className="text-sm font-bold text-slate-600">
                                {hasPendingTruck
                                    ? t("Your truck is under review. Please wait for admin approval to start receiving bookings.", "আপনার ট্রাক রিভিউ করা হচ্ছে। বুকিং শুরু করতে অ্যাডমিনের অনুমোদনের জন্য অপেক্ষা করুন।")
                                    : t("You must register a truck and get it approved before you can accept bookings.", "বুকিং গ্রহণ করার আগে আপনাকে একটি ট্রাক নিবন্ধন করতে হবে এবং তা অনুমোদন করতে হবে।")
                                }
                            </p>
                        </div>
                    </div>
                    {!hasPendingTruck && (
                        <Button onClick={() => router.push("/driver/trucks/new")} className="h-12 px-8 rounded-xl font-black bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20">
                            {t("Add a Truck Now", "এখনই ট্রাক যোগ করুন")}
                        </Button>
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {cards.map((card, idx) => (
                    <div key={idx} onClick={() => router.push(card.href)} className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm flex items-center gap-6 cursor-pointer hover:border-primary/20 transition-all">
                        <div className={`${card.color} w-14 h-14 rounded-lg flex items-center justify-center text-white`}>
                            <card.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-slate-600 text-xs font-bold uppercase tracking-widest mb-1">{card.label}</p>
                            <p className="text-2xl font-black text-slate-950">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className={cn(
                "rounded-xl p-10 border mb-10 relative overflow-hidden transition-all",
                hasApprovedTruck ? "bg-primary/5 border-primary/10" : "bg-slate-50 border-slate-200 opacity-75 grayscale"
            )}>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
                    <div>
                        <h2 className="text-2xl font-black text-slate-950 mb-2">{t("Find New Jobs", "নতুন কাজ খুঁজুন")}</h2>
                        <p className="text-slate-700 font-bold">
                            {hasApprovedTruck
                                ? t("There are several new booking requests in your current area.", "আপনার বর্তমান এলাকায় বেশ কিছু নতুন বুকিং রিকোয়েস্ট আছে।")
                                : t("Unlock job feed by registering and verifying your truck.", "ট্রাক নিবন্ধন এবং যাচাই করে জব ফিড আনলক করুন।")
                            }
                        </p>
                    </div>
                    <Button
                        disabled={!hasApprovedTruck}
                        onClick={() => router.push("/driver/jobs")}
                        size="lg"
                        className="rounded-lg h-14 px-8 font-black text-lg gap-3 text-white"
                    >
                        {t("View Job Feed", "জব ফিড দেখুন")}
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-950">{t("Upcoming Trips", "আসন্ন ট্রিপসমূহ")}</h3>
                    <button onClick={() => router.push("/driver/bookings")} className="text-slate-600 font-bold text-sm hover:text-primary transition-colors">{t("History", "ইতিহাস")}</button>
                </div>
                <div className="p-20 text-center">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 text-slate-200" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-600 mb-1">{t("No assigned trips yet", "এখনও কোনো ট্রিপ বরাদ্দ করা হয়নি")}</h4>
                    <p className="text-slate-600 text-sm font-bold">{t("Requests you accept will appear here.", "আপনার গ্রহণ করা রিকোয়েস্টগুলো এখানে দেখা যাবে।")}</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
