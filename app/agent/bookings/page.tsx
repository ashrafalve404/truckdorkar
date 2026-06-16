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
    Truck
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

export default function AgentBookingsPage() {
    const { t } = useLanguage();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchBookings = async () => {
        try {
            // For now use the same endpoint, we might refine it later
            const response = await api.get("/bookings");
            setBookings(response.data.data || []);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(b =>
        b.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.dropoffAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.status.toLowerCase().includes(searchTerm.toLowerCase())
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
        <DashboardLayout requiredRole="AGENT">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Manage Bookings", "বুকিং ম্যানেজ করুন")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Monitor active bookings and assist drivers/customers.", "সক্রিয় বুকিংগুলো মনিটর করুন এবং সাহায্য করুন।")}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-950" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t("Search by location or status...", "ঠিকানা বা স্ট্যাটাস খুঁজুন...")}
                            className="bg-white h-12 pl-12 pr-6 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/10 outline-none w-72 font-black text-sm text-slate-950 placeholder:text-slate-500"
                        />
                    </div>
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
                                    <th className="px-8 py-4">{t("Details", "বিস্তারিত")}</th>
                                    <th className="px-8 py-4">{t("Route", "রাস্তা")}</th>
                                    <th className="px-8 py-4">{t("Date", "তারিখ")}</th>
                                    <th className="px-8 py-4">{t("Status", "স্ট্যাটাস")}</th>
                                    <th className="px-8 py-4 text-right">{t("Actions", "অ্যাকশন")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center text-slate-500 font-bold italic">
                                            {t("No bookings found.", "কোন বুকিং পাওয়া যায়নি।")}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((booking) => (
                                        <tr key={booking.id} className="hover:bg-slate-50/50 transition-all">
                                            <td className="px-8 py-4">
                                                <div>
                                                    <p className="font-bold text-slate-950">{booking.truckType?.replace(/_/g, ' ') || 'Any Truck'}</p>
                                                    <p className="text-[10px] text-slate-700 font-bold uppercase tracking-wider">{booking.cargoType || booking.goodsType}</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                                        <MapPin className="w-3 h-3 text-green-500" />
                                                        {booking.pickupAddress}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                                                        <MapPin className="w-3 h-3 text-red-500" />
                                                        {booking.dropoffAddress}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-4 text-xs font-bold text-slate-800">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {new Date(booking.scheduledAt).toLocaleDateString()}
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
                                                <Button variant="ghost" size="sm" className="rounded-lg font-bold text-primary">
                                                    {t("Manage", "ম্যানেজ")}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
