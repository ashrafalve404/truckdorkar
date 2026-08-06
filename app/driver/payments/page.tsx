"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    DollarSign,
    CreditCard,
    History,
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle,
    Loader2
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function DriverPaymentsPage() {
    const { t } = useLanguage();
    const [data, setData] = useState<{
        payments: any[];
        totalDue: number;
        paidAlready: number;
        currentBalance: number;
    }>({
        payments: [],
        totalDue: 0,
        paidAlready: 0,
        currentBalance: 0
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({ amount: "", transactionId: "" });

    const fetchData = async () => {
        try {
            const res = await api.get("/drivers/commission-payments");
            setData(res.data.data);
        } catch (error) {
            console.error("Failed to fetch payments", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.amount || !form.transactionId) {
            return toast.error(t("Please fill all fields", "দয়া করে সব ঘর পূরণ করুন"));
        }

        setSubmitting(true);
        try {
            await api.post("/drivers/commission-payments", {
                amount: parseFloat(form.amount),
                transactionId: form.transactionId
            });
            toast.success(t("Payment submitted for approval!", "পেমেন্টটি অনুমোদনের জন্য পাঠানো হয়েছে!"));
            setForm({ amount: "", transactionId: "" });
            fetchData();
        } catch (error) {
            console.error("Failed to submit payment", error);
            toast.error(t("Failed to submit payment", "পেমেন্ট পাঠাতে ব্যর্থ হয়েছে"));
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'APPROVED': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'PENDING': return <Clock className="w-4 h-4 text-amber-500" />;
            case 'REJECTED': return <XCircle className="w-4 h-4 text-red-500" />;
            default: return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return "bg-green-50 text-green-600 border-green-100";
            case 'PENDING': return "bg-amber-50 text-amber-600 border-amber-100";
            case 'REJECTED': return "bg-red-50 text-red-600 border-red-100";
            default: return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    return (
        <DashboardLayout requiredRole="DRIVER">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    {t("Commission Payments", "কমিশন পেমেন্ট")}
                </h1>
                <p className="text-slate-700 font-bold">
                    {t("Pay your platform commissions to keep your account active.", "আপনার অ্যাকাউন্ট সচল রাখতে প্ল্যাটফর্ম কমিশন পরিশোধ করুন।")}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side: Stats and Form */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{t("Current Due", "বর্তমান বকেয়া")}</p>
                                <p className="text-2xl font-black text-slate-950">৳{data.currentBalance.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="space-y-3 pt-6 border-t border-primary/10">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-slate-600">{t("Total Commission", "মোট কমিশন")}:</span>
                                <span className="text-slate-950">৳{data.totalDue.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm font-bold text-green-600">
                                <span>{t("Paid Already", "পরিশোধিত")}:</span>
                                <span>৳{data.paidAlready.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm">
                        <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-primary" />
                            {t("Submit New Payment", "নতুন পেমেন্ট জমা দিন")}
                        </h3>
                        <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <p className="text-xs font-bold text-amber-800 leading-relaxed">
                                <AlertCircle className="w-3 h-3 inline mr-1 mb-0.5" />
                                {t("Send money to bKash: 01739142959 and enter the Transaction ID below.", "বিকাশ করুন: ০১৭৩৯১৪২৯৫৯ নম্বরে এবং নিচে ট্রানজেকশন আইডি দিন।")}
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-1.5 ml-1">{t("Amount", "পরিমাণ")}</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 500"
                                    value={form.amount}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, amount: e.target.value })}
                                    className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-950 focus:ring-2 focus:ring-primary/10 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-1.5 ml-1">{t("Transaction ID", "ট্রানজেকশন আইডি")}</label>
                                <input
                                    type="text"
                                    placeholder="e.g. B8X2K9L0P"
                                    value={form.transactionId}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, transactionId: e.target.value })}
                                    className="w-full h-12 px-4 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-950 focus:ring-2 focus:ring-primary/10 outline-none"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-full h-12 rounded-xl font-black shadow-lg shadow-primary/20 mt-4"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : t("Submit Payment", "পেমেন্ট জমা দিন")}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Right Side: History */}
                <div className="lg:col-span-2">
                    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden h-full">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-950 flex items-center gap-2">
                                <History className="w-5 h-5 text-primary" />
                                {t("Payment History", "পেমেন্টের ইতিহাস")}
                            </h3>
                        </div>

                        {loading ? (
                            <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                        ) : data.payments.length === 0 ? (
                            <div className="p-20 text-center">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <History className="w-8 h-8 text-slate-300" />
                                </div>
                                <h4 className="text-lg font-bold text-slate-600">{t("No payments found", "কোন পেমেন্ট পাওয়া যায়নি")}</h4>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100">
                                        <tr className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                            <th className="px-8 py-4">{t("Date", "তারিখ")}</th>
                                            <th className="px-8 py-4">{t("TXN ID", "ট্রানজেকশন আইডি")}</th>
                                            <th className="px-8 py-4">{t("Amount", "পরিমাণ")}</th>
                                            <th className="px-8 py-4">{t("Status", "স্ট্যাটাস")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {data.payments.map((p) => (
                                            <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-8 py-5 text-sm font-bold text-slate-700">
                                                    {new Date(p.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-8 py-5 text-sm font-black text-slate-950">{p.transactionId}</td>
                                                <td className="px-8 py-5 text-sm font-black text-slate-950">৳{p.amount}</td>
                                                <td className="px-8 py-5">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black border ${getStatusColor(p.status)}`}>
                                                        {getStatusIcon(p.status)}
                                                        {p.status}
                                                    </span>
                                                    {p.adminNote && (
                                                        <p className="text-[10px] text-slate-500 font-bold mt-1 max-w-[200px] truncate">{p.adminNote}</p>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
