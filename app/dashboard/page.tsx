"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import { Package, Clock, CheckCircle, AlertCircle, MapPin, Truck as TruckIcon, Loader2, Phone, Bell } from "lucide-react";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface Booking {
    id: string;
    bookingNumber: string;
    type: string;
    pickupAddress: string;
    dropAddress: string;
    scheduledAt: string;
    status: string;
    distance?: number | null;
    contactPhone?: string | null;
    truck?: { id: string; name: string; category: string } | null;
    goodsType?: string | null;
    goodsWeight?: number | null;
}

export default function DashboardPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingsRes, notifsRes] = await Promise.all([
                    api.get("/bookings"),
                    api.get("/notifications")
                ]);
                setBookings(bookingsRes.data.data || []);
                setNotifications(notifsRes.data?.data || notifsRes.data || []);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "PENDING": return <Clock className="w-5 h-5 text-amber-500" />;
            case "ACCEPTED": return <CheckCircle className="w-5 h-5 text-blue-500" />;
            case "IN_TRANSIT": return <TruckIcon className="w-5 h-5 text-primary" />;
            case "COMPLETED": return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "CANCELLED": return <AlertCircle className="w-5 h-5 text-red-500" />;
            default: return <Package className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <DashboardLayout requiredRole="USER">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-black text-black">
                        {t("My Bookings", "আমার বুকিং")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Track your active orders and view booking history.", "আপনার সক্রিয় অর্ডারগুলো ট্র্যাক করুন এবং বুকিং ইতিহাস দেখুন।")}
                    </p>
                </div>
                <Button onClick={() => router.push("/bookings/new")} className="rounded-2xl h-12 px-6 font-bold bg-primary text-white shadow-lg shadow-primary/20">
                    {t("New Booking Request", "নতুন বুকিং রিকোয়েস্ট")}
                </Button>
            </header>

            {/* Latest Notifications Card */}
            {notifications.filter(n => !n.isRead).length > 0 && (
                <div className="mb-10 bg-primary/5 border border-primary/20 rounded-2xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                        <Bell className="w-24 h-24 text-primary" />
                    </div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center animate-pulse">
                                <Bell className="w-4 h-4" />
                            </div>
                            <h2 className="text-lg font-black text-slate-950 uppercase tracking-tight">
                                {t("Latest Notifications", "সর্বশেষ নোটিফিকেশন")}
                            </h2>
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.push("/notifications")}
                            className="text-xs font-black text-primary hover:bg-primary/10 transition-all rounded-full h-8 cursor-pointer relative z-20"
                        >
                            {t("View All", "সব দেখুন")}
                        </Button>
                    </div>
                    <div className="space-y-4">
                        {notifications.filter(n => !n.isRead).slice(0, 2).map((notif) => (
                            <div key={notif.id} className="bg-white/60 backdrop-blur-sm border border-white/40 p-4 rounded-xl flex items-start gap-4">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                                <div>
                                    <h3 className="font-black text-sm text-slate-900 mb-0.5">{notif.title}</h3>
                                    <p className="text-xs text-slate-700 font-bold leading-relaxed">{notif.body}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                    { label: t("Total Bookings", "মোট বুকিং"), value: bookings.length, icon: Package, color: "bg-blue-500" },
                    { label: t("Active", "সক্রিয়"), value: bookings.filter(b => ["ACCEPTED", "IN_TRANSIT"].includes(b.status)).length, icon: Clock, color: "bg-amber-500" },
                    { label: t("Completed", "সম্পন্ন"), value: bookings.filter(b => b.status === "COMPLETED").length, icon: CheckCircle, color: "bg-green-500" },
                    { label: t("Cancelled", "বাতিল"), value: bookings.filter(b => b.status === "CANCELLED").length, icon: AlertCircle, color: "bg-red-500" },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-lg shadow-sm border border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-lg ${stat.color} text-white flex items-center justify-center`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-2xl font-black text-slate-950">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Booking List */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-950">{t("Recent Bookings", "সাম্প্রতিক বুকিং")}</h2>
                </div>

                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="text-slate-700 font-bold">{t("Loading your bookings...", "বুকিং লোড হচ্ছে...")}</p>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="p-20 text-center">
                        <Package className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 mb-2">{t("No bookings yet", "কোন বুকিং পাওয়া যায়নি")}</h3>
                        <Button variant="outline" onClick={() => router.push("/bookings/new")} className="rounded-xl border-primary text-primary">
                            {t("Book Your First Truck", "আপনার প্রথম ট্রাক বুক করুন")}
                        </Button>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 text-[10px] font-black text-slate-950 uppercase tracking-widest">
                                    <th className="px-8 py-4">{t("Details", "বিস্তারিত")}</th>
                                    <th className="px-8 py-4">{t("Pickup", "পিকআপ")}</th>
                                    <th className="px-8 py-4">{t("Drop", "ড্রপ")}</th>
                                    <th className="px-8 py-4">{t("Distance", "দূরত্ব")}</th>
                                    <th className="px-8 py-4">{t("Date", "তারিখ")}</th>
                                    <th className="px-8 py-4">{t("Status", "স্ট্যাটাস")}</th>
                                    <th className="px-8 py-4">{t("Action", "অ্যাকশন")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="font-bold text-slate-950">{booking.type.replace(/_/g, ' ')}</div>
                                            <div className="text-[10px] uppercase font-bold text-slate-700 tracking-wider mt-1">{booking.goodsType || "—"}</div>
                                            {booking.contactPhone && (
                                                <a href={`tel:${booking.contactPhone}`} className="flex items-center gap-1 text-[10px] text-primary font-bold hover:underline mt-1">
                                                    <Phone className="w-2.5 h-2.5" />
                                                    {booking.contactPhone}
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-sm text-slate-800 font-bold">
                                                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                                                <span className="line-clamp-1">{booking.pickupAddress}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-sm text-slate-800 font-bold">
                                                <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                                                <span className="line-clamp-1">{booking.dropAddress}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-sm text-slate-800 font-bold">
                                            {booking.distance ? `${booking.distance} KM` : "—"}
                                        </td>
                                        <td className="px-8 py-6 text-sm text-slate-800 font-bold">
                                            {new Date(booking.scheduledAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                                {getStatusIcon(booking.status)}
                                                <span className={
                                                    booking.status === "COMPLETED" ? "text-green-600" :
                                                        booking.status === "CANCELLED" ? "text-red-600" :
                                                            booking.status === "PENDING" ? "text-amber-600" : "text-blue-600"
                                                }>
                                                    {booking.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <Button variant="ghost" size="sm" className="rounded-xl font-bold text-primary hover:bg-primary/5" onClick={() => router.push(`/bookings/${booking.id}`)}>
                                                {t("Details", "বিস্তারিত")}
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
