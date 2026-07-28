"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    TrendingUp,
    Package,
    Navigation,
    Truck,
    Calendar,
    Loader2,
    DollarSign,
    BarChart3,
    Award,
    Wallet,
    ArrowUpRight,
    CreditCard,
    CheckCircle2,
    XCircle,
    Clock,
    X,
    Phone
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type TimeRange = "day" | "week" | "month" | "year";

interface TripEarnings {
    id: string;
    bookingNumber: string;
    truckName: string;
    truckReg: string;
    driverName: string;
    driverPhone: string;
    fare: number;
    commission: number;
    completedAt: string;
    distance: number;
}

interface WithdrawalRequest {
    id: string;
    amount: number;
    bkashNumber: string;
    method: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    adminNote?: string;
    createdAt: string;
}

export default function AgentEarnings() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<TimeRange>("week");
    const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

    // Modal state for withdrawal
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState<string>("5000");
    const [bkashNumber, setBkashNumber] = useState<string>("");
    const [isSubmittingWithdraw, setIsSubmittingWithdraw] = useState(false);

    const [earningsData, setEarningsData] = useState<{
        totalCommissions: number;
        totalTrips: number;
        trips: TripEarnings[];
    }>({
        totalCommissions: 0,
        totalTrips: 0,
        trips: []
    });

    const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
    const [agentWallet, setAgentWallet] = useState<number>(0);

    const fetchData = async () => {
        try {
            const [earningsRes, dashRes, withdrawRes] = await Promise.all([
                api.get("/agents/earnings"),
                api.get("/agents/dashboard"),
                api.get("/agents/withdrawals").catch(() => ({ data: { data: [] } }))
            ]);

            setEarningsData(earningsRes.data?.data || { totalCommissions: 0, totalTrips: 0, trips: [] });
            setAgentWallet(dashRes.data?.data?.counts?.walletBalance || dashRes.data?.data?.counts?.totalEarnings || 0);
            setWithdrawals(withdrawRes.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch agent earnings", error);
            toast.error(t("Failed to load earnings data", "উপার্জন ডেটা লোড করতে ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleWithdrawSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const amt = Number(withdrawAmount);

        if (!amt || amt < 5000) {
            toast.error(t("Minimum withdrawal amount is ৳5,000", "সর্বনিম্ন উত্তোলনের পরিমাণ ৫,০০০ টাকা"));
            return;
        }

        if (!bkashNumber || bkashNumber.trim().length < 11) {
            toast.error(t("Please enter a valid 11-digit bKash number", "দয়া করে একটি সঠিক ১১-ডিজিটের বিকাশ নম্বর দিন"));
            return;
        }

        if (amt > agentWallet) {
            toast.error(t(`Insufficient wallet balance. Available: ৳${agentWallet.toLocaleString()}`, `পর্যাপ্ত ব্যালেন্স নেই। উপলব্ধ ব্যালেন্স: ৳${agentWallet.toLocaleString()}`));
            return;
        }

        setIsSubmittingWithdraw(true);
        try {
            await api.post("/agents/withdraw", {
                amount: amt,
                bkashNumber: bkashNumber.trim()
            });
            toast.success(t("Withdrawal request submitted successfully! Admin will review your request.", "উত্তোলন আবেদন সফলভাবে জমা দেওয়া হয়েছে! অ্যাডমিন পর্যালোচনা করবেন।"));
            setIsWithdrawModalOpen(false);
            setWithdrawAmount("5000");
            setBkashNumber("");
            fetchData();
        } catch (err: any) {
            toast.error(err.response?.data?.message || t("Failed to submit withdrawal request", "উত্তোলন আবেদন জমা দিতে ব্যর্থ হয়েছে"));
        } finally {
            setIsSubmittingWithdraw(false);
        }
    };

    // ── Calculate Period Totals ──────────────────────────────────────────────
    const periodStats = useMemo(() => {
        const trips = earningsData.trips || [];
        const now = new Date();

        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const dayOfWeek = now.getDay();
        const diffToMon = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() + diffToMon);
        weekStart.setHours(0, 0, 0, 0);

        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        let thisMonthSum = 0;
        let thisWeekSum = 0;
        let todaySum = 0;

        trips.forEach((trip) => {
            const date = new Date(trip.completedAt || Date.now());
            const comm = trip.commission || 0;
            if (date >= todayStart) todaySum += comm;
            if (date >= weekStart) thisWeekSum += comm;
            if (date >= monthStart) thisMonthSum += comm;
        });

        return {
            today: todaySum,
            thisWeek: thisWeekSum,
            thisMonth: thisMonthSum,
        };
    }, [earningsData]);

    // ── Generate Dynamic Chart Data Points ───────────────────────────────────
    const chartData = useMemo(() => {
        const trips = earningsData.trips || [];
        const now = new Date();

        if (timeRange === "day") {
            const slots = [
                { label: "00:00-04:00", start: 0, end: 4 },
                { label: "04:00-08:00", start: 4, end: 8 },
                { label: "08:00-12:00", start: 8, end: 12 },
                { label: "12:00-16:00", start: 12, end: 16 },
                { label: "16:00-20:00", start: 16, end: 20 },
                { label: "20:00-24:00", start: 20, end: 24 },
            ];

            const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            return slots.map((slot) => {
                let amount = 0;
                let tripsCount = 0;
                trips.forEach((tItem) => {
                    const date = new Date(tItem.completedAt || Date.now());
                    if (date >= todayStart && date.getHours() >= slot.start && date.getHours() < slot.end) {
                        amount += tItem.commission || 0;
                        tripsCount++;
                    }
                });
                return { label: slot.label, amount, tripsCount, subtext: t("Today", "আজকে") };
            });
        }

        if (timeRange === "week") {
            const days = [
                { id: 1, en: "Mon", bn: "সোম" },
                { id: 2, en: "Tue", bn: "মঙ্গল" },
                { id: 3, en: "Wed", bn: "বুধ" },
                { id: 4, en: "Thu", bn: "বৃহঃ" },
                { id: 5, en: "Fri", bn: "শুক্র" },
                { id: 6, en: "Sat", bn: "শনিবার" },
                { id: 0, en: "Sun", bn: "রবি" },
            ];

            const dayOfWeek = now.getDay();
            const diffToMon = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
            const monday = new Date(now);
            monday.setDate(now.getDate() + diffToMon);
            monday.setHours(0, 0, 0, 0);

            return days.map((day, idx) => {
                const targetDate = new Date(monday);
                targetDate.setDate(monday.getDate() + idx);
                const nextDate = new Date(targetDate);
                nextDate.setDate(targetDate.getDate() + 1);

                let amount = 0;
                let tripsCount = 0;
                trips.forEach((tItem) => {
                    const d = new Date(tItem.completedAt || Date.now());
                    if (d >= targetDate && d < nextDate) {
                        amount += tItem.commission || 0;
                        tripsCount++;
                    }
                });

                const dateStr = `${targetDate.getDate()} ${targetDate.toLocaleString('default', { month: 'short' })}`;

                return {
                    label: t(day.en, day.bn),
                    amount,
                    tripsCount,
                    subtext: dateStr
                };
            });
        }

        if (timeRange === "month") {
            const weeks = [
                { label: t("Week 1", "সপ্তাহ ১"), startDay: 1, endDay: 7 },
                { label: t("Week 2", "সপ্তাহ ২"), startDay: 8, endDay: 14 },
                { label: t("Week 3", "সপ্তাহ ৩"), startDay: 15, endDay: 21 },
                { label: t("Week 4", "সপ্তাহ ৪"), startDay: 22, endDay: 31 },
            ];

            return weeks.map((w) => {
                let amount = 0;
                let tripsCount = 0;
                trips.forEach((tItem) => {
                    const d = new Date(tItem.completedAt || Date.now());
                    if (
                        d.getFullYear() === now.getFullYear() &&
                        d.getMonth() === now.getMonth() &&
                        d.getDate() >= w.startDay &&
                        d.getDate() <= w.endDay
                    ) {
                        amount += tItem.commission || 0;
                        tripsCount++;
                    }
                });
                return {
                    label: w.label,
                    amount,
                    tripsCount,
                    subtext: `${w.startDay}-${w.endDay} ${now.toLocaleString('default', { month: 'short' })}`
                };
            });
        }

        // Year (12 months)
        const monthNames = [
            { en: "Jan", bn: "জানু" }, { en: "Feb", bn: "ফেব্রু" }, { en: "Mar", bn: "মার্চ" },
            { en: "Apr", bn: "এপ্রিল" }, { en: "May", bn: "মে" }, { en: "Jun", bn: "জুন" },
            { en: "Jul", bn: "জুলাই" }, { en: "Aug", bn: "আগস্ট" }, { en: "Sep", bn: "সেপ্টে" },
            { en: "Oct", bn: "অক্টো" }, { en: "Nov", bn: "নভে" }, { en: "Dec", bn: "ডিসে" }
        ];

        return monthNames.map((m, idx) => {
            let amount = 0;
            let tripsCount = 0;
            trips.forEach((tItem) => {
                const d = new Date(tItem.completedAt || Date.now());
                if (d.getFullYear() === now.getFullYear() && d.getMonth() === idx) {
                    amount += tItem.commission || 0;
                    tripsCount++;
                }
            });
            return {
                label: t(m.en, m.bn),
                amount,
                tripsCount,
                subtext: `${now.getFullYear()}`
            };
        });
    }, [earningsData, timeRange, t]);

    const maxChartAmount = useMemo(() => {
        const highest = Math.max(...chartData.map((d) => d.amount), 0);
        return highest > 0 ? Math.ceil(highest * 1.25) : 2000;
    }, [chartData]);

    const activeChartTotal = useMemo(() => {
        return chartData.reduce((sum, d) => sum + d.amount, 0);
    }, [chartData]);

    const activeChartTrips = useMemo(() => {
        return chartData.reduce((sum, d) => sum + d.tripsCount, 0);
    }, [chartData]);

    const peakDataPoint = useMemo(() => {
        if (chartData.length === 0) return null;
        return [...chartData].sort((a, b) => b.amount - a.amount)[0];
    }, [chartData]);

    // Chart Dimensions
    const svgWidth = 800;
    const svgHeight = 220;
    const paddingX = 40;
    const paddingY = 30;

    const points = useMemo(() => {
        if (chartData.length === 0) return [];
        const stepX = (svgWidth - paddingX * 2) / (chartData.length - 1 || 1);
        return chartData.map((item, index) => {
            const x = paddingX + index * stepX;
            const y = svgHeight - paddingY - (item.amount / maxChartAmount) * (svgHeight - paddingY * 2);
            return { x, y, ...item };
        });
    }, [chartData, maxChartAmount]);

    const curvePath = useMemo(() => {
        if (points.length < 2) return "";
        let d = `M ${points[0].x} ${points[0].y}`;
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const cp1x = p0.x + (p1.x - p0.x) / 2;
            const cp1y = p0.y;
            const cp2x = p0.x + (p1.x - p0.x) / 2;
            const cp2y = p1.y;
            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p1.x} ${p1.y}`;
        }
        return d;
    }, [points]);

    const areaPath = useMemo(() => {
        if (!curvePath || points.length === 0) return "";
        const lastX = points[points.length - 1].x;
        const firstX = points[0].x;
        const bottomY = svgHeight - paddingY;
        return `${curvePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
    }, [curvePath, points]);

    if (loading) {
        return (
            <DashboardLayout requiredRole="AGENT">
                <div className="h-64 w-full flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout requiredRole="AGENT">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Earnings & Money Withdrawals", "উপার্জন এবং টাকা উত্তোলন")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Track your commissions and withdraw money directly to your bKash account.", "আপনার অর্জিত কমিশন ট্র্যাক করুন এবং বিকাশের মাধ্যমে টাকা উত্তোলন করুন।")}
                    </p>
                </div>

                <Link href="/agent/withdraw">
                    <Button
                        className="h-13 px-8 rounded-2xl font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all text-sm gap-2 shrink-0"
                    >
                        <ArrowUpRight className="w-5 h-5" />
                        {t("Money Withdraw Page", "টাকা উত্তোলন পেজ")}
                    </Button>
                </Link>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 shadow-sm">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{t("Total Commission", "মোট কমিশন")}</p>
                        <p className="text-2xl font-black text-slate-950">৳{earningsData.totalCommissions.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-sm">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{t("Available Wallet", "উত্তোলনযোগ্য ব্যালেন্স")}</p>
                        <p className="text-2xl font-black text-emerald-600">৳{agentWallet.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-sm">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{t("This Month", "এই মাসের কমিশন")}</p>
                        <p className="text-2xl font-black text-blue-600">৳{periodStats.thisMonth.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-all">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{t("Successful Trips", "সফল ট্রিপ")}</p>
                        <p className="text-2xl font-black text-slate-950">{earningsData.totalTrips}</p>
                    </div>
                </div>
            </div>

            {/* WITHDRAWAL HISTORY LIST SECTION */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-10">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="font-black text-slate-900 text-lg">{t("Withdrawal Requests History", "টাকা উত্তোলনের হিস্ট্রি তালিকা")}</h3>
                        <p className="text-xs text-slate-500 font-medium">{t("Track your pending and approved bKash cashout requests", "আপনার বিকাশ উত্তোলন আবেদনের অবস্থা দেখুন")}</p>
                    </div>
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-600 text-xs font-bold">
                        {withdrawals.length} {t("Requests", "টি আবেদন")}
                    </span>
                </div>

                {withdrawals.length === 0 ? (
                    <div className="p-12 text-center text-slate-500 font-bold">
                        {t("No withdrawal requests made yet. Minimum withdrawal amount is ৳5,000 via bKash.", "এখনো কোনো উত্তোলনের আবেদন করেননি। সর্বনিম্ন উত্তোলনের পরিমাণ ৫,০০০ টাকা (বিকাশ)।")}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                    <th className="px-6 py-4">{t("Request ID", "আবেদন আইডি")}</th>
                                    <th className="px-6 py-4">{t("Amount (৳)", "পরিমাণ")}</th>
                                    <th className="px-6 py-4">{t("bKash Number", "বিকাশ নম্বর")}</th>
                                    <th className="px-6 py-4">{t("Status", "অবস্থা")}</th>
                                    <th className="px-6 py-4">{t("Date & Time", "তারিখ")}</th>
                                    <th className="px-6 py-4">{t("Admin Note", "অ্যাডমিন নোট")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm font-bold">
                                {withdrawals.map((w) => (
                                    <tr key={w.id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-6 py-4 font-black text-slate-900">#{w.id.slice(-6).toUpperCase()}</td>
                                        <td className="px-6 py-4 font-black text-emerald-600 text-base">৳{w.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-pink-50 text-pink-700 font-bold text-xs border border-pink-100">
                                                <Phone className="w-3.5 h-3.5" />
                                                {w.bkashNumber}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {w.status === "APPROVED" && (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black border border-emerald-200">
                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                    {t("APPROVED", "অনুমোদিত")}
                                                </span>
                                            )}
                                            {w.status === "PENDING" && (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-black border border-amber-200">
                                                    <Clock className="w-3.5 h-3.5" />
                                                    {t("PENDING REVIEW", "অপেক্ষমান")}
                                                </span>
                                            )}
                                            {w.status === "REJECTED" && (
                                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-black border border-red-200">
                                                    <XCircle className="w-3.5 h-3.5" />
                                                    {t("REJECTED", "প্রত্যাখ্যাত")}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium text-xs">
                                            {new Date(w.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                                        </td>
                                        <td className="px-6 py-4 text-xs text-slate-500 italic max-w-xs truncate">
                                            {w.adminNote || "—"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* TRIP BREAKDOWN TABLE */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-10">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-black text-slate-900 text-lg">{t("Commission Breakdown by Trip", "ট্রিপ বিবরণ অনুযায়ী কমিশন")}</h3>
                </div>

                {!earningsData.trips || earningsData.trips.length === 0 ? (
                    <div className="p-16 text-center text-slate-500 font-bold">
                        {t("No trip earnings found yet. Commissions will appear here when trucks you registered complete trips.", "কোনো ট্রিপ কমিশন পাওয়া যায়নি। আপনার নিবন্ধিত ট্রাকগুলো ট্রিপ সম্পন্ন করলে কমিশন এখানে দেখা যাবে।")}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                    <th className="px-6 py-4">{t("Trip ID", "ট্রিপ আইডি")}</th>
                                    <th className="px-6 py-4">{t("Truck & Reg", "ট্রাক ও রেজিস্টার")}</th>
                                    <th className="px-6 py-4">{t("Driver", "ড্রাইভার")}</th>
                                    <th className="px-6 py-4">{t("Trip Fare", "ট্রিপ ভাড়া")}</th>
                                    <th className="px-6 py-4">{t("Agent Commission", "এজেন্ট কমিশন")}</th>
                                    <th className="px-6 py-4">{t("Date", "তারিখ")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm font-bold">
                                {earningsData.trips.map((trip) => (
                                    <tr key={trip.id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-6 py-4 font-black text-primary">#{trip.bookingNumber}</td>
                                        <td className="px-6 py-4">
                                            <p className="text-slate-900 font-black">{trip.truckName || "—"}</p>
                                            <p className="text-xs text-slate-500 font-medium">{trip.truckReg}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-slate-900 font-bold">{trip.driverName || "—"}</p>
                                            <p className="text-xs text-slate-500 font-medium">{trip.driverPhone}</p>
                                        </td>
                                        <td className="px-6 py-4 text-slate-900 font-black">
                                            ৳{trip.fare.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-600 font-black text-xs border border-purple-100">
                                                +৳{trip.commission.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-600 font-medium text-xs">
                                            {new Date(trip.completedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* AGENT COMMISSION GRAPH CHART */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">
                                {t("Commission Analytics Chart", "কমিশন আয়ের গ্রাফ চার্ট")}
                            </h3>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                            {t("Visual commission performance for selected timeframe", "আপনার কমিশন আয়ের বিশ্লেষণ")}
                        </p>
                    </div>

                    <div className="flex items-center bg-slate-100/80 p-1.5 rounded-2xl gap-1 shrink-0 self-start md:self-auto border border-slate-200/50">
                        {[
                            { id: "day", label: t("Today", "আজকে") },
                            { id: "week", label: t("This Week", "এই সপ্তাহ") },
                            { id: "month", label: t("This Month", "এই মাস") },
                            { id: "year", label: t("This Year", "এই বছর") },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => {
                                    setTimeRange(tab.id as TimeRange);
                                    setHoveredPointIndex(null);
                                }}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-black transition-all duration-200",
                                    timeRange === tab.id
                                        ? "bg-white text-purple-600 shadow-sm border border-slate-200/60"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                            {t("Period Commission", "সময়কালীন কমিশন")}
                        </span>
                        <span className="text-lg font-black text-purple-600">৳{activeChartTotal.toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                            {t("Completed Trips", "মোট ট্রিপ")}
                        </span>
                        <span className="text-lg font-black text-slate-900">{activeChartTrips} {t("Trips", "টি")}</span>
                    </div>
                    {peakDataPoint && (
                        <div className="col-span-2 sm:col-span-1">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                                {t("Peak Period", "সর্বোচ্চ কমিশন")}
                            </span>
                            <span className="text-sm font-black text-slate-900 truncate block">
                                {peakDataPoint.label}: <span className="text-purple-600 font-black">৳{peakDataPoint.amount.toLocaleString()}</span>
                            </span>
                        </div>
                    )}
                </div>

                <div className="relative w-full overflow-x-auto pt-4 pb-2 scrollbar-none">
                    <div className="min-w-[600px] relative">
                        <svg
                            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                            className="w-full h-auto overflow-visible select-none"
                        >
                            <defs>
                                <linearGradient id="purpleAreaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#9333EA" stopOpacity="0.38" />
                                    <stop offset="60%" stopColor="#9333EA" stopOpacity="0.08" />
                                    <stop offset="100%" stopColor="#9333EA" stopOpacity="0.0" />
                                </linearGradient>

                                <filter id="purpleLineGlow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#9333EA" floodOpacity="0.35" />
                                </filter>
                            </defs>

                            {[0, 0.33, 0.66, 1].map((pct, idx) => {
                                const yPos = paddingY + (svgHeight - paddingY * 2) * (1 - pct);
                                const value = Math.round(maxChartAmount * pct);
                                return (
                                    <g key={idx}>
                                        <line
                                            x1={paddingX}
                                            y1={yPos}
                                            x2={svgWidth - paddingX}
                                            y2={yPos}
                                            stroke="#F1F5F9"
                                            strokeDasharray="4 4"
                                            strokeWidth="1.5"
                                        />
                                        <text
                                            x={paddingX - 8}
                                            y={yPos + 4}
                                            textAnchor="end"
                                            className="text-[10px] font-bold fill-slate-400"
                                        >
                                            ৳{value.toLocaleString()}
                                        </text>
                                    </g>
                                );
                            })}

                            {areaPath && (
                                <path
                                    d={areaPath}
                                    fill="url(#purpleAreaGradient)"
                                    className="transition-all duration-500 ease-out"
                                />
                            )}

                            {curvePath && (
                                <path
                                    d={curvePath}
                                    fill="none"
                                    stroke="#9333EA"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    filter="url(#purpleLineGlow)"
                                    className="transition-all duration-500 ease-out"
                                />
                            )}

                            {points.map((pt, idx) => {
                                const isHovered = hoveredPointIndex === idx;

                                return (
                                    <g key={idx} className="cursor-pointer">
                                        <rect
                                            x={pt.x - 20}
                                            y={paddingY}
                                            width={40}
                                            height={svgHeight - paddingY * 2}
                                            fill="transparent"
                                            onMouseEnter={() => setHoveredPointIndex(idx)}
                                            onMouseLeave={() => setHoveredPointIndex(null)}
                                        />

                                        {isHovered && (
                                            <line
                                                x1={pt.x}
                                                y1={paddingY}
                                                x2={pt.x}
                                                y2={svgHeight - paddingY}
                                                stroke="#9333EA"
                                                strokeOpacity="0.4"
                                                strokeDasharray="3 3"
                                                strokeWidth="1.5"
                                            />
                                        )}

                                        <circle
                                            cx={pt.x}
                                            cy={pt.y}
                                            r={isHovered ? 8 : 5}
                                            className={cn(
                                                "transition-all duration-200",
                                                isHovered ? "fill-purple-600 stroke-white stroke-2" : "fill-white stroke-purple-600 stroke-2"
                                            )}
                                        />

                                        {isHovered && (
                                            <circle
                                                cx={pt.x}
                                                cy={pt.y}
                                                r={3}
                                                fill="#ffffff"
                                            />
                                        )}

                                        <text
                                            x={pt.x}
                                            y={svgHeight - 6}
                                            textAnchor="middle"
                                            className={cn(
                                                "text-[11px] font-black transition-colors duration-200",
                                                isHovered ? "fill-purple-700" : "fill-slate-500"
                                            )}
                                        >
                                            {pt.label}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>

                        {hoveredPointIndex !== null && points[hoveredPointIndex] && (
                            <div
                                className="absolute pointer-events-none z-20 transition-all duration-150 transform -translate-x-1/2 -translate-y-full"
                                style={{
                                    left: `${(points[hoveredPointIndex].x / svgWidth) * 100}%`,
                                    top: `${(points[hoveredPointIndex].y / svgHeight) * 100}%`,
                                    marginTop: "-12px"
                                }}
                            >
                                <div className="bg-slate-950 text-white rounded-xl p-3 shadow-xl border border-slate-800 text-center min-w-[130px] whitespace-nowrap animate-in fade-in-50 zoom-in-95 duration-150">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {points[hoveredPointIndex].label} {points[hoveredPointIndex].subtext && `(${points[hoveredPointIndex].subtext})`}
                                    </p>
                                    <p className="text-base font-black text-purple-400 mt-0.5">
                                        ৳{points[hoveredPointIndex].amount.toLocaleString()}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-300 mt-0.5">
                                        {points[hoveredPointIndex].tripsCount} {t("Completed Trips", "ট্রিপ")}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* WITHDRAWAL REQUEST MODAL */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold">
                                    ৳
                                </div>
                                <div>
                                    <h3 className="font-black text-lg">{t("Request Money Withdrawal", "টাকা উত্তোলনের আবেদন")}</h3>
                                    <p className="text-xs text-slate-400 font-medium">{t("Instant payout via bKash personal account", "বিকাশ অ্যাকাউন্টে সরাসরি টাকা ক্যাশআউট করুন")}</p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsWithdrawModalOpen(false)}
                                className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleWithdrawSubmit} className="p-6 space-y-6">
                            {/* Minimum withdrawal Notice Banner */}
                            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-3">
                                <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-white font-black text-[10px]">
                                    {t("NOTICE", "সতর্কতা")}
                                </span>
                                <span>{t("Minimum withdrawal amount is ৳5,000 per request.", "প্রতি উত্তোলনে সর্বনিম্ন পরিমাণ ৫,০০০ টাকা।")}</span>
                            </div>

                            {/* bKash Phone Number */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-pink-500" />
                                    {t("bKash Personal Account Number", "বিকাশ পার্সোনাল নম্বর")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={bkashNumber}
                                    onChange={(e) => setBkashNumber(e.target.value)}
                                    placeholder="017XXXXXXXX"
                                    className="w-full h-13 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                                />
                            </div>

                            {/* Amount Input */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                                        {t("Withdrawal Amount (৳)", "উত্তোলনের পরিমাণ (টাকা)")} <span className="text-red-500">*</span>
                                    </label>
                                    <span className="text-xs font-bold text-slate-500">
                                        {t("Available", "উপলব্ধ")}: <span className="font-black text-emerald-600">৳{agentWallet.toLocaleString()}</span>
                                    </span>
                                </div>
                                <input
                                    type="number"
                                    required
                                    min={5000}
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(e.target.value)}
                                    placeholder="5000"
                                    className="w-full h-13 bg-slate-50 border border-slate-200 rounded-xl px-4 font-black text-lg text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsWithdrawModalOpen(false)}
                                    className="h-12 px-6 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-100"
                                >
                                    {t("Cancel", "বাতিল")}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmittingWithdraw}
                                    className="h-12 px-8 rounded-xl font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 gap-2"
                                >
                                    {isSubmittingWithdraw ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        t("Submit Request", "আবেদন জমা দিন")
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
