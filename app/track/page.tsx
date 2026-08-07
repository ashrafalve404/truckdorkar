"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    MapPin,
    Truck,
    Phone,
    Loader2,
    Clock,
    AlertCircle,
    ArrowRight,
    Navigation,
    ShieldCheck,
    Calendar,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { toast } from "react-hot-toast";

const MapComponent = dynamic(() => import("@/components/mapping/MapComponent"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 font-bold">Loading Map...</div>
});

export default function TrackShipmentPage() {
    const { t } = useLanguage();
    const router = useRouter();

    const [bookings, setBookings] = useState<any[]>([]);
    const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [mapCoords, setMapCoords] = useState<{ pickup?: [number, number]; drop?: [number, number] }>({});

    const fetchActiveBookings = useCallback(async () => {
        try {
            const { data } = await api.get("/bookings");
            const allBookings = data.data || [];
            // Filter active trips (ACCEPTED, PICKUP_STARTED, IN_TRANSIT)
            const active = allBookings.filter((b: any) =>
                ["ACCEPTED", "PICKUP_STARTED", "IN_TRANSIT"].includes(b.status)
            );
            setBookings(active);

            if (active.length > 0) {
                // If no booking is selected yet, select the first active trip
                setSelectedBookingId((prevId) => {
                    if (prevId && active.some((b: any) => b.id === prevId)) return prevId;
                    return active[0].id;
                });
            } else {
                setSelectedBookingId(null);
            }
        } catch (error) {
            console.error("Failed to fetch active bookings", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchActiveBookings();
    }, [fetchActiveBookings]);

    // Currently selected booking
    const activeBooking = bookings.find((b) => b.id === selectedBookingId) || (bookings.length > 0 ? bookings[0] : null);

    // Geocode pickup & drop address for current active booking
    useEffect(() => {
        if (!activeBooking?.pickupAddress || !activeBooking?.dropAddress) return;

        const geocode = async () => {
            try {
                const pRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(activeBooking.pickupAddress + ", Bangladesh")}&limit=1`);
                const pData = await pRes.json();
                const dRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(activeBooking.dropAddress + ", Bangladesh")}&limit=1`);
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
    }, [activeBooking?.pickupAddress, activeBooking?.dropAddress]);

    // Live 5-second polling when an active trip is selected
    useEffect(() => {
        if (!activeBooking) return;
        const interval = setInterval(() => {
            fetchActiveBookings();
        }, 5000);
        return () => clearInterval(interval);
    }, [activeBooking, fetchActiveBookings]);

    const isDriverOnline = activeBooking?.driver?.isOnline || false;
    const driverLat = activeBooking?.driver?.currentLat;
    const driverLng = activeBooking?.driver?.currentLng;
    const driverUpdatedAt = activeBooking?.driver?.updatedAt;

    return (
        <DashboardLayout requiredRole="USER">
            <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 flex items-center gap-2.5">
                        <Navigation className="w-7 h-7 text-primary shrink-0" />
                        {t("Live Tracking", "লাইভ ট্র্যাকিং")}
                    </h1>
                    <p className="text-slate-600 font-medium text-xs sm:text-sm">
                        {t("Track your booked truck position live on the map.", "ম্যাপে আপনার বুক করা ট্রাকের রিয়েল-টাইম লাইভ অবস্থান ট্র্যাক করুন।")}
                    </p>
                </div>

                {bookings.length > 0 && (
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-3 w-3 shrink-0">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                            {bookings.length} {t("Active Trip(s)", "অ্যাক্টিভ ট্রিপ")}
                        </span>
                    </div>
                )}
            </header>

            {loading ? (
                <div className="bg-white rounded-2xl p-16 border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-4 text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-slate-600 font-bold text-sm">{t("Loading tracking data...", "ট্র্যাকিং ডেটা লোড হচ্ছে...")}</p>
                </div>
            ) : bookings.length === 0 ? (
                /* No Active Trips Empty State */
                <div className="bg-white rounded-3xl p-8 sm:p-14 border border-slate-100 shadow-sm text-center max-w-2xl mx-auto">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
                        <MapPin className="w-10 h-10 animate-bounce" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-3">
                        {t("No Active Trip to Track", "বর্তমানে কোনো অ্যাক্টিভ ট্রিপ নেই")}
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-md mx-auto mb-8 font-medium">
                        {t(
                            "When you book a truck and your driver starts the ride, real-time live GPS tracking will automatically appear on this page.",
                            "আপনি ট্রাক বুক করার পর ড্রাইভার রাইড শুরু করলে এখানে স্বয়ংক্রিয়ভাবে রিয়েল-টাইম লাইভ জিপিএস ম্যাপ দেখা যাবে।"
                        )}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        <Button
                            onClick={() => router.push("/bookings/new")}
                            className="w-full sm:w-auto h-12 px-6 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 gap-2"
                        >
                            <Truck className="w-5 h-5" />
                            {t("Book a Truck Now", "এখনই ট্রাক বুক করুন")}
                        </Button>
                        <Button
                            onClick={() => router.push("/bookings")}
                            variant="outline"
                            className="w-full sm:w-auto h-12 px-6 rounded-xl font-bold border-slate-300 hover:bg-slate-50 text-slate-700"
                        >
                            {t("View All Trips", "সব ট্রিপ দেখুন")}
                        </Button>
                    </div>
                </div>
            ) : (
                /* Active Trip Tracking View */
                <div className="space-y-6">
                    {/* Multiple Active Trips Selector Tabs */}
                    {bookings.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
                                {t("Select Trip:", "ট্রিপ নির্বাচন করুন:")}
                            </span>
                            {bookings.map((b) => (
                                <button
                                    key={b.id}
                                    onClick={() => setSelectedBookingId(b.id)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 border",
                                        activeBooking?.id === b.id
                                            ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                                            : "bg-white text-slate-700 border-slate-200 hover:border-primary/40"
                                    )}
                                >
                                    <span className="uppercase">#{b.bookingNumber}</span>
                                    <span className="opacity-80">({b.status === "IN_TRANSIT" ? "In Transit" : "Accepted"})</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Status Banner */}
                    <div className={cn(
                        "rounded-2xl p-5 sm:p-6 border shadow-sm flex flex-col md:flex-row items-center justify-between gap-4",
                        activeBooking?.status === "IN_TRANSIT"
                            ? "bg-emerald-500/10 border-emerald-500/20"
                            : "bg-amber-500/10 border-amber-500/20"
                    )}>
                        <div className="flex items-center gap-3.5 text-center md:text-left">
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white font-bold",
                                activeBooking?.status === "IN_TRANSIT" ? "bg-emerald-500" : "bg-amber-500"
                            )}>
                                {activeBooking?.status === "IN_TRANSIT" ? <Navigation className="w-6 h-6 animate-pulse" /> : <Clock className="w-6 h-6" />}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1 justify-center md:justify-start">
                                    <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-md bg-white/80 shadow-xs border border-slate-200">
                                        #{activeBooking?.bookingNumber}
                                    </span>
                                    <span className={cn(
                                        "text-xs font-bold px-2.5 py-0.5 rounded-md text-white uppercase",
                                        activeBooking?.status === "IN_TRANSIT" ? "bg-emerald-600" : "bg-amber-600"
                                    )}>
                                        {activeBooking?.status === "IN_TRANSIT" ? t("RIDE IN TRANSIT", "রাইড চলমান রয়েছে") : t("TRIP ACCEPTED", "ট্রিপ গৃহীত হয়েছে")}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-slate-800">
                                    {activeBooking?.status === "IN_TRANSIT"
                                        ? t("Driver is currently driving towards destination. Live map updating real-time.", "ড্রাইভার বর্তমানে গন্তব্যের দিকে গাড়ি চালাচ্ছেন। রিয়েল-টাইম ম্যাপ আপডেট হচ্ছে।")
                                        : t("Driver accepted your booking. GPS tracking will turn on as soon as driver starts the ride.", "ড্রাইভার বুকিং মেনে নিয়েছেন। ড্রাইভার রাইড শুরু করলেই লাইভ জিপিএস ম্যাপ সক্রিয় হবে।")
                                    }
                                </p>
                            </div>
                        </div>

                        <Link
                            href={`/bookings/${activeBooking?.id}`}
                            className="shrink-0 flex items-center gap-1.5 text-xs font-bold text-primary hover:underline bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs"
                        >
                            <span>{t("View Trip Details", "বিস্তারিত দেখুন")}</span>
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Live Tracking Map Section */}
                    {activeBooking?.status === "IN_TRANSIT" ? (
                        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
                            <div className="flex items-center justify-between flex-wrap gap-2 pb-1">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">{t("Live Vehicle Position", "লাইভ গাড়ি ট্র্যাকিং")}</h3>
                                </div>
                                <div className={cn(
                                    "px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border shadow-xs",
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

                            <div className="h-[450px] lg:h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
                                <MapComponent
                                    pickup={mapCoords.pickup}
                                    drop={mapCoords.drop}
                                    driverLocation={driverLat && driverLng ? [driverLat, driverLng] : undefined}
                                    isDriverOnline={isDriverOnline}
                                    driverName={activeBooking.driver?.user?.name || "Driver"}
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
                    ) : (
                        /* Accepted Wait Banner */
                        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 text-center space-y-4">
                            <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                                <Clock className="w-8 h-8 animate-pulse" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">
                                {t("Waiting for Driver to Start Ride", "রাইড শুরু হওয়ার অপেক্ষায়")}
                            </h3>
                            <p className="text-slate-600 text-sm max-w-md mx-auto font-medium">
                                {t(
                                    "Your driver has confirmed the booking. The live tracking map will automatically render here as soon as the driver presses 'Start Ride'.",
                                    "আপনার ড্রাইভার বুকিং নিশ্চিত করেছেন। ড্রাইভার 'রাইড শুরু করুন' চাপার সাথে সাথে এখানে লাইভ ট্র্যাকিং ম্যাপ চালুর হবে।"
                                )}
                            </p>
                        </div>
                    )}

                    {/* Driver & Trip Specs Card */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Driver Contact */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xl font-black shrink-0">
                                    {activeBooking?.driver?.user?.name?.charAt(0) || "D"}
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("Assigned Driver", "নির্ধারিত ড্রাইভার")}</span>
                                    <h4 className="text-lg font-black text-slate-950">{activeBooking?.driver?.user?.name || "Assigned Driver"}</h4>
                                    <p className="text-xs font-bold text-slate-600 flex items-center gap-1.5 mt-0.5">
                                        <Truck className="w-3.5 h-3.5 text-primary" />
                                        <span>{activeBooking?.driver?.trucks?.[0]?.regNumber || "Verified Vehicle"}</span>
                                    </p>
                                </div>
                            </div>

                            {activeBooking?.driver?.user?.phone && (
                                <a
                                    href={`tel:${activeBooking.driver.user.phone}`}
                                    className="w-12 h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-all shrink-0"
                                    title="Call Driver"
                                >
                                    <Phone className="w-5 h-5" />
                                </a>
                            )}
                        </div>

                        {/* Route Summary */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                            <div className="flex items-start gap-3">
                                <span className="w-3 h-3 rounded-full bg-primary shrink-0 mt-1" />
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("Pickup Address", "পিকআপ ঠিকানা")}</span>
                                    <p className="text-xs font-bold text-slate-900 leading-tight">{activeBooking?.pickupAddress}</p>
                                </div>
                            </div>
                            <div className="w-px h-4 bg-slate-200 ml-1.5" />
                            <div className="flex items-start gap-3">
                                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0 mt-1" />
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t("Drop-off Address", "ড্রপ ঠিকানা")}</span>
                                    <p className="text-xs font-bold text-slate-900 leading-tight">{activeBooking?.dropAddress}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
