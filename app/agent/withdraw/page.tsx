"use client";

import React, { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Wallet,
    DollarSign,
    Phone,
    Clock,
    CheckCircle2,
    XCircle,
    Loader2,
    ArrowUpRight,
    AlertCircle,
    Building,
    FileText,
    History
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface WithdrawalRequest {
    id: string;
    amount: number;
    bkashNumber: string;
    method: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    adminNote?: string;
    createdAt: string;
}

export default function AgentWithdrawPage() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [agentTotalEarnings, setAgentTotalEarnings] = useState<number>(0);
    const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);

    const [withdrawAmount, setWithdrawAmount] = useState<string>("5000");
    const [bkashNumber, setBkashNumber] = useState<string>("");

    const fetchData = async () => {
        try {
            const [dashRes, withdrawRes] = await Promise.all([
                api.get("/agents/dashboard"),
                api.get("/agents/withdrawals").catch(() => ({ data: { data: [] } }))
            ]);

            const earnings = dashRes.data?.data?.counts?.totalEarnings || dashRes.data?.data?.counts?.tripCommission || 0;
            setAgentTotalEarnings(earnings);
            setWithdrawals(withdrawRes.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch withdrawal data", error);
            toast.error(t("Failed to load withdrawal data", "উত্তোলন ডেটা লোড করতে ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const totals = useMemo(() => {
        let pending = 0;
        let approved = 0;
        withdrawals.forEach((w) => {
            if (w.status === "PENDING") pending += w.amount;
            if (w.status === "APPROVED") approved += w.amount;
        });
        return { pending, approved };
    }, [withdrawals]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const amt = Number(withdrawAmount);

        if (!amt || amt < 5000) {
            toast.error(t("Minimum withdrawal amount is ৳5,000", "সর্বনিম্ন উত্তোলনের পরিমাণ ৫,০০০ টাকা"));
            return;
        }

        if (!bkashNumber || bkashNumber.trim().length < 11) {
            toast.error(t("Please enter a valid 11-digit bKash number", "দয়া করে একটি সঠিক ১১-ডিজিটের বিকাশ নম্বর দিন"));
            return;
        }

        if (amt > agentTotalEarnings) {
            toast.error(t(`Insufficient total earnings. Available: ৳${agentTotalEarnings.toLocaleString()}`, `পর্যাপ্ত মোট আয় নেই। উপলব্ধ মোট আয়: ৳${agentTotalEarnings.toLocaleString()}`));
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post("/agents/withdraw", {
                amount: amt,
                bkashNumber: bkashNumber.trim()
            });
            toast.success(t("Withdrawal request submitted successfully! Admin will review your request.", "উত্তোলন আবেদন সফলভাবে জমা দেওয়া হয়েছে! অ্যাডমিন পর্যালোচনা করবেন।"));
            setWithdrawAmount("5000");
            setBkashNumber("");
            fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.message || t("Failed to submit withdrawal request", "উত্তোলন আবেদন জমা দিতে ব্যর্থ হয়েছে"));
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    {t("Money Withdrawals", "টাকা উত্তোলন")}
                </h1>
                <p className="text-slate-700 font-bold">
                    {t("Withdraw your earned commissions directly to your bKash personal account. Minimum withdrawal: ৳5,000.", "আপনার অর্জিত কমিশন সরাসরি বিকাশ অ্যাকাউন্টে উত্তোলন করুন। সর্বনিম্ন উত্তোলন: ৫,০০০ টাকা।")}
                </p>
            </header>

            {/* Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                    <div className="w-13 h-13 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">{t("Available Total Earnings", "উত্তোলনযোগ্য মোট আয়")}</p>
                        <p className="text-3xl font-black text-emerald-600">৳{agentTotalEarnings.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                    <div className="w-13 h-13 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-sm">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">{t("Total Cashout Disbursed", "মোট উত্তোলিত অর্থ")}</p>
                        <p className="text-3xl font-black text-purple-600">৳{totals.approved.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                    <div className="w-13 h-13 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">{t("Pending Cashout Requests", "অপেক্ষমান উত্তোলন")}</p>
                        <p className="text-3xl font-black text-amber-600">৳{totals.pending.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Request Withdrawal Form & Info Card Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {/* Form Card */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <ArrowUpRight className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-slate-900">{t("New Withdrawal Request", "নতুন টাকা উত্তোলনের আবেদন")}</h3>
                            <p className="text-xs text-slate-500 font-medium">{t("Submit bKash account details for admin disbursement", "বিকাশ অ্যাকাউন্টের বিবরণ দিয়ে আবেদনের ফর্ম পূরণ করুন")}</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Minimum Withdrawal Notice */}
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-3">
                            <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white font-black text-[10px] shrink-0">
                                {t("NOTICE", "সতর্কতা")}
                            </span>
                            <span>{t("Minimum withdrawal amount is ৳5,000 per request.", "প্রতি উত্তোলনে সর্বনিম্ন পরিমাণ ৫,০০০ টাকা।")}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* bKash Phone Number */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-pink-500" />
                                    {t("bKash Personal Number", "বিকাশ পার্সোনাল নম্বর")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={bkashNumber}
                                    onChange={(e) => setBkashNumber(e.target.value)}
                                    placeholder="017XXXXXXXX"
                                    className="w-full h-13 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                />
                            </div>

                            {/* Withdrawal Amount */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                                        {t("Amount (৳)", "পরিমাণ (টাকা)")} <span className="text-red-500">*</span>
                                    </label>
                                </div>
                                <input
                                    type="number"
                                    required
                                    min={5000}
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    placeholder="5000"
                                    className="w-full h-13 bg-slate-50 border border-slate-200 rounded-xl px-4 font-black text-lg text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto h-13 px-10 rounded-xl font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all text-sm gap-2"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    t("Submit Cashout Request", "ক্যাশআউট আবেদন জমা দিন")
                                )}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Instructions Card */}
                <div className="bg-slate-900 text-white rounded-2xl p-8 flex flex-col justify-between space-y-6 shadow-xl">
                    <div className="space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-black text-xl">
                            ৳
                        </div>
                        <h4 className="text-xl font-black">{t("Withdrawal Policy", "টাকা উত্তোলনের নিয়মাবলী")}</h4>
                        <ul className="space-y-3 text-xs text-slate-300 font-bold leading-relaxed">
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400 font-black">•</span>
                                {t("Minimum cashout limit is ৳5,000 per transaction.", "প্রতিটি ক্যাশআউট আবেদনে সর্বনিম্ন পরিমাণ ৫,০০০ টাকা।")}
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400 font-black">•</span>
                                {t("Only bKash Personal accounts are supported.", "শুধুমাত্র বিকাশ পার্সোনাল নম্বর গ্রহণ করা হয়।")}
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400 font-black">•</span>
                                {t("Admin verifies & dispatches money within 24 hours.", "অ্যাডমিন ২৪ ঘণ্টার মধ্যে আবেদন পর্যালোচনা ও ক্যাশআউট সম্পন্ন করবেন।")}
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-emerald-400 font-black">•</span>
                                {t("You will receive an in-app notification upon approval.", "অনুমোদিত হলে আপনি ইন-অ্যাপ নোটিফিকেশন পাবেন।")}
                            </li>
                        </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700">
                        <p className="text-[11px] text-slate-400 font-medium mb-1">{t("Available Total Earnings", "উপলব্ধ মোট আয়")}</p>
                        <p className="text-2xl font-black text-emerald-400">৳{agentTotalEarnings.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* WITHDRAWAL HISTORY LIST TABLE */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                            <History className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-black text-slate-900 text-lg">{t("Withdrawal Requests History", "উত্তোলনের হিস্ট্রি তালিকা")}</h3>
                            <p className="text-xs text-slate-500 font-medium">{t("All submitted cashout requests and their admin approval status", "আপনার সমস্ত ক্যাশআউট আবেদনের ইতিহাস")}</p>
                        </div>
                    </div>
                    <span className="px-3.5 py-1 bg-slate-100 rounded-full text-slate-700 text-xs font-black">
                        {withdrawals.length} {t("Records", "টি রেকর্ড")}
                    </span>
                </div>

                {withdrawals.length === 0 ? (
                    <div className="p-16 text-center text-slate-500 font-bold">
                        {t("No withdrawal requests submitted yet. Minimum withdrawal is ৳5,000.", "এখনো কোনো উত্তোলনের আবেদন জমা পড়েনি। সর্বনিম্ন উত্তোলন: ৫,০০০ টাকা।")}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                    <th className="px-6 py-4">{t("Request ID", "আবেদন আইডি")}</th>
                                    <th className="px-6 py-4">{t("Amount (৳)", "পরিমাণ")}</th>
                                    <th className="px-6 py-4">{t("bKash Number", "বিকাশ নম্বর")}</th>
                                    <th className="px-6 py-4">{t("Status", "অবস্থা")}</th>
                                    <th className="px-6 py-4">{t("Submitted Date", "তারিখ ও সময়")}</th>
                                    <th className="px-6 py-4">{t("Admin Note", "অ্যাডমিন নোট")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm font-bold">
                                {withdrawals.map((w) => (
                                    <tr key={w.id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-6 py-4 font-black text-slate-900">#{w.id.slice(-6).toUpperCase()}</td>
                                        <td className="px-6 py-4 font-black text-emerald-600 text-base">৳{w.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-pink-50 text-pink-700 font-bold text-xs border border-pink-100">
                                                <Phone className="w-3.5 h-3.5" />
                                                {w.bkashNumber}
                                            </span>
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
                                        <td className="px-6 py-4 text-slate-600 font-medium text-xs">
                                            {new Date(w.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500 italic max-w-xs truncate">
                                            {w.adminNote || "—"}
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
