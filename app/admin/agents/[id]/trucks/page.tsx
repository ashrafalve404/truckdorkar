"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Truck,
    ArrowLeft,
    Loader2,
    CheckCircle,
    XCircle,
    FileText,
    Eye,
    ExternalLink
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRouter, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

const STATUS_COLOURS: Record<string, string> = {
    PENDING: "text-amber-600 bg-amber-50",
    APPROVED: "text-green-600 bg-green-50",
    REJECTED: "text-red-600 bg-red-50",
};

export default function AdminAgentTrucksPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [trucks, setTrucks] = useState<any[]>([]);
    const [selectedTruck, setSelectedTruck] = useState<any>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [note, setNote] = useState("");

    const fetchTrucks = async () => {
        try {
            const response = await api.get(`/agents/admin/${id}/trucks`);
            setTrucks(response.data.data);
        } catch (error) {
            console.error("Failed to fetch agent trucks", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrucks();
    }, [id]);

    const handleAction = async (truckId: string, status: string) => {
        setActionLoading(true);
        try {
            await api.patch(`/agents/admin/trucks/${truckId}/approve`, { status, note });
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

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-10 flex items-center gap-4">
                <button
                    onClick={() => router.push("/admin/agents")}
                    className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-all text-black"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-1">
                        {t("Truck Submissions", "ট্রাক সাবমিশন")}
                    </h1>
                    <p className="text-slate-600 font-bold text-sm">
                        {t("Review and verify truck registrations submitted by this agent.", "এই এজেন্টের জমা দেওয়া ট্রাক রেজিস্ট্রেশন যাচাই করুন।")}
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-4">
                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        </div>
                    ) : trucks.length === 0 ? (
                        <div className="py-20 bg-white rounded-xl border border-slate-100 text-center text-black font-bold">
                            {t("No trucks submitted yet.", "এখনো কোনো ট্রাক জমা দেওয়া হয়নি।")}
                        </div>
                    ) : (
                        trucks.map((truck) => (
                            <div
                                key={truck.id}
                                className={cn(
                                    "p-6 rounded-xl border transition-all cursor-pointer",
                                    selectedTruck?.id === truck.id ? "bg-primary/5 border-primary shadow-md" : "bg-white border-slate-100 hover:border-primary/20 shadow-sm"
                                )}
                                onClick={() => setSelectedTruck(truck)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                                            <Truck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-slate-950">{truck.name}</h3>
                                            <p className="text-sm text-slate-500 font-bold">{truck.registrationNo}</p>
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                        STATUS_COLOURS[truck.status] || "bg-slate-50 text-slate-600"
                                    )}>
                                        {truck.status}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="xl:col-span-1">
                    {selectedTruck ? (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden sticky top-8 text-black">
                            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                                <h2 className="font-black text-lg text-slate-950">{t("Verification Details", "ভেরিফিকেশন বিবরণ")}</h2>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t("Registration", "রেজিস্ট্রেশন")}</p>
                                        <p className="font-black text-sm">{selectedTruck.registrationNo}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t("Number Plate", "নাম্বার প্লেট")}</p>
                                        <p className="font-black text-sm">{selectedTruck.numberPlateText || "N/A"}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">{t("Documents", "ডকুমেন্টস")}</p>
                                    <div className="space-y-2">
                                        {[
                                            { label: "Road Permit", url: selectedTruck.roadPermitUrl },
                                            { label: "Tax Token", url: selectedTruck.taxTokenUrl },
                                            { label: "Blue Book", url: selectedTruck.blueBookUrl },
                                            { label: "Number Plate Photo", url: selectedTruck.numberPlateImageUrl },
                                        ].map((doc, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-slate-400" />
                                                    <span className="text-xs font-bold">{t(doc.label, doc.label)}</span>
                                                </div>
                                                {doc.url ? (
                                                    <a
                                                        href={doc.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-primary hover:underline flex items-center gap-1 text-[10px] font-black"
                                                    >
                                                        {t("View", "দেখুন")}
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400 text-[10px] font-bold">{t("Missing", "নেই")}</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t("Approval Note", "অনুমোদন নোট")}</label>
                                    <textarea
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                        className="w-full h-24 p-4 rounded-xl bg-slate-50 border-none outline-none focus:ring-2 focus:ring-primary/10 font-bold text-sm"
                                        placeholder={t("Add a note for the agent...", "এজেন্টের জন্য একটি নোট যোগ করুন...")}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        onClick={() => handleAction(selectedTruck.id, "REJECTED")}
                                        disabled={actionLoading || selectedTruck.status === "REJECTED"}
                                        variant="outline"
                                        className="h-12 rounded-xl font-black gap-2 border-red-200 text-red-600 hover:bg-red-50"
                                    >
                                        <XCircle className="w-5 h-5" />
                                        {t("Reject", "প্রত্যাখ্যান")}
                                    </Button>
                                    <Button
                                        onClick={() => handleAction(selectedTruck.id, "APPROVED")}
                                        disabled={actionLoading || selectedTruck.status === "APPROVED"}
                                        className="h-12 rounded-xl font-black gap-2 shadow-lg shadow-green-500/20 text-white"
                                    >
                                        <CheckCircle className="w-5 h-5" />
                                        {t("Approve", "অনুমোদন")}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-8 text-center text-black font-bold">
                            <Eye className="w-12 h-12 mb-4 opacity-20" />
                            <p>{t("Select a truck submission from the list to view full details and documents.", "বিস্তারিত তথ্য এবং ডকুমেন্টস দেখতে তালিকা থেকে একটি ট্রাক নির্বাচন করুন।")}</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
