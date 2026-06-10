"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Package,
    Search,
    MoreVertical,
    Loader2,
    Filter,
    Calendar,
    MapPin,
    Tag,
    Trash2
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function AdminBookingsPage() {
    const { t } = useLanguage();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchBookings = async () => {
        try {
            const response = await api.get("/admin/bookings");
            setBookings(response.data.data.bookings || []);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this booking?")) return;
        try {
            await api.delete(`/bookings/${id}`);
            setBookings(prev => prev.filter(b => b.id !== id));
            toast.success("Booking deleted successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to delete booking");
        }
    };

    const filteredBookings = bookings.filter(b =>
        b.bookingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.pickupAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.dropAddress?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-100 text-amber-600';
            case 'ACCEPTED': return 'bg-blue-100 text-blue-600';
            case 'IN_TRANSIT': return 'bg-indigo-100 text-indigo-600';
            case 'COMPLETED': return 'bg-green-100 text-green-600';
            case 'CANCELLED': return 'bg-red-100 text-red-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("All Bookings", "সকল বুকিং")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Track and manage all logistics requests across the country.", "সারা দেশের সকল লজিস্টিক রিকোয়েস্ট ট্র্যাক এবং ম্যানেজ করুন।")}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-950" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t("Search booking ID...", "বুকিং আইডি খুঁজুন...")}
                            className="bg-white h-12 pl-12 pr-6 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/10 outline-none w-64 font-black text-sm text-slate-950 placeholder:text-slate-500"
                        />
                    </div>
                    <Button variant="outline" className="h-12 rounded-lg gap-2 font-bold px-6 text-slate-950">
                        <Filter className="w-4 h-4 text-slate-950" />
                        {t("Filter", "ফিল্টার")}
                    </Button>
                </div>
            </header>

            <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden text-black">
                {loading ? (
                    <div className="p-20 flex justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 border-b border-slate-100">
                                <tr className="text-[10px] font-black text-slate-950 uppercase tracking-widest">
                                    <th className="px-8 py-4">{t("ID & Customer", "আইডি ও কাস্টমার")}</th>
                                    <th className="px-8 py-4">{t("Route", "রাস্তা")}</th>
                                    <th className="px-8 py-4">{t("Date", "তারিখ")}</th>
                                    <th className="px-8 py-4">{t("Price", "মূল্য")}</th>
                                    <th className="px-8 py-4">{t("Status", "স্ট্যাটাস")}</th>
                                    <th className="px-8 py-4 text-right">{t("Actions", "অ্যাকশন")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-slate-50/50 transition-all">
                                        <td className="px-8 py-4">
                                            <div>
                                                <p className="font-black text-primary text-xs mb-1">#{booking.bookingNumber}</p>
                                                <p className="font-bold text-slate-950">{booking.user?.name || "—"}</p>
                                                <p className="text-[10px] text-slate-700 font-bold">{booking.user?.phone || "—"}</p>
                                            </div>
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
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-3.5 h-3.5" />
                                                {booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleDateString() : "—"}
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <p className="font-black text-slate-950">৳{booking.estimatedFare || 0}</p>
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
                                            <div className="flex items-center justify-end gap-2">
                                                <Button variant="ghost" size="icon" className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(booking.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
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
