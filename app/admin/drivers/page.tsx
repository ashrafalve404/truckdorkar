"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Truck as TruckIcon,
    Search,
    Loader2,
    UserX,
    UserCheck,
    Trash2,
    Eye,
    X,
    DollarSign,
    Calendar,
    Star,
    ShieldCheck,
    Package,
    TrendingUp,
    ExternalLink,
    FileText,
    CheckCircle2,
    XCircle,
    Phone,
    Mail
} from "lucide-react";
import api, { getFileUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn, getAvatarUrl } from "@/lib/utils";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

export default function AdminDriversPage() {
    const { t } = useLanguage();
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusModal, setStatusModal] = useState<{ open: boolean; id: string; name: string; currentActive: boolean }>({ open: false, id: "", name: "", currentActive: true });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: "", name: "" });
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Detail Modal state
    const [selectedDriver, setSelectedDriver] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState<"overview" | "trucks" | "trips">("overview");
    const [previewDocument, setPreviewDocument] = useState<{ title: string; url: string } | null>(null);

    const fetchDrivers = useCallback(async () => {
        try {
            const response = await api.get("/admin/drivers");
            const fetched = response.data?.data?.drivers || [];
            setDrivers(fetched);

            // Keep selected driver updated if modal is open without triggering effect loop
            setSelectedDriver((prev: any) => {
                if (!prev) return null;
                const updated = fetched.find((d: any) => d.id === prev.id);
                return updated || prev;
            });
        } catch (err) {
            console.error("Failed to fetch drivers", err);
            toast.error(t("Failed to load drivers", "ড্রাইভার লোড করতে ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchDrivers();
    }, [fetchDrivers]);

    const toggleStatus = async () => {
        if (!statusModal.id) return;
        setIsUpdating(true);
        try {
            await api.patch(`/admin/users/${statusModal.id}/status`, { isActive: !statusModal.currentActive });
            toast.success(t("User status updated", "ইউজার স্ট্যাটাস আপডেট করা হয়েছে"));
            fetchDrivers();
            setStatusModal({ open: false, id: "", name: "", currentActive: true });
        } catch (err) {
            console.error(err);
            toast.error(t("Failed to update status", "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে"));
        } finally {
            setIsUpdating(false);
        }
    };

    const handleHardDelete = async () => {
        if (!deleteModal.id) return;
        setIsDeleting(true);
        try {
            await api.delete(`/admin/drivers/${deleteModal.id}`);
            toast.success(t("Driver permanently deleted", "ড্রাইভার চিরতরে মুছে ফেলা হয়েছে"));
            if (selectedDriver?.id === deleteModal.id) setSelectedDriver(null);
            fetchDrivers();
            setDeleteModal({ open: false, id: "", name: "" });
        } catch (err) {
            toast.error(t("Failed to delete driver", "ড্রাইভার মুছতে ব্যর্থ হয়েছে"));
        } finally {
            setIsDeleting(false);
        }
    };

    const handleVerify = async (driverId: string, status: string) => {
        try {
            await api.patch(`/admin/drivers/${driverId}/verify`, { status });
            toast.success(t("Driver status updated", "ড্রাইভার স্ট্যাটাস আপডেট করা হয়েছে"));
            fetchDrivers();
        } catch (err) {
            console.error(err);
            toast.error(t("Failed to verify driver", "ড্রাইভার যাচাই করতে ব্যর্থ হয়েছে"));
        }
    };

    const filteredDrivers = drivers.filter(d =>
        d.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.user?.phone?.includes(searchTerm) ||
        d.licenseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.nidNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Driver Management", "ড্রাইভার ম্যানেজমেন্ট")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Verify and manage delivery partners, trip history, and earnings.", "ডেলিভারি পার্টনার, ট্রিপ হিস্ট্রি এবং ড্রাইভার ইনফরমেশন দেখুন।")}
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
                            className="bg-white h-12 pl-12 pr-6 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/10 outline-none w-72 font-black text-sm text-slate-950 placeholder:text-slate-500 shadow-sm"
                        />
                    </div>
                </div>
            </header>

            {/* DRIVER TABLE LIST */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden text-black">
                {loading ? (
                    <div className="p-20 flex justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : filteredDrivers.length === 0 ? (
                    <div className="p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                            <TruckIcon className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">
                            {searchTerm ? t("No drivers found", "কোন ড্রাইভার পাওয়া যায়নি") : t("No drivers registered yet", "এখনো কোনো ড্রাইভার রেজিস্টার করেনি")}
                        </h3>
                        <p className="text-slate-500 text-sm max-w-md font-medium">
                            {searchTerm
                                ? t("Try adjusting your search term", "অনুসন্ধান শর্ত পরিবর্তন করুন")
                                : t("New driver registrations will appear here once they sign up.", "নতুন ড্রাইভার রেজিস্ট্রেশন সাইন আপ করলে এখানে দেখা যাবে।")}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-700">
                                <tr>
                                    <th className="px-8 py-4">{t("Driver", "ড্রাইভার")}</th>
                                    <th className="px-8 py-4">{t("License / NID", "লাইসেন্স / এনআইডি")}</th>
                                    <th className="px-8 py-4">{t("Referral Info", "রেফারেল তথ্য")}</th>
                                    <th className="px-8 py-4">{t("Financials", "অর্থনৈতিক বিবরণ")}</th>
                                    <th className="px-8 py-4">{t("Verification", "ভেরিফিকেশন")}</th>
                                    <th className="px-8 py-4">{t("User Status", "ইউজার স্ট্যাটাস")}</th>
                                    <th className="px-8 py-4 text-right">{t("Actions", "অ্যাকশন")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-bold text-sm">
                                {filteredDrivers.map((driver) => (
                                    <tr
                                        key={driver.id}
                                        onClick={() => {
                                            setSelectedDriver(driver);
                                            setActiveTab("overview");
                                        }}
                                        className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                                    >
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center font-black text-primary overflow-hidden shrink-0 border border-slate-200 shadow-sm">
                                                    {driver.user?.avatar ? (
                                                        <img src={getAvatarUrl(driver.user.avatar) || ""} alt={driver.user?.name || "Driver"} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <TruckIcon className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-950 group-hover:text-primary transition-colors flex items-center gap-1.5">
                                                        {driver.user?.name || "—"}
                                                    </p>
                                                    <p className="text-xs text-slate-600 font-medium">{driver.user?.phone || "—"}</p>
                                                    {driver.user?.email && (
                                                        <p className="text-[11px] text-slate-400 font-medium">{driver.user.email}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-xs font-medium text-slate-700">
                                            <div>
                                                <p className="font-bold text-slate-900">DL: {driver.licenseNumber || t("N/A", "N/A")}</p>
                                                <p className="text-[11px] text-slate-500 font-medium">NID: {driver.nidNumber || t("N/A", "N/A")}</p>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-xs font-medium text-slate-700">
                                            <div>
                                                <span className="inline-block px-2 py-0.5 rounded bg-slate-100 font-mono font-bold text-slate-800 text-[11px] border border-slate-200">
                                                    {driver.referralCode || "—"}
                                                </span>
                                                {driver.referredBy ? (
                                                    <p className="text-[11px] text-slate-600 font-medium mt-1">
                                                        Ref by: <span className="font-bold text-slate-900">{driver.referredBy?.user?.name || "Driver"}</span> ({driver.referredBy?.user?.phone})
                                                    </p>
                                                ) : (
                                                    <p className="text-[11px] text-slate-400 font-medium mt-1">Direct Signup</p>
                                                )}
                                                {(driver.referralEarnings || 0) > 0 && (
                                                    <p className="text-[10px] font-black text-emerald-600 mt-0.5">
                                                        +৳{(driver.referralEarnings || 0).toLocaleString()} 5% bonus
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-xs">
                                            <div>
                                                <p className="font-black text-emerald-600">৳{(driver.totalEarnings || 0).toLocaleString()} <span className="text-[10px] text-slate-400 font-medium">{t("earned", "আয়")}</span></p>
                                                {(driver.dueAmount || 0) > 0 ? (
                                                    <p className="font-bold text-amber-600 text-[11px] mt-0.5">
                                                        ৳{(driver.dueAmount || 0).toFixed(2)} {t("unpaid commission", "কমিশন বকেয়া")}
                                                    </p>
                                                ) : (
                                                    <p className="text-[11px] text-slate-400 font-medium">{driver.totalTrips || 0} {t("trips completed", "ট্রিপস")}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                                                driver.status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    driver.status === 'REJECTED' ? 'bg-red-50 text-red-600 border-red-100' :
                                                        'bg-amber-50 text-amber-600 border-amber-100'
                                            )}>
                                                {driver.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-2 h-2 rounded-full", driver.user?.isActive ? "bg-emerald-500" : "bg-red-500")} />
                                                <span className={cn("text-xs font-bold", driver.user?.isActive ? "text-emerald-600" : "text-red-600")}>
                                                    {driver.user?.isActive ? t("Active", "সক্রিয়") : t("Suspended", "স্থগিত")}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2.5 rounded-lg text-xs font-black gap-1 text-slate-700 hover:bg-slate-100"
                                                    onClick={() => {
                                                        setSelectedDriver(driver);
                                                        setActiveTab("overview");
                                                    }}
                                                >
                                                    <Eye className="w-3.5 h-3.5 text-primary" />
                                                    {t("View Info", "তথ্য দেখুন")}
                                                </Button>

                                                {driver.status === 'PENDING' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            className="h-8 text-[10px] uppercase font-black bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-2.5"
                                                            onClick={() => handleVerify(driver.id, 'VERIFIED')}
                                                        >
                                                            {t("Verify", "যাচাই")}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-8 text-[10px] uppercase font-black rounded-lg px-2.5"
                                                            onClick={() => handleVerify(driver.id, 'REJECTED')}
                                                        >
                                                            {t("Reject", "প্রত্যাখ্যান")}
                                                        </Button>
                                                    </>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={cn("rounded-lg h-8 w-8", driver.user?.isActive ? "text-red-500 hover:bg-red-50" : "text-emerald-600 hover:bg-emerald-50")}
                                                    onClick={() => {
                                                        if (driver.user?.isActive && driver.user.id) {
                                                            setStatusModal({ open: true, id: driver.user.id, name: driver.user.name || "this driver", currentActive: true });
                                                        } else if (driver.user?.id) {
                                                            api.patch(`/admin/users/${driver.user.id}/status`, { isActive: true }).then(() => {
                                                                toast.success(t("Driver account activated", "অ্যালাইন চালুর বিজ্ঞপ্তি"));
                                                                fetchDrivers();
                                                            });
                                                        }
                                                    }}
                                                >
                                                    {driver.user?.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-lg h-8 w-8 text-red-500 hover:bg-red-50"
                                                    onClick={() => setDeleteModal({ open: true, id: driver.id, name: driver.user?.name || "this driver" })}
                                                >
                                                    <Trash2 className="w-4 h-4" />
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

            {/* ── DRIVER DETAILS POPUP MODAL ─────────────────────────────────────── */}
            {selectedDriver && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    onClick={() => setSelectedDriver(null)}
                >
                    <div
                        className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-6 md:p-8 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedDriver(null);
                                }}
                                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer z-10"
                                title={t("Close", "বন্ধ করুন")}
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-2xl bg-white/10 overflow-hidden border-2 border-white/20 shrink-0 shadow-lg">
                                    {selectedDriver.user?.avatar ? (
                                        <img src={getAvatarUrl(selectedDriver.user.avatar) || ""} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center font-black text-xl text-white">
                                            {(selectedDriver.user?.name || "D").charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h2 className="text-2xl font-black">{selectedDriver.user?.name || "Driver Details"}</h2>
                                        <span className={cn(
                                            "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                                            selectedDriver.status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                                                selectedDriver.status === 'REJECTED' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                                                    'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                        )}>
                                            {selectedDriver.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 font-medium mt-1 flex items-center gap-3 flex-wrap">
                                        <span className="inline-flex items-center gap-1">
                                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                                            {selectedDriver.user?.phone || "—"}
                                        </span>
                                        <span className="text-slate-600">•</span>
                                        <span className="inline-flex items-center gap-1">
                                            <Mail className="w-3.5 h-3.5 text-blue-400" />
                                            {selectedDriver.user?.email || "No email"}
                                        </span>
                                    </p>
                                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                                        Driver ID: <span className="text-slate-200 font-mono">{selectedDriver.id}</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Financials & Quick Stats Bar */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-slate-50 border-b border-slate-100">
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t("Total Earnings", "মোট উপার্জন")}</p>
                                <p className="text-xl font-black text-emerald-600">৳{(selectedDriver.totalEarnings || 0).toLocaleString()}</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t("Unpaid Commission", "কমিশন বকেয়া")}</p>
                                <p className={cn("text-xl font-black", (selectedDriver.dueAmount || 0) > 0 ? "text-amber-600" : "text-slate-900")}>
                                    ৳{(selectedDriver.dueAmount || 0).toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t("Paid Commission", "পরিশোধিত কমিশন")}</p>
                                <p className="text-xl font-black text-slate-900">৳{(selectedDriver.paidCommission || 0).toLocaleString()}</p>
                            </div>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t("Rating & Trips", "রেটিং ও ট্রিপ")}</p>
                                <p className="text-xl font-black text-slate-900 flex items-center gap-1.5">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                                    <span>{(selectedDriver.rating || 5.0).toFixed(1)}</span>
                                    <span className="text-xs text-slate-400 font-medium">({selectedDriver.totalTrips || selectedDriver.bookings?.length || 0} {t("trips", "ট্রিপ")})</span>
                                </p>
                            </div>
                        </div>

                        {/* Modal Navigation Tabs */}
                        <div className="flex border-b border-slate-100 px-6 bg-white">
                            {[
                                { id: "overview", label: t("Overview & Verification Documents", "ডকুমেন্টস ও তথ্য") },
                                { id: "trucks", label: `${t("Registered Trucks", "ট্রাক সমূহ")} (${selectedDriver.trucks?.length || 0})` },
                                { id: "trips", label: `${t("Trip & Earnings History", "ট্রিপ হিস্ট্রি")} (${selectedDriver.bookings?.length || 0})` },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={cn(
                                        "px-5 py-4 text-xs font-black transition-all border-b-2",
                                        activeTab === tab.id
                                            ? "border-primary text-primary"
                                            : "border-transparent text-slate-500 hover:text-slate-900"
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Modal Tab Content */}
                        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
                            {/* TAB 1: OVERVIEW & DOCUMENTS */}
                            {activeTab === "overview" && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t("Personal Information", "ব্যক্তিগত তথ্য")}</h4>
                                            <div className="space-y-2 text-sm font-medium">
                                                <p className="flex justify-between border-b border-slate-200/50 pb-2">
                                                    <span className="text-slate-500">{t("Full Name", "পূর্ণ নাম")}:</span>
                                                    <span className="font-bold text-slate-900">{selectedDriver.user?.name || "—"}</span>
                                                </p>
                                                <p className="flex justify-between border-b border-slate-200/50 pb-2">
                                                    <span className="text-slate-500">{t("Phone Number", "মোবাইল নম্বর")}:</span>
                                                    <span className="font-bold text-slate-900">{selectedDriver.user?.phone || "—"}</span>
                                                </p>
                                                <p className="flex justify-between border-b border-slate-200/50 pb-2">
                                                    <span className="text-slate-500">{t("Email Address", "ইমেইল ঠিকানা")}:</span>
                                                    <span className="font-bold text-slate-900">{selectedDriver.user?.email || "—"}</span>
                                                </p>
                                                <p className="flex justify-between">
                                                    <span className="text-slate-500">{t("License Number", "ড্রাইভিং লাইসেন্স নং")}:</span>
                                                    <span className="font-bold text-slate-900">{selectedDriver.licenseNumber || "N/A"}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">{t("Verification Details", "ভেরিফিকেশন তথ্য")}</h4>
                                            <div className="space-y-2 text-sm font-medium">
                                                <p className="flex justify-between border-b border-slate-200/50 pb-2">
                                                    <span className="text-slate-500">{t("NID Number", "এনআইডি নম্বর")}:</span>
                                                    <span className="font-bold text-slate-900">{selectedDriver.nidNumber || "N/A"}</span>
                                                </p>
                                                <p className="flex justify-between border-b border-slate-200/50 pb-2">
                                                    <span className="text-slate-500">{t("Account Status", "অ্যাকাউন্ট স্ট্যাটাস")}:</span>
                                                    <span className={cn("font-bold", selectedDriver.user?.isActive ? "text-emerald-600" : "text-red-600")}>
                                                        {selectedDriver.user?.isActive ? t("Active", "সক্রিয়") : t("Suspended", "স্থগিত")}
                                                    </span>
                                                </p>
                                                <p className="flex justify-between border-b border-slate-200/50 pb-2">
                                                    <span className="text-slate-500">{t("Verification Status", "যাচাই স্ট্যাটাস")}:</span>
                                                    <span className="font-bold text-slate-900">{selectedDriver.status}</span>
                                                </p>
                                                <p className="flex justify-between">
                                                    <span className="text-slate-500">{t("Registered Date", "রেজিস্ট্রেশনের তারিখ")}:</span>
                                                    <span className="font-bold text-slate-900">{new Date(selectedDriver.createdAt).toLocaleDateString()}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Uploaded Documents Grid */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-black text-slate-900">{t("Verification Documents", "যাচাইকৃত ডকুমেন্টস")}</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {[
                                                { label: t("NID Front", "এনআইডি ফ্রন্ট"), url: selectedDriver.nidFront },
                                                { label: t("NID Back", "এনআইডি ব্যাক"), url: selectedDriver.nidBack },
                                                { label: t("License Front", "লাইসেন্স ফ্রন্ট"), url: selectedDriver.licenseFront },
                                                { label: t("License Back", "লাইসেন্স ব্যাক"), url: selectedDriver.licenseBack },
                                            ].map((doc, idx) => (
                                                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 text-center space-y-2">
                                                    <p className="text-xs font-bold text-slate-700">{doc.label}</p>
                                                    {doc.url ? (
                                                        <div
                                                            onClick={() => setPreviewDocument({ title: doc.label, url: getFileUrl(doc.url) })}
                                                            className="w-full h-32 rounded-xl bg-slate-200 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-slate-300 flex items-center justify-center relative group"
                                                        >
                                                            <img src={getFileUrl(doc.url)} alt={doc.label} className="w-full h-full object-cover" />
                                                            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                                                                <Eye className="w-4 h-4" /> {t("Preview", "দেখুন")}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-32 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs font-bold">
                                                            {t("No File Uploaded", "ফাইল নেই")}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 2: REGISTERED TRUCKS */}
                            {activeTab === "trucks" && (
                                <div className="space-y-4">
                                    {!selectedDriver.trucks || selectedDriver.trucks.length === 0 ? (
                                        <div className="p-12 text-center text-slate-500 font-bold bg-slate-50 rounded-2xl border border-slate-100">
                                            {t("No trucks registered by this driver yet.", "এই ড্রাইভারের কোনো নিবন্ধিত ট্রাক পাওয়া যায়নি।")}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedDriver.trucks.map((truck: any) => (
                                                <div key={truck.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                                            <TruckIcon className="w-6 h-6" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-black text-slate-900 text-base">{truck.name}</h4>
                                                            <p className="text-xs text-slate-600 font-bold">Reg: {truck.registrationNo}</p>
                                                            <p className="text-[11px] text-slate-400 font-medium">Category: {truck.category}</p>
                                                        </div>
                                                    </div>
                                                    <span className={cn(
                                                        "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                                        truck.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-600' :
                                                            truck.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                                                'bg-amber-100 text-amber-600'
                                                    )}>
                                                        {truck.status}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 3: TRIPS & EARNINGS HISTORY */}
                            {activeTab === "trips" && (
                                <div className="space-y-4">
                                    {!selectedDriver.bookings || selectedDriver.bookings.length === 0 ? (
                                        <div className="p-12 text-center text-slate-500 font-bold bg-slate-50 rounded-2xl border border-slate-100">
                                            {t("No trips history found for this driver.", "এই ড্রাইভারের কোনো ট্রিপ ইতিহাস পাওয়া যায়নি।")}
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                                            <table className="w-full text-left">
                                                <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                                    <tr>
                                                        <th className="px-6 py-3">{t("Trip ID", "ট্রিপ আইডি")}</th>
                                                        <th className="px-6 py-3">{t("Route", "রুট")}</th>
                                                        <th className="px-6 py-3">{t("Fare", "ভাড়া")}</th>
                                                        <th className="px-6 py-3">{t("Date", "তারিখ")}</th>
                                                        <th className="px-6 py-3">{t("Status", "স্ট্যাটাস")}</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 text-xs font-bold">
                                                    {selectedDriver.bookings.map((booking: any) => (
                                                        <tr key={booking.id} className="hover:bg-slate-50/50">
                                                            <td className="px-6 py-4 text-primary font-black">#{booking.bookingNumber}</td>
                                                            <td className="px-6 py-4 max-w-xs truncate">
                                                                <p className="text-slate-900 font-bold truncate">{booking.pickupAddress}</p>
                                                                <p className="text-slate-500 font-medium truncate">→ {booking.dropAddress}</p>
                                                            </td>
                                                            <td className="px-6 py-4 text-slate-900 font-black">
                                                                ৳{(booking.finalFare || booking.estimatedFare || 0).toLocaleString()}
                                                            </td>
                                                            <td className="px-6 py-4 text-slate-600 font-medium">
                                                                {new Date(booking.createdAt).toLocaleDateString()}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={cn(
                                                                    "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                                                                    booking.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' :
                                                                        booking.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                                                                            'bg-blue-100 text-blue-600'
                                                                )}>
                                                                    {booking.status}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Document Preview Lightbox Modal */}
            {previewDocument && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={() => setPreviewDocument(null)}>
                    <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-3xl overflow-hidden p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100 mb-3 px-2">
                            <h4 className="font-black text-slate-900">{previewDocument.title}</h4>
                            <button onClick={() => setPreviewDocument(null)} className="p-1 hover:bg-slate-100 rounded-full text-slate-500">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <img src={previewDocument.url} alt={previewDocument.title} className="max-h-[75vh] w-auto mx-auto object-contain rounded-xl" />
                    </div>
                </div>
            )}

            <DeleteConfirmModal
                isOpen={statusModal.open}
                onClose={() => setStatusModal({ open: false, id: "", name: "", currentActive: true })}
                onConfirm={toggleStatus}
                isLoading={isUpdating}
                title={t("Suspend Driver", "ড্রাইভার স্থগিত করুন")}
                description={`${t("Are you sure you want to suspend", "আপনি কি নিশ্চিত যে আপনি স্থগিত করতে চান")} ${statusModal.name}? ${t("This will revoke their access to the platform until reactivated.", "এটি পুনরায় সক্রিয় না করা পর্যন্ত প্ল্যাটফর্মে তাদের অ্যাক্সেস বাতিল করবে।")}`}
            />

            <DeleteConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: "", name: "" })}
                onConfirm={handleHardDelete}
                isLoading={isDeleting}
                title={t("Permanently Delete Driver", "ড্রাইভার চিরতরে মুছুন")}
                description={`${t("Are you sure you want to permanently delete", "আপনি কি নিশ্চিত যে আপনি চিরতরে মুছে ফেলতে চান")} ${deleteModal.name}? ${t("This action is irreversible and will remove the driver, their trucks, and all associated account data.", "এই ক্রিয়াটি অপরিবর্তনীয় এবং ড্রাইভার, তাদের ট্রাক এবং সমস্ত সংশ্লিষ্ট অ্যাকাউন্ট ডেটা সরিয়ে দেবে।")}`}
            />
        </DashboardLayout>
    );
}