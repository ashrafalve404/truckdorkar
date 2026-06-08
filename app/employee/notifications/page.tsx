"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Bell,
    CheckCircle,
    Info,
    Truck,
    Package,
    Clock
} from "lucide-react";

export default function EmployeeNotificationsPage() {
    const { t } = useLanguage();

    const notifications = [
        {
            id: 1,
            title: t("New Driver Registered", "নতুন ড্রাইভার রেজিস্ট্রেশন"),
            message: t("A new driver has registered and is pending verification.", "একজন নতুন ড্রাইভার রেজিস্ট্রেশন করেছে এবং যাচাইয়ের অপেক্ষায় আছে।"),
            time: "5 mins ago",
            icon: Truck,
            color: "text-blue-500",
            bg: "bg-blue-50"
        },
        {
            id: 2,
            title: t("Urgent Booking Help", "জরুরি বুকিং সাহায্য"),
            message: t("Booking #12845 requires immediate coordinate with driver.", "বুকিং #১২৮৪৫ এর জন্য ড্রাইভারের সাথে জরুরি সমন্বয় প্রয়োজন।"),
            time: "1 hour ago",
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-50"
        },
        {
            id: 3,
            title: t("Monthly Target Reached", "মাসিক লক্ষ্য অর্জিত"),
            message: t("Congratulations! The team has reached the monthly booking target.", "অভিনন্দন! টিম মাসিক বুকিং লক্ষ্যমাত্রা অর্জন করেছে।"),
            time: "2 days ago",
            icon: CheckCircle,
            color: "text-green-500",
            bg: "bg-green-50"
        },
    ];

    return (
        <DashboardLayout requiredRole="EMPLOYEE">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    {t("Notifications", "নোটিফিকেশন")}
                </h1>
                <p className="text-slate-700 font-bold">
                    {t("Stay updated with system activities and urgent tasks.", "সিস্টেম অ্যাক্টিভিটি এবং জরুরি কাজগুলো সম্পর্কে আপডেট থাকুন।")}
                </p>
            </header>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-50">
                    {notifications.map((notif) => {
                        const Icon = notif.icon;
                        return (
                            <div key={notif.id} className="p-6 hover:bg-slate-50/50 transition-all flex items-start gap-4">
                                <div className={`w-12 h-12 rounded-xl ${notif.bg} ${notif.color} flex items-center justify-center shrink-0`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between gap-4 mb-1">
                                        <h3 className="font-black text-slate-950">{notif.title}</h3>
                                        <span className="text-xs text-slate-500 font-bold whitespace-nowrap">{notif.time}</span>
                                    </div>
                                    <p className="text-sm text-slate-700 font-bold leading-relaxed">{notif.message}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="p-6 bg-slate-50 text-center">
                    <button className="text-sm font-black text-primary hover:underline">
                        {t("Mark all as read", "সব পড়া হিসেবে মার্ক করুন")}
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}
