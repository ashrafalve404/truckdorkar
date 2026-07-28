"use client";

import React, { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Wallet,
    CheckCircle2,
    XCircle,
    Loader2,
    Search,
    Phone,
    Clock,
    User,
    ArrowUpRight,
    Filter,
    DollarSign,
    Copy,
    Check
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface AgentWithdrawal {
    id: string;
    amount: number;
    bkashNumber: string;
    method: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    adminNote?: string;
    createdAt: string;
    agent: {
        id: string;
        user: {
            name: string;
            phone: string;
            email: string;
        };
    };
}

export default function AdminAgentWithdrawalsPage() {
    const { t } = useLanguage();
    const [withdrawals, setWithdrawals] = useState<AgentWithdrawal[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [search, setSearch] = useState("");
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fetchWithdrawals = async () => {
        try {
            const res = await api.get("/admin/agent-withdrawals");
            setWithdrawals(res.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch agent withdrawals", error);
            toast.error(t("Failed to load agent withdrawal requests", "এজেন্ট উত্তোলনের তালিকা লোড করতে ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, []);

    const handleApprove = async (id: string) => {
        const adminNote = prompt(t("Add bKash Cashout TrxID / Admin Note (optional):", "বিকাশ ট্রানজেকশন আইডি বা নোট দিন (ঐচ্ছিক):"));
        try {
            await api.patch(`/admin/agent-withdrawals/${id}/approve`, { adminNote });
            toast.success(t("Agent withdrawal request approved & agent notified!", "উত্তোলন আবেদনটি অনুমোদিত হয়েছে এবং এজেন্টকে নোটিফিকেশন পাঠানো হয়েছে!"));
            fetchWithdrawals();
        } catch (err: any) {
            toast.error(err.response?.data?.message || t("Failed to approve withdrawal", "অনুমোদন করতে ব্যর্থ হয়েছে"));
        }
    };

    const handleReject = async (id: string) => {
        const adminNote = prompt(t("Reason for rejection:", "প্রত্যাখ্যানের কারণ:"));
        if (!adminNote) return;
        try {
            await api.patch(`/admin/agent-withdrawals/${id}/reject`, { adminNote });
            toast.success(t("Withdrawal request rejected", "উত্তোলন আবেদনটি প্রত্যাখ্যাত হয়েছে"));
            fetchWithdrawals();
        } catch (err: any) {
            toast.error(err.response?.data?.message || t("Failed to reject withdrawal", "প্রত্যাখ্যান করতে ব্যর্থ হয়েছে"));
        }
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success(t("bKash number copied!", "বিকাশ নম্বর কপি করা হয়েছে!"));
        setTimeout(() => setCopiedId(null), 2000);
    };

    const stats = useMemo(() => {
        let totalPending = 0;
        let totalApproved = 0;
        let pendingCount = 0;
        let approvedCount = 0;

        withdrawals.forEach((w) => {
            if (w.status === "PENDING") {
                totalPending += w.amount;
                pendingCount++;
            }
            if (w.status === "APPROVED") {
                totalApproved += w.amount;
                approvedCount++;
            }
        });

        return { totalPending, totalApproved, pendingCount, approvedCount };
    }, [withdrawals]);

    const filteredWithdrawals = useMemo(() => {
        return withdrawals.filter((w) => {
            const matchesStatus = statusFilter === "ALL" || w.status === statusFilter;
            const agentName = (w.agent?.user?.name || "").toLowerCase();
            const agentPhone = (w.agent?.user?.phone || "");
            const bkash = w.bkashNumber || "";
            const matchesSearch =
                agentName.includes(search.toLowerCase()) ||
                agentPhone.includes(search) ||
                bkash.includes(search);
            return matchesStatus && matchesSearch;
        });
    }, [withdrawals, statusFilter, search]);

    if (loading) {
        return (
            <DashboardLayout requiredRole="ADMIN">
                <div className="h-64 w-full flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Agent Money Withdrawals", "এজেন্টদের টাকা উত্তোলন")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Review, verify, and approve bKash money withdrawal requests from registered agents.", "নিবন্ধিত এজেন্টদের বিকাশ ক্যাশআউট আবেদনগুলো দেখুন ও অনুমোদন করুন।")}
                    </p>
                </div>
            </header>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{t("Pending Requests", "অপেক্ষমান আবেদন")}</p>
                        <p className="text-2xl font-black text-amber-600">{stats.pendingCount} {t("Requests", "টি")}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-sm">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{t("Pending Amount", "অপেক্ষমান টাকার পরিমাণ")}</p>
                        <p className="text-2xl font-black text-purple-600">৳{stats.totalPending.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{t("Total Disbursed", "মোট পরিশোধিত টাকা")}</p>
                        <p className="text-2xl font-black text-emerald-600">৳{stats.totalApproved.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{t("Total Requests", "সর্বমোট আবেদন")}</p>
                        <p className="text-2xl font-black text-slate-950">{withdrawals.length}</p>
                    </div>
                </div>
            </div>

            {/* WITHDRAWAL REQUESTS TABLE SECTION */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden space-y-4">
                {/* Header & Filter Controls */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900">{t("Agent Cashout Requests List", "এজেন্ট ক্যাশআউট আবেদনের তালিকা")}</h3>
                            <p className="text-xs text-slate-500 font-medium">{t("Verify bKash phone numbers and approve cashouts", "বিকাশ নম্বর যাচাই করে অর্থ প্রেরণ অনুমোদন করুন")}</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        {/* Search Input */}
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={t("Search agent or bKash...", "এজেন্ট বা বিকাশ নম্বর খুঁজুন...")}
                                className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>

                        {/* Status Filter Tabs */}
                        <div className="flex items-center bg-slate-100/80 p-1 rounded-xl gap-1 shrink-0 border border-slate-200/50">
                            {[
                                { id: "ALL", label: t("All", "সব") },
                                { id: "PENDING", label: t("Pending", "অপেক্ষমান") },
                                { id: "APPROVED", label: t("Approved", "অনুমোদিত") },
                                { id: "REJECTED", label: t("Rejected", "প্রত্যাখ্যাত") },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setStatusFilter(tab.id)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg text-xs font-black transition-all",
                                        statusFilter === tab.id
                                            ? "bg-white text-purple-600 shadow-sm border border-slate-200/60"
                                            : "text-slate-600 hover:text-slate-900"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {filteredWithdrawals.length === 0 ? (
                    <div className="p-16 text-center text-slate-500 font-bold">
                        {t("No agent withdrawal requests found matching your filter.", "কোনো এজেন্ট উত্তোলনের আবেদন পাওয়া যায়নি।")}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                    <th className="px-6 py-4">{t("Agent Details", "এজেন্ট বিস্তারিত")}</th>
                                    <th className="px-6 py-4">{t("Amount (৳)", "পরিমাণ")}</th>
                                    <th className="px-6 py-4">{t("bKash Number", "বিকাশ নম্বর")}</th>
                                    <th className="px-6 py-4">{t("Requested Date", "আবেদনের তারিখ")}</th>
                                    <th className="px-6 py-4">{t("Status", "অবস্থা")}</th>
                                    <th className="px-6 py-4 text-right">{t("Action", "অ্যাকশন")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm font-bold">
                                {filteredWithdrawals.map((w) => (
                                    <tr key={w.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-black text-xs shrink-0">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-slate-900 font-black">{w.agent?.user?.name || "Agent"}</p>
                                                    <p className="text-xs text-slate-500 font-medium">{w.agent?.user?.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-black text-purple-700 text-base">
                                            ৳{w.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-pink-50 text-pink-700 font-bold text-xs border border-pink-100">
                                                <Phone className="w-3.5 h-3.5" />
                                                <span>{w.bkashNumber}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(w.bkashNumber, w.id)}
                                                    className="p-1 hover:bg-pink-100 rounded-md transition-colors text-pink-600"
                                                    title={t("Copy Number", "নম্বর কপি করুন")}
                                                >
                                                    {copiedId === w.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium text-xs">
                                            {new Date(w.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                        </td>
                                        <td className="px-6 py-4">
                                            {w.status === "APPROVED" && (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    {t("APPROVED", "অনুমোদিত")}
                                                </span>
                                            )}
                                            {w.status === "PENDING" && (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-black border border-amber-200">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {t("PENDING REVIEW", "অপেক্ষমান")}
                                                </span>
                                            )}
                                            {w.status === "REJECTED" && (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-black border border-red-200">
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    {t("REJECTED", "প্রত্যাখ্যাত")}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {w.status === "PENDING" ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        onClick={() => handleApprove(w.id)}
                                                        className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs gap-1.5 shadow-sm"
                                                    >
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        {t("Approve & Disburse", "অনুমোদন করুন")}
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleReject(w.id)}
                                                        variant="outline"
                                                        className="h-9 px-3 rounded-xl border-red-200 text-red-600 hover:bg-red-50 font-black text-xs gap-1.5"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        {t("Reject", "বাতিল")}
                                                    </Button>
                                                </div>
                                            ) : (
                                                <span className="text-xs font-bold text-slate-400 italic">
                                                    {w.adminNote ? `Note: ${w.adminNote}` : t("Processed", "সম্পন্ন")}
                                                </span>
                                            )}
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
