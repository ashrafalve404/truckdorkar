"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Users,
    Truck,
    Package,
    MessageSquare,
    CheckCircle,
    Clock,
    AlertCircle,
    Loader2,
    TrendingUp
} from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function AgentDashboard() {
    const { t } = useLanguage();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [counts, setCounts] = useState({
        pendingTrucks: 0,
        myTrucksCount: 0,
        totalCommission: 0,
        todayBookings: 0,
        totalTrips: 0,
    });
    const [recentTickets, setRecentTickets] = useState<any[]>([]);
    const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [dashRes, ticketsRes, driversRes] = await Promise.all([
                    api.get("/agents/dashboard"),
                    api.get("/support/tickets"),
                    api.get("/drivers"),
                ]);

                const dashData = dashRes.data?.data || {};
                setCounts({
                    pendingTrucks: dashData.counts?.pendingTrucks || 0,
                    myTrucksCount: dashData.counts?.myTrucksCount || 0,
                    totalCommission: dashData.counts?.totalCommission || 0,
                    todayBookings: dashData.counts?.todayBookings || 0,
                    totalTrips: dashData.counts?.totalTrips || 0,
                });

                const tickets = ticketsRes.data?.data || [];
                setRecentTickets(tickets.slice(0, 5));

                const driversList = driversRes.data?.data?.drivers || [];
                const pending = driversList.filter((d: any) => d.status === "PENDING");
                setPendingApprovals(pending.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch agent dashboard", error);
                toast.error(t("Failed to load dashboard data", "ড্যাশবোর্ড ডেটা লোড করতে ব্যর্থ হয়েছে"));
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const stats = [
        { label: t("My Registered Trucks", "আমার নিবন্ধিত ট্রাক"), value: counts.myTrucksCount, icon: Truck, color: "text-blue-500", bg: "bg-blue-50", href: "/agent/trucks" },
        { label: t("Total Commission", "মোট কমিশন"), value: `৳${counts.totalCommission.toLocaleString()}`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-50", href: "/agent/earnings" },
        { label: t("Successful Trips", "সফল ট্রিপ"), value: counts.totalTrips, icon: Package, color: "text-purple-500", bg: "bg-purple-50", href: "/agent/earnings" },
        { label: t("Pending Trucks", "অপেক্ষমান ট্রাক"), value: counts.pendingTrucks, icon: Clock, color: "text-amber-500", bg: "bg-amber-50", href: "/agent/trucks" },
    ];

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
                    {t("Agent Dashboard", "এজেন্ট ড্যাশবোর্ড")}
                </h1>
                <p className="text-slate-700 font-bold">
                    {t("Manage your registered trucks, support requests, and commissions.", "আপনার নিবন্ধিত ট্রাক, সাপোর্ট রিকোয়েস্ট এবং কমিশন পরিচালনা করুন।")}
                </p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {stats.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={idx}
                            onClick={() => router.push(item.href)}
                            className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:border-primary/20 transition-all cursor-pointer"
                        >
                            <div className={`w-12 h-12 rounded-lg ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-2xl font-black text-slate-950">{item.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Recent Tickets */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">{t("Recent Tickets", "সাম্প্রতিক টিকেট")}</h3>
                        <button onClick={() => router.push("/agent/support")} className="text-primary text-sm font-bold hover:underline">{t("View All", "সব দেখুন")}</button>
                    </div>
                    {recentTickets.length > 0 ? (
                        <div className="space-y-3">
                            {recentTickets.map((ticket) => (
                                <div key={ticket.id} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${ticket.priority === 'URGENT' ? 'bg-red-100' : ticket.priority === 'HIGH' ? 'bg-orange-100' : 'bg-purple-50'}`}>
                                        <AlertCircle className={`w-5 h-5 ${ticket.priority === 'URGENT' ? 'text-red-500' : ticket.priority === 'HIGH' ? 'text-orange-500' : 'text-purple-500'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-slate-900 truncate">{ticket.subject}</p>
                                        <p className="text-xs text-slate-500 font-bold">{ticket.user?.name || "Unknown"} · {new Date(ticket.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${ticket.status === 'OPEN' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {ticket.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm font-bold text-slate-500">{t("No support tickets yet", "কোনো সাপোর্ট টিকেট নেই")}</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
