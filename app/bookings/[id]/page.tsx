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
    Navigation,
    XCircle,
    Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("@/components/mapping/MapComponent"), {
    ssr: false,
    loading: () => <div className="h-64 bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 font-bold">Loading Live Map...</div>
});

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
    contactPhone?: string;
    user: { name: string; phone: string };
    driver?: {
        id: string;
        userId: string;
        currentLat?: number | null;
        currentLng?: number | null;
        isAvailable?: boolean;
        updatedAt?: string;
        user: { name: string; phone: string };
    };
    review?: { id: string; rating: number; comment?: string } | null;
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

    // Geocoded route map coordinates
    const [mapCoords, setMapCoords] = useState<{ pickup?: [number, number]; drop?: [number, number] }>({});

    // Review state
    const [rating, setRating] = useState(5);
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

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

    // Geocode pickup and drop addresses for the map
    useEffect(() => {
        if (!booking?.pickupAddress || !booking?.dropAddress) return;

        const geocode = async () => {
            try {
                const pRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(booking.pickupAddress + ", Bangladesh")}&limit=1`);
                const pData = await pRes.json();
                const dRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(booking.dropAddress + ", Bangladesh")}&limit=1`);
                const dData = await dRes.json();

                const pLat = pData[0] ? parseFloat(pData[0].lat) : 23.8103;
                const pLng = pData[0] ? parseFloat(pData[0].lon) : 90.4125;
                const dLat = dData[0] ? parseFloat(dData[0].lat) : 23.9088;
                const dLng = dData[0] ? parseFloat(dData[0].lon) : 90.4116;

                setMapCoords({ pickup: [pLat, pLng], drop: [dLat, dLng] });
            } catch (e) {
                setMapCoords({ pickup: [23.8103, 90.4125], drop: [23.9088, 90.4116] });
            }
        };
        geocode();
    }, [booking?.pickupAddress, booking?.dropAddress]);

    // Live auto-polling every 5 seconds when trip is active (ACCEPTED / IN_TRANSIT)
    useEffect(() => {
        if (!booking) return;
        const isActive = ["ACCEPTED", "PICKUP_STARTED", "IN_TRANSIT"].includes(booking.status);
        if (!isActive) return;

        const interval = setInterval(() => {
            fetchBooking();
        }, 5000);
        return () => clearInterval(interval);
    }, [booking?.status, fetchBooking]);

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

    const handleCancel = async () => {
        if (!window.confirm(t("Are you sure you want to cancel this booking?", "আপনি কি নিশ্চিত যে আপনি এই বুকিংটি বাতিল করতে চান?"))) {
            return;
        }

        setUpdating(true);
        try {
            await api.patch(`/bookings/${id}/cancel`, { reason: "Cancelled by user" });
            toast.success(t("Booking cancelled successfully", "বুকিং সফলভাবে বাতিল করা হয়েছে"));
            fetchBooking();
        } catch (error) {
            toast.error(t("Failed to cancel booking", "বুকিং বাতিল করতে ব্যর্থ হয়েছে"));
        } finally {
            setUpdating(false);
        }
    };

    const handleUpdateStatus = async (status: string, note: string) => {
        setUpdating(true);
        try {
            await api.patch(`/bookings/${id}/status`, { status, note });
            toast.success(t("Status updated!", "স্ট্যাটাস আপডেট হয়েছে!"));
            fetchBooking();
        } catch (error) {
            toast.error(t("Failed to update status", "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে"));
        } finally {
            setUpdating(false);
        }
    };

    const handleSubmitReview = async () => {
        if (!booking) return;
        setSubmittingReview(true);
        try {
            await api.post("/reviews", {
                bookingId: booking.id,
                rating,
                comment: reviewComment,
            });
            toast.success(t("Thank you! Review submitted successfully.", "ধন্যবাদ! রিভিউ সফলভাবে সাবমিট করা হয়েছে।"));
            fetchBooking();
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("Failed to submit review", "রিভিউ সাবমিট করতে ব্যর্থ হয়েছে"));
        } finally {
            setSubmittingReview(false);
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
    const isCompleted = booking.status === "COMPLETED";
    const isUser = user?.role === "USER";
    const isDriver = user?.role === "DRIVER";

    const driverLat = booking.driver?.currentLat;
    const driverLng = booking.driver?.currentLng;
    const driverUpdatedAt = booking.driver?.updatedAt ? new Date(booking.driver.updatedAt).getTime() : 0;
    const isDriverOnline = Boolean(
        booking.driver?.isAvailable &&
        driverUpdatedAt > 0 &&
        (Date.now() - driverUpdatedAt < 150000)
    );

    return (
        <DashboardLayout requiredRole={user?.role as any}>
            <div className="max-w-4xl mx-auto pb-12">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-slate-500 font-bold hover:text-primary transition-colors mb-6 text-sm"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {t("Back to Bookings", "বুকিং তালিকায় ফিরুন")}
                </button>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    {/* Top Header Banner */}
                    <div className="p-8 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-black text-slate-950">
                                    Booking #{booking.bookingNumber}
                                </h1>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider",
                                    isCompleted ? "bg-green-100 text-green-700" :
                                        booking.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                                            isPending ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                                )}>
                                    {booking.status}
                                </span>
                            </div>
                            <p className="text-xs text-slate-700 font-bold">
                                {t("Created on", "তৈরি করা হয়েছে")} {new Date(booking.scheduledAt).toLocaleDateString()}
                            </p>
                        </div>

                        {booking.driver && (
                            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{t("Assigned Driver", "মনোনীত ড্রাইভার")}</p>
                                    <p className="text-sm font-bold text-slate-900">{booking.driver.user.name}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Grid */}
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                        {/* Route Details */}
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest mb-4">{t("Trip Route", "ট্রিপ রুট")}</h3>
                                <div className="space-y-6 relative before:absolute before:left-3.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                                    <div className="flex items-start gap-4 relative">
                                        <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center shrink-0 shadow-md">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{t("Pickup Address", "পিকআপ অ্যাড্রেস")}</p>
                                            <p className="text-sm font-bold text-slate-900">{booking.pickupAddress}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 relative">
                                        <div className="w-7 h-7 rounded-full bg-secondary text-white flex items-center justify-center shrink-0 shadow-md">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{t("Drop-off Address", "ড্রপ-অফ অ্যাড্রেস")}</p>
                                            <p className="text-sm font-bold text-slate-900">{booking.dropAddress}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight flex items-center gap-1.5 mb-1">
                                        <Navigation className="w-3 h-3 text-primary" />
                                        {t("Distance", "দূরত্ব")}
                                    </p>
                                    <p className="text-lg font-black text-slate-950">{booking.distance} KM</p>
                                </div>
                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight flex items-center gap-1.5 mb-1">
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

                                        <Button
                                            onClick={handleCancel}
                                            variant="ghost"
                                            disabled={updating}
                                            className="w-full h-12 rounded-xl font-bold text-red-500 hover:bg-red-50 hover:text-red-600 gap-2 mt-2"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            {t("Cancel Booking", "বুকিং বাতিল করুন")}
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between flex-wrap gap-3">
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
                                        {booking.status === "ACCEPTED" && isDriver && (
                                            <Button
                                                onClick={() => handleUpdateStatus("IN_TRANSIT", "Driver started the ride")}
                                                disabled={updating}
                                                className="h-12 px-6 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                                            >
                                                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : t("Start Ride", "রাইড শুরু করুন")}
                                            </Button>
                                        )}
                                        {booking.status === "IN_TRANSIT" && isDriver && (
                                            <Button
                                                onClick={() => handleUpdateStatus("COMPLETED", "Driver completed the ride")}
                                                disabled={updating}
                                                className="h-12 px-6 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-200"
                                            >
                                                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : t("Complete Ride", "রাইড সম্পন্ন করুন")}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Driver Rating Section (For Completed Bookings) */}
                            {isCompleted && isUser && (
                                <div>
                                    {booking.review ? (
                                        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 shadow-sm">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                                                <h3 className="font-black text-slate-900 text-sm">
                                                    {t("Your Rating for Driver", "ড্রাইভারকে দেয়া আপনার রেটিং")}
                                                </h3>
                                            </div>
                                            <div className="flex items-center gap-1 my-2">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        className={cn(
                                                            "w-5 h-5",
                                                            s <= booking.review!.rating
                                                                ? "fill-amber-400 text-amber-400"
                                                                : "text-slate-300"
                                                        )}
                                                    />
                                                ))}
                                                <span className="ml-2 font-black text-slate-900 text-sm">{booking.review.rating}.0 / 5.0</span>
                                            </div>
                                            {booking.review.comment && (
                                                <p className="text-xs text-slate-700 font-bold italic mt-2">"{booking.review.comment}"</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-6 shadow-sm">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                                                    <Star className="w-5 h-5 fill-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-slate-900 text-sm">
                                                        {t("Rate Your Driver", "ড্রাইভারকে রেটিং দিন")}
                                                    </h3>
                                                    <p className="text-xs font-bold text-slate-600">
                                                        {t("How was your trip experience?", "আপনার ট্রিপ অভিজ্ঞতা কেমন ছিল?")}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Star Selection */}
                                            <div className="flex items-center gap-2 my-4">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        className="p-1 hover:scale-125 transition-transform outline-none"
                                                    >
                                                        <Star
                                                            className={cn(
                                                                "w-7 h-7 transition-colors",
                                                                star <= rating
                                                                    ? "fill-amber-400 text-amber-400"
                                                                    : "text-slate-300 hover:text-amber-300"
                                                            )}
                                                        />
                                                    </button>
                                                ))}
                                                <span className="ml-2 font-black text-slate-900 text-sm">{rating}.0 / 5.0</span>
                                            </div>

                                            <textarea
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                                placeholder={t("Write a review for your driver (optional)...", "ড্রাইভার সার্ভিস কেমন লেগেছে লিখুন (ঐচ্ছিক)...")}
                                                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 bg-white focus:ring-2 focus:ring-amber-500/20 outline-none resize-none mb-4"
                                                rows={2}
                                            />

                                            <Button
                                                onClick={handleSubmitReview}
                                                disabled={submittingReview}
                                                className="h-11 px-6 rounded-xl font-black bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20"
                                            >
                                                {submittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : t("Submit Driver Rating", "রেটিং প্রদান করুন")}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Trip Info List */}
                            <div className="grid grid-cols-2 gap-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{t("Date", "তারিখ")}</p>
                                    <p className="text-sm font-bold text-slate-900">{new Date(booking.scheduledAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{t("Goods Type", "পণ্যের ধরন")}</p>
                                    <p className="text-sm font-bold text-slate-900">{booking.goodsType}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{t("Weight", "ওজন")}</p>
                                    <p className="text-sm font-bold text-slate-900">{booking.goodsWeight} KG</p>
                                </div>
                                {booking.contactPhone && (
                                    <div className="col-span-2">
                                        <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight flex items-center gap-1">
                                            <Phone className="w-3 h-3" />
                                            {t("Contact Phone", "যোগাযোগ নম্বর")}
                                        </p>
                                        <a href={`tel:${booking.contactPhone}`} className="text-sm font-bold text-primary hover:underline">{booking.contactPhone}</a>
                                    </div>
                                )}
                            </div>

                            {booking.specialNote && (
                                <div className="bg-slate-50 rounded-2xl p-4">
                                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-tight shrink-0 mb-1">{t("Special Note", "বিশেষ নোট")}</p>
                                    <p className="text-xs text-slate-700 font-bold italic">"{booking.specialNote}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Waiting Banner for ACCEPTED status before ride starts */}
                    {booking.status === "ACCEPTED" && (
                        <div className="p-8 border-t border-slate-100 bg-amber-50/60 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shrink-0 shadow-md shadow-amber-500/20">
                                🚚
                            </div>
                            <div>
                                <h3 className="text-base font-black text-amber-950">
                                    {t("Trip Accepted by Driver!", "ড্রাইভার ট্রিপটি গ্রহণ করেছেন!")}
                                </h3>
                                <p className="text-xs font-bold text-amber-700 mt-0.5">
                                    {t(
                                        "Driver will start the ride soon. Live GPS tracking map will be activated as soon as driver starts the ride.",
                                        "ড্রাইভার শীঘ্রই রাইড শুরু করবেন। ড্রাইভার রাইড শুরু করলেই লাইভ জিপিএস ট্র্যাকিং ম্যাপ চালু হবে।"
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Live Truck Tracking Map Card (Activates ONLY when ride starts) */}
                    {(booking.status === "IN_TRANSIT" || booking.status === "PICKUP_STARTED" || booking.status === "DELIVERED") && (
                        <div className="p-8 border-t border-slate-100 bg-slate-50/60">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="text-lg font-black text-slate-950 flex items-center gap-2">
                                        <Navigation className="w-5 h-5 text-primary" />
                                        {t("Live Truck Tracking", "লাইভ ট্রাক ট্র্যাকিং")}
                                    </h3>
                                    <p className="text-xs text-slate-500 font-bold mt-0.5">
                                        {isDriverOnline
                                            ? t("Real-time GPS signal active", "রিয়েল-টাইম জিপিএস সিগন্যাল অ্যাক্টিভ")
                                            : t("Driver is offline. Showing last known position.", "ড্রাইভার অফলাইন। সর্বশেষ লোকেশন দেখানো হচ্ছে।")}
                                    </p>
                                </div>

                                <div className={cn(
                                    "px-3.5 py-1.5 rounded-full text-xs font-black flex items-center gap-2 border shadow-xs",
                                    isDriverOnline
                                        ? "bg-green-50 text-green-700 border-green-200"
                                        : "bg-slate-100 text-slate-600 border-slate-200"
                                )}>
                                    <span className={`w-2.5 h-2.5 rounded-full ${isDriverOnline ? "bg-green-500 animate-pulse" : "bg-slate-400"}`} />
                                    {isDriverOnline
                                        ? t("Driver Active & Online", "ড্রাইভার অনলাইনে আছে")
                                        : t("Driver Offline (Last Location)", "ড্রাইভার অফলাইন (শেষ লোকেশন)")}
                                </div>
                            </div>

                            <div className="h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
                                <MapComponent
                                    pickup={mapCoords.pickup}
                                    drop={mapCoords.drop}
                                    driverLocation={driverLat && driverLng ? [driverLat, driverLng] : undefined}
                                    isDriverOnline={isDriverOnline}
                                    driverName={booking.driver?.user?.name || "Driver"}
                                    lastActiveText={
                                        isDriverOnline
                                            ? t("Location updating live", "লাইভ লোকেশন আপডেট হচ্ছে")
                                            : driverUpdatedAt
                                                ? `${t("Last active", "সর্বশেষ অ্যাক্টিভ")}: ${new Date(driverUpdatedAt).toLocaleTimeString()}`
                                                : t("No GPS signal received yet", "এখনো কোনো জিপিএস সিগন্যাল পাওয়া যায়নি")
                                    }
                                />
                            </div>
                        </div>
                    )}

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
                                        <p className="text-[10px] font-bold text-slate-700">{new Date(log.createdAt).toLocaleString()}</p>
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
