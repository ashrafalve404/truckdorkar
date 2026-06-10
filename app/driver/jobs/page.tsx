"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Search,
    Calendar,
    ArrowRight,
    Loader2,
    Package
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function DriverJobsPage() {
    const { t } = useLanguage();
    const [jobs, setJobs] = useState<{ id: string; type?: string; pickupAddress: string; dropAddress: string; status: string; estimatedFare?: number | string; scheduledAt?: string; goodsType?: string }[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = useCallback(async () => {
        try {
            // Fetch available jobs (PENDING status)
            const response = await api.get("/bookings");
            const allBookings = response.data.data || [];
            setJobs(allBookings.filter((b: { status: string }) => b.status === 'PENDING'));
        } catch (error) {
            console.error("Failed to fetch jobs", error);
            toast.error(t("Failed to load available jobs", "কাজগুলো লোড করতে ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    }, [t, toast]);

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    const handleAcceptJob = async (id: string) => {
        try {
            await api.patch(`/bookings/${id}/accept`);
            toast.success(t("Job accepted successfully!", "কাজটি সফলভাবে গ্রহণ করা হয়েছে!"));
            fetchJobs();
        } catch (error) {
            console.error("Failed to accept job", error);
            toast.error(t("Failed to accept job", "কাজটি গ্রহণ করতে ব্যর্থ হয়েছে"));
        }
    };

    return (
        <DashboardLayout requiredRole="DRIVER">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Find New Jobs", "কাজ খুঁজুন")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Browse available booking requests and accept yours.", "সাভেইলেবল বুকিংগুলো দেখুন এবং আপনার পছন্দমতো গ্রহণ করুন।")}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-950" />
                        <input
                            type="text"
                            placeholder={t("Search location...", "ঠিকানা খুঁজুন...")}
                            className="bg-white h-12 pl-12 pr-6 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/10 outline-none w-64 font-black text-sm text-slate-950 placeholder:text-slate-500"
                        />
                    </div>
                </div>
            </header>

            {loading ? (
                <div className="p-20 flex justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : jobs.length === 0 ? (
                <div className="bg-white rounded-lg border border-slate-100 p-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-950 mb-2">{t("No Available Jobs", "কোন কাজ পাওয়া যায়নি")}</h3>
                    <p className="text-slate-700 font-bold max-w-sm mx-auto">
                        {t("Currently there are no unassigned booking requests. Check back later!", "বর্তমানে কোন বুকিং রিকোয়েস্ট নেই। পরে আবার চেষ্টা করুন!")}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                        <div key={job.id} className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-primary/5 text-primary text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                                        {job.type?.replace('_', ' ') || "DELIVERY"}
                                    </div>
                                    <div className="font-black text-slate-950">৳{job.estimatedFare || 'Negotiable'}</div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                        <div>
                                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-none mb-1">{t("Pickup", "পিকআপ")}</p>
                                            <p className="text-sm font-bold text-slate-900">{job.pickupAddress}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                        <div>
                                            <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest leading-none mb-1">{t("Drop", "ড্রপ")}</p>
                                            <p className="text-sm font-bold text-slate-900">{job.dropAddress}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 py-4 border-y border-slate-50 mb-6">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-700">
                                            {job.scheduledAt ? new Date(job.scheduledAt).toLocaleDateString() : 'ASAP'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-700">{job.goodsType}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={() => handleAcceptJob(job.id)}
                                    className="w-full h-12 rounded-lg font-black gap-2 shadow-lg shadow-primary/10"
                                >
                                    {t("Accept Job", "কাজটি নিন")}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
