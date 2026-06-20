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
    Users,
    MessageSquare,
    Loader2,
    ArrowRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/use-auth";
import { useNotifications } from "@/store/use-notifications";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function AdminNotificationsPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const { notifications, unreadCount, loading, fetchNotifications, markAllAsRead } = useNotifications();

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
        USER: Users,
    };

    const colorMap: Record<string, { icon: string; bg: string }> = {
        BOOKING: { icon: "text-blue-500", bg: "bg-blue-50" },
        QUOTATION: { icon: "text-amber-500", bg: "bg-amber-50" },
        PAYMENT: { icon: "text-green-500", bg: "bg-green-50" },
        SYSTEM: { icon: "text-purple-500", bg: "bg-purple-50" },
        SUPPORT: { icon: "text-red-500", bg: "bg-red-50" },
        DRIVER: { icon: "text-indigo-500", bg: "bg-indigo-50" },
        USER: { icon: "text-cyan-500", bg: "bg-cyan-50" },
    };

    const handleAction = (notif: any) => {
        const data = notif.data || {};

        if (data.truckId) {
            router.push(`/admin/agents/${data.agentId}/trucks`);
        } else if (data.role === 'AGENT') {
            router.push('/admin/agents');
        } else if (data.role === 'DRIVER') {
            router.push('/admin/drivers');
        } else if (data.role === 'USER') {
            router.push('/admin/users');
        } else {
            router.push('/admin/users');
        }
    };

    const getTimeAgo = (dateStr: string) => {
        const now = new Date();
        const date = new Date(dateStr);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return t("Just now", "এইমাত্র");
        if (diffMins < 60) return `${diffMins} mins ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    };

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Admin Notifications", "এডমিন নোটিফিকেশন")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Monitor system registrations and urgent verification requests.", "সিস্টেম রেজিস্ট্রেশন এবং জরুরি ভেরিফিকেশন অনুরোধগুলো মনিটর করুন।")}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full">
                        {notifications.filter((n) => !n.isRead).length} {t("new alerts", "নতুন এলার্ট")}
                    </span>
                    <button
                        onClick={markAllAsRead}
                        className="text-xs font-black text-primary hover:underline"
                    >
                        {t("Mark all as read", "সব পড়া হিসেবে মার্ক করুন")}
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden text-slate-950">
                {loading ? (
                    <div className="p-20 flex justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-20 text-center">
                        <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{t("No alerts yet", "এখনো কোনো এলার্ট নেই")}</h3>
                        <p className="text-sm text-slate-500 font-bold">{t("System is running smoothly.", "সিস্টেম সঠিকভাবে চলছে।")}</p>
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
                                    <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.icon} flex items-center justify-center shrink-0`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-4 mb-1">
                                            <h3 className="font-black text-base text-slate-900 leading-tight">{notif.title}</h3>
                                            <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap uppercase tracking-tighter">{getTimeAgo(notif.createdAt)}</span>
                                        </div>
                                        <p className="text-sm text-slate-600 font-bold leading-relaxed">{notif.body}</p>

                                        {/* Action Hint */}
                                        {(notif.data?.agentId || notif.data?.userId || notif.data?.truckId) && (
                                            <div className="mt-3 flex items-center gap-2">
                                                <button
                                                    onClick={() => handleAction(notif)}
                                                    className="text-[11px] font-black text-primary hover:underline flex items-center gap-1 group"
                                                >
                                                    {t("View User Details", "ইউজার ডিটেইলস দেখুন")}
                                                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    {!notif.isRead && (
                                        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2.5 shadow-sm shadow-primary/40" />
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
