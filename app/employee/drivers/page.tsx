"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Truck,
    Search,
    UserCheck,
    Loader2,
    ShieldCheck,
    XCircle,
    FileText
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function EmployeeDriversPage() {
    const { t } = useLanguage();
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchDrivers = async () => {
        try {
            // Use /drivers endpoint which allows both ADMIN and EMPLOYEE
            const response = await api.get("/drivers");
            const driversList = response.data?.data?.drivers || [];
            // Drivers endpoint returns user info directly, adapt to same structure
            const adapted = driversList.map((d: any) => ({
                id: d.id,
                userId: d.userId,
                licenseNumber: d.licenseNumber,
                status: d.status,
                experience: d.experience,
                user: d.user || {},
            }));
            setDrivers(adapted);
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
        d.user.phone.includes(searchTerm)
    );

    return (
        <DashboardLayout requiredRole="EMPLOYEE">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Verify Drivers", "ড্রাইভার যাচাই")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Review driver documents and grant verification status.", "ড্রাইভারের ডকুমেন্টস যাচাই করুন এবং ভেরিফিকেশন দিন।")}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-950" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t("Search by name or phone...", "নাম বা ফোন খুঁজুন...")}
                            className="bg-white h-12 pl-12 pr-6 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/10 outline-none w-72 font-black text-sm text-slate-950 placeholder:text-slate-500"
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 flex justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : filteredDrivers.length === 0 ? (
                    <div className="col-span-full py-20 bg-white rounded-lg border border-slate-100 text-center">
                        <UserCheck className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold italic">{t("No drivers found.", "কোন ড্রাইভার পাওয়া যায়নি।")}</p>
                    </div>
                ) : (
                    filteredDrivers.map((driver) => (
                        <div key={driver.id} className="bg-white rounded-lg border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-primary">
                                    <Truck className="w-6 h-6" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h3 className="font-black text-slate-950 truncate">{driver.user.name}</h3>
                                    <p className="text-sm text-slate-700 font-bold">{driver.user.phone}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-slate-600">{t("License No", "লাইসেন্স নং")}:</span>
                                    <span className="text-slate-950">{driver.licenseNumber || "N/A"}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-slate-600">{t("Status", "স্ট্যাটাস")}:</span>
                                    {driver.isVerified ? (
                                        <span className="text-green-600 flex items-center gap-1 uppercase tracking-widest text-[10px] font-black">
                                            <ShieldCheck className="w-3 h-3" />
                                            {t("Verified", "ভেরিফাইড")}
                                        </span>
                                    ) : (
                                        <span className="text-amber-600 flex items-center gap-1 uppercase tracking-widest text-[10px] font-black">
                                            <XCircle className="w-3 h-3" />
                                            {t("Pending", "অপেক্ষমান")}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-2 font-black text-white">
                                <Button className="flex-1 rounded-lg gap-2">
                                    <FileText className="w-4 h-4" />
                                    {t("Review Details", "বিস্তারিত দেখুন")}
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </DashboardLayout>
    );
}
