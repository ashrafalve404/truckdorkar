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
    EyeOff,
    Phone,
    Mail,
    Calendar,
    ExternalLink,
    FileText,
    Truck,
    ShieldCheck,
    DollarSign,
    Star,
    Package,
    ArrowRight
} from "lucide-react";
import api, { getFileUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn, getAvatarUrl } from "@/lib/utils";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

export default function AdminUsersPage() {
    const { t } = useLanguage();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusModal, setStatusModal] = useState<{ open: boolean; id: string; name: string; currentActive: boolean }>({ open: false, id: "", name: "", currentActive: true });
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: "", name: "" });
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Detail Modal State
    const [selectedUser, setSelectedUser] = useState<any | null>(null);
    const [userTab, setUserTab] = useState<"overview" | "role" | "bookings">("overview");
    const [previewDocument, setPreviewDocument] = useState<{ title: string; url: string } | null>(null);

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
                                    <tr
                                        key={user.id}
                                        onClick={() => {
                                            setSelectedUser(user);
                                            setUserTab("overview");
                                        }}
                                        className="hover:bg-slate-50/80 transition-all cursor-pointer group"
                                    >
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
                                        <td className="px-8 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center justify-end gap-1.5">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 px-2.5 rounded-lg text-xs font-black gap-1 text-slate-700 hover:bg-slate-100"
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setUserTab("overview");
                                                    }}
                                                >
                                                    <Eye className="w-3.5 h-3.5 text-primary" />
                                                    {t("View Info", "তথ্য দেখুন")}
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className={cn("rounded-lg h-8 w-8", user.isActive ? "text-red-500 hover:bg-red-50" : "text-green-500 hover:bg-green-50")}
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
                                                    className="rounded-lg h-8 w-8 text-red-500 hover:bg-red-50"
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

            {/* ── USER DETAILS POPUP MODAL ─────────────────────────────────────── */}
            {selectedUser && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                    onClick={() => setSelectedUser(null)}
                >
                    <div
                        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="p-6 md:p-8 bg-slate-900 text-white flex items-start justify-between relative overflow-hidden">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-16 h-16 rounded-2xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-2xl font-black overflow-hidden shrink-0 shadow-lg">
                                    {selectedUser.avatar ? (
                                        <img src={getAvatarUrl(selectedUser.avatar) || ""} alt={selectedUser.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-white">{selectedUser.name?.[0]?.toUpperCase()}</span>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <h2 className="text-xl md:text-2xl font-black">{selectedUser.name}</h2>
                                        <span className={cn(
                                            "px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                                            selectedUser.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300 border-purple-400/30' :
                                                selectedUser.role === 'DRIVER' ? 'bg-amber-500/20 text-amber-300 border-amber-400/30' :
                                                    selectedUser.role === 'AGENT' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30' :
                                                        'bg-blue-500/20 text-blue-300 border-blue-400/30'
                                        )}>
                                            {selectedUser.role}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-300 font-bold flex items-center gap-4 flex-wrap">
                                        <span>📞 {selectedUser.phone}</span>
                                        {selectedUser.email && <span>✉️ {selectedUser.email}</span>}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedUser(null)}
                                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white font-bold transition-all relative z-10"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex border-b border-slate-100 bg-slate-50 px-6 gap-2 pt-2">
                            <button
                                onClick={() => setUserTab("overview")}
                                className={cn(
                                    "px-5 py-3 text-xs font-black transition-all border-b-2 -mb-px",
                                    userTab === "overview" ? "border-primary text-primary bg-white rounded-t-xl shadow-xs" : "border-transparent text-slate-500 hover:text-slate-900"
                                )}
                            >
                                {t("Overview", "সংক্ষিপ্ত বিবরণ")}
                            </button>
                            {(selectedUser.driver || selectedUser.agent) && (
                                <button
                                    onClick={() => setUserTab("role")}
                                    className={cn(
                                        "px-5 py-3 text-xs font-black transition-all border-b-2 -mb-px",
                                        userTab === "role" ? "border-primary text-primary bg-white rounded-t-xl shadow-xs" : "border-transparent text-slate-500 hover:text-slate-900"
                                    )}
                                >
                                    {selectedUser.role === "DRIVER" ? t("Driver Details", "ড্রাইভার বিস্তারিত") : t("Agent Details", "এজেন্ট বিস্তারিত")}
                                </button>
                            )}
                            <button
                                onClick={() => setUserTab("bookings")}
                                className={cn(
                                    "px-5 py-3 text-xs font-black transition-all border-b-2 -mb-px",
                                    userTab === "bookings" ? "border-primary text-primary bg-white rounded-t-xl shadow-xs" : "border-transparent text-slate-500 hover:text-slate-900"
                                )}
                            >
                                {t("Recent Trips", "সাম্প্রতিক বুকিং")} ({selectedUser.bookings?.length || 0})
                            </button>
                        </div>

                        {/* Modal Content Body */}
                        <div className="p-6 md:p-8 overflow-y-auto flex-1 space-y-6">
                            {userTab === "overview" && (
                                <div className="space-y-6">
                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{t("User ID", "ইউজার আইডি")}</span>
                                            <span className="text-xs font-black text-slate-900 font-mono truncate block">{selectedUser.id}</span>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{t("Status", "স্ট্যাটাস")}</span>
                                            <span className={cn("text-xs font-black uppercase tracking-wider", selectedUser.isActive ? "text-green-600" : "text-red-600")}>
                                                {selectedUser.isActive ? t("Active", "সক্রিয়") : t("Suspended", "সাময়িক স্থগিত")}
                                            </span>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{t("Joined Date", "যোগদানের তারিখ")}</span>
                                            <span className="text-xs font-black text-slate-900">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>

                                    {/* Additional Info Cards */}
                                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">{t("Contact Details", "যোগাযোগের বিবরণ")}</h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                                            <div>
                                                <span className="text-slate-500 block text-[10px] uppercase mb-0.5">{t("Phone Number", "ফোন নম্বর")}</span>
                                                <a href={`tel:${selectedUser.phone}`} className="text-primary font-black hover:underline">{selectedUser.phone}</a>
                                            </div>
                                            <div>
                                                <span className="text-slate-500 block text-[10px] uppercase mb-0.5">{t("Email Address", "ইমেইল")}</span>
                                                <span className="text-slate-900">{selectedUser.email || t("Not Provided", "প্রদান করা হয়নি")}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {userTab === "role" && selectedUser.driver && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block mb-1">{t("Total Trips", "মোট ট্রিপ")}</span>
                                            <span className="text-xl font-black text-amber-900">{selectedUser.driver.totalTrips || 0}</span>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                                            <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block mb-1">{t("Rating", "রেটিং")}</span>
                                            <span className="text-xl font-black text-amber-900">⭐ {selectedUser.driver.rating || 5.0}</span>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">{t("Earnings", "মোট আয়")}</span>
                                            <span className="text-xl font-black text-emerald-900">৳{selectedUser.driver.totalEarnings || 0}</span>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">{t("Commission Paid", "পরিশোধিত কমিশন")}</span>
                                            <span className="text-xl font-black text-blue-900">৳{selectedUser.driver.paidCommission || 0}</span>
                                        </div>
                                    </div>

                                    {/* Registered Trucks */}
                                    {selectedUser.driver.trucks && selectedUser.driver.trucks.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">{t("Registered Vehicles", "রেজিস্টার্ড ট্রাক")}</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                {selectedUser.driver.trucks.map((trk: any) => (
                                                    <div key={trk.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                                                        <div>
                                                            <p className="text-xs font-black text-slate-900">{trk.registrationNo}</p>
                                                            <p className="text-[10px] font-bold text-slate-500">{trk.category} • {trk.capacityTon} Ton</p>
                                                        </div>
                                                        <span className={cn("text-[10px] font-black px-2 py-0.5 rounded uppercase", trk.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                                                            {trk.status}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Driver Documents */}
                                    {(selectedUser.driver.nidFront || selectedUser.driver.nidBack || selectedUser.driver.licenseFront || selectedUser.driver.licenseBack) && (
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">{t("Uploaded Documents", "আপলোডকৃত কাগজপত্র")}</h4>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                                {selectedUser.driver.nidFront && (
                                                    <button
                                                        onClick={() => setPreviewDocument({ title: t("NID Front", "এনআইডি ফ্রন্ট"), url: selectedUser.driver.nidFront })}
                                                        className="p-3 rounded-2xl border border-slate-200 hover:border-primary transition-all text-center space-y-2 group bg-slate-50 hover:bg-white shadow-xs"
                                                    >
                                                        <div className="h-20 w-full rounded-xl overflow-hidden bg-slate-200">
                                                            <img src={getFileUrl(selectedUser.driver.nidFront)} alt="NID Front" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-700 block truncate">{t("NID Front", "এনআইডি ফ্রন্ট")}</span>
                                                    </button>
                                                )}
                                                {selectedUser.driver.nidBack && (
                                                    <button
                                                        onClick={() => setPreviewDocument({ title: t("NID Back", "এনআইডি ব্যাক"), url: selectedUser.driver.nidBack })}
                                                        className="p-3 rounded-2xl border border-slate-200 hover:border-primary transition-all text-center space-y-2 group bg-slate-50 hover:bg-white shadow-xs"
                                                    >
                                                        <div className="h-20 w-full rounded-xl overflow-hidden bg-slate-200">
                                                            <img src={getFileUrl(selectedUser.driver.nidBack)} alt="NID Back" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-700 block truncate">{t("NID Back", "এনআইডি ব্যাক")}</span>
                                                    </button>
                                                )}
                                                {selectedUser.driver.licenseFront && (
                                                    <button
                                                        onClick={() => setPreviewDocument({ title: t("License Front", "লাইসেন্স ফ্রন্ট"), url: selectedUser.driver.licenseFront })}
                                                        className="p-3 rounded-2xl border border-slate-200 hover:border-primary transition-all text-center space-y-2 group bg-slate-50 hover:bg-white shadow-xs"
                                                    >
                                                        <div className="h-20 w-full rounded-xl overflow-hidden bg-slate-200">
                                                            <img src={getFileUrl(selectedUser.driver.licenseFront)} alt="License Front" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-700 block truncate">{t("License Front", "লাইসেন্স ফ্রন্ট")}</span>
                                                    </button>
                                                )}
                                                {selectedUser.driver.licenseBack && (
                                                    <button
                                                        onClick={() => setPreviewDocument({ title: t("License Back", "লাইসেন্স ব্যাক"), url: selectedUser.driver.licenseBack })}
                                                        className="p-3 rounded-2xl border border-slate-200 hover:border-primary transition-all text-center space-y-2 group bg-slate-50 hover:bg-white shadow-xs"
                                                    >
                                                        <div className="h-20 w-full rounded-xl overflow-hidden bg-slate-200">
                                                            <img src={getFileUrl(selectedUser.driver.licenseBack)} alt="License Back" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-slate-700 block truncate">{t("License Back", "লাইসেন্স ব্যাক")}</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {userTab === "role" && selectedUser.agent && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        <div className="p-4 rounded-2xl bg-cyan-50 border border-cyan-100">
                                            <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest block mb-1">{t("Agent ID", "এজেন্ট আইডি")}</span>
                                            <span className="text-sm font-black text-cyan-900 font-mono">{selectedUser.agent.agentId || "N/A"}</span>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
                                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">{t("Wallet Balance", "ওয়ালেট ব্যালেন্স")}</span>
                                            <span className="text-xl font-black text-emerald-900">৳{selectedUser.agent.walletBalance || 0}</span>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100">
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">{t("Total Earnings", "মোট উপার্জিত")}</span>
                                            <span className="text-xl font-black text-blue-900">৳{selectedUser.agent.totalEarnings || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {userTab === "bookings" && (
                                <div className="space-y-3">
                                    {selectedUser.bookings && selectedUser.bookings.length > 0 ? (
                                        selectedUser.bookings.map((b: any) => (
                                            <div key={b.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
                                                <div>
                                                    <p className="text-xs font-black text-slate-900">#{b.bookingNumber}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold truncate max-w-md">{b.pickupAddress} ➔ {b.dropAddress}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-black text-primary block">৳{b.estimatedFare}</span>
                                                    <span className="text-[10px] font-black uppercase text-slate-400">{b.status}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400 font-bold text-center py-8">{t("No recent bookings found", "কোনো সাম্প্রতিক বুকিং পাওয়া যায়নি")}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer Controls */}
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                            <Button
                                onClick={() => {
                                    const targetUser = selectedUser;
                                    setSelectedUser(null);
                                    setDeleteModal({ open: true, id: targetUser.id, name: targetUser.name });
                                }}
                                variant="ghost"
                                className="text-red-500 hover:bg-red-50 font-bold text-xs gap-1.5"
                            >
                                <Trash2 className="w-4 h-4" />
                                {t("Delete User", "ইউজার মুছে ফেলুন")}
                            </Button>

                            <Button
                                onClick={() => setSelectedUser(null)}
                                className="h-11 px-8 rounded-xl font-bold bg-slate-900 text-white"
                            >
                                {t("Close", "বন্ধ করুন")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Document Preview Lightbox Modal */}
            {previewDocument && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200"
                    onClick={() => setPreviewDocument(null)}
                >
                    <div className="max-w-3xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20 p-6 relative space-y-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-sm font-black text-slate-900">{previewDocument.title}</h3>
                            <button onClick={() => setPreviewDocument(null)} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">✕</button>
                        </div>
                        <div className="max-h-[75vh] overflow-auto rounded-2xl bg-slate-950 flex items-center justify-center p-2">
                            <img src={getFileUrl(previewDocument.url)} alt={previewDocument.title} className="max-w-full max-h-[70vh] object-contain rounded-xl" />
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
