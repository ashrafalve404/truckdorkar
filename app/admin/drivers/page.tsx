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
    Trash2
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn, getAvatarUrl } from "@/lib/utils";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

export default function AdminDriversPage() {
    const { t } = useLanguage();
    const [drivers, setDrivers] = useState<{
        id: string; user?: { name?: string; phone?: string; email?: string; avatar?: string; isActive?: boolean; id?: string }; licenseNumber?: string; status: string
    }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusModal, setStatusModal] = useState<{ open: boolean; id: string; name: string; currentActive: boolean }>({ open: false, id: "", name: "", currentActive: true });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: "", name: "" });
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchDrivers = useCallback(async () => {
        try {
            const response = await api.get("/admin/drivers");
            setDrivers(response.data?.data?.drivers || []);
        } catch (err) {
            console.error("Failed to fetch drivers", err);
            toast.error(t("Failed to load drivers", "ড্রাইভার লোড করতে ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    }, []);

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
                </div>
            </header>

            <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden text-black">
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
                        <p className="text-slate-500 text-sm max-w-md">
                            {searchTerm
                                ? t("Try adjusting your search term", "অনুসন্ধান শর্ত পরিবর্তন করুন")
                                : t("New driver registrations will appear here once they sign up.", "নতুন ড্রাইভার রেজিস্ট্রেশন সাইন আপ করলে এখানে দেখা যাবে।")}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-950">
                                <tr>
                                    <th className="px-8 py-4">{t("Driver", "ড্রাইভার")}</th>
                                    <th className="px-8 py-4">{t("License No", "লাইসেন্স নং")}</th>
                                    <th className="px-8 py-4">{t("Verification", "ভেরিফিকেশন")}</th>
                                    <th className="px-8 py-4">{t("User Status", "ইউজার স্ট্যাটাস")}</th>
                                    <th className="px-8 py-4 text-right">{t("Actions", "অ্যাকশন")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 font-bold text-sm">
                                {filteredDrivers.map((driver) => (
                                    <tr key={driver.id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-primary overflow-hidden shrink-0 border border-slate-200">
                                                    {driver.user?.avatar ? (
                                                        <img src={getAvatarUrl(driver.user.avatar) || ""} alt={driver.user?.name || "Driver"} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <TruckIcon className="w-5 h-5 text-slate-400" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-950">{driver.user?.name || "—"}</p>
                                                    <p className="text-xs text-slate-700 font-bold">{driver.user?.phone || "—"}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1">NID: {(driver as any).nidNumber || "N/A"}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-slate-600">
                                            {driver.licenseNumber || t("N/A", "N/A")}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider",
                                                    driver.status === 'VERIFIED' ? 'bg-green-100 text-green-600' :
                                                        driver.status === 'REJECTED' ? 'bg-red-100 text-red-600' :
                                                            'bg-amber-100 text-amber-600'
                                                )}>
                                                    {driver.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-2 h-2 rounded-full", driver.user?.isActive ? "bg-green-500" : "bg-red-500")} />
                                                <span className={cn("text-xs font-bold", driver.user?.isActive ? "text-green-600" : "text-red-600")}>
                                                    {driver.user?.isActive ? t("Active", "সক্রিয়") : t("Suspended", "স্থগিত")}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {driver.status === 'PENDING' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="default"
                                                            className="h-8 text-[10px] uppercase font-black tracking-widest bg-green-500 hover:bg-green-600 text-white"
                                                            onClick={() => handleVerify(driver.id, 'VERIFIED')}
                                                        >
                                                            {t("Verify", "যাচাই করুন")}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-8 text-[10px] uppercase font-black tracking-widest"
                                                            onClick={() => handleVerify(driver.id, 'REJECTED')}
                                                        >
                                                            {t("Reject", "প্রত্যাখ্যান")}
                                                        </Button>
                                                    </>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={cn("rounded-lg", driver.user?.isActive ? "text-red-500 hover:bg-red-50" : "text-green-500 hover:bg-green-50")}
                                                    onClick={() => {
                                                        if (driver.user?.isActive && driver.user.id) {
                                                            setStatusModal({ open: true, id: driver.user.id, name: driver.user.name || "this driver", currentActive: true });
                                                        } else if (driver.user?.id) {
                                                            api.patch(`/admin/users/${driver.user.id}/status`, { isActive: true }).then(() => {
                                                                toast.success("Driver account activated");
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
                                                    className="rounded-lg text-red-500 hover:bg-red-50"
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