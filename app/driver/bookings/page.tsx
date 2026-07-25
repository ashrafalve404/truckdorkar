"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Search,
    Loader2,
    Calendar,
    MapPin,
    Phone
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function DriverBookingsPage() {
    const { t } = useLanguage();
    const [bookings, setBookings] = useState<{
        id: string;
        bookingNumber?: string;
        pickupAddress: string;
        dropAddress: string;
        status: string;
        scheduledAt?: string;
        contactPhone?: string | null;
        user?: { name?: string };
        distance?: number | null;
        estimatedFare?: number | null;
        finalFare?: number | null;
        companyCommission?: number | null;
        driverEarnings?: number | null;
    }[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMyBookings = useCallback(async () => {
        try {
            const response = await api.get("/bookings");
            const all = response.data.data || [];
            setBookings(all.filter((b: { status: string }) => b.status !== 'PENDING'));
        } catch (error) {
            console.error("Failed to fetch my bookings", error);
            toast.error(t("Failed to load your bookings", "আপনার বুকিংগুলো লোড করতে ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    }, [t, toast]);

    const handleUpdateStatus = async (id: string, status: string) => {
        try {
            await api.patch(`/bookings/${id}/status`, { status, note: 'Status updated by driver' });
            toast.success(t("Status updated successfully!", "স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!"));
            fetchMyBookings();
        } catch (error) {
            console.error("Failed to update status", error);
            toast.error(t("Failed to update status", "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে"));
        }
    };

    useEffect(() => {
        fetchMyBookings();
    }, [fetchMyBookings]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACCEPTED': return 'bg-blue-100 text-blue-600';
            case 'IN_TRANSIT': return 'bg-indigo-100 text-indigo-600';
            case 'COMPLETED': return 'bg-green-100 text-green-600';
            case 'CANCELLED': return 'bg-red-100 text-red-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <DashboardLayout requiredRole="DRIVER">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("My Bookings", "আমার বুকিং")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Manage your active trips and view completed history.", "আপনার চলমান ট্রিপগুলো পরিচালনা করুন এবং ইতিহাস দেখুন।")}
                    </p>
                </div>
            </header>

            <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden text-black">
                {loading ? (
                    <div className="p-20 flex justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="p-20 text-center">
                        <h3 className="text-xl font-bold text-slate-950 mb-2">{t("No Bookings Yet", "কোন বুকিং নেই")}</h3>
                        <p className="text-slate-700 font-bold max-w-sm mx-auto">
                            {t("You haven't accepted any trips yet. Go to Find Trips to get started!", "আপনি এখনও কোনো ট্রিপ গ্রহণ করেননি। ট্রিপ খুঁজতে 'ট্রিপ খুঁজুন' এ যান!")}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                    <th className="px-8 py-4">{t("Booking ID", "বুকিং আইডি")}</th>
                                    <th className="px-8 py-4">{t("Route", "রাস্তা")}</th>
                                    <th className="px-8 py-4">{t("Distance", "দূরত্ব")}</th>
                                    <th className="px-8 py-4">{t("Date", "তারিখ")}</th>
                                    <th className="px-8 py-4">{t("Fare / Earnings", "ভাড়া / আয়")}</th>
                                    <th className="px-8 py-4">{t("Status", "স্ট্যাটাস")}</th>
                                    <th className="px-8 py-4 text-right">{t("Actions", "অ্যাকশন")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {bookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-4">
                                            <p className="font-black text-primary text-xs mb-1">#{booking.bookingNumber || booking.id.slice(0, 8).toUpperCase()}</p>
                                            <p className="font-bold text-slate-950 text-sm">{booking.user?.name || 'Customer'}</p>
                                            {booking.contactPhone && (
                                                <a href={`tel:${booking.contactPhone}`} className="flex items-center gap-1 text-[10px] text-primary font-bold hover:underline mt-0.5">
                                                    <Phone className="w-2.5 h-2.5" />
                                                    {booking.contactPhone}
                                                </a>
                                            )}
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                    {booking.pickupAddress}
                                                </div>
                                                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                                    {booking.dropAddress}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4 text-xs font-bold text-slate-800">
                                            {booking.distance ? `${booking.distance} KM` : "—"}
                                        </td>
                                        <td className="px-8 py-4 text-xs font-bold text-slate-800">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleDateString() : t("N/A", "N/A")}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-950 text-sm">৳{booking.finalFare || booking.estimatedFare || 0}</span>
                                                {booking.status === 'COMPLETED' && booking.companyCommission != null && (
                                                    <div className="flex flex-col mt-1">
                                                        <span className="text-[10px] text-red-500 font-bold shrink-0">-{t("Fee", "চার্জ")}: ৳{booking.companyCommission}</span>
                                                        <span className="text-[10px] text-green-600 font-black shrink-0">{t("Net", "নিট")}: ৳{booking.driverEarnings}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <span className={cn(
                                                "text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider",
                                                getStatusColor(booking.status)
                                            )}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-4 text-right">
                                            {booking.status === 'ACCEPTED' || booking.status === 'IN_TRANSIT' ? (
                                                <Button
                                                    onClick={() => handleUpdateStatus(booking.id, 'COMPLETED')}
                                                    variant="default"
                                                    size="sm"
                                                    className="rounded-lg h-9 font-bold px-4 bg-green-600 hover:bg-green-700 text-white border-none"
                                                >
                                                    {t("Complete Trip", "ট্রিপ শেষ করুন")}
                                                </Button>
                                            ) : (
                                                <Button variant="outline" size="sm" className="rounded-lg h-9 font-bold px-4 opacity-50 cursor-default">
                                                    {t("No Action", "কোনো কাজ নেই")}
                                                </Button>
                                            )}
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
