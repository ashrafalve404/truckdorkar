"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Truck as TruckIcon,
    Search,
    Loader2,
    CheckCircle,
    XCircle,
    Eye,
    FileText,
    ExternalLink,
    User
} from "lucide-react";
import api, { getFileUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

const STATUS_COLOURS: Record<string, string> = {
    PENDING: "text-amber-600 bg-amber-50",
    APPROVED: "text-green-600 bg-green-50",
    REJECTED: "text-red-600 bg-red-50",
    INACTIVE: "text-slate-600 bg-slate-50",
};

export default function AdminTrucksPage() {
    const { t } = useLanguage();
    const [trucks, setTrucks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTruck, setSelectedTruck] = useState<any>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [note, setNote] = useState("");
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string }>({ open: false, id: "" });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchTrucks = useCallback(async () => {
        try {
            const response = await api.get("/admin/trucks");
            setTrucks(response.data?.data?.trucks || []);
        } catch (err) {
            console.error("Failed to fetch trucks", err);
            toast.error(t("Failed to load trucks", "ট্রাক লোড করতে ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchTrucks();
    }, [fetchTrucks]);

    const handleAction = async (truckId: string, status: string) => {
        setActionLoading(true);
        try {
            await api.patch(`/trucks/${truckId}/approve`, { status, note });
            toast.success(`Truck ${status.toLowerCase()} successfully`);
            fetchTrucks();
            setSelectedTruck(null);
            setNote("");
        } catch (error) {
            toast.error("Failed to update truck status");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        setIsDeleting(true);
        try {
            await api.delete(`/trucks/${deleteModal.id}`);
            toast.success("Truck removed successfully");
            fetchTrucks();
            setDeleteModal({ open: false, id: "" });
        } catch (err) {
            toast.error("Failed to remove truck");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredTrucks = trucks.filter(t =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.registrationNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.driver?.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Truck Verification", "ট্রাক যাচাইকরণ")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Review and verify all truck registration submissions from drivers and agents.", "ড্রাইভার এবং এজেন্টদের জমা দেওয়া সমস্ত ট্রাক রেজিস্ট্রেশন যাচাই করুন।")}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-950" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t("Search trucks...", "ট্রাক খুঁজুন...")}
                            className="bg-white h-12 pl-12 pr-6 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/10 outline-none w-64 font-black text-sm text-slate-950 placeholder:text-slate-500"
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2">
                    <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden text-black">
                        {loading ? (
                            <div className="p-20 flex justify-center">
                                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                            </div>
                        ) : filteredTrucks.length === 0 ? (
                            <div className="p-12 text-center">
                                <TruckIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                                <h3 className="font-black text-slate-900">{t("No trucks found", "কোনো ট্রাক পাওয়া যায়নি")}</h3>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 border-b border-slate-100 font-black text-[10px] uppercase tracking-widest text-slate-950">
                                        <tr>
                                            <th className="px-6 py-4">{t("Truck Info", "ট্রাকের তথ্য")}</th>
                                            <th className="px-6 py-4">{t("Submitted By", "জমা দিয়েছেন")}</th>
                                            <th className="px-6 py-4">{t("Status", "স্ট্যাটাস")}</th>
                                            <th className="px-6 py-4 text-right">{t("Action", "অ্যাকশন")}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 font-bold text-sm">
                                        {filteredTrucks.map((truck) => (
                                            <tr key={truck.id} className={cn("hover:bg-slate-50/50 transition-all cursor-pointer", selectedTruck?.id === truck.id && "bg-primary/5")}>
                                                <td className="px-6 py-4" onClick={() => setSelectedTruck(truck)}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                                            <TruckIcon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-slate-950">{truck.name}</p>
                                                            <p className="text-xs text-slate-500">{truck.registrationNo}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4" onClick={() => setSelectedTruck(truck)}>
                                                    <div className="flex items-center gap-2">
                                                        {truck.registeredByAgent ? (
                                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-black uppercase rounded">Agent</span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[9px] font-black uppercase rounded">Driver</span>
                                                        )}
                                                        <span className="text-slate-700">{truck.registeredByAgent?.user?.name || truck.driver?.user?.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={cn(
                                                        "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                                                        STATUS_COLOURS[truck.status]
                                                    )}>
                                                        {truck.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary font-black" onClick={() => setSelectedTruck(truck)}>
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            {t("Review", "রিভিউ")}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeleteModal({ open: true, id: truck.id });
                                                            }}
                                                        >
                                                            <XCircle className="w-4 h-4" />
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
                </div>

                <div className="xl:col-span-1">
                    {selectedTruck ? (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden sticky top-8 text-black">
                            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                                <h2 className="font-black text-lg text-slate-950">{t("Verification Details", "ভেরিফিকেশন বিবরণ")}</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-slate-400">
                                            <User className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t("Submitted By", "জমা দিয়েছেন")}</p>
                                            <p className="font-black text-slate-950">{selectedTruck.registeredByAgent?.user?.name || selectedTruck.driver?.user?.name}</p>
                                            <p className="text-xs text-slate-600 font-bold">{selectedTruck.registeredByAgent ? "System Agent" : "Direct Driver"}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t("Model", "মডেল")}</p>
                                            <p className="font-black text-sm">{selectedTruck.make} {selectedTruck.model}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t("Capacity", "ক্ষমতা")}</p>
                                            <p className="font-black text-sm">{selectedTruck.capacityTon} Ton</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">{t("Documents", "ডকুমেন্টস")}</p>
                                    <div className="space-y-2">
                                        {[
                                            { label: "Road Permit", url: selectedTruck.roadPermitUrl },
                                            { label: "Tax Token", url: selectedTruck.taxTokenUrl },
                                            { label: "Blue Book", url: selectedTruck.blueBookUrl },
                                            { label: "Number Plate", url: selectedTruck.numberPlateImageUrl },
                                            { label: "Driving License", url: selectedTruck.drivingLicenseUrl },
                                        ].map((doc, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-slate-400" />
                                                    <span className="text-xs font-bold">{t(doc.label, doc.label)}</span>
                                                </div>
                                                {doc.url ? (
                                                    <a
                                                        href={getFileUrl(doc.url)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline flex items-center gap-1 text-[10px] font-black"
                                                    >
                                                        {t("View", "দেখুন")}
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400 text-[10px] font-bold">{t("N/A", "N/A")}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {selectedTruck.status === 'PENDING' && (
                                    <div className="space-y-4 pt-4 border-t border-slate-50">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">{t("Approval/Rejection Note", "অনুমোদন/প্রত্যাখ্যান নোট")}</label>
                                            <textarea
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                className="w-full h-24 p-4 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-primary/10 font-bold text-sm"
                                                placeholder={t("Add a note...", "একটি নোট যোগ করুন...")}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <Button
                                                onClick={() => handleAction(selectedTruck.id, "REJECTED")}
                                                disabled={actionLoading}
                                                variant="outline"
                                                className="h-12 rounded-xl font-black gap-2 border-red-200 text-red-600 hover:bg-red-50"
                                            >
                                                <XCircle className="w-5 h-5" />
                                                {t("Reject", "প্রত্যাখ্যান")}
                                            </Button>
                                            <Button
                                                onClick={() => handleAction(selectedTruck.id, "APPROVED")}
                                                disabled={actionLoading}
                                                className="h-12 rounded-xl font-black gap-2 shadow-lg shadow-green-500/20 text-white bg-green-500 hover:bg-green-600"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                {t("Approve", "অনুমোদন")}
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center font-bold">
                            <Eye className="w-12 h-12 mb-4 opacity-20" />
                            <p>{t("Select a truck from the list to view full details and documents for verification.", "যাচাইকরণের জন্য তালিকা থেকে একটি ট্রাক নির্বাচন করুন।")}</p>
                        </div>
                    )}
                </div>
            </div>

            <DeleteConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: "" })}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                title={t("Remove Truck", "ট্রাক মুছুন")}
                description={t("Are you sure you want to remove this truck? This action will archive the record and it will no longer be visible in the active fleet.", "আপনি কি নিশ্চিত যে আপনি এই ট্রাকটি সরাতে চান? এটি সক্রিয় তালিকা থেকে সরিয়ে আর্কাইভ করা হবে।")}
            />
        </DashboardLayout>
    );
}
