"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    DollarSign,
    CheckCircle2,
    XCircle,
    Loader2,
    Search,
    Filter,
    User,
    ArrowRight,
    Building
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function AdminPaymentsPage() {
    const { t } = useLanguage();
    const [pendingPayments, setPendingPayments] = useState<any[]>([]);
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalCompanyRevenue: 0, pendingPayouts: 0 });
    const [search, setSearch] = useState("");

    const fetchData = async () => {
        try {
            const [paymentsRes, driversRes, statsRes] = await Promise.all([
                api.get("/admin/commission-payments"),
                api.get("/admin/drivers"),
                api.get("/admin/dashboard/stats")
            ]);
            setPendingPayments(paymentsRes.data.data);
            setDrivers(driversRes.data.data.drivers);
            setStats({
                totalCompanyRevenue: statsRes.data.data.summary.companyRevenue,
                pendingPayouts: paymentsRes.data.data.length
            });
        } catch (error) {
            console.error("Failed to fetch admin financial data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApprove = async (id: string) => {
        const adminNote = prompt(t("Add a note (optional):", "একটি নোট যোগ করুন (ঐচ্ছিক):"));
        try {
            await api.patch(`/admin/commission-payments/${id}/approve`, { adminNote });
            toast.success(t("Payment approved and balance updated!", "পেমেন্টটি অনুমোদিত এবং ব্যালেন্স আপডেট করা হয়েছে!"));
            fetchData();
        } catch (error) {
            toast.error(t("Failed to approve payment", "পেমেন্ট অনুমোদন করতে ব্যর্থ হয়েছে"));
        }
    };

    const handleReject = async (id: string) => {
        const adminNote = prompt(t("Reason for rejection:", "প্রত্যাখ্যানের কারণ:"));
        if (!adminNote) return;
        try {
            await api.patch(`/admin/commission-payments/${id}/reject`, { adminNote });
            toast.success(t("Payment rejected", "পেমেন্টটি প্রত্যাখ্যান করা হয়েছে"));
            fetchData();
        } catch (error) {
            toast.error(t("Failed to reject payment", "প্রত্যাখ্যান করতে ব্যর্থ হয়েছে"));
        }
    };

    const filteredDrivers = drivers.filter(d =>
        (d.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (d.user?.phone || "").includes(search)
    );

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Platform Commissions", "প্ল্যাটফর্ম কমিশন")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Manage driver payments and monitor company revenue.", "ড্রাইভারদের পেমেন্ট পরিচালনা করুন এবং কোম্পানির আয় মনিটর করুন।")}
                    </p>
                </div>
                <div className="flex bg-white p-2 rounded-2xl border border-slate-100 shadow-sm gap-4">
                    <div className="px-6 py-2 border-r border-slate-100">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t("Total Revenue", "মোট আয়")}</p>
                        <p className="text-xl font-black text-slate-950">৳{stats.totalCompanyRevenue.toLocaleString()}</p>
                    </div>
                    <div className="px-6 py-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{t("Pending Verification", "অপেক্ষমান যাচাইকরণ")}</p>
                        <p className="text-xl font-black text-orange-600">{stats.pendingPayouts}</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Section 1: Pending Approvals */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden min-h-[400px]">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-500" />
                                {t("Pending Commission Payments", "অপেক্ষমান কমিশন পেমেন্ট")}
                            </h3>
                        </div>
                        {loading ? (
                            <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                        ) : pendingPayments.length === 0 ? (
                            <div className="p-20 text-center">
                                <CheckCircle2 className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                                <p className="text-slate-500 font-bold">{t("All payments processed!", "সব পেমেন্ট সম্পন্ন হয়েছে!")}</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-50">
                                {pendingPayments.map((p) => (
                                    <div key={p.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                                    <User className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900">{p.driver?.user?.name}</p>
                                                    <p className="text-[10px] font-bold text-slate-500">{p.driver?.user?.phone}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-black text-slate-950">৳{p.amount}</p>
                                                <p className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded">{p.transactionId}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleApprove(p.id)}
                                                className="flex-1 h-10 rounded-xl bg-green-600 hover:bg-green-700 text-white font-black text-xs gap-2"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
                                                {t("Approve", "অনুমোদন করুন")}
                                            </Button>
                                            <Button
                                                onClick={() => handleReject(p.id)}
                                                variant="outline"
                                                className="flex-1 h-10 rounded-xl border-red-200 text-red-600 hover:bg-red-50 font-black text-xs gap-2"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                {t("Reject", "বাতিল করুন")}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Section 2: Driver Debt Leaderboard */}
                <div className="space-y-6">
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden h-full flex flex-col">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                                <Building className="w-5 h-5 text-primary" />
                                {t("Driver Ledger", "ড্রাইভার লেজার")}
                            </h3>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    placeholder={t("Search...", "খুঁজুন...")}
                                    value={search}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                                    className="h-9 pl-9 pr-3 w-48 text-xs font-bold bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-primary outline-none text-slate-950"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                        <th className="px-8 py-4">{t("Driver", "ড্রাইভার")}</th>
                                        <th className="px-8 py-4">{t("Total Due", "মোট বকেয়া")}</th>
                                        <th className="px-8 py-4">{t("Paid", "পরিশোধিত")}</th>
                                        <th className="px-8 py-4">{t("Balance", "ব্যালেন্স")}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {filteredDrivers.map((d) => (
                                        <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-8 py-4">
                                                <p className="text-sm font-black text-slate-950">{d.user?.name}</p>
                                                <p className="text-[10px] font-bold text-slate-500">{d.user?.phone}</p>
                                            </td>
                                            <td className="px-8 py-4 text-sm font-bold text-slate-700">৳{d.totalDue?.toLocaleString() || 0}</td>
                                            <td className="px-8 py-4 text-sm font-bold text-green-600">৳{d.paidCommission?.toLocaleString() || 0}</td>
                                            <td className="px-8 py-4">
                                                <span className={`text-sm font-black ${d.dueAmount > 0 ? "text-red-500" : "text-slate-400"}`}>
                                                    ৳{d.dueAmount?.toLocaleString() || 0}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

const Clock = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
