"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    DollarSign,
    TrendingUp,
    Download,
    Calendar,
    Loader2
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function DriverEarningsPage() {
    const { t } = useLanguage();
    const [earnings, setEarnings] = useState<{
        total: number;
        thisMonth: number;
        thisWeek: number;
        history: { id: number; date: string; amount: number; status: string; trip: string }[];
    }>({
        total: 0,
        thisMonth: 0,
        thisWeek: 0,
        history: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                // In reality, fetch from an earnings endpoint
                const response = await api.get("/drivers/profile");
                const driver = response.data.data;
                setEarnings({
                    total: driver.totalEarnings || 0,
                    thisMonth: (driver.totalEarnings || 0) * 0.4, // Mock data
                    thisWeek: (driver.totalEarnings || 0) * 0.1, // Mock data
                    history: [
                        { id: 1, date: '2026-06-05', amount: 1200, status: 'PAID', trip: '#TD-A1B2C3' },
                        { id: 2, date: '2026-06-03', amount: 800, status: 'PAID', trip: '#TD-X9Y8Z7' },
                        { id: 3, date: '2026-06-01', amount: 2500, status: 'PAID', trip: '#TD-M5N6O7' },
                    ]
                });
            } catch (error) {
                console.error("Failed to fetch earnings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEarnings();
    }, []);

    return (
        <DashboardLayout requiredRole="DRIVER">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Earnings", "উপার্জন")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Track your income and withdraw your balance.", "আপনার আয় ট্র্যাক করুন এবং ব্যালেন্স উত্তোলন করুন।")}
                    </p>
                </div>
                <Button className="h-12 rounded-lg gap-2 font-black px-8 bg-primary text-white shadow-lg shadow-primary/20">
                    <Download className="w-5 h-5" />
                    {t("Withdraw Money", "টাকা তুলুন")}
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                    { label: t("Total Earnings", "মোট উপার্জন"), value: `৳${earnings.total}`, icon: DollarSign, color: "bg-green-500" },
                    { label: t("This Month", "এই মাস"), value: `৳${earnings.thisMonth.toFixed(0)}`, icon: TrendingUp, color: "bg-blue-500" },
                    { label: t("Pending Balance", "অপেক্ষমান ব্যালেন্স"), value: `৳0`, icon: Calendar, color: "bg-amber-500" },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm flex items-center gap-6">
                        <div className={`w-14 h-14 rounded-xl ${stat.color} text-white flex items-center justify-center`}>
                            <stat.icon className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-slate-600 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-950">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50">
                    <h3 className="text-xl font-bold text-slate-950">{t("Transaction History", "লেনদেনের ইতিহাস")}</h3>
                </div>
                {loading ? (
                    <div className="p-20 flex justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                    <th className="px-8 py-4">{t("Trip ID", "ট্রিপ আইডি")}</th>
                                    <th className="px-8 py-4">{t("Date", "তারিখ")}</th>
                                    <th className="px-8 py-4">{t("Amount", "পরিমাণ")}</th>
                                    <th className="px-8 py-4">{t("Status", "স্ট্যাটাস")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {earnings.history.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-4 font-black text-primary text-sm">{tx.trip}</td>
                                        <td className="px-8 py-4 text-sm font-bold text-slate-800">{tx.date}</td>
                                        <td className="px-8 py-4 text-sm font-black text-slate-950">৳{tx.amount}</td>
                                        <td className="px-8 py-4">
                                            <span className="text-[10px] font-black px-2 py-1 rounded bg-green-50 text-green-600 uppercase tracking-wider">
                                                {tx.status}
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
