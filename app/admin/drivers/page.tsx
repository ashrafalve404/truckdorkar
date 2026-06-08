"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Truck,
    Search,
    MoreVertical,
    CheckCircle,
    XCircle,
    Loader2,
    Filter,
    ShieldCheck
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function AdminDriversPage() {
    const { t } = useLanguage();
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchDrivers = async () => {
        try {
            const response = await api.get("/admin/drivers");
            setDrivers(response.data.data.drivers || []);
        } catch (error) {
            console.error("Failed to fetch drivers", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
    }, []);

    const filteredDrivers = drivers.filter(d =>
        d.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.user.phone.includes(searchTerm) ||
        d.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Driver Management", "ড্রাইভার ম্যানেজমেন্ট")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Verify and manage delivery partners and their documents.", "ডেলিভারি পার্টনার এবং তাদের ডকুমেন্টস যাচাই ও ম্যানেজ করুন।")}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-950" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t("Search drivers...", "ড্রাইভার খুঁজুন...")}
                            className="bg-white h-12 pl-12 pr-6 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/10 outline-none w-64 font-black text-sm text-slate-950 placeholder:text-slate-500"
                        />
                    </div>
                    <Button variant="outline" className="h-12 rounded-lg gap-2 font-bold px-6 text-slate-950">
                        <Filter className="w-4 h-4 text-slate-950" />
                        {t("Filter", "ফিল্টার")}
                    </Button>
                </div>
            </header>

            <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden text-black">
                {loading ? (
                    <div className="p-20 flex justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr className="text-[10px] font-black text-slate-950 uppercase tracking-widest">
                                    <th className="px-8 py-4">{t("Driver", "ড্রাইভার")}</th>
                                    <th className="px-8 py-4">{t("License No", "লাইসেন্স নং")}</th>
                                    <th className="px-8 py-4">{t("Verification", "ভেরিফিকেশন")}</th>
                                    <th className="px-8 py-4">{t("User Status", "ইউজার স্ট্যাটাস")}</th>
                                    <th className="px-8 py-4 text-right">{t("Actions", "অ্যাকশন")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredDrivers.map((driver) => (
                                    <tr key={driver.id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center font-black text-primary">
                                                    <Truck className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-950">{driver.user.name}</p>
                                                    <p className="text-xs text-slate-700 font-bold">{driver.user.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-sm text-slate-600 font-bold">
                                            {driver.licenseNumber || t("N/A", "N/A")}
                                        </td>
                                        <td className="px-8 py-4 text-sm text-slate-800 font-bold">
                                            <div className="flex items-center gap-2">
                                                {driver.isVerified ? (
                                                    <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-wider">
                                                        <ShieldCheck className="w-3 h-3" />
                                                        {t("Verified", "ভেরিফাইড")}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-[10px] uppercase font-black tracking-wider">
                                                        <XCircle className="w-3 h-3" />
                                                        {t("Pending", "অপেক্ষমান")}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-2 h-2 rounded-full", driver.user.isActive ? "bg-green-500" : "bg-red-500")} />
                                                <span className={cn("text-xs font-bold", driver.user.isActive ? "text-green-600" : "text-red-600")}>
                                                    {driver.user.isActive ? t("Active", "সক্রিয়") : t("Suspended", "স্থগিত")}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="default" size="sm" className="rounded-lg h-9 font-bold px-4">
                                                    {t("View Profile", "প্রোফাইল")}
                                                </Button>
                                                <Button variant="ghost" size="icon" className="rounded-lg text-slate-600">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </div>
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
