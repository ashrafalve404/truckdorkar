"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import {
    Users,
    Truck,
    Package,
    MessageSquare,
    CheckCircle,
    Clock,
    AlertCircle
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import api from "@/lib/api";

export default function EmployeeDashboard() {
    const { t } = useLanguage();
    const [counts, setCounts] = useState({
        pendingTrucks: 5,
        pendingDrivers: 8,
        activeTickets: 12,
        todayBookings: 24
    });

    return (
        <DashboardLayout requiredRole="EMPLOYEE">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    {t("Operations Dashboard", "অপারেশন ড্যাশবোর্ড")}
                </h1>
                <p className="text-slate-500 font-medium font-bold">
                    {t("Manage driver verification, support requests, and daily operations.", "ড্রাইভার ভেরিফিকেশন, সাপোর্ট রিকোয়েস্ট এবং দৈনন্দিন অপারেশন পরিচালনা করুন।")}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: t("Truck Verification", "ট্রাক ভেরিফিকেশন"), value: counts.pendingTrucks, icon: Truck, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: t("Driver Verification", "ড্রাইভার ভেরিফিকেশন"), value: counts.pendingDrivers, icon: Users, color: "text-amber-500", bg: "bg-amber-50" },
                    { label: t("Support Tickets", "সাপোর্ট টিকেট"), value: counts.activeTickets, icon: MessageSquare, color: "text-purple-500", bg: "bg-purple-50" },
                    { label: t("Today's Bookings", "আজকের বুকিং"), value: counts.todayBookings, icon: Package, color: "text-green-500", bg: "bg-green-50" },
                ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div key={idx} className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm">
                            <div className={`w-12 h-12 rounded-lg ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{item.label}</p>
                            <p className="text-2xl font-black text-slate-900">{item.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white rounded-lg border border-slate-100 p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-8">{t("Pending Approvals", "অপেক্ষমান অনুমোদন")}</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-white border border-slate-50 hover:border-primary/20 transition-all cursor-pointer">
                                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                                    {t("DOC", "ডকুমেন্ট")}
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900">{t("Md. Karim Uddin", "মো. করিম উদ্দিন")}</p>
                                    <p className="text-xs text-slate-400 font-medium">{t("Driving License Verification", "ড্রাইভিং লাইসেন্স ভেরিফিকেশন")}</p>
                                </div>
                                <Clock className="w-5 h-5 text-amber-500" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-100 p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-8">{t("Recent Tickets", "সাম্প্রতিক টিকেট")}</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-white border border-slate-50 hover:border-primary/20 transition-all cursor-pointer">
                                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center">
                                    <AlertCircle className="w-6 h-6 text-purple-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-900">{t("Fare Dispute - #TK1024", "ভাড়া নিয়ে অভিযোগ - #TK1024")}</p>
                                    <p className="text-xs text-slate-400 font-medium">{t("High Priority - 2 hours ago", "হাই প্রায়োরিটি - ২ ঘণ্টা আগে")}</p>
                                </div>
                                <div className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase">{t("URGENT", "জরুরি")}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
