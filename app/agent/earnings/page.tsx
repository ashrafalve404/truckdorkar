"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    TrendingUp,
    Package,
    Navigation,
    Truck,
    Calendar,
    Loader2,
    DollarSign
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

interface TripEarnings {
    id: string;
    bookingNumber: string;
    truckName: string;
    truckReg: string;
    driverName: string;
    driverPhone: string;
    fare: number;
    commission: number;
    completedAt: string;
    distance: number;
}

export default function AgentEarnings() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [earningsData, setEarningsData] = useState<{
        totalCommissions: number;
        totalTrips: number;
        trips: TripEarnings[];
    } | null>(null);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const response = await api.get("/agents/earnings");
                setEarningsData(response.data.data);
            } catch (error) {
                console.error("Failed to fetch agent earnings", error);
                toast.error(t("Failed to load earnings data", "উপার্জন ডেটা লোড করতে ব্যর্থ হয়েছে"));
            } finally {
                setLoading(false);
            }
        };

        fetchEarnings();
    }, []);

    if (loading) {
        return (
            <DashboardLayout requiredRole="AGENT">
                <div className="h-64 w-full flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout requiredRole="AGENT">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    {t("Earnings & Commissions", "উপার্জন এবং কমিশন")}
                </h1>
                <p className="text-slate-700 font-bold">
                    {t("Track your earnings (20% of platform commission) from every successful trip of trucks you registered.", "আপনার নিবন্ধিত ট্রাকের প্রতিটি সফল ট্রিপ থেকে আপনার উপার্জন (প্ল্যাটফর্ম কমিশনের ২০%) ট্র্যাক করুন।")}
                </p>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{t("Total Commission", "মোট কমিশন")}</p>
                        <p className="text-4xl font-black text-slate-950">৳{earningsData?.totalCommissions.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <Package className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{t("Successful Trips", "সফল ট্রিপ")}</p>
                        <p className="text-4xl font-black text-slate-950">{earningsData?.totalTrips}</p>
                    </div>
                </div>
            </div>

            {/* Trip History Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-50">
                    <h3 className="text-lg font-bold text-slate-900">{t("Commission History", "কমিশন ইতিহাস")}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                                <th className="px-6 py-4">{t("Booking / Truck", "বুকিং / ট্রাক")}</th>
                                <th className="px-6 py-4">{t("Driver", "ড্রাইভার")}</th>
                                <th className="px-6 py-4">{t("Trip Info", "ট্রিপ তথ্য")}</th>
                                <th className="px-6 py-4">{t("Fare / Commission", "ভাড়া / কমিশন")}</th>
                                <th className="px-6 py-4">{t("Date", "তারিখ")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {earningsData?.trips.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic font-bold">
                                        {t("No trips completed yet.", "এখনো কোনো ট্রিপ সম্পন্ন হয়নি।")}
                                    </td>
                                </tr>
                            ) : (
                                earningsData?.trips.map((trip) => (
                                    <tr key={trip.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-slate-900">#{trip.bookingNumber.slice(-6)}</span>
                                                <div className="flex items-center gap-1.5 mt-1">
                                                    <Truck className="w-3 h-3 text-primary" />
                                                    <span className="text-[10px] font-bold text-slate-600">{trip.truckName}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-900">{trip.driverName}</span>
                                                <span className="text-[10px] text-slate-500 font-bold">{trip.driverPhone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Navigation className="w-3 h-3 text-slate-400" />
                                                    <span className="text-xs font-bold text-slate-700">{trip.distance} KM</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-slate-500 font-black uppercase tracking-tighter">Fare: ৳{trip.fare}</span>
                                                <span className="text-sm font-black text-green-600 mt-1">৳{trip.commission.toLocaleString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(trip.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
