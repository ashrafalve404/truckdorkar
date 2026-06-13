"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    MessageSquare,
    Search,
    Loader2,
    CheckCircle,
    Clock,
    AlertCircle,
    User,
    ArrowUpDown
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function AgentSupportPage() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [tickets, setTickets] = useState<any[]>([]);
    const [filter, setFilter] = useState<"all" | "open" | "in_progress" | "resolved">("all");

    const fetchTickets = async () => {
        try {
            const res = await api.get("/support/tickets");
            setTickets(res.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch tickets", error);
            toast.error(t("Failed to load tickets", "টিকেট লোড করতে ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const openCount = tickets.filter(t => t.status === "OPEN").length;
    const inProgressCount = tickets.filter(t => t.status === "IN_PROGRESS").length;
    const resolvedCount = tickets.filter(t => t.status === "RESOLVED" || t.status === "CLOSED").length;

    const filteredTickets = filter === "all"
        ? tickets
        : tickets.filter(t => t.status.toLowerCase() === filter.replace("_", "_"));

    const getStatusColor = (status: string) => {
        switch (status) {
            case "OPEN": return "bg-red-50 text-red-600";
            case "IN_PROGRESS": return "bg-amber-50 text-amber-600";
            case "RESOLVED": return "bg-green-50 text-green-600";
            case "CLOSED": return "bg-slate-100 text-slate-600";
            default: return "bg-slate-100 text-slate-600";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "URGENT": return "bg-red-100 text-red-600";
            case "HIGH": return "bg-orange-100 text-orange-600";
            case "MEDIUM": return "bg-amber-50 text-amber-600";
            case "LOW": return "bg-slate-100 text-slate-600";
            default: return "bg-slate-100 text-slate-600";
        }
    };

    return (
        <DashboardLayout requiredRole="AGENT">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Support Tickets", "সাপোর্ট টিকেট")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Handle customer inquiries and resolve issues.", "কাস্টমারদের জিজ্ঞাসা সমাধান করুন এবং সাহায্য করুন।")}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-950" />
                        <input
                            type="text"
                            placeholder={t("Search tickets...", "টিকেট খুঁজুন...")}
                            className="bg-white h-12 pl-12 pr-6 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/10 outline-none w-72 font-black text-sm text-slate-950 placeholder:text-slate-500"
                        />
                    </div>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {[
                    { label: t("My Assigned", "আমার দায়িত্ব"), value: resolvedCount, icon: User, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: t("Pending", "অপেক্ষমান"), value: openCount, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
                    { label: t("In Progress", "চলমান"), value: inProgressCount, icon: AlertCircle, color: "text-purple-500", bg: "bg-purple-50" },
                    { label: t("Resolved", "সমাধান"), value: resolvedCount, icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
                ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div key={idx} className="bg-white p-5 md:p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-lg ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">{item.label}</p>
                                <p className="text-xl font-black text-slate-950">{item.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {(["all", "open", "in_progress", "resolved"] as const).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filter === f
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                    >
                        {f === "all" ? t("All", "সব") :
                            f === "open" ? t("Open", "খোলা") :
                                f === "in_progress" ? t("In Progress", "চলমান") :
                                    t("Resolved", "সমাধান")}
                    </button>
                ))}
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-20 flex justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : filteredTickets.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{t("No Active Tickets", "কোন সক্রিয় টিকেট নেই")}</h3>
                        <p className="text-sm text-slate-500 font-bold max-w-sm mx-auto">
                            {t("You have responded to all assigned tickets. Good job!", "আপনার জন্য নির্ধারিত সকল টিকেটের উত্তর দেওয়া হয়েছে। অভিনন্দন!")}
                        </p>
                        <Button className="mt-6 rounded-lg font-black h-12 px-8 text-white">{t("Browse Queue", "কিউ দেখুন")}</Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-950">{t("Ticket", "টিকেট")}</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-950">{t("Customer", "গ্রাহক")}</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-950">{t("Subject", "বিষয়")}</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-950">{t("Priority", "অগ্রাধিকার")}</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-950">{t("Status", "স্ট্যাটাস")}</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-950 text-right">{t("Date", "তারিখ")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredTickets.map((ticket) => (
                                    <tr key={ticket.id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-slate-950">#{ticket.id?.slice(-6) || "----"}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-slate-700">{ticket.user?.name || "—"}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-bold text-slate-900">{ticket.subject}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getPriorityColor(ticket.priority)}`}>
                                                {ticket.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${getStatusColor(ticket.status)}`}>
                                                {ticket.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-xs text-slate-500 font-bold">
                                                {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
