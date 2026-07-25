"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Search,
    MoreVertical,
    UserX,
    UserCheck,
    Loader2,
    Filter,
    Trash2
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn, getAvatarUrl } from "@/lib/utils";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

export default function AdminUsersPage() {
    const { t } = useLanguage();
    const [users, setUsers] = useState<{ id: string; name: string; phone: string; email?: string; role: string; createdAt: string; isActive: boolean }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusModal, setStatusModal] = useState<{ open: boolean; id: string; name: string; currentActive: boolean }>({ open: false, id: "", name: "", currentActive: true });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: "", name: "" });
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Filter states
    const [roleFilter, setRoleFilter] = useState("ALL");
    const [statusFilter, setStatusFilter] = useState("ALL");

    const fetchUsers = useCallback(async () => {
        try {
            const response = await api.get("/admin/users");
            setUsers(response.data.data.users || []);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const toggleStatus = async () => {
        if (!statusModal.id) return;
        setIsUpdating(true);
        try {
            await api.patch(`/admin/users/${statusModal.id}/status`, { isActive: !statusModal.currentActive });
            toast.success(t("User status updated", "ইউজার স্ট্যাটাস আপডেট করা হয়েছে"));
            fetchUsers();
            setStatusModal({ open: false, id: "", name: "", currentActive: true });
        } catch (error) {
            toast.error(t("Failed to update status", "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে"));
        } finally {
            setIsUpdating(false);
        }
    };

    const handleHardDelete = async () => {
        if (!deleteModal.id) return;
        setIsDeleting(true);
        try {
            await api.delete(`/admin/users/${deleteModal.id}`);
            toast.success(t("User permanently deleted", "ইউজার চিরতরে মুছে ফেলা হয়েছে"));
            fetchUsers();
            setDeleteModal({ open: false, id: "", name: "" });
        } catch (error) {
            toast.error(t("Failed to delete user", "ইউজার মুছতে ব্যর্থ হয়েছে"));
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch =
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.phone.includes(searchTerm) ||
            u.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole = roleFilter === "ALL" || u.role === roleFilter;
        const matchesStatus = statusFilter === "ALL" ||
            (statusFilter === "ACTIVE" ? u.isActive : !u.isActive);

        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-1">
                        {t("User Management", "ইউজার ম্যানেজমেন্ট")}
                    </h1>
                    <p className="text-slate-600 font-bold text-sm">
                        {t("Manage all customers, drivers, and agents.", "কাস্টমার, ড্রাইভার এবং এজেন্টদের ম্যানেজ করুন।")}
                    </p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t("Search by name, phone...", "নাম বা ফোন দিয়ে খুঁজুন...")}
                        className="bg-white h-12 pl-12 pr-6 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/10 outline-none w-full md:w-80 font-bold text-sm text-slate-950 placeholder:text-slate-400 transition-all shadow-sm"
                    />
                </div>
            </header>

            {/* Always-on Filter Bar */}
            <div className="mb-8 p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-wrap gap-8 items-end">
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Filter className="w-3 h-3 text-primary" />
                        {t("User Role", "ইউজার রোল")}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {[
                            { id: "ALL", label: t("All", "সব") },
                            { id: "USER", label: t("Customer", "কাস্টমার") },
                            { id: "DRIVER", label: t("Driver", "ড্রাইভার") },
                            { id: "AGENT", label: t("Agent", "এজেন্ট") },
                            { id: "ADMIN", label: t("Admin", "এডমিন") },
                        ].map((role) => (
                            <button
                                key={role.id}
                                onClick={() => setRoleFilter(role.id)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-xs font-black transition-all border",
                                    roleFilter === role.id
                                        ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                                        : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-200"
                                )}
                            >
                                {role.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-10 w-px bg-slate-100 hidden md:block" />

                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("Account Status", "অ্যাকাউন্ট স্ট্যাটাস")}</label>
                    <div className="flex gap-2">
                        {[
                            { id: "ALL", label: t("All", "সব") },
                            { id: "ACTIVE", label: t("Active", "সক্রিয়") },
                            { id: "SUSPENDED", label: t("Suspended", "স্থগিত") },
                        ].map((status) => (
                            <button
                                key={status.id}
                                onClick={() => setStatusFilter(status.id)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-xs font-black transition-all border",
                                    statusFilter === status.id
                                        ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/20"
                                        : "bg-slate-50 border-slate-100 text-slate-600 hover:bg-white hover:border-slate-200"
                                )}
                            >
                                {status.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

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
                                    <th className="px-8 py-4">{t("User", "ইউজার")}</th>
                                    <th className="px-8 py-4">{t("Role", "রোল")}</th>
                                    <th className="px-8 py-4">{t("Registered", "রেজিস্টার্ড")}</th>
                                    <th className="px-8 py-4">{t("Status", "স্ট্যাটাস")}</th>
                                    <th className="px-8 py-4 text-right">{t("Actions", "অ্যাকশন")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-600 overflow-hidden shrink-0 border border-slate-200">
                                                    {user.avatar ? (
                                                        <img src={getAvatarUrl(user.avatar) || ""} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.name[0]?.toUpperCase()
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-950">{user.name}</p>
                                                    <p className="text-xs text-slate-700 font-bold">{user.phone}</p>
                                                    {((user as any).driver?.nidNumber || (user as any).agent?.nidNumber) && (
                                                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase">
                                                            NID: {(user as any).driver?.nidNumber || (user as any).agent?.nidNumber}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={cn(
                                                "text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider",
                                                user.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' :
                                                    user.role === 'DRIVER' ? 'bg-amber-100 text-amber-600' :
                                                        user.role === 'AGENT' ? 'bg-cyan-100 text-cyan-600' :
                                                            'bg-blue-100 text-blue-600'
                                            )}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-sm text-slate-800 font-bold">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={cn("w-2 h-2 rounded-full", user.isActive ? "bg-green-500" : "bg-red-500")} />
                                                <span className={cn("text-xs font-bold", user.isActive ? "text-green-600" : "text-red-600")}>
                                                    {user.isActive ? t("Active", "সক্রিয়") : t("Suspended", "সাময়িক স্থগিত")}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={cn("rounded-lg", user.isActive ? "text-red-500 hover:bg-red-50" : "text-green-500 hover:bg-green-50")}
                                                    onClick={() => {
                                                        if (user.isActive) {
                                                            setStatusModal({ open: true, id: user.id, name: user.name, currentActive: user.isActive });
                                                        } else {
                                                            // For activating, we can just do it directly or show a modal. 
                                                            // User specifically asked for alert on delete/remove, activation is positive.
                                                            // But let's be consistent and use modal for both or just suspension.
                                                            // user said "delete or remove anything", suspension is like removal.
                                                            api.patch(`/admin/users/${user.id}/status`, { isActive: true }).then(() => {
                                                                toast.success("User activated");
                                                                fetchUsers();
                                                            });
                                                        }
                                                    }}
                                                >
                                                    {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-lg text-red-500 hover:bg-red-50"
                                                    onClick={() => setDeleteModal({ open: true, id: user.id, name: user.name })}
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
                title={t("Suspend User", "ইউজার স্থগিত করুন")}
                description={`${t("Are you sure you want to suspend", "আপনি কি নিশ্চিত যে আপনি স্থগিত করতে চান")} ${statusModal.name}? ${t("This will revoke their access to the platform until reactivated.", "এটি পুনরায় সক্রিয় না করা পর্যন্ত প্ল্যাটফর্মে তাদের অ্যাক্সেস বাতিল করবে।")}`}
            />

            <DeleteConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: "", name: "" })}
                onConfirm={handleHardDelete}
                isLoading={isDeleting}
                title={t("Permanently Delete User", "ইউজার চিরতরে মুছুন")}
                description={`${t("Are you sure you want to permanently delete", "আপনি কি নিশ্চিত যে আপনি চিরতরে মুছে ফেলতে চান")} ${deleteModal.name}? ${t("This action is irreversible and will remove all their data from the system.", "এই ক্রিয়াটি অপরিবর্তনীয় এবং সিস্টেম থেকে তাদের সমস্ত ডেটা সরিয়ে দেবে।")}`}
            />
        </DashboardLayout>
    );
}
