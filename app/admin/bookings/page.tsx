"use client";

import React, { useCallback, useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Search,
    Loader2,
    Filter,
    Calendar,
    Trash2,
    Phone,
    Truck
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

interface BookingRow {
    id: string;
    bookingNumber: string;
    pickupAddress: string;
    dropAddress: string;
    scheduledAt: string | null;
    status: string;
    truckType?: string | null;
    estimatedFare: number | null;
    finalFare: number | null;
    companyCommission?: number | null;
    agentCommission?: number | null;
    driverEarnings?: number | null;
    distance?: number | null;
    contactPhone?: string | null;
    user: { name: string | null; phone: string | null } | null;
    truck?: { name: string | null; category: string | null; registrationNo: string | null } | null;
}

export default function AdminBookingsPage() {
    const { t } = useLanguage();
    const [bookings, setBookings] = useState<BookingRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; num: string }>({ open: false, id: "", num: "" });
    const [isDeleting, setIsDeleting] = useState(false);

    const [statusFilter, setStatusFilter] = useState("ALL");

    const fetchBookings = useCallback(async () => {
        try {
            const response = await api.get("/admin/bookings");
            setBookings(response.data.data.bookings || []);
        } catch (error) {
            console.error("Failed to fetch bookings", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        setIsDeleting(true);
        try {
            await api.delete(`/bookings/${deleteModal.id}`);
            setBookings(prev => prev.filter(b => b.id !== deleteModal.id));
            toast.success("Booking deleted successfully");
            setDeleteModal({ open: false, id: "", num: "" });
        } catch (error: unknown) {
            const message = error && typeof error === "object" && "response" in error
                ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
                : undefined;
            toast.error(message || "Failed to delete booking");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredBookings = bookings.filter(b => {
        const matchesSearch =
            b.bookingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.pickupAddress?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.dropAddress?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING": return "bg-amber-100 text-amber-600";
            case "ACCEPTED": return "bg-blue-100 text-blue-600";
            case "IN_TRANSIT": return "bg-indigo-100 text-indigo-600";
            case "COMPLETED": return "bg-green-100 text-green-600";
            case "CANCELLED": return "bg-red-100 text-red-600";
            default: return "bg-slate-100 text-slate-600";
        }
    };

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1 sm:mb-2">
                        {t("All Bookings", "সকল বুকিং")}
                    </h1>
                    <p className="text-slate-600 font-bold text-xs sm:text-sm">
                        {t("Track and manage all logistics requests across the country.", "সারা দেশের সকল লজিস্টিক রিকোয়েস্ট ট্র্যাক এবং ম্যানেজ করুন।")}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t("Search booking ID...", "বুকিং আইডি খুঁজুন...")}
                            className="bg-white h-11 pl-10 pr-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/10 outline-none w-full font-bold text-xs sm:text-sm text-slate-950 placeholder:text-slate-400"
                        />
                    </div>
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-white h-11 pl-4 pr-10 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/10 outline-none w-full sm:w-auto font-bold text-xs sm:text-sm text-slate-950 cursor-pointer appearance-none shrink-0"
                        >
                            <option value="ALL">{t("All Statuses", "সকল স্ট্যাটাস")}</option>
                            <option value="PENDING">{t("Pending", "পেন্ডিং")}</option>
                            <option value="ACCEPTED">{t("Accepted", "গৃহীত")}</option>
                            <option value="IN_TRANSIT">{t("In Transit", "চলমান")}</option>
                            <option value="COMPLETED">{t("Completed", "সম্পন্ন")}</option>
                            <option value="CANCELLED">{t("Cancelled", "বাতিল")}</option>
                        </select>
                        <Filter className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
                                    <th className="px-6 py-4">{t("ID & Customer", "আইডি ও কাস্টমার")}</th>
                                    <th className="px-6 py-4">{t("Truck Type", "গাড়ির ধরন")}</th>
                                    <th className="px-6 py-4">{t("Route", "রাস্তা")}</th>
                                    <th className="px-6 py-4">{t("Distance", "দূরত্ব")}</th>
                                    <th className="px-6 py-4">{t("Date", "তারিখ")}</th>
                                    <th className="px-6 py-4">{t("Price", "মূল্য")}</th>
                                    <th className="px-6 py-4">{t("Status", "স্ট্যাটাস")}</th>
                                    <th className="px-6 py-4 text-right">{t("Actions", "অ্যাকশন")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredBookings.map((booking) => {
                                    const truckTypeLabel = booking.truckType
                                        ? booking.truckType.replace(/_/g, " ").toUpperCase()
                                        : booking.truck?.category
                                            ? booking.truck.category.replace(/_/g, " ").toUpperCase()
                                            : booking.truck?.name || "Standard Truck";

                                    return (
                                        <tr key={booking.id} className="hover:bg-slate-50/50 transition-all">
                                            <td className="px-6 py-4">
                                                <div>
                                                    <p className="font-black text-primary text-xs mb-1">#{booking.bookingNumber}</p>
                                                    <p className="font-bold text-slate-950">{booking.user?.name || "—"}</p>
                                                    <p className="text-[10px] text-slate-700 font-bold">{booking.user?.phone || "—"}</p>
                                                    {booking.contactPhone && (
                                                        <a href={`tel:${booking.contactPhone}`} className="flex items-center gap-1 text-[10px] text-primary font-bold hover:underline mt-0.5">
                                                            <Phone className="w-2.5 h-2.5" />
                                                            {booking.contactPhone}
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-900 text-xs font-extrabold px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                                                    <Truck className="w-3.5 h-3.5 text-primary shrink-0" />
                                                    <span>{truckTypeLabel}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
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
                                            <td className="px-6 py-4 text-xs font-bold text-slate-800">
                                                {booking.distance ? `${booking.distance} KM` : "—"}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-800">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="w-3.5 h-3.5" />
                                                    {booking.scheduledAt ? new Date(booking.scheduledAt).toLocaleDateString() : "—"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-black text-slate-950">৳{booking.finalFare ?? booking.estimatedFare ?? 0}</p>
                                                {booking.status === 'COMPLETED' && booking.companyCommission != null && (
                                                    <div className="mt-1 space-y-0.5">
                                                        <p className="text-[10px] font-bold text-green-600">+৳{booking.companyCommission.toFixed(2)} {t("Company", "কোম্পানি")}</p>
                                                        {booking.agentCommission != null && booking.agentCommission > 0 && (
                                                            <p className="text-[10px] font-bold text-cyan-600">+৳{booking.agentCommission.toFixed(2)} {t("Agent", "এজেন্ট")}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={cn(
                                                    "text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider",
                                                    getStatusColor(booking.status)
                                                )}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => setDeleteModal({ open: true, id: booking.id, num: booking.bookingNumber })}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <DeleteConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: "", num: "" })}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                title={t("Delete Booking", "বুকিং মুছুন")}
                description={`${t("Are you sure you want to delete booking", "আপনি কি নিশ্চিত যে আপনি বুকিং মুছতে চান")} #${deleteModal.num}? ${t("This action cannot be undone and will remove the booking from historical records.", "এই কাজটি আর ফেরানো যাবে না এবং এটি ইতিহাস থেকে বুকিংটি মুছে ফেলবে।")}`}
            />
        </DashboardLayout>
    );
}
