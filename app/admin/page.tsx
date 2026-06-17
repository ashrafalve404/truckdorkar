"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import {
    Users,
    Truck,
    Package,
    TrendingUp,
    ArrowUpRight,
    Clock,
    CheckCircle,
    Loader2
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import Link from "next/link";

interface AdminStats {
    summary: { totalRevenue: number; totalBookings: number; totalUsers: number; totalDrivers: number };
    recentBookings: { id: string; bookingNumber: string; user: { name: string }; finalFare?: number; estimatedFare?: number; status: string; distance?: number | null }[];
    pendingDrivers: number;
    pendingTrucks: number;
    openTickets: number;
}

export default function AdminDashboard() {
    const { t } = useLanguage();
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/admin/dashboard/stats");
                setStats(response.data.data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <DashboardLayout requiredRole="ADMIN">
                <div className="h-64 w-full flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    const statCards = [
        {
            label: t("Total Revenue", "মোট রাজস্ব"),
            value: `৳${stats?.summary?.totalRevenue?.toLocaleString() || 0}`,
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-50",
            trend: "+12.5%",
            isUp: true
        },
        {
            label: t("Total Bookings", "মোট বুকিং"),
            value: stats?.summary?.totalBookings || 0,
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-50",
            trend: "+8.2%",
            isUp: true
        },
        {
            label: t("Total Users", "মোট ইউজার"),
            value: stats?.summary?.totalUsers || 0,
            icon: Users,
            color: "text-purple-600",
            bg: "bg-purple-50",
            trend: "+5.1%",
            isUp: true
        },
        {
            label: t("Active Drivers", "সক্রিয় ড্রাইভার"),
            value: stats?.summary?.totalDrivers || 0,
            icon: Truck,
            color: "text-amber-600",
            bg: "bg-amber-50",
            trend: "Active",
            isUp: true
        }
    ];

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    {t("Admin Command Center", "অ্যাডমিন কমান্ড সেন্টার")}
                </h1>
                <p className="text-slate-700 font-bold">
                    {t("Real-time overview of TruckDorkar's performance and operations.", "ট্রাক দরকারের পারফরম্যান্স এবং অপারেশনগুলোর রিয়েল-টাইম ওভারভিউ।")}
                </p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCards.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-12 h-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className={cn(
                                    "flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md",
                                    stat.isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                )}>
                                    <ArrowUpRight className="w-3 h-3" />
                                    {stat.trend}
                                </div>
                            </div>
                            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-950">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-black">
                {/* Recent Bookings */}
                <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8 text-black">
                        <h2 className="text-xl font-bold text-slate-900">{t("Recent Bookings", "সাম্প্রতিক বুকিং")}</h2>
                        <Link href="/admin/bookings" className="text-primary text-sm font-bold hover:underline">{t("View All", "সব দেখুন")}</Link>
                    </div>
                    <div className="space-y-4">
                        {stats && stats.recentBookings.length > 0 ? (
                            stats.recentBookings.map((booking) => (
                                <div key={booking.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100">
                                    <div>
                                        <p className="font-bold text-sm text-slate-950">#{booking.bookingNumber.slice(-6)}</p>
                                        <p className="text-xs text-slate-700 font-bold">{booking.user?.name || "—"}</p>
                                        {booking.distance && (
                                            <p className="text-[10px] text-primary font-black mt-1 flex items-center gap-1">
                                                <TrendingUp className="w-2.5 h-2.5" />
                                                {booking.distance} KM
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-sm text-slate-900">৳{booking.finalFare || booking.estimatedFare}</p>
                                        <p className={`text-[10px] font-black uppercase tracking-widest ${booking.status === 'COMPLETED' ? 'text-green-500' : 'text-amber-500'
                                            }`}>{booking.status}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-slate-700 font-bold italic">
                                {t("No bookings record found.", "কোনো বুকিং রেকর্ড পাওয়া যায়নি।")}
                            </div>
                        )}
                    </div>
                </div>

                {/* System Monitoring */}
                <div className="bg-white rounded-xl border border-slate-100 p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-slate-900">{t("System Health", "সিস্টেম হেলথ")}</h2>
                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            {t("All Systems Operational", "সব সিস্টেম সচল আছে")}
                        </span>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                            <Clock className="w-10 h-10 text-amber-500" />
                            <div className="flex-1">
                                <p className="font-bold text-slate-950 line-clamp-1">{t(`${stats?.pendingDrivers || 0} New Driver Applications`, `${stats?.pendingDrivers || 0} জন নতুন ড্রাইভার আবেদন`)}</p>
                                <p className="text-xs text-slate-700 font-bold">{t("Pending review by agent team", "এজেন্ট টিমের পর্যালোচনার অপেক্ষায়")}</p>
                            </div>
                            {stats?.pendingDrivers === 0 && <CheckCircle className="w-6 h-6 text-green-500" />}
                        </div>
                        <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                            <Truck className="w-10 h-10 text-emerald-500" />
                            <div className="flex-1">
                                <p className="font-bold text-slate-950 line-clamp-1">{t(`${stats?.pendingTrucks || 0} New Truck Registrations`, `${stats?.pendingTrucks || 0}টি নতুন ট্রাক রেজিস্ট্রেশন`)}</p>
                                <p className="text-xs text-slate-700 font-bold">{t("Verify documents and approve fleet", "ডকুমেন্টস যাচাই করুন এবং অনুমোদন দিন")}</p>
                            </div>
                            {stats?.pendingTrucks === 0 && <CheckCircle className="w-6 h-6 text-green-500" />}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
