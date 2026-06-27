"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Bell,
    CheckCircle,
    Info,
    Truck,
    Package,
    Clock,
    MessageSquare,
    Loader2
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function AgentNotificationsPage() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState<any[]>([]);

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notifications");
            setNotifications(res.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
            toast.error(t("Failed to load notifications", "নোটিফিকেশন লোড করতে ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const iconMap: Record<string, any> = {
        BOOKING: Package,
        QUOTATION: MessageSquare,
        PAYMENT: CheckCircle,
        SYSTEM: Info,
        SUPPORT: MessageSquare,
        DRIVER: Truck,
    };

    const colorMap: Record<string, { icon: string; bg: string }> = {
        BOOKING: { icon: "text-blue-500", bg: "bg-blue-50" },
        QUOTATION: { icon: "text-amber-500", bg: "bg-amber-50" },
        PAYMENT: { icon: "text-green-500", bg: "bg-green-50" },
        SYSTEM: { icon: "text-purple-500", bg: "bg-purple-50" },
        SUPPORT: { icon: "text-red-500", bg: "bg-red-50" },
        DRIVER: { icon: "text-indigo-500", bg: "bg-indigo-50" },
    };

    const getTimeAgo = (dateStr: string) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 60) return `${diffMins} mins ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    };

    return (
        <DashboardLayout requiredRole="AGENT">
            <header className="mb-10 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Notifications", "নোটিফিকেশন")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Stay updated with system activities and urgent tasks.", "সিস্টেম অ্যাক্টিভিটি এবং জরুরি কাজগুলো সম্পর্কে আপডেট থাকুন।")}
                    </p>
                </div>
                <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                    {notifications.filter((n) => !n.isRead).length} {t("unread", "অপঠিত")}
                </span>
            </header>

            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-20 flex justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-20 text-center">
                        <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{t("No notifications", "কোনো নোটিফিকেশন নেই")}</h3>
                        <p className="text-sm text-slate-500 font-bold">{t("You're all caught up!", "আপনি সবসময় আপডেট আছেন!")}</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {notifications.map((notif) => {
                            const Icon = iconMap[notif.type] || Bell;
                            const colors = colorMap[notif.type] || { icon: "text-slate-500", bg: "bg-slate-50" };
                            return (
                                <div
                                    key={notif.id}
                                    className={`p-5 md:p-6 hover:bg-slate-50/50 transition-all flex items-start gap-4 ${!notif.isRead ? "bg-primary/5" : ""}`}
                                >
                                    <div className={`w-11 h-11 rounded-xl ${colors.bg} ${colors.icon} flex items-center justify-center shrink-0`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-4 mb-1">
                                            <h3 className="font-black text-sm text-slate-900">{notif.title}</h3>
                                            <span className="text-xs text-slate-500 font-bold whitespace-nowrap">{getTimeAgo(notif.createdAt)}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 font-bold leading-relaxed">{notif.body}</p>
                                    </div>
                                    {!notif.isRead && (
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0 mt-2" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                {notifications.length > 0 && (
                    <div className="p-5 bg-slate-50 flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-bold">
                            {notifications.filter((n) => !n.isRead).length} {t("unread notifications", "টি অপঠিত নোটিফিকেশন")}
                        </span>
                        <button className="text-sm font-black text-primary hover:underline">
                            {t("Mark all as read", "সব পড়া হিসেবে মার্ক করুন")}
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
