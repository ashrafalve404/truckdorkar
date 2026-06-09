"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    MessageSquare,
    AlertCircle,
    CheckCircle,
    Clock,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function AdminSupportPage() {
    const { t } = useLanguage();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTickets = async () => {
        try {
            const response = await api.get("/support/tickets");
            setTickets(response.data.data);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const stats = {
        open: tickets.filter(t => t.status === 'OPEN').length,
        resolved: tickets.filter(t => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
        urgent: tickets.filter(t => t.priority === 'URGENT' && t.status !== 'CLOSED').length,
    };

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Support Center", "সাপোর্ট সেন্টার")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Manage customer and driver queries, disputes and tickets.", "কাস্টমার এবং ড্রাইভারদের জিজ্ঞাসা এবং অভিযোগ পরিচালনা করুন।")}
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-black">
                {[
                    { label: t("Open Tickets", "খোলা টিকেট"), value: stats.open, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
                    { label: t("Resolved", "সমাধানকৃত"), value: stats.resolved, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
                    { label: t("Urgent", "জরুরি"), value: stats.urgent, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-950 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-950">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {loading ? (
                <div className="p-20 flex justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : tickets.length > 0 ? (
                <div className="bg-white rounded-lg border border-slate-100 overflow-hidden text-black">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100 uppercase text-[10px] font-black tracking-widest">
                            <tr>
                                <th className="px-8 py-4">{t("User", "ইউজার")}</th>
                                <th className="px-8 py-4">{t("Subject", "বিষয়")}</th>
                                <th className="px-8 py-4">{t("Priority", "অগ্রাধিকার")}</th>
                                <th className="px-8 py-4">{t("Status", "স্ট্যাটাস")}</th>
                                <th className="px-8 py-4 text-right">{t("Actions", "অ্যাকশন")}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 font-bold text-sm">
                            {tickets.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-slate-50/50 transition-all">
                                    <td className="px-8 py-4">
                                        <p className="text-slate-950">{ticket.user.name}</p>
                                        <p className="text-[10px] text-slate-500">{ticket.user.phone}</p>
                                    </td>
                                    <td className="px-8 py-4 text-slate-800">{ticket.subject}</td>
                                    <td className="px-8 py-4">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-[10px]",
                                            ticket.priority === 'URGENT' ? 'bg-red-100 text-red-600' :
                                                ticket.priority === 'HIGH' ? 'bg-orange-100 text-orange-600' :
                                                    'bg-blue-100 text-blue-600'
                                        )}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4">
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-[10px]",
                                            ticket.status === 'OPEN' ? 'bg-amber-100 text-amber-600' :
                                                ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600' :
                                                    'bg-green-100 text-green-600'
                                        )}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <Button variant="default" size="sm" className="rounded-lg h-9 font-bold px-4 text-white">
                                            {t("View", "দেখুন")}
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-lg border border-slate-100 p-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-950 mb-2">{t("No Support Tickets", "কোন সাপোর্ট টিকেট নেই")}</h3>
                    <p className="text-slate-700 font-bold max-w-sm mx-auto mb-8">
                        {t("All clear! Currently there are no pending customer or driver tickets that need your attention.", "সব ঠিক আছে! বর্তমানে কোন কাস্টমার বা ড্রাইভার টিকেট আপনার অপেক্ষায় নেই।")}
                    </p>
                </div>
            )}
        </DashboardLayout>
    );
}
