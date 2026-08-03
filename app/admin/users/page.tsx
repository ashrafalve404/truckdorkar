"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Search,
    UserX,
    UserCheck,
    Loader2,
    Filter,
    Trash2,
    UserPlus,
    X,
    Eye,
    EyeOff
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn, getAvatarUrl } from "@/lib/utils";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

export default function AdminUsersPage() {
    const { t } = useLanguage();
    const [users, setUsers] = useState<{ id: string; name: string; phone: string; email?: string; avatar?: string; role: string; createdAt: string; isActive: boolean }[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusModal, setStatusModal] = useState<{ open: boolean; id: string; name: string; currentActive: boolean }>({ open: false, id: "", name: "", currentActive: true });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: "", name: "" });
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Create User Modal State
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [createFormData, setCreateFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        role: "USER",
    });

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

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!createFormData.name || !createFormData.phone || !createFormData.password) {
            toast.error(t("Please fill all required fields", "সব প্রয়োজনীয় ঘর পূরণ করুন"));
            return;
        }

        setIsCreating(true);
        try {
            await api.post("/admin/users", {
                name: createFormData.name,
                phone: createFormData.phone,
                email: createFormData.email.trim() || undefined,
                password: createFormData.password,
                role: createFormData.role,
            });

            toast.success(t("User created successfully (No OTP required)", "ইউজার সফলভাবে তৈরি হয়েছে (OTP প্রয়োজন নেই)"));
            setCreateModalOpen(false);
            setCreateFormData({ name: "", phone: "", email: "", password: "", role: "USER" });
            fetchUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("Failed to create user", "ইউজার তৈরি করতে ব্যর্থ হয়েছে"));
        } finally {
            setIsCreating(false);
        }
    };

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

                <div className="flex flex-wrap items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t("Search by name, phone...", "নাম বা ফোন দিয়ে খুঁজুন...")}
                            className="bg-white h-12 pl-12 pr-6 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/10 outline-none w-full md:w-72 font-bold text-sm text-slate-950 placeholder:text-slate-400 transition-all shadow-sm"
                        />
                    </div>

                    <Button
                        onClick={() => setCreateModalOpen(true)}
                        className="h-12 px-6 rounded-xl font-bold gap-2 text-white bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                    >
                        <UserPlus className="w-5 h-5" />
                        {t("Add New User", "নতুন ইউজার যোগ করুন")}
                    </Button>
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
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("w-2 h-2 rounded-full", user.isActive ? "bg-green-500" : "bg-red-500")} />
                                                    <span className={cn("text-xs font-bold", user.isActive ? "text-green-600" : "text-red-600")}>
                                                        {user.isActive ? t("Active", "সক্রিয়") : t("Suspended", "সাময়িক স্থগিত")}
                                                    </span>
                                                </div>
                                                <span className={cn("text-[10px] font-black px-2 py-0.5 rounded w-fit uppercase tracking-wider", (user as any).isPhoneVerified !== false ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600")}>
                                                    {(user as any).isPhoneVerified !== false ? t("Phone Verified", "ফোন ভেরিফাইড") : t("Pending OTP", "পেন্ডিং OTP")}
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

            {/* ── CREATE USER MODAL (NO OTP REQUIRED) ── */}
            {createModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setCreateModalOpen(false)}
                            className="absolute right-5 top-5 text-slate-400 hover:text-slate-700 transition-colors p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                                <UserPlus className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-slate-900">
                                    {t("Create New User", "নতুন ইউজার তৈরি করুন")}
                                </h3>
                                <p className="text-xs text-slate-500 font-bold">
                                    {t("Direct Creation (No OTP Verification Needed)", "সরাসরি তৈরি করুন (OTP ভেরিফিকেশন লাগবে না)")}
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                    {t("Full Name", "পুরো নাম")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={createFormData.name}
                                    onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                                    placeholder={t("Enter full name", "পুরো নাম লিখুন")}
                                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 outline-none focus:border-primary focus:bg-white transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                    {t("Phone Number", "ফোন নম্বর")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={createFormData.phone}
                                    onChange={(e) => setCreateFormData({ ...createFormData, phone: e.target.value })}
                                    placeholder="017XXXXXXXX"
                                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 outline-none focus:border-primary focus:bg-white transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                    {t("Role", "ভূমিকা / রোল")} <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={createFormData.role}
                                    onChange={(e) => setCreateFormData({ ...createFormData, role: e.target.value })}
                                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 outline-none focus:border-primary focus:bg-white transition-all"
                                >
                                    <option value="USER">{t("Customer (Normal User)", "কাস্টমার (সাধারণ ইউজার)")}</option>
                                    <option value="DRIVER">{t("Truck Driver", "ট্রাক ড্রাইভার")}</option>
                                    <option value="AGENT">{t("Truck Dorkar Agent", "ট্রাক দরকার এজেন্ট")}</option>
                                    <option value="ADMIN">{t("System Administrator", "সিস্টেম অ্যাডমিন")}</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                    {t("Email (Optional)", "ইমেইল (ঐচ্ছিক)")}
                                </label>
                                <input
                                    type="email"
                                    value={createFormData.email}
                                    onChange={(e) => setCreateFormData({ ...createFormData, email: e.target.value })}
                                    placeholder="user@example.com"
                                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 text-sm font-bold text-slate-900 outline-none focus:border-primary focus:bg-white transition-all"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-700 block mb-1">
                                    {t("Password", "পাসওয়ার্ড")} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={createFormData.password}
                                        onChange={(e) => setCreateFormData({ ...createFormData, password: e.target.value })}
                                        placeholder={t("Set user password", "পাসওয়ার্ড সেট করুন")}
                                        className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-4 pr-10 text-sm font-bold text-slate-900 outline-none focus:border-primary focus:bg-white transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-3 flex items-center justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setCreateModalOpen(false)}
                                    className="h-11 px-5 rounded-xl font-bold text-slate-700"
                                >
                                    {t("Cancel", "বাতিল")}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isCreating}
                                    className="h-11 px-6 rounded-xl font-bold text-white bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                                >
                                    {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : t("Create User", "ইউজার তৈরি করুন")}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <DeleteConfirmModal
                isOpen={statusModal.open}
                onClose={() => setStatusModal({ open: false, id: "", name: "", currentActive: true })}
                onConfirm={toggleStatus}
                isLoading={isUpdating}
                title={t("Suspend User Account", "ইউজার অ্যাকাউন্ট স্থগিত করুন")}
                description={t(
                    `Are you sure you want to suspend ${statusModal.name}? This will revoke their access to the platform until reactivated.`,
                    `আপনি কি নিশ্চিত যে আপনি ${statusModal.name}-কে স্থগিত করতে চান? এটি পুনরায় সক্রিয় না করা পর্যন্ত প্ল্যাটফর্মে তাদের অ্যাক্সেস বাতিল থাকবে।`
                )}
                confirmText={t("Suspend User", "স্থগিত করুন")}
                cancelText={t("Cancel", "বাতিল")}
            />

            <DeleteConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: "", name: "" })}
                onConfirm={handleHardDelete}
                isLoading={isDeleting}
                title={t("Permanently Delete User", "ইউজার চিরতরে মুছুন")}
                description={t(
                    `Are you sure you want to permanently delete ${deleteModal.name}? This action is irreversible and will remove all their data from the system.`,
                    `আপনি কি নিশ্চিত যে আপনি ${deleteModal.name}-কে চিরতরে মুছে ফেলতে চান? এই প্রক্রিয়াটি অপরিবর্তনীয় এবং সিস্টেম থেকে তাদের সমস্ত তথ্য সরিয়ে দেবে।`
                )}
                confirmText={t("Delete Permanently", "চিরতরে মুছুন")}
                cancelText={t("Cancel", "বাতিল")}
            />
        </DashboardLayout>
    );
}
