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
    Loader2,
    CheckCheck
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";

export default function DriverNotificationsPage() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState<any[]>([]);

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notifications");
            setNotifications(res.data?.data || res.data || []);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAllAsRead = async () => {
        try {
            await api.patch("/notifications/read-all");
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            toast.success(t("All notifications marked as read", "সব নোটিফিকেশন পড়া হিসেবে চিহ্নিত করা হয়েছে"));
        } catch (error) {
            toast.error(t("Failed to mark as read", "চিহ্নিত করতে ব্যর্থ হয়েছে"));
        }
    };

    const markSingleAsRead = async (id: string) => {
        try {
            await api.patch(`/notifications/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Failed to mark notification read", error);
        }
    };

    const iconMap: Record<string, any> = {
        BOOKING: Package,
        PAYMENT: CheckCircle,
        SYSTEM: Info,
        SUPPORT: MessageSquare,
        DRIVER: Truck,
    };

    const colorMap: Record<string, { icon: string; bg: string }> = {
        BOOKING: { icon: "text-blue-500", bg: "bg-blue-50" },
        PAYMENT: { icon: "text-green-500", bg: "bg-green-50" },
        SYSTEM: { icon: "text-purple-500", bg: "bg-purple-50" },
        SUPPORT: { icon: "text-red-500", bg: "bg-red-50" },
        DRIVER: { icon: "text-indigo-500", bg: "bg-indigo-50" },
    };

    const getTimeAgo = (dateStr: string) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return t("Just now", "এইমাত্র");
        if (diffMins < 60) return t(`${diffMins} mins ago`, `${diffMins} মিনিট আগে`);
        if (diffHours < 24) return t(`${diffHours} hours ago`, `${diffHours} ঘণ্টা আগে`);
        return t(`${diffDays} days ago`, `${diffDays} দিন আগে`);
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <DashboardLayout requiredRole="DRIVER">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-1 flex items-center gap-3">
                        {t("Notifications", "নোটিফিকেশন")}
                        {unreadCount > 0 && (
                            <span className="px-3 py-1 text-xs bg-primary text-white font-bold rounded-full">
                                {unreadCount} {t("new", "নতুন")}
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-600 font-bold text-sm">
                        {t("Stay updated with trip requests, payments, and system alerts.", "ট্রিপ রিকোয়েস্ট, পেমেন্ট এবং সিস্টেম অ্যালার্টের আপডেট থাকুন।")}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <Button
                        onClick={markAllAsRead}
                        className="h-11 px-6 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-wider hover:bg-slate-800 shadow-md gap-2"
                    >
                        <CheckCheck className="w-4 h-4 text-green-400" />
                        {t("Mark All as Read", "সব পড়া হিসেবে মার্ক করুন")}
                    </Button>
                )}
            </header>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden p-6 md:p-8">
                {loading ? (
                    <div className="p-20 flex justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-16 text-center">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                            {t("No Notifications Yet", "কোনো নোটিফিকেশন নেই")}
                        </h3>
                        <p className="text-slate-500 font-bold text-sm max-w-sm mx-auto">
                            {t("You'll receive updates when new trips, trip acceptances, or payments occur.", "নতুন ট্রিপ, ট্রিপ অনুমোদন বা পেমেন্ট সংক্রান্ত আপডেট এখানে দেখা যাবে।")}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((item) => {
                            const IconComponent = iconMap[item.type] || Bell;
                            const colors = colorMap[item.type] || { icon: "text-slate-500", bg: "bg-slate-50" };

                            return (
                                <div
                                    key={item.id}
                                    onClick={() => !item.isRead && markSingleAsRead(item.id)}
                                    className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                                        item.isRead
                                            ? "bg-white border-slate-100"
                                            : "bg-slate-50/80 border-primary/20 shadow-sm"
                                    }`}
                                >
                                    <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center shrink-0`}>
                                        <IconComponent className={`w-6 h-6 ${colors.icon}`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <h4 className="text-base font-black text-slate-900 truncate">
                                                {item.title}
                                            </h4>
                                            <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {getTimeAgo(item.createdAt)}
                                            </span>
                                        </div>

                                        <p className="text-sm font-bold text-slate-600 leading-relaxed">
                                            {item.message}
                                        </p>
                                    </div>

                                    {!item.isRead && (
                                        <span className="w-3 h-3 rounded-full bg-primary shrink-0 mt-2" title="Unread" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
