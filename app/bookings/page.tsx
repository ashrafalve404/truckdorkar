"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Package,
    Clock,
    CheckCircle,
    AlertCircle,
    MapPin,
    Truck as TruckIcon,
    Loader2,
    Phone,
    Search,
    PlusCircle,
    Filter
} from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Booking {
    id: string;
    bookingNumber: string;
    type: string;
    pickupAddress: string;
    dropAddress: string;
    scheduledAt: string;
    status: string;
    estimatedFare: number;
    distance?: number | null;
    contactPhone?: string | null;
    goodsType?: string | null;
    goodsWeight?: number | null;
}

export default function UserBookingsPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get("/bookings");
                setBookings(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch bookings", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PENDING": return <Clock className="w-4 h-4 text-amber-500" />;
            case "ACCEPTED": return <CheckCircle className="w-4 h-4 text-blue-500" />;
            case "IN_TRANSIT": return <TruckIcon className="w-4 h-4 text-primary" />;
            case "COMPLETED": return <CheckCircle className="w-4 h-4 text-green-500" />;
            case "CANCELLED": return <AlertCircle className="w-4 h-4 text-red-500" />;
            default: return <Package className="w-4 h-4 text-slate-500" />;
        }
    };

    const filteredBookings = bookings.filter((b) => {
        // Status filter
        if (filterStatus === "ACTIVE" && !["ACCEPTED", "IN_TRANSIT", "PENDING"].includes(b.status)) return false;
        if (filterStatus === "COMPLETED" && b.status !== "COMPLETED") return false;
        if (filterStatus === "CANCELLED" && b.status !== "CANCELLED") return false;

        // Search query filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            const matchNumber = b.bookingNumber?.toLowerCase().includes(query);
            const matchPickup = b.pickupAddress?.toLowerCase().includes(query);
            const matchDrop = b.dropAddress?.toLowerCase().includes(query);
            const matchType = b.type?.toLowerCase().includes(query);
            return matchNumber || matchPickup || matchDrop || matchType;
        }

        return true;
    });

    const statusCounts = {
        ALL: bookings.length,
        ACTIVE: bookings.filter(b => ["ACCEPTED", "IN_TRANSIT", "PENDING"].includes(b.status)).length,
        COMPLETED: bookings.filter(b => b.status === "COMPLETED").length,
        CANCELLED: bookings.filter(b => b.status === "CANCELLED").length,
    };

    return (
        <DashboardLayout requiredRole="USER">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                        {t("My Trips & Bookings", "আমার ট্রিপস ও বুকিং")}
                    </h1>
                    <p className="text-slate-600 font-bold text-xs sm:text-sm">
                        {t("View and manage all your past and active truck booking requests.", "আপনার সকল অতীত ও বর্তমান ট্রাক বুকিং রিকোয়েস্ট দেখুন এবং পরিচালনা করুন।")}
                    </p>
                </div>
                <Button onClick={() => router.push("/bookings/new")} className="rounded-xl h-12 px-6 font-bold bg-primary text-white shadow-md shadow-primary/20 shrink-0 gap-2">
                    <PlusCircle className="w-5 h-5" />
                    {t("New Booking Request", "নতুন বুকিং করুন")}
                </Button>
            </header>

            {/* Filter Tabs & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Status Filter Tabs */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                        {[
                            { key: "ALL", label: t("All Trips", "সব ট্রিপ"), count: statusCounts.ALL },
                            { key: "ACTIVE", label: t("Active", "সক্রিয়"), count: statusCounts.ACTIVE },
                            { key: "COMPLETED", label: t("Completed", "সম্পন্ন"), count: statusCounts.COMPLETED },
                            { key: "CANCELLED", label: t("Cancelled", "বাতিল"), count: statusCounts.CANCELLED },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setFilterStatus(tab.key)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2",
                                    filterStatus === tab.key
                                        ? "bg-slate-900 text-white shadow-sm"
                                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                                )}
                            >
                                <span>{tab.label}</span>
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-md text-[10px] font-black",
                                    filterStatus === tab.key ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                                )}>
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full sm:w-72">
                        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t("Search by location or ID...", "স্থান বা আইডি দিয়ে খুঁজুন...")}
                            className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Bookings List */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="text-slate-600 font-bold text-sm">{t("Loading your trips...", "ট্রিপ লোড হচ্ছে...")}</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="p-16 text-center">
                        <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-800 mb-2">{t("No trips found", "কোন ট্রিপ পাওয়া যায়নি")}</h3>
                        <p className="text-xs text-slate-500 font-medium mb-6">
                            {searchQuery || filterStatus !== "ALL"
                                ? t("Try adjusting your filters or search query.", "ফিল্টার বা সার্চ পরিবর্তন করে দেখুন।")
                                : t("You haven't placed any truck bookings yet.", "আপনি এখনও কোন ট্রাক বুক করেননি।")}
                        </p>
                        <Button onClick={() => router.push("/bookings/new")} className="rounded-xl font-bold bg-primary text-white">
                            {t("Book a Truck Now", "এখনই ট্রাক বুক করুন")}
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 text-[10px] font-black text-slate-600 uppercase tracking-wider border-b border-slate-100">
                                    <th className="px-6 py-4">{t("Booking ID & Details", "বুকিং আইডি ও বিস্তারিত")}</th>
                                    <th className="px-6 py-4">{t("Pickup Location", "পিকআপ স্থান")}</th>
                                    <th className="px-6 py-4">{t("Drop-off Location", "ড্রপ-অফ স্থান")}</th>
                                    <th className="px-6 py-4">{t("Fare Offer", "ভাড়ার অফার")}</th>
                                    <th className="px-6 py-4">{t("Date", "তারিখ")}</th>
                                    <th className="px-6 py-4">{t("Status", "স্ট্যাটাস")}</th>
                                    <th className="px-6 py-4 text-right">{t("Action", "অ্যাকশন")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-slate-50/70 transition-colors">
                                        <td className="px-6 py-5">
                                            <div className="font-black text-slate-900 text-sm">#{booking.bookingNumber}</div>
                                            <div className="text-xs font-bold text-slate-600 mt-0.5">{booking.type.replace(/_/g, ' ')}</div>
                                            {booking.goodsType && (
                                                <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                                                    {booking.goodsType} ({booking.goodsWeight || 0} kg)
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-xs text-slate-900 font-bold max-w-xs">
                                                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                                                <span className="line-clamp-2">{booking.pickupAddress}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2 text-xs text-slate-900 font-bold max-w-xs">
                                                <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                                                <span className="line-clamp-2">{booking.dropAddress}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="font-black text-slate-950 text-base">৳{booking.estimatedFare?.toLocaleString()}</div>
                                            {booking.distance && (
                                                <div className="text-[10px] text-slate-500 font-bold">{booking.distance} KM</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-xs text-slate-700 font-bold whitespace-nowrap">
                                            {new Date(booking.scheduledAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-1.5 text-xs font-bold">
                                                {getStatusIcon(booking.status)}
                                                <span className={cn(
                                                    "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                                    booking.status === "COMPLETED" ? "bg-green-100 text-green-700" :
                                                        booking.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                                                            booking.status === "PENDING" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                                                )}>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right whitespace-nowrap">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="rounded-xl font-bold text-primary border-primary/20 hover:bg-primary/5 hover:border-primary"
                                                onClick={() => router.push(`/bookings/${booking.id}`)}
                                            >
                                                {t("View Details", "বিস্তারিত")}
                                            </Button>
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
