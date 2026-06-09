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
    Loader2
} from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function EmployeeDashboard() {
    const { t } = useLanguage();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [counts, setCounts] = useState({
        pendingTrucks: 0,
        pendingDrivers: 0,
        openTickets: 0,
        todayBookings: 0,
    });
    const [recentTickets, setRecentTickets] = useState<any[]>([]);
    const [pendingApprovals, setPendingApprovals] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [dashRes, ticketsRes, driversRes] = await Promise.all([
                    api.get("/employees/dashboard"),
                    api.get("/support/tickets"),
                    api.get("/drivers"),
                ]);

                const dashData = dashRes.data?.data || {};
                setCounts({
                    pendingTrucks: dashData.counts?.pendingTrucks || 0,
                    pendingDrivers: dashData.counts?.pendingDrivers || 0,
                    openTickets: dashData.counts?.openTickets || 0,
                    todayBookings: dashData.counts?.todayBookings || 0,
                });

                const tickets = ticketsRes.data?.data || [];
                setRecentTickets(tickets.slice(0, 5));

                const driversList = driversRes.data?.data?.drivers || [];
                const pending = driversList.filter((d: any) => d.status === "PENDING");
                setPendingApprovals(pending.slice(0, 5));
            } catch (error) {
                console.error("Failed to fetch employee dashboard", error);
                toast.error(t("Failed to load dashboard data", "ড্যাশবোর্ড ডেটা লোড করতে ব্যর্থ হয়েছে"));
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const stats = [
        { label: t("Truck Verification", "ট্রাক ভেরিফিকেশন"), value: counts.pendingTrucks, icon: Truck, color: "text-blue-500", bg: "bg-blue-50", href: "/employee/drivers" },
        { label: t("Driver Verification", "ড্রাইভার যাচাই"), value: counts.pendingDrivers, icon: Users, color: "text-amber-500", bg: "bg-amber-50", href: "/employee/drivers" },
        { label: t("Support Tickets", "সাপোর্ট টিকেট"), value: counts.openTickets, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-50", href: "/employee/support" },
        { label: t("Total Bookings", "মোট বুকিং"), value: counts.todayBookings, icon: Package, color: "text-green-500", bg: "bg-green-50", href: "/employee/bookings" },
    ];

    if (loading) {
        return (
            <DashboardLayout requiredRole="EMPLOYEE">
                <div className="h-64 w-full flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout requiredRole="EMPLOYEE">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    {t("Operations Dashboard", "অপারেশন ড্যাশবোর্ড")}
                </h1>
                <p className="text-slate-700 font-bold">
                    {t("Manage driver verification, support requests, and daily operations.", "ড্রাইভার ভেরিফিকেশন, সাপোর্ট রিকোয়েস্ট এবং দৈনন্দিন অপারেশন পরিচালনা করুন।")}
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Approvals */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">{t("Pending Approvals", "অপেক্ষমান অনুমোদন")}</h3>
                        <button onClick={() => router.push("/employee/drivers")} className="text-primary text-sm font-bold hover:underline">{t("View All", "সব দেখুন")}</button>
                    </div>
                    {pendingApprovals.length > 0 ? (
                        <div className="space-y-3">
                            {pendingApprovals.map((driver) => (
                                <div key={driver.id} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center font-black text-amber-600 text-xs">
                                        {t("DRV", "ড্রাই")}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-slate-900 truncate">{driver.user?.name || "Unknown"}</p>
                                        <p className="text-xs text-slate-500 font-bold">{driver.user?.phone || "—"}</p>
                                    </div>
                                    <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-wider">
                                        {t("PENDING", "অপেক্ষমান")}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-3" />
                            <p className="text-sm font-bold text-slate-500">{t("No pending approvals", "কোনো অনুমোদনের অপেক্ষায় নয়")}</p>
                        </div>
                    )}
                </div>

                {/* Recent Tickets */}
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">{t("Recent Tickets", "সাম্প্রতিক টিকেট")}</h3>
                        <button onClick={() => router.push("/employee/support")} className="text-primary text-sm font-bold hover:underline">{t("View All", "সব দেখুন")}</button>
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