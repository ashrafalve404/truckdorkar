"use client";

import React, { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    DollarSign,
    TrendingUp,
    Calendar,
    Loader2,
    BarChart3,
    Clock,
    Award,
    ChevronRight
} from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

type TimeRange = "day" | "week" | "month" | "year";

interface BookingItem {
    id: string;
    bookingNumber: string;
    finalFare?: number;
    estimatedFare?: number;
    distance?: number | null;
    createdAt: string;
}

export default function DriverEarningsPage() {
    const { t } = useLanguage();
    const [timeRange, setTimeRange] = useState<TimeRange>("week");
    const [rawBookings, setRawBookings] = useState<BookingItem[]>([]);
    const [stats, setStats] = useState({
        total: 0,
        thisMonth: 0,
        thisWeek: 0,
        today: 0,
        totalTrips: 0
    });
    const [loading, setLoading] = useState(true);
    const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchEarnings = async () => {
            try {
                const response = await api.get("/drivers/earnings");
                const data = response.data.data;
                const recent: BookingItem[] = data.recentBookings || [];
                setRawBookings(recent);

                const now = new Date();
                const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                // Week start (Monday)
                const dayOfWeek = now.getDay();
                const diffToMon = (dayOfWeek === 0 ? -6 : 1) - dayOfWeek;
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() + diffToMon);
                weekStart.setHours(0, 0, 0, 0);

                // Month start
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

                let todaySum = 0;
                let weekSum = 0;
                let monthSum = 0;

                recent.forEach((b) => {
                    const amount = b.finalFare || b.estimatedFare || 0;
                    const date = new Date(b.createdAt);
                    if (date >= todayStart) todaySum += amount;
                    if (date >= weekStart) weekSum += amount;
                    if (date >= monthStart) monthSum += amount;
                });

                setStats({
                    total: data.totalEarnings || 0,
                    thisMonth: monthSum,
                    thisWeek: weekSum,
                    today: todaySum,
                    totalTrips: data.totalTrips || recent.length
                });
            } catch (error) {
                console.error("Failed to fetch earnings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEarnings();
    }, []);

    // ── Generate Chart Data Points dynamically based on selected TimeRange ────
    const chartData = useMemo(() => {
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
                rawBookings.forEach((b) => {
                    const date = new Date(b.createdAt);
                    if (date >= todayStart && date.getHours() >= slot.start && date.getHours() < slot.end) {
                        amount += b.finalFare || b.estimatedFare || 0;
                        tripsCount++;
                    }
                });
                return { label: slot.label, amount, tripsCount, subtext: t("Today", "আজকে") };
            });
        }

        if (timeRange === "week") {
            // 7 Days of current week (Mon -> Sun)
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
                rawBookings.forEach((b) => {
                    const d = new Date(b.createdAt);
                    if (d >= targetDate && d < nextDate) {
                        amount += b.finalFare || b.estimatedFare || 0;
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
            // 4 Weeks of current month
            const weeks = [
                { label: t("Week 1", "সপ্তাহ ১"), startDay: 1, endDay: 7 },
                { label: t("Week 2", "সপ্তাহ ২"), startDay: 8, endDay: 14 },
                { label: t("Week 3", "সপ্তাহ ৩"), startDay: 15, endDay: 21 },
                { label: t("Week 4", "সপ্তাহ ৪"), startDay: 22, endDay: 31 },
            ];

            return weeks.map((w) => {
                let amount = 0;
                let tripsCount = 0;
                rawBookings.forEach((b) => {
                    const d = new Date(b.createdAt);
                    if (
                        d.getFullYear() === now.getFullYear() &&
                        d.getMonth() === now.getMonth() &&
                        d.getDate() >= w.startDay &&
                        d.getDate() <= w.endDay
                    ) {
                        amount += b.finalFare || b.estimatedFare || 0;
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

        // Default: Year (12 months)
        const monthNames = [
            { en: "Jan", bn: "জানু" }, { en: "Feb", bn: "ফেব্রু" }, { en: "Mar", bn: "মার্চ" },
            { en: "Apr", bn: "এপ্রিল" }, { en: "May", bn: "মে" }, { en: "Jun", bn: "জুন" },
            { en: "Jul", bn: "জুলাই" }, { en: "Aug", bn: "আগস্ট" }, { en: "Sep", bn: "সেপ্টে" },
            { en: "Oct", bn: "অক্টো" }, { en: "Nov", bn: "নভে" }, { en: "Dec", bn: "ডিসে" }
        ];

        return monthNames.map((m, idx) => {
            let amount = 0;
            let tripsCount = 0;
            rawBookings.forEach((b) => {
                const d = new Date(b.createdAt);
                if (d.getFullYear() === now.getFullYear() && d.getMonth() === idx) {
                    amount += b.finalFare || b.estimatedFare || 0;
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
    }, [rawBookings, timeRange, t]);

    // Max amount for Y axis scaling
    const maxChartAmount = useMemo(() => {
        const highest = Math.max(...chartData.map((d) => d.amount), 0);
        return highest > 0 ? Math.ceil(highest * 1.2) : 5000;
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

    // Chart dimensions
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

    // Generate smooth SVG curve path
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

    // Closed Area Path for gradient fill
    const areaPath = useMemo(() => {
        if (!curvePath || points.length === 0) return "";
        const lastX = points[points.length - 1].x;
        const firstX = points[0].x;
        const bottomY = svgHeight - paddingY;
        return `${curvePath} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;
    }, [curvePath, points]);

    return (
        <DashboardLayout requiredRole="DRIVER">
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Earnings & Income Analytics", "উপার্জন ও আয় অ্যানালিটিক্স")}
                    </h1>
                    <p className="text-slate-600 font-medium text-sm">
                        {t("Track your daily, weekly, and monthly trip income performance.", "আপনার দৈনিক, সাপ্তাহিক ও মাসিক আয়ের গ্রাফ ও ইতিহাস দেখুন।")}
                    </p>
                </div>
            </header>

            {/* Summary Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                    { label: t("Total Lifetime Earnings", "মোট উপার্জন"), value: `৳${stats.total.toLocaleString()}`, icon: DollarSign, color: "bg-emerald-500 text-white" },
                    { label: t("This Month", "এই মাসের আয়"), value: `৳${stats.thisMonth.toLocaleString()}`, icon: TrendingUp, color: "bg-blue-500 text-white" },
                    { label: t("This Week", "এই সপ্তাহের আয়"), value: `৳${stats.thisWeek.toLocaleString()}`, icon: Calendar, color: "bg-indigo-500 text-white" },
                    { label: t("Total Completed Trips", "সম্পন্ন ট্রিপ"), value: `${stats.totalTrips}`, icon: Award, color: "bg-amber-500 text-white" },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-md", stat.color)}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1 truncate">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900 truncate">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── PROFESSIONAL EARNINGS GRAPH CHART ───────────────────────────────── */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 mb-8 space-y-6">
                {/* Chart Top Header & Filter Tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">
                                {t("Earnings Overview Chart", "আয়ের গ্রাফ চার্ট")}
                            </h3>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                            {t("Interactive income breakdown for selected period", "আপনার আয়ের বিশ্লেষণসমূহ")}
                        </p>
                    </div>

                    {/* Time Range Selector Tabs */}
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
                                        ? "bg-white text-emerald-600 shadow-sm border border-slate-200/60"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sub Header KPI Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                            {t("Period Earnings", "কাজের সময়কালীন আয়")}
                        </span>
                        <span className="text-lg font-black text-emerald-600">৳{activeChartTotal.toLocaleString()}</span>
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
                                {t("Peak Period", "সর্বোচ্চ আয়")}
                            </span>
                            <span className="text-sm font-black text-slate-900 truncate block">
                                {peakDataPoint.label}: <span className="text-emerald-600 font-black">৳{peakDataPoint.amount.toLocaleString()}</span>
                            </span>
                        </div>
                    )}
                </div>

                {/* SVG Area Line Chart View */}
                <div className="relative w-full overflow-x-auto pt-4 pb-2 scrollbar-none">
                    <div className="min-w-[600px] relative">
                        <svg
                            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                            className="w-full h-auto overflow-visible select-none"
                        >
                            <defs>
                                {/* Emerald Area Gradient */}
                                <linearGradient id="emeraldAreaGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.38" />
                                    <stop offset="60%" stopColor="#10B981" stopOpacity="0.08" />
                                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                                </linearGradient>

                                {/* Drop Shadow for Line */}
                                <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#10B981" floodOpacity="0.35" />
                                </filter>
                            </defs>

                            {/* Horizontal Gridlines */}
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

                            {/* Area Fill */}
                            {areaPath && (
                                <path
                                    d={areaPath}
                                    fill="url(#emeraldAreaGradient)"
                                    className="transition-all duration-500 ease-out"
                                />
                            )}

                            {/* Smooth Line Path */}
                            {curvePath && (
                                <path
                                    d={curvePath}
                                    fill="none"
                                    stroke="#10B981"
                                    strokeWidth="3.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    filter="url(#lineGlow)"
                                    className="transition-all duration-500 ease-out"
                                />
                            )}

                            {/* Interactive Data Points & Vertical Guides */}
                            {points.map((pt, idx) => {
                                const isHovered = hoveredPointIndex === idx;

                                return (
                                    <g key={idx} className="cursor-pointer">
                                        {/* Invisible Touch/Click Area */}
                                        <rect
                                            x={pt.x - 20}
                                            y={paddingY}
                                            width={40}
                                            height={svgHeight - paddingY * 2}
                                            fill="transparent"
                                            onMouseEnter={() => setHoveredPointIndex(idx)}
                                            onMouseLeave={() => setHoveredPointIndex(null)}
                                        />

                                        {/* Vertical Guide Line on Hover */}
                                        {isHovered && (
                                            <line
                                                x1={pt.x}
                                                y1={paddingY}
                                                x2={pt.x}
                                                y2={svgHeight - paddingY}
                                                stroke="#10B981"
                                                strokeOpacity="0.4"
                                                strokeDasharray="3 3"
                                                strokeWidth="1.5"
                                            />
                                        )}

                                        {/* Point Circle Outer Glow */}
                                        <circle
                                            cx={pt.x}
                                            cy={pt.y}
                                            r={isHovered ? 8 : 5}
                                            className={cn(
                                                "transition-all duration-200",
                                                isHovered ? "fill-emerald-500 stroke-white stroke-2" : "fill-white stroke-emerald-500 stroke-2"
                                            )}
                                        />

                                        {/* Inner Center Dot */}
                                        {isHovered && (
                                            <circle
                                                cx={pt.x}
                                                cy={pt.y}
                                                r={3}
                                                fill="#ffffff"
                                            />
                                        )}

                                        {/* X Axis Label */}
                                        <text
                                            x={pt.x}
                                            y={svgHeight - 6}
                                            textAnchor="middle"
                                            className={cn(
                                                "text-[11px] font-black transition-colors duration-200",
                                                isHovered ? "fill-emerald-600" : "fill-slate-500"
                                            )}
                                        >
                                            {pt.label}
                                        </text>
                                    </g>
                                );
                            })}
                        </svg>

                        {/* Interactive Floating Hover Tooltip */}
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
                                    <p className="text-base font-black text-emerald-400 mt-0.5">
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

            {/* ── TRANSACTION HISTORY TABLE ────────────────────────────────────────── */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-slate-900">{t("Transaction History", "লেনদেনের ইতিহাস")}</h3>
                        <p className="text-xs text-slate-500 font-medium">{t("Recent completed booking payouts", "আপনার সাম্প্রতিক ট্রিপের তালিকা")}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="p-20 flex justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : rawBookings.length === 0 ? (
                    <div className="p-20 text-center text-slate-500 font-bold">
                        {t("No transactions found yet. Your earnings will appear here once you complete trips.", "কোন লেনদেন পাওয়া যায়নি। ট্রিপ সম্পন্ন করার পর আপনার উপার্জন এখানে দেখাবে।")}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                    <th className="px-8 py-4">{t("Trip ID", "ট্রিপ আইডি")}</th>
                                    <th className="px-8 py-4">{t("Distance", "দূরত্ব")}</th>
                                    <th className="px-8 py-4">{t("Date", "তারিখ")}</th>
                                    <th className="px-8 py-4">{t("Gross Amount", "মোট পরিমাণ")}</th>
                                    <th className="px-8 py-4">{t("Status", "স্ট্যাটাস")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {rawBookings.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-4 font-black text-primary text-sm">#{tx.bookingNumber}</td>
                                        <td className="px-8 py-4 text-sm font-bold text-slate-800">
                                            {tx.distance ? `${tx.distance} KM` : "—"}
                                        </td>
                                        <td className="px-8 py-4 text-sm font-bold text-slate-800">
                                            {new Date(tx.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-4 text-sm font-black text-slate-900">
                                            ৳{(tx.finalFare || tx.estimatedFare || 0).toLocaleString()}
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 uppercase tracking-wider border border-emerald-100">
                                                {t("PAID", "পরিশোধিত")}
                                            </span>
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
