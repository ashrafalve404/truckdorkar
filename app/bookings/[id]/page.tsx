"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/store/use-auth";
import api from "@/lib/api";
import {
    MapPin,
    Calendar,
    Truck,
    Package,
    User,
    Phone,
    CheckCircle,
    Clock,
    AlertCircle,
    Loader2,
    ArrowLeft,
    TrendingUp,
    Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

interface BookingDetail {
    id: string;
    bookingNumber: string;
    type: string;
    pickupAddress: string;
    dropAddress: string;
    scheduledAt: string;
    status: string;
    estimatedFare: number;
    distance: number;
    goodsType: string;
    goodsWeight: number;
    truckType: string;
    specialNote?: string;
    user: { name: string; phone: string };
    driver?: { user: { name: string; phone: string } };
    statusLogs: { status: string; note: string; createdAt: string }[];
}

export default function BookingDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { t } = useLanguage();
    const { user } = useAuth();
    const [booking, setBooking] = useState<BookingDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newFare, setNewFare] = useState("");

    const fetchBooking = useCallback(async () => {
        try {
            const { data } = await api.get(`/bookings/${id}`);
            setBooking(data.data);
            setNewFare(data.data.estimatedFare.toString());
        } catch (error) {
            console.error("Failed to fetch booking", error);
            toast.error(t("Failed to load booking details", "বুকিং তথ্য লোড করতে ব্যর্থ হয়েছে"));
            router.back();
        } finally {
            setLoading(false);
        }
    }, [id, t, router]);

    useEffect(() => {
        fetchBooking();
    }, [fetchBooking]);

    const handleAcceptJob = async () => {
        setUpdating(true);
        try {
            await api.patch(`/bookings/${id}/accept`);
            toast.success(t("Job accepted!", "কাজটি গ্রহণ করা হয়েছে!"));
            fetchBooking();
        } catch (error) {
            toast.error(t("Failed to accept job", "কাজটি গ্রহণ করতে ব্যর্থ হয়েছে"));
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateFare = async () => {
        const fareNum = Number(newFare);
        const currentFare = booking?.estimatedFare || 0;

        // Users can ONLY increase fares, never reduce them
        if (fareNum <= currentFare) {
            toast.error(t("You can only increase your fare offer, not reduce it.", "আপনি শুধুমাত্র ভাড়া বাড়াতে পারবেন, কমাতে পারবেন না।"));
            return;
        }

        setUpdating(true);
        try {
            await api.patch(`/bookings/${id}/update-fare`, { fare: fareNum });
            toast.success(t("Fare updated successfully!", "ভাড়া সফলভাবে আপডেট করা হয়েছে!"));
            fetchBooking();
        } catch (error) {
            toast.error(t("Failed to update fare", "ভাড়া আপডেট করতে ব্যর্থ হয়েছে"));
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout requiredRole="USER">
                <div className="h-96 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    if (!booking) return null;

    const isPending = booking.status === "PENDING";
    const isUser = user?.role === "USER";
    const isDriver = user?.role === "DRIVER";

    return (
        <DashboardLayout requiredRole={user?.role as any}>
            <div className="max-w-4xl mx-auto pb-12">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-colors mb-6 text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t("Back to List", "তালিকায় ফিরে যান")}
                </button>

                <div className="bg-white rounded-3xl border border-slate-100 shadow-premium overflow-hidden">
                    {/* Status Header */}
                    <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{t("Booking ID", "বুকিং আইডি")}</p>
                            <h1 className="text-xl font-black text-slate-950 uppercase">{booking.bookingNumber}</h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={cn(
                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                                booking.status === "PENDING" ? "bg-amber-100 text-amber-700" :
                                    booking.status === "ACCEPTED" ? "bg-blue-100 text-blue-700" :
                                        booking.status === "COMPLETED" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-700"
                            )}>
                                {booking.status}
                            </span>
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Trip Info */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-sm font-black text-slate-950 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <div className="w-1 h-4 bg-primary rounded-full" />
                                    {t("Route Details", "রুটের বিস্তারিত")}
                                </h3>
                                <div className="space-y-6 relative ml-1.5">
                                    <div className="absolute left-0.5 top-2 bottom-2 w-0.5 bg-slate-100" />
                                    <div className="flex gap-4 relative">
                                        <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5 shrink-0 z-10" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{t("Pickup", "পিকআপ")}</p>
                                            <p className="text-sm font-bold text-slate-900 mt-0.5">{booking.pickupAddress}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 relative">
                                        <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0 z-10" />
                                        <div>
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{t("Drop", "ড্রপ")}</p>
                                            <p className="text-sm font-bold text-slate-900 mt-0.5">{booking.dropAddress}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight flex items-center gap-1.5 mb-1">
                                        <Navigation className="w-3 h-3 text-primary" />
                                        {t("Distance", "দূরত্ব")}
                                    </p>
                                    <p className="text-lg font-black text-slate-950">{booking.distance} KM</p>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight flex items-center gap-1.5 mb-1">
                                        <Truck className="w-3 h-3 text-primary" />
                                        {t("Truck Type", "ট্রাকের ধরন")}
                                    </p>
                                    <p className="text-sm font-bold text-slate-950 truncate">
                                        {booking.truckType?.replace(/_/g, ' ') || t("Not Specified", "নির্দিষ্ট নয়")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Management Side */}
                        <div className="space-y-8">
                            {/* Fare Offer Card */}
                            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6">
                                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    {t("Fare Offer", "ভাড়ার অফার")}
                                </p>

                                {isPending && isUser ? (
                                    <div className="space-y-4">
                                        <p className="text-3xl font-black text-slate-950">৳{booking.estimatedFare.toLocaleString()}</p>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">৳</span>
                                            <input
                                                type="number"
                                                value={newFare}
                                                min={booking.estimatedFare + 1}
                                                onChange={(e) => setNewFare(e.target.value)}
                                                className={cn(
                                                    "w-full h-14 bg-white border rounded-xl pl-10 pr-4 font-black text-xl text-slate-950 focus:ring-2 focus:ring-primary/20 outline-none transition-all",
                                                    Number(newFare) < booking.estimatedFare ? "border-red-300" : "border-slate-200"
                                                )}
                                            />
                                        </div>
                                        {Number(newFare) < booking.estimatedFare && (
                                            <p className="text-xs text-red-500 font-bold">
                                                {t("Fare cannot be reduced. Enter a value above ", "ভাড়া কমানো যাবে না। এর চেয়ে বেশি লিখুন: ")}{booking.estimatedFare} TK
                                            </p>
                                        )}
                                        <Button
                                            onClick={handleUpdateFare}
                                            disabled={updating || Number(newFare) <= booking.estimatedFare}
                                            className="w-full h-12 rounded-xl font-bold bg-primary text-white"
                                        >
                                            {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : t("Update My Offer", "অফার আপডেট করুন")}
                                        </Button>
                                        <p className="text-[10px] text-slate-500 font-bold text-center">
                                            {t("Increasing your offer might help find a driver faster.", "অফার বাড়ালে দ্রুত ড্রাইভার পাওয়া যেতে পারে।")}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <p className="text-4xl font-black text-slate-950">৳{booking.estimatedFare.toLocaleString()}</p>
                                        {isPending && isDriver && (
                                            <Button
                                                onClick={handleAcceptJob}
                                                disabled={updating}
                                                className="h-12 px-6 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200"
                                            >
                                                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : t("Accept Trip", "ট্রিপটি নিন")}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Trip Info List */}
                            <div className="grid grid-cols-2 gap-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{t("Date", "তারিখ")}</p>
                                    <p className="text-sm font-bold text-slate-900">{new Date(booking.scheduledAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{t("Goods Type", "পণ্যের ধরন")}</p>
                                    <p className="text-sm font-bold text-slate-900">{booking.goodsType}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{t("Weight", "ওজন")}</p>
                                    <p className="text-sm font-bold text-slate-900">{booking.goodsWeight} KG</p>
                                </div>
                            </div>

                            {booking.specialNote && (
                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tight shrink-0 mb-1">{t("Special Note", "বিশেষ নোট")}</p>
                                    <p className="text-xs text-slate-700 font-bold italic">"{booking.specialNote}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="p-8 bg-slate-50/50 border-t border-slate-50">
                        <h3 className="text-sm font-black text-slate-950 uppercase tracking-widest mb-6">{t("Activity Log", "অ্যাক্টিভিটি লগ")}</h3>
                        <div className="space-y-4">
                            {booking.statusLogs.map((log, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">{log.note}</p>
                                        <p className="text-[10px] font-bold text-slate-500">{new Date(log.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
