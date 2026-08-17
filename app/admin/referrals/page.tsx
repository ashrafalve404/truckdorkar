"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
    Gift,
    Users,
    DollarSign,
    Search,
    Loader2,
    TrendingUp,
    Award,
    CheckCircle2,
    Crown,
    ArrowUpRight,
    Calendar,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function AdminReferralsPage() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [data, setData] = useState<{
        summary: {
            totalPayouts: number;
            totalReferredDrivers: number;
            totalReferrers: number;
            topReferrer: { name: string; phone: string; referralCode: string; referralEarnings: number } | null;
        };
        topReferrers: any[];
        logs: any[];
        totalLogs: number;
        limit: number;
    }>({
        summary: {
            totalPayouts: 0,
            totalReferredDrivers: 0,
            totalReferrers: 0,
            topReferrer: null
        },
        topReferrers: [],
        logs: [],
        totalLogs: 0,
        limit: 20
    });

    // Handle Search Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchAnalytics = useCallback(async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/referrals?page=${page}&limit=20&search=${encodeURIComponent(debouncedSearch)}`);
            setData(res.data.data);
        } catch (error) {
            console.error("Failed to fetch admin referral analytics", error);
            toast.error(t("Failed to load referral analytics", "রেফারেল অ্যানালিটিক্স লোড করতে ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    }, [page, debouncedSearch, t]);

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    const totalPages = Math.ceil(data.totalLogs / data.limit) || 1;

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Gift className="w-6 h-6" />
                    </div>
                    {t("Driver Referral Management", "ড্রাইভার রেফারেল ম্যানেজমেন্ট")}
                </h1>
                <p className="text-slate-600 font-medium text-xs sm:text-sm max-w-2xl">
                    {t(
                        "Monitor platform-wide driver referral activity, top referrers leaderboard, and 5% commission logs paid out from company platform fees.",
                        "প্ল্যাটফর্ম-ওয়াইড ড্রাইভার রেফারেল কার্যক্রম, সেরা রেফারার লিডারবোর্ড এবং কোম্পানির সার্ভিস ফি থেকে প্রদানকৃত ৫% কমিশন ট্রানজাকশন মনিটর করুন।"
                    )}
                </p>
            </header>

            {loading && page === 1 && !debouncedSearch ? (
                <div className="bg-white rounded-2xl p-16 border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-4 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-slate-600 font-bold text-sm">{t("Loading referral analytics...", "রেফারেল অ্যানালিটিক্স লোড হচ্ছে...")}</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-2xl shadow-lg shadow-emerald-500/20 relative overflow-hidden">
                            <span className="text-xs font-bold uppercase tracking-wider opacity-90">{t("Total 5% Payouts", "মোট ৫% কমিশন বিতরণ")}</span>
                            <h2 className="text-3xl font-black mt-2 mb-1">৳{data.summary.totalPayouts.toLocaleString()}</h2>
                            <p className="text-xs font-medium text-emerald-100">{t("Paid out of company 10% cut", "কোম্পানির ১০% সার্ভিস ফি থেকে প্রদত্ত")}</p>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="w-13 h-13 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-black">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("Referred Drivers", "রেফারকৃত ড্রাইভার")}</span>
                                <h3 className="text-2xl font-black text-slate-900 mt-0.5">{data.summary.totalReferredDrivers}</h3>
                                <p className="text-xs font-medium text-slate-500">{t("Registered with referral link", "রেফারেল লিংকে সাইনআপকৃত")}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="w-13 h-13 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 font-black">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("Active Referrers", "অ্যাক্টিভ রেফারার")}</span>
                                <h3 className="text-2xl font-black text-slate-900 mt-0.5">{data.summary.totalReferrers}</h3>
                                <p className="text-xs font-medium text-slate-500">{t("Drivers earning referral bonuses", "রেফারেল কমিশন উপার্জনকারী ড্রাইভার")}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                            <div className="w-13 h-13 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-black">
                                <Crown className="w-6 h-6" />
                            </div>
                            <div className="truncate">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("Top Referrer", "সেরা রেফারার")}</span>
                                <h3 className="text-lg font-black text-slate-900 truncate mt-0.5">
                                    {data.summary.topReferrer?.name || "None Yet"}
                                </h3>
                                <p className="text-xs font-bold text-emerald-600 truncate">
                                    {data.summary.topReferrer ? `৳${data.summary.topReferrer.referralEarnings.toLocaleString()} earned` : "No earnings"}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Top Referrers Leaderboard */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    <Crown className="w-5 h-5 text-amber-500" />
                                    {t("Top Referrers Leaderboard", "সেরা রেফারার ড্রাইভারদের তালিকা")}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                    {t("Drivers who invited the most active drivers onto the platform", "প্ল্যাটফর্মে সর্বাধিক ড্রাইভার আমন্ত্রণ জানানো ড্রাইভারবৃন্দ")}
                                </p>
                            </div>
                            <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-700">
                                {data.topReferrers.length} {t("Referrers", "জন")}
                            </span>
                        </div>

                        <div className="overflow-x-auto">
                            {data.topReferrers.length === 0 ? (
                                <div className="p-12 text-center text-slate-400 font-medium">
                                    {t("No driver referrers recorded yet.", "এখনো কোনো রেফারার রেকর্ড পাওয়া যায়নি।")}
                                </div>
                            ) : (
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="p-4">{t("Rank & Referrer Driver", "র‍্যাংক ও ড্রাইভার")}</th>
                                            <th className="p-4">{t("Referral Code", "রেফারেল কোড")}</th>
                                            <th className="p-4 text-center">{t("Drivers Invited", "আমন্ত্রিত ড্রাইভার")}</th>
                                            <th className="p-4 text-right">{t("Total 5% Earned", "মোট ৫% আয়")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                                        {data.topReferrers.map((driver, idx) => (
                                            <tr key={driver.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <span className={cn(
                                                            "w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0",
                                                            idx === 0 ? "bg-amber-500 text-white" :
                                                                idx === 1 ? "bg-slate-300 text-slate-800" :
                                                                    idx === 2 ? "bg-amber-700 text-white" : "bg-slate-100 text-slate-600"
                                                        )}>
                                                            #{idx + 1}
                                                        </span>
                                                        <div>
                                                            <div className="font-bold text-slate-900">{driver.name}</div>
                                                            <div className="text-[10px] text-slate-500">{driver.phone}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4 font-mono font-bold text-primary">
                                                    {driver.referralCode}
                                                </td>
                                                <td className="p-4 text-center font-bold text-slate-900">
                                                    {driver.totalReferred} {t("drivers", "জন")}
                                                </td>
                                                <td className="p-4 text-right font-black text-emerald-600 text-sm">
                                                    ৳{driver.referralEarnings.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* All 5% Referral Commission Logs */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                                    {t("All Referral Commission Transaction Logs", "সকল ৫% রেফারেল কমিশন ট্রানজাকশন লগ")}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">
                                    {t("Real-time list of 5% commissions awarded per completed trip", "প্রতিটি সম্পন্ন ট্রিপের জন্য প্রদানকৃত ৫% কমিশনের ইতিহাস")}
                                </p>
                            </div>

                            {/* Search */}
                            <div className="relative w-full sm:w-72">
                                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder={t("Search by driver / booking ID...", "ড্রাইভার / বুকিং আইডি দ্বারা অনুসন্ধান...")}
                                    className="w-full h-10 pl-9 pr-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {data.logs.length === 0 ? (
                                <div className="p-12 text-center text-slate-400 font-medium">
                                    {t("No referral logs found matching your criteria.", "কোন রেফারেল ট্রানজাকশন লগ পাওয়া যায়নি।")}
                                </div>
                            ) : (
                                <table className="w-full text-left text-xs">
                                    <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="p-4">{t("Date & Booking", "তারিখ ও বুকিং")}</th>
                                            <th className="p-4">{t("Referrer Driver (Recipients 5%)", "রেফারার (আয় করেছেন)")}</th>
                                            <th className="p-4">{t("Referred Driver (Completed Trip)", "ট্রিপ সম্পন্নকারী ড্রাইভার")}</th>
                                            <th className="p-4 text-right">{t("Trip Fare", "ট্রিপ ভাড়া")}</th>
                                            <th className="p-4 text-right">{t("5% Commission", "৫% কমিশন")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                                        {data.logs.map((log) => (
                                            <tr key={log.id} className="hover:bg-emerald-50/20 transition-colors">
                                                <td className="p-4">
                                                    <div className="font-mono font-bold text-slate-900">#{log.bookingId.slice(-8).toUpperCase()}</div>
                                                    <div className="text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleString()}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-900">{log.referrerName}</div>
                                                    <div className="text-[10px] text-slate-500">{log.referrerPhone}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-slate-900">{log.referredDriverName}</div>
                                                    <div className="text-[10px] text-slate-500">{log.referredDriverPhone}</div>
                                                </td>
                                                <td className="p-4 text-right font-medium text-slate-600">
                                                    ৳{log.tripFare.toLocaleString()}
                                                </td>
                                                <td className="p-4 text-right font-black text-emerald-600 text-sm">
                                                    +৳{log.commissionAmount.toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-xs text-slate-500 font-medium">
                                    {t("Showing page", "পৃষ্ঠা দেখুন")} {page} {t("of", "এর")} {totalPages}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        disabled={page <= 1}
                                        onClick={() => setPage((p) => p - 1)}
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 rounded-lg text-xs"
                                    >
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        {t("Previous", "পূর্ববর্তী")}
                                    </Button>
                                    <Button
                                        disabled={page >= totalPages}
                                        onClick={() => setPage((p) => p + 1)}
                                        variant="outline"
                                        size="sm"
                                        className="h-8 px-3 rounded-lg text-xs"
                                    >
                                        {t("Next", "পরবর্তী")}
                                        <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
