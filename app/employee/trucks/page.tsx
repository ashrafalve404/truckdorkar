"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Truck,
    Plus,
    Loader2,
    Clock,
    CheckCircle,
    XCircle,
    FileText,
    Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import Link from "next/link";

const STATUS_CONFIG: Record<string, { label: string; labelBn: string; color: string; bg: string; icon: React.ReactNode }> = {
    PENDING: { label: "Pending Review", labelBn: "পর্যালোচনাধীন", color: "text-amber-600", bg: "bg-amber-50", icon: <Clock className="w-3 h-3" /> },
    APPROVED: { label: "Approved", labelBn: "অনুমোদিত", color: "text-green-600", bg: "bg-green-50", icon: <CheckCircle className="w-3 h-3" /> },
    REJECTED: { label: "Rejected", labelBn: "প্রত্যাখ্যাত", color: "text-red-600", bg: "bg-red-50", icon: <XCircle className="w-3 h-3" /> },
    INACTIVE: { label: "Inactive", labelBn: "নিষ্ক্রিয়", color: "text-slate-500", bg: "bg-slate-50", icon: <Clock className="w-3 h-3" /> },
};

export default function EmployeeTrucksPage() {
    const { t } = useLanguage();
    const [trucks, setTrucks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/employees/trucks")
            .then(r => setTrucks(r.data?.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const stats = {
        total: trucks.length,
        pending: trucks.filter(t => t.status === "PENDING").length,
        approved: trucks.filter(t => t.status === "APPROVED").length,
        rejected: trucks.filter(t => t.status === "REJECTED").length,
    };

    return (
        <DashboardLayout requiredRole="EMPLOYEE">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("My Registered Trucks", "আমার নিবন্ধিত ট্রাক")}
                    </h1>
                    <p className="text-slate-700 font-bold text-sm">
                        {t("Track the approval status of trucks you've submitted.", "আপনার জমা দেওয়া ট্রাকগুলোর অনুমোদনের অবস্থা দেখুন।")}
                    </p>
                </div>
                <Link href="/employee/trucks/new">
                    <Button className="h-12 px-6 rounded-xl font-black gap-2 shadow-lg shadow-primary/20 text-white">
                        <Plus className="w-5 h-5" />
                        {t("Register New Truck", "নতুন ট্রাক নিবন্ধন")}
                    </Button>
                </Link>
            </header>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    { label: t("Total", "মোট"), value: stats.total, color: "text-slate-900", bg: "bg-slate-50" },
                    { label: t("Pending", "অপেক্ষমান"), value: stats.pending, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: t("Approved", "অনুমোদিত"), value: stats.approved, color: "text-green-600", bg: "bg-green-50" },
                    { label: t("Rejected", "প্রত্যাখ্যাত"), value: stats.rejected, color: "text-red-600", bg: "bg-red-50" },
                ].map((s, i) => (
                    <div key={i} className={cn("rounded-xl p-5 text-center", s.bg)}>
                        <p className={cn("text-3xl font-black", s.color)}>{s.value}</p>
                        <p className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">{s.label}</p>
                    </div>
                ))}
            </div>

            {loading ? (
                <div className="py-24 flex justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : trucks.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-100 p-24 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Truck className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="font-black text-lg text-slate-900 mb-2">{t("No Trucks Registered Yet", "এখনো কোনো ট্রাক নিবন্ধিত নয়")}</h3>
                    <p className="text-slate-500 font-bold text-sm mb-8">
                        {t("Start by registering your first truck for admin approval.", "প্রথম ট্রাক নিবন্ধন করুন।")}
                    </p>
                    <Link href="/employee/trucks/new">
                        <Button className="font-black gap-2 text-white rounded-xl">
                            <Plus className="w-4 h-4" />
                            {t("Register First Truck", "প্রথম ট্রাক নিবন্ধন করুন")}
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {trucks.map((truck) => {
                        const status = STATUS_CONFIG[truck.status] || STATUS_CONFIG.PENDING;
                        return (
                            <div key={truck.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                                                <Truck className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h3 className="font-black text-slate-900 truncate max-w-[140px]">{truck.name}</h3>
                                                <p className="text-xs text-slate-500 font-bold">{truck.registrationNo}</p>
                                            </div>
                                        </div>
                                        <span className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider", status.color, status.bg)}>
                                            {status.icon}
                                            {t(status.label, status.labelBn)}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-slate-500">{t("Plate", "প্লেট")}</span>
                                            <span className="text-slate-900">{truck.numberPlateText || "—"}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-slate-500">{t("Category", "ক্যাটাগরি")}</span>
                                            <span className="text-slate-900">{truck.category}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-slate-500">{t("Capacity", "ধারণক্ষমতা")}</span>
                                            <span className="text-slate-900">{truck.capacityTon} {t("ton", "টন")}</span>
                                        </div>
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-slate-500">{t("Driver", "ড্রাইভার")}</span>
                                            <span className="text-slate-900">{truck.driver?.user?.name || "—"}</span>
                                        </div>
                                    </div>

                                    {/* Document status */}
                                    <div className="border-t border-slate-50 pt-4">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{t("Documents", "ডকুমেন্টস")}</p>
                                        <div className="grid grid-cols-4 gap-1.5">
                                            {[
                                                { key: "roadPermitUrl", label: t("Road", "রোড") },
                                                { key: "taxTokenUrl", label: t("Tax", "ট্যাক্স") },
                                                { key: "blueBookUrl", label: t("Blue", "বুক") },
                                                { key: "numberPlateImageUrl", label: t("Plate", "প্লেট") },
                                            ].map(d => (
                                                <div key={d.key} className={cn(
                                                    "rounded-lg p-1.5 text-center text-[9px] font-black uppercase",
                                                    truck[d.key] ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400"
                                                )}>
                                                    {d.label}
                                                    <span className="block text-[8px] mt-0.5">{truck[d.key] ? "✓" : "✗"}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {truck.approvalNote && (
                                        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100">
                                            <p className="text-[10px] font-black text-red-700 uppercase tracking-wider mb-1">{t("Admin Note", "অ্যাডমিন মন্তব্য")}</p>
                                            <p className="text-xs text-red-600 font-bold">{truck.approvalNote}</p>
                                        </div>
                                    )}
                                </div>
                                <div className="px-6 pb-5">
                                    <p className="text-[10px] text-slate-400 font-bold">
                                        {t("Submitted", "জমা দেওয়া হয়েছে")} {new Date(truck.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </DashboardLayout>
    );
}
