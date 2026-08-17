"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
    Gift,
    Users,
    DollarSign,
    Copy,
    Check,
    Share2,
    Truck,
    Clock,
    Loader2,
    CheckCircle2,
    AlertCircle,
    TrendingUp,
    ExternalLink
} from "lucide-react";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

export default function DriverReferralsPage() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<{
        referralCode: string;
        referralEarnings: number;
        totalReferredCount: number;
        referredDrivers: any[];
        referralLogs: any[];
    }>({
        referralCode: "",
        referralEarnings: 0,
        totalReferredCount: 0,
        referredDrivers: [],
        referralLogs: []
    });

    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchReferralStats = async () => {
            try {
                const { data } = await api.get("/drivers/referral-stats");
                setStats(data.data);
            } catch (error) {
                console.error("Failed to fetch referral stats", error);
                toast.error(t("Failed to load referral data", "রেফারেল তথ্য লোড করতে ব্যর্থ হয়েছে"));
            } finally {
                setLoading(false);
            }
        };
        fetchReferralStats();
    }, [t]);

    const origin = typeof window !== "undefined" ? window.location.origin : "https://truckdorkar.com";
    const shareableUrl = `${origin}/register?role=driver&ref=${stats.referralCode}`;

    const handleCopy = (textToCopy: string, isCode = false) => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        toast.success(isCode ? t("Referral code copied!", "রেফারেল কোড কপি করা হয়েছে!") : t("Referral link copied!", "রেফারেল লিংক কপি করা হয়েছে!"));
        setTimeout(() => setCopied(false), 2500);
    };

    const handleWhatsAppShare = () => {
        const message = encodeURIComponent(
            `🚚 *Truck Dorkar Driver Invitation*\n\nJoin Truck Dorkar as a verified driver and get instant booking requests in your area!\n\nRegister using my referral link:\n${shareableUrl}\n\nReferral Code: *${stats.referralCode}*`
        );
        window.open(`https://api.whatsapp.com/send?text=${message}`, "_blank");
    };

    return (
        <DashboardLayout requiredRole="DRIVER">
            <header className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Gift className="w-6 h-6" />
                    </div>
                    {t("Driver Referral Program", "ড্রাইভার রেফারেল প্রোগ্রাম")}
                </h1>
                <p className="text-slate-600 font-medium text-xs sm:text-sm max-w-2xl">
                    {t(
                        "Invite other drivers to register on Truck Dorkar. You earn a 5% commission on every completed trip they make forever! (Paid out of company platform fee)",
                        "অন্যান্য ড্রাইভারদের ট্রাক দরকার-এ আমন্ত্রণ জানান। তাদের প্রতিটি সম্পন্ন ট্রিপের ভাড়ার ৫% কমিশন সরাসরি পান! (কোম্পানির সার্ভিস ফি থেকে প্রদান করা হয়)"
                    )}
                </p>
            </header>

            {loading ? (
                <div className="bg-white rounded-3xl p-16 border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-4 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-slate-600 font-bold text-sm">{t("Loading referral dashboard...", "রেফারেল ড্যাশবোর্ড লোড হচ্ছে...")}</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white p-6 rounded-3xl shadow-lg shadow-emerald-500/20 relative overflow-hidden">
                            <div className="absolute right-3 -bottom-4 opacity-15">
                                <DollarSign className="w-32 h-32 text-white" />
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider opacity-90">{t("Total 5% Referral Income", "মোট রেফারেল আয়")}</span>
                            <h2 className="text-3xl sm:text-4xl font-black mt-2 mb-1">৳{stats.referralEarnings.toLocaleString()}</h2>
                            <p className="text-xs font-medium text-emerald-100">{t("Lifetime earned from referred drivers", "আপনার রেফারকৃত ড্রাইভার থেকে মোট আয়")}</p>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-black">
                                <Users className="w-7 h-7" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("Referred Drivers", "রেফারকৃত ড্রাইভার")}</span>
                                <h3 className="text-3xl font-black text-slate-900 mt-1">{stats.totalReferredCount}</h3>
                                <p className="text-xs font-medium text-slate-500">{t("Registered with your link", "আপনার লিংকে রেজিস্টার্ড")}</p>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-black">
                                <Gift className="w-7 h-7" />
                            </div>
                            <div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("Your Referral Code", "আপনার রেফারেল কোড")}</span>
                                <h3 className="text-2xl font-black text-primary tracking-wider mt-1">{stats.referralCode}</h3>
                                <p className="text-xs font-medium text-slate-500">{t("Share code during signup", "রেজিস্ট্রেশনের সময় এই কোডটি দিন")}</p>
                            </div>
                        </div>
                    </div>

                    {/* Share Link Banner */}
                    <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
                        <div className="relative z-10 space-y-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h3 className="text-xl sm:text-2xl font-black text-white mb-1 flex items-center gap-2">
                                        <span>🚀</span>
                                        <span>{t("Share Your Driver Referral Link", "আপনার ড্রাইভ রেফারেল লিংক শেয়ার করুন")}</span>
                                    </h3>
                                    <p className="text-slate-300 text-xs sm:text-sm font-medium">
                                        {t("Send this link to driver friends. When they complete rides, 5% of their trip fare is added to your earnings!", "ড্রাইভার বন্ধুদের এই লিংকটি পাঠান। তারা ট্রিপ সম্পূর্ণ করলে ভাড়ার ৫% টাকা আপনার একাউন্টে যোগ হবে!")}
                                    </p>
                                </div>
                                <Button
                                    onClick={handleWhatsAppShare}
                                    className="h-11 px-5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white gap-2 shrink-0 border-none shadow-md shadow-emerald-500/20"
                                >
                                    <Share2 className="w-4 h-4" />
                                    {t("Share on WhatsApp", "হোয়াটসঅ্যাপে শেয়ার")}
                                </Button>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <div className="flex-1 bg-slate-800/90 border border-slate-700 rounded-2xl px-4 py-3 text-xs sm:text-sm font-mono text-emerald-400 truncate flex items-center select-all">
                                    {shareableUrl}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        onClick={() => handleCopy(shareableUrl)}
                                        className="h-12 px-6 rounded-2xl font-bold bg-primary hover:bg-primary/90 text-white gap-2 shrink-0"
                                    >
                                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        {copied ? t("Copied!", "কপি হয়েছে!") : t("Copy Link", "লিংক কপি করুন")}
                                    </Button>
                                    <Button
                                        onClick={() => handleCopy(stats.referralCode, true)}
                                        variant="outline"
                                        className="h-12 px-4 rounded-2xl font-bold border-slate-700 hover:bg-slate-800 text-white gap-2 shrink-0"
                                        title="Copy Referral Code"
                                    >
                                        {t("Code Only", "শুধু কোড")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tables Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Referred Drivers List */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    {t("Referred Drivers", "রেফারকৃত ড্রাইভারবৃন্দ")}
                                </h3>
                                <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-700">
                                    {stats.referredDrivers.length} {t("Drivers", "জন")}
                                </span>
                            </div>

                            <div className="p-0 overflow-x-auto flex-1">
                                {stats.referredDrivers.length === 0 ? (
                                    <div className="p-12 text-center text-slate-400 space-y-3">
                                        <Users className="w-12 h-12 mx-auto text-slate-200" />
                                        <p className="text-sm font-bold text-slate-600">{t("No referred drivers yet", "এখনো কোনো ড্রাইভার রেফার হয়নি")}</p>
                                        <p className="text-xs">{t("Share your link above to start earning 5% commission!", "৫% কমিশন পেতে উপরে দেওয়া লিংকটি শেয়ার করুন!")}</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                                            <tr>
                                                <th className="p-4">{t("Driver Name", "ড্রাইভারের নাম")}</th>
                                                <th className="p-4">{t("Joined Date", "রেজিস্ট্রেশনের তারিখ")}</th>
                                                <th className="p-4 text-center">{t("Total Trips", "মোট ট্রিপ")}</th>
                                                <th className="p-4 text-right">{t("Status", "স্ট্যাটাস")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                                            {stats.referredDrivers.map((driver) => (
                                                <tr key={driver.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="p-4">
                                                        <div className="font-bold text-slate-900">{driver.name}</div>
                                                        <div className="text-[10px] text-slate-500">{driver.phone}</div>
                                                    </td>
                                                    <td className="p-4 text-slate-500 font-medium">
                                                        {new Date(driver.createdAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="p-4 text-center font-bold text-slate-900">
                                                        {driver.totalTrips}
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <span className={cn(
                                                            "px-2.5 py-1 rounded-full text-[10px] font-black uppercase",
                                                            driver.status === "VERIFIED"
                                                                ? "bg-emerald-50 text-emerald-600"
                                                                : "bg-amber-50 text-amber-600"
                                                        )}>
                                                            {driver.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* 5% Commission History Logs */}
                        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                                    {t("Commission Earnings History", "৫% কমিশন উপার্জনের ইতিহাস")}
                                </h3>
                                <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">
                                    5% {t("Cut", "বোনাস")}
                                </span>
                            </div>

                            <div className="p-0 overflow-x-auto flex-1">
                                {stats.referralLogs.length === 0 ? (
                                    <div className="p-12 text-center text-slate-400 space-y-3">
                                        <Gift className="w-12 h-12 mx-auto text-slate-200" />
                                        <p className="text-sm font-bold text-slate-600">{t("No commission transactions yet", "এখনো কোনো কমিশন জমা হয়নি")}</p>
                                        <p className="text-xs">{t("When your referred drivers complete trips, your 5% cut will show here.", "আপনার রেফারকৃত ড্রাইভারদের ট্রিপ শেষ হলে ৫% কমিশন এখানে যোগ হবে।")}</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left text-xs">
                                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                                            <tr>
                                                <th className="p-4">{t("Date & Trip", "তারিখ ও ট্রিপ")}</th>
                                                <th className="p-4">{t("Referred Driver", "রেফারকৃত ড্রাইভার")}</th>
                                                <th className="p-4 text-right">{t("Trip Fare", "ট্রিপ ভাড়া")}</th>
                                                <th className="p-4 text-right">{t("Your 5% Share", "আপনার ৫% আয়")}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                                            {stats.referralLogs.map((log) => (
                                                <tr key={log.id} className="hover:bg-emerald-50/30 transition-colors">
                                                    <td className="p-4">
                                                        <div className="font-bold text-slate-900">#{log.bookingId.slice(-6).toUpperCase()}</div>
                                                        <div className="text-[10px] text-slate-500">{new Date(log.createdAt).toLocaleDateString()}</div>
                                                    </td>
                                                    <td className="p-4 font-bold text-slate-900">
                                                        {log.referredDriverName}
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
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
