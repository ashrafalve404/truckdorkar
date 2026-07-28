"use client";

import React, { useEffect, useState, useMemo } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Users,
    Truck,
    Package,
    MessageSquare,
    CheckCircle,
    Clock,
    AlertCircle,
    Loader2,
    TrendingUp,
    BarChart3,
    ArrowRight,
    DollarSign,
    Wallet
} from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

type TimeRange = "day" | "week" | "month" | "year";

interface TripEarnings {
    id: string;
    commission: number;
    completedAt: string;
}

export default function AgentDashboard() {
    const { t } = useLanguage();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState<TimeRange>("week");
    const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

    const [counts, setCounts] = useState({
        pendingTrucks: 0,
        myTrucksCount: 0,
        tripCommission: 0,
        walletBalance: 0,
        totalEarnings: 0,
        todayBookings: 0,
        totalTrips: 0,
    });
    const [recentTickets, setRecentTickets] = useState<any[]>([]);
    const [agentTrips, setAgentTrips] = useState<TripEarnings[]>([]);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const [dashRes, ticketsRes, earningsRes] = await Promise.all([
                    api.get("/agents/dashboard"),
                    api.get("/support/tickets").catch(() => ({ data: { data: [] } })),
                    api.get("/agents/earnings").catch(() => ({ data: { data: { trips: [] } } }))
                ]);

                const dashData = dashRes.data?.data || {};
                setCounts({
                    pendingTrucks: dashData.counts?.pendingTrucks || 0,
                    myTrucksCount: dashData.counts?.myTrucksCount || 0,
                    tripCommission: dashData.counts?.tripCommission || 0,
                    walletBalance: dashData.counts?.walletBalance || 0,
                    totalEarnings: dashData.counts?.totalEarnings || (dashData.counts?.tripCommission || 0) + (dashData.counts?.walletBalance || 0),
                    todayBookings: dashData.counts?.todayBookings || 0,
                    totalTrips: dashData.counts?.totalTrips || 0,
                });

                const tickets = ticketsRes.data?.data || [];
                setRecentTickets(tickets.slice(0, 5));

                const earnings = earningsRes.data?.data?.trips || [];
                setAgentTrips(earnings);
            } catch (error) {
                console.error("Failed to fetch agent dashboard", error);
                toast.error(t("Failed to load dashboard data", "ড্যাশবোর্ড ডেটা লোড করতে ব্যর্থ হয়েছে"));
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    // ── Generate Dynamic Overall Chart Data Points (Trip Commissions + Wallet Bonuses) ──
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
                agentTrips.forEach((tItem) => {
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
                agentTrips.forEach((tItem) => {
                    const d = new Date(tItem.completedAt || Date.now());
                    if (d >= targetDate && d < nextDate) {
                        amount += tItem.commission || 0;
                        tripsCount++;
                    }
                });

                return {
                    label: t(day.en, day.bn),
                    amount,
                    tripsCount,
                    subtext: `${targetDate.getDate()} ${targetDate.toLocaleString('default', { month: 'short' })}`
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
                agentTrips.forEach((tItem) => {
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
            agentTrips.forEach((tItem) => {
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
    }, [agentTrips, timeRange, t]);

    const maxChartAmount = useMemo(() => {
        const highest = Math.max(...chartData.map((d) => d.amount), 0);
        return highest > 0 ? Math.ceil(highest * 1.25) : 2000;
    }, [chartData]);

    const activeChartTotal = useMemo(() => {
        return chartData.reduce((sum, d) => sum + d.amount, 0);
    }, [chartData]);

    // SVG Dimensions
    const svgWidth = 800;
    const svgHeight = 220;
    const paddingX = 40;
    const paddingY = 25;

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

    const stats = [
        { label: t("My Registered Trucks", "আমার নিবন্ধিত ট্রাক"), value: counts.myTrucksCount, icon: Truck, color: "text-blue-600", bg: "bg-blue-50", href: "/agent/trucks" },
        { label: t("Wallet Balance", "ওয়ালেট ব্যালেন্স"), value: `৳${counts.walletBalance.toLocaleString()}`, icon: Wallet, color: "text-emerald-600", bg: "bg-emerald-50", href: "/agent/earnings" },
        { label: t("Trip Commission", "ট্রিপ কমিশন"), value: `৳${counts.tripCommission.toLocaleString()}`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50", href: "/agent/earnings" },
        { label: t("Total Earnings", "মোট আয়"), value: `৳${counts.totalEarnings.toLocaleString()}`, icon: DollarSign, color: "text-indigo-600", bg: "bg-indigo-50", href: "/agent/earnings" },
        { label: t("Successful Trips", "সফল ট্রিপ"), value: counts.totalTrips, icon: Package, color: "text-emerald-600", bg: "bg-emerald-50", href: "/agent/earnings" },
        { label: t("Pending Trucks", "অপেক্ষমান ট্রাক"), value: counts.pendingTrucks, icon: Clock, color: "text-amber-600", bg: "bg-amber-50", href: "/agent/trucks" },
    ];

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
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    {t("Agent Dashboard", "এজেন্ট ড্যাশবোর্ড")}
                </h1>
                <p className="text-slate-700 font-bold">
                    {t("Manage your registered trucks, support requests, and commissions.", "আপনার নিবন্ধিত ট্রাক, সাপোর্ট রিকোয়েস্ট এবং কমিশন পরিচালনা করুন।")}
                </p>
            </header>

            {/* 1. TOP SECTION: Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {stats.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={idx}
                            onClick={() => router.push(item.href)}
                            className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-5"
                        >
                            <div className={`w-13 h-13 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 shadow-sm`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-0.5">{item.label}</p>
                                <p className="text-2xl font-black text-slate-950">{item.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 2. MIDDLE SECTION: Support Tickets */}
            <div className="grid grid-cols-1 gap-8 mb-10">
                <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-900">{t("Recent Tickets", "সাম্প্রতিক টিকেট")}</h3>
                        <button onClick={() => router.push("/agent/support")} className="text-primary text-sm font-bold hover:underline">{t("View All", "সব দেখুন")}</button>
                    </div>
                    {recentTickets.length > 0 ? (
                        <div className="space-y-3">
                            {recentTickets.map((ticket) => (
                                <div key={ticket.id} className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${ticket.priority === 'URGENT' ? 'bg-red-100' : ticket.priority === 'HIGH' ? 'bg-orange-100' : 'bg-purple-50'}`}>
                                        <AlertCircle className={`w-5 h-5 ${ticket.priority === 'URGENT' ? 'text-red-500' : ticket.priority === 'HIGH' ? 'text-orange-500' : 'text-purple-500'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-slate-900 truncate">{ticket.subject}</p>
                                        <p className="text-xs text-slate-500 font-bold">{ticket.user?.name || "Unknown"} · {new Date(ticket.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${ticket.status === 'OPEN' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                        {ticket.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                            <p className="text-sm font-bold text-slate-500">{t("No support tickets yet", "কোনো সাপোর্ট টিকেট নেই")}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. VERY BOTTOM SECTION: OVERALL PERFORMANCE & COMMISSION ANALYTICS CHART */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
                {/* Chart Top Header & Time Tabs */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                    <div>
                        <div className="flex items-center gap-2.5 mb-1">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                                <BarChart3 className="w-5 h-5" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900">
                                {t("Overall Earnings & Commission Analytics", "সামগ্রিক আয় ও কমিশন অ্যানালিটিক্স চার্ট")}
                            </h3>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                            {t("Complete income overview combining trip commissions (20%) & wallet earnings", "ওয়ালট ব্যালেন্স ও ট্রিপ কমিশনের সম্মিলিত আয়ের চার্ট")}
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
                                        ? "bg-white text-purple-600 shadow-sm border border-slate-200/60"
                                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                                )}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Sub Header Income Summary Badges (Wallet + Trip Commission + Total) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50/70 p-4 rounded-2xl border border-slate-100">
                    <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                            {t("Total Earnings", "মোট আয়")}
                        </span>
                        <span className="text-lg font-black text-indigo-600">৳{counts.totalEarnings.toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                            {t("Trip Commission", "ট্রিপ কমিশন")}
                        </span>
                        <span className="text-lg font-black text-purple-600">৳{counts.tripCommission.toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                            {t("Wallet Balance", "ওয়ালেট ব্যালেন্স")}
                        </span>
                        <span className="text-lg font-black text-emerald-600">৳{counts.walletBalance.toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-0.5">
                            {t("Period Total", "কাজের আয়ের চার্ট")}
                        </span>
                        <span className="text-lg font-black text-slate-900">৳{activeChartTotal.toLocaleString()}</span>
                    </div>
                </div>

                {/* SVG Area Line Chart View */}
                <div className="relative w-full overflow-x-auto pt-2 pb-2 scrollbar-none">
                    <div className="min-w-[600px] relative">
                        <svg
                            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                            className="w-full h-auto overflow-visible select-none"
                        >
                            <defs>
                                <linearGradient id="dashPurpleGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#9333EA" stopOpacity="0.38" />
                                    <stop offset="70%" stopColor="#9333EA" stopOpacity="0.06" />
                                    <stop offset="100%" stopColor="#9333EA" stopOpacity="0.0" />
                                </linearGradient>
                            </defs>

                            {[0, 0.5, 1].map((pct, idx) => {
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
                                    fill="url(#dashPurpleGradient)"
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

                                        <circle
                                            cx={pt.x}
                                            cy={pt.y}
                                            r={isHovered ? 7 : 4.5}
                                            className={cn(
                                                "transition-all duration-200",
                                                isHovered ? "fill-purple-600 stroke-white stroke-2" : "fill-white stroke-purple-600 stroke-2"
                                            )}
                                        />

                                        <text
                                            x={pt.x}
                                            y={svgHeight - 4}
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
                                    marginTop: "-10px"
                                }}
                            >
                                <div className="bg-slate-950 text-white rounded-xl p-2.5 shadow-xl border border-slate-800 text-center min-w-[130px] whitespace-nowrap">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                        {points[hoveredPointIndex].label}
                                    </p>
                                    <p className="text-sm font-black text-purple-400 mt-0.5">
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
        </DashboardLayout>
    );
}
