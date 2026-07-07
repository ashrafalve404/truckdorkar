"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Search,
    Calendar,
    ArrowRight,
    Loader2,
    Package,
    TrendingUp,
    AlertTriangle,
    Lock,
    CreditCard,
    MapPin,
    Map as MapIcon
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Link from "next/link";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/mapping/MapComponent"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-500 font-bold" />
});

export default function DriverJobsPage() {
    const { t } = useLanguage();
    const [jobs, setJobs] = useState<{
        id: string;
        type?: string;
        pickupAddress: string;
        pickupLat?: number | null;
        pickupLng?: number | null;
        dropAddress: string;
        dropLat?: number | null;
        dropLng?: number | null;
        status: string;
        estimatedFare?: number | string;
        scheduledAt?: string;
        goodsType?: string;
        distance?: number | null;
    }[]>([]);
    const [loading, setLoading] = useState(true);
    const [commissionBalance, setCommissionBalance] = useState(0);
    const [commissionLoading, setCommissionLoading] = useState(true);
    const [activeMapJob, setActiveMapJob] = useState<null | typeof jobs[0]>(null);
    const [geocodingJobId, setGeocodingJobId] = useState<string | null>(null);

    const handleOpenMap = async (job: typeof jobs[0]) => {
        if (
            job.pickupLat &&
            job.pickupLng &&
            job.dropLat &&
            job.dropLng &&
            Number(job.pickupLat) !== 0 &&
            Number(job.dropLat) !== 0
        ) {
            setActiveMapJob(job);
            return;
        }

        setGeocodingJobId(job.id);
        const mapToast = toast.loading(t("Geocoding addresses...", "অ্যাড্রেস থেকে লোকেশন খোঁজা হচ্ছে..."));

        try {
            const pRes = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(job.pickupAddress + ", Bangladesh")}&limit=1`
            );
            const pData = await pRes.json();

            const dRes = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(job.dropAddress + ", Bangladesh")}&limit=1`
            );
            const dData = await dRes.json();

            const pickupLat = pData[0] ? parseFloat(pData[0].lat) : 23.8103;
            const pickupLng = pData[0] ? parseFloat(pData[0].lon) : 90.4125;
            const dropLat = dData[0] ? parseFloat(dData[0].lat) : 23.9088;
            const dropLng = dData[0] ? parseFloat(dData[0].lon) : 90.4116;

            setActiveMapJob({
                ...job,
                pickupLat,
                pickupLng,
                dropLat,
                dropLng
            });
            toast.success(t("Location loaded!", "লোকেশন লোড হয়েছে!"), { id: mapToast });
        } catch (error) {
            console.error("Geocoding failed", error);
            setActiveMapJob({
                ...job,
                pickupLat: 23.8103,
                pickupLng: 90.4125,
                dropLat: 23.9088,
                dropLng: 90.4116
            });
            toast.success(t("Open Map (with standard coordinate)", "ম্যাপ চালু করা হচ্ছে"), { id: mapToast });
        } finally {
            setGeocodingJobId(null);
        }
    };

    const fetchCommissionStatus = useCallback(async () => {
        try {
            const res = await api.get("/drivers/commission-payments");
            setCommissionBalance(res.data.data?.currentBalance ?? 0);
        } catch {
            // Silently fail — don't block job feed
        } finally {
            setCommissionLoading(false);
        }
    }, []);

    const fetchJobs = useCallback(async () => {
        try {
            const response = await api.get("/bookings");
            const allBookings = response.data.data || [];
            setJobs(allBookings.filter((b: { status: string }) => b.status === "PENDING"));
        } catch (error) {
            console.error("Failed to fetch jobs", error);
            toast.error(t("Failed to load available jobs", "কাজগুলো লোড করতে ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchCommissionStatus();
        fetchJobs();
    }, [fetchCommissionStatus, fetchJobs]);

    const hasCommissionDue = !commissionLoading && commissionBalance > 0;

    const handleAcceptJob = async (id: string) => {
        if (hasCommissionDue) {
            toast.error(t("Pay your commission first to accept jobs.", "কাজ নিতে আগে কমিশন পরিশোধ করুন।"));
            return;
        }
        try {
            await api.patch(`/bookings/${id}/accept`);
            toast.success(t("Job accepted successfully!", "কাজটি সফলভাবে গ্রহণ করা হয়েছে!"));
            fetchJobs();
        } catch (error: any) {
            const msg = error?.response?.data?.message || t("Failed to accept job", "কাজটি গ্রহণ করতে ব্যর্থ হয়েছে");
            toast.error(msg);
        }
    };

    return (
        <DashboardLayout requiredRole="DRIVER">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
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

            {/* Commission Due Banner */}
            {hasCommissionDue && (
                <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
                            <AlertTriangle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-amber-900 mb-0.5">
                                {t("Commission Payment Required", "কমিশন পরিশোধ প্রয়োজন")}
                            </p>
                            <p className="text-xs font-bold text-amber-700 leading-relaxed">
                                {t(
                                    `You have an outstanding commission balance of ৳${commissionBalance.toFixed(2)}. Pay your commission and wait for admin approval to accept new trips.`,
                                    `আপনার ৳${commissionBalance.toFixed(2)} কমিশন বকেয়া আছে। নতুন ট্রিপ নিতে কমিশন পরিশোধ করুন এবং অ্যাডমিনের অনুমোদনের জন্য অপেক্ষা করুন।`
                                )}
                            </p>
                        </div>
                    </div>
                    <Link href="/driver/payments" className="shrink-0">
                        <Button className="h-10 px-5 rounded-lg font-black text-xs gap-2 bg-amber-600 hover:bg-amber-700 text-white shadow-sm whitespace-nowrap">
                            <CreditCard className="w-4 h-4" />
                            {t("Pay Commission", "কমিশন দিন")}
                        </Button>
                    </Link>
                </div>
            )}

            {loading ? (
                <div className="p-20 flex justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : jobs.length === 0 ? (
                <div className="bg-white rounded-lg border border-slate-100 p-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-950 mb-2">{t("No Available Jobs", "কোন কাজ পাওয়া যায়নি")}</h3>
                    <p className="text-slate-700 font-bold max-w-sm mx-auto">
                        {t("Currently there are no unassigned booking requests. Check back later!", "বর্তমানে কোন বুকিং রিকোয়েস্ট নেই। পরে আবার চেষ্টা করুন!")}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {jobs.map((job) => (
                        <div key={job.id} className={`bg-white rounded-lg border shadow-sm overflow-hidden transition-shadow ${hasCommissionDue ? "border-slate-100 opacity-80" : "border-slate-100 hover:shadow-md"}`}>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-primary/5 text-primary text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
                                        {job.type?.replace("_", " ") || "DELIVERY"}
                                    </div>
                                    <div className="font-black text-slate-950">৳{job.estimatedFare || "Negotiable"}</div>
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
                                            {job.scheduledAt ? new Date(job.scheduledAt).toLocaleDateString() : "ASAP"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Package className="w-4 h-4 text-slate-400" />
                                        <span className="text-xs font-bold text-slate-700">{job.goodsType}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-primary" />
                                        <span className="text-xs font-bold text-slate-700">
                                            {job.distance ? `${job.distance} KM` : t("N/A", "N/A")}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        disabled={geocodingJobId === job.id}
                                        onClick={() => handleOpenMap(job)}
                                        className="h-12 px-4 rounded-lg font-black border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5 min-w-[80px]"
                                    >
                                        {geocodingJobId === job.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                                        ) : (
                                            <MapIcon className="w-4 h-4 text-slate-500" />
                                        )}
                                        {t("Map", "ম্যাপ")}
                                    </Button>
                                    {hasCommissionDue ? (
                                        <div className="flex-1 h-12 rounded-lg font-black flex items-center justify-center gap-2 bg-slate-100 border border-slate-200 text-slate-400 text-sm cursor-not-allowed select-none">
                                            <Lock className="w-4 h-4" />
                                            {t("Pay Commission to Unlock", "কোম্পানি কমিশন দিন")}
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => handleAcceptJob(job.id)}
                                            className="flex-1 h-12 rounded-lg font-black gap-2 shadow-lg shadow-primary/10"
                                        >
                                            {t("Accept Job", "কাজটি নিন")}
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Map Viewer Modal Overlay */}
            {activeMapJob && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">
                                    {t("Trip Route & Details", "ট্রিপ রুট ও বিস্তারিত বিবরণ")}
                                </h3>
                                <p className="text-xs font-bold text-slate-500 mt-1">
                                    {t("Booking Fare", "বুকিং ভাড়া")}: <span className="text-primary font-black">৳{activeMapJob.estimatedFare || "Negotiable"}</span>
                                    {activeMapJob.distance && ` | ${t("Distance", "দূরত্ব")}: ${activeMapJob.distance} KM`}
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveMapJob(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-0 overflow-y-auto">
                            {/* Left Side: Map Container */}
                            <div className="lg:col-span-2 relative min-h-[350px] lg:min-h-[450px] bg-slate-100">
                                {activeMapJob.pickupLat && activeMapJob.pickupLng && activeMapJob.dropLat && activeMapJob.dropLng ? (
                                    <MapComponent
                                        pickup={[activeMapJob.pickupLat, activeMapJob.pickupLng]}
                                        drop={[activeMapJob.dropLat, activeMapJob.dropLng]}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 bg-slate-100 font-bold">
                                        {t("Coordinates not available", "ভৌগোলিক স্থানাঙ্ক অনুপস্থিত")}
                                    </div>
                                )}
                            </div>

                            {/* Right Side: Details */}
                            <div className="p-6 border-t lg:border-t-0 lg:border-l border-slate-100 flex flex-col justify-between space-y-6">
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">{t("Pickup", "পিকআপ")}</p>
                                                <p className="text-sm font-bold text-slate-900 leading-relaxed">{activeMapJob.pickupAddress}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                            <div>
                                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">{t("Drop", "ড্রপ")}</p>
                                                <p className="text-sm font-bold text-slate-900 leading-relaxed">{activeMapJob.dropAddress}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 pt-6 space-y-3">
                                        <div className="flex justify-between text-sm font-bold">
                                            <span className="text-slate-500">{t("Goods Type", "পণ্যের ধরণ")}:</span>
                                            <span className="text-slate-900">{activeMapJob.goodsType || t("N/A", "N/A")}</span>
                                        </div>
                                        <div className="flex justify-between text-sm font-bold">
                                            <span className="text-slate-500">{t("Scheduled Time", "বুকিং সময়")}:</span>
                                            <span className="text-slate-900">
                                                {activeMapJob.scheduledAt ? new Date(activeMapJob.scheduledAt).toLocaleString() : "ASAP"}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100">
                                    {hasCommissionDue ? (
                                        <div className="w-full h-12 rounded-lg font-black flex items-center justify-center gap-2 bg-slate-100 border border-slate-200 text-slate-400 text-sm cursor-not-allowed select-none">
                                            <Lock className="w-4 h-4" />
                                            {t("Pay Commission to Unlock", "কোম্পানি কমিশন দিন")}
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => {
                                                handleAcceptJob(activeMapJob.id);
                                                setActiveMapJob(null);
                                            }}
                                            className="w-full h-12 rounded-lg font-black gap-2 shadow-lg shadow-primary/10"
                                        >
                                            {t("Accept Job", "কাজটি নিন")}
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
