"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Users as UsersIcon,
    Search,
    MoreVertical,
    Shield,
    UserX,
    UserCheck,
    Loader2,
    Filter
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
    const { t } = useLanguage();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        try {
            const response = await api.get("/admin/users");
            setUsers(response.data.data.users || []);
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleStatus = async (userId: string, currentStatus: boolean) => {
        try {
            await api.patch(`/admin/users/${userId}/status`, { isActive: !currentStatus });
            toast.success(t("User status updated", "ইউজার স্ট্যাটাস আপডেট করা হয়েছে"));
            fetchUsers();
        } catch (error) {
            toast.error(t("Failed to update status", "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে"));
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("User Management", "ইউজার ম্যানেজমেন্ট")}
                    </h1>
                    <p className="text-slate-500 font-bold">
                        {t("Monitor and manage all registered users on the platform.", "প্ল্যাটফর্মের সকল রেজিস্টার্ড ইউজারদের মনিটর এবং ম্যানেজ করুন।")}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t("Search users...", "ইউজার খুঁজুন...")}
                            className="bg-white h-12 pl-12 pr-6 rounded-lg border border-slate-100 focus:ring-2 focus:ring-primary/10 outline-none w-64 font-bold text-sm"
                        />
                    </div>
                    <Button variant="outline" className="h-12 rounded-lg gap-2 font-bold px-6">
                        <Filter className="w-4 h-4" />
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
                                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
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
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400">
                                                    {user.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{user.name}</p>
                                                    <p className="text-xs text-slate-400 font-medium">{user.phone}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={cn(
                                                "text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider",
                                                user.role === 'ADMIN' ? 'bg-purple-100 text-purple-600' :
                                                    user.role === 'DRIVER' ? 'bg-amber-100 text-amber-600' :
                                                        'bg-blue-100 text-blue-600'
                                            )}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-sm text-slate-500 font-bold">
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
                                                    onClick={() => toggleStatus(user.id, user.isActive)}
                                                >
                                                    {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                                </Button>
                                                <Button variant="ghost" size="icon" className="rounded-lg text-slate-400">
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
