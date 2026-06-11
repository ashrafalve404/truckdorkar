"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Users,
    Truck,
    Search,
    Loader2,
    Eye,
    CheckCircle,
    XCircle,
    Clock
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminEmployeesPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [employees, setEmployees] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await api.get("/employees/admin/overview");
                setEmployees(response.data.data);
            } catch (error) {
                console.error("Failed to fetch employee overview", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEmployees();
    }, []);

    const filteredEmployees = employees.filter(emp =>
        emp.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.user.phone.includes(searchTerm) ||
        (emp.employeeId && emp.employeeId.includes(searchTerm))
    );

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Employee Operations", "কর্মচারী অপারেশন")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Monitor employee performance and truck registrations.", "কর্মচারীদের পারফরম্যান্স এবং ট্রাক রেজিস্ট্রেশন মনিটর করুন।")}
                    </p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t("Search by name or ID...", "নাম বা আইডি দিয়ে খুঁজুন...")}
                        className="bg-white h-12 pl-12 pr-6 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary/10 w-72 font-bold text-sm text-slate-900"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 flex justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : filteredEmployees.length === 0 ? (
                    <div className="col-span-full py-20 bg-white rounded-lg border border-slate-100 text-center">
                        <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold italic">{t("No employees found.", "কোন কর্মচারী পাওয়া যায়নি।")}</p>
                    </div>
                ) : (
                    filteredEmployees.map((emp) => (
                        <div key={emp.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-black">
                                        {emp.user.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-black text-slate-950 truncate">{emp.user.name}</h3>
                                        <p className="text-xs text-slate-500 font-bold">{emp.employeeId || "No ID"}</p>
                                    </div>
                                    <div className={cn(
                                        "px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                        emp.user.isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                    )}>
                                        {emp.user.isActive ? t("Active", "সক্রিয়") : t("Suspended", "স্থগিত")}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mb-6">
                                    <div className="bg-slate-50 p-3 rounded-lg text-center">
                                        <p className="text-lg font-black text-slate-950">{emp.trucksTotal}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">{t("Total", "মোট")}</p>
                                    </div>
                                    <div className="bg-amber-50 p-3 rounded-lg text-center">
                                        <p className="text-lg font-black text-amber-600">{emp.trucksPending}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">{t("Pending", "অপেক্ষা")}</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg text-center">
                                        <p className="text-lg font-black text-green-600">{emp.trucksApproved}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">{t("Approved", "অনুমোদিত")}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-500">{t("Phone", "ফোন")}:</span>
                                        <span className="text-slate-950">{emp.user.phone}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-500">{t("Department", "বিভাগ")}:</span>
                                        <span className="text-slate-950">{emp.department || "N/A"}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => router.push(`/admin/employees/${emp.id}/trucks`)}
                                    className="w-full h-12 rounded-lg gap-2 font-black text-white"
                                >
                                    <Truck className="w-5 h-5" />
                                    {t("View Truck Submissions", "ট্রাক সাবমিশন দেখুন")}
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
}
