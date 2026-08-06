"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Truck,
    Plus,
    Clock,
    CheckCircle2,
    XCircle,
    Info,
    ArrowRight,
    Search,
    Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api, { getFileUrl } from "@/lib/api";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DriverTrucksPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [trucks, setTrucks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTruck, setSelectedTruck] = useState<any | null>(null);

    const fetchTrucks = async () => {
        try {
            const res = await api.get("/trucks/mine");
            setTrucks(res.data.data);
        } catch (error) {
            console.error("Failed to fetch trucks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrucks();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED": return "bg-green-100 text-green-700 border-green-200";
            case "REJECTED": return "bg-red-100 text-red-700 border-red-200";
            case "PENDING": return "bg-amber-100 text-amber-700 border-amber-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "APPROVED": return <CheckCircle2 className="w-4 h-4" />;
            case "REJECTED": return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <DashboardLayout requiredRole="DRIVER">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 mb-1">{t("My Registered Trucks", "আমার নিবন্ধিত ট্রাক")}</h1>
                        <p className="text-slate-600 font-bold text-sm">{t("Manage your vehicles and check approval status.", "আপনার যানবাহন পরিচালনা করুন এবং স্ট্যাটাস চেক করুন।")}</p>
                    </div>
                    <Button onClick={() => router.push("/driver/trucks/new")} className="h-12 px-6 rounded-xl font-black bg-primary text-white shadow-lg shadow-primary/20">
                        <Plus className="w-5 h-5 mr-2" />
                        {t("Add New Truck", "নতুন ট্রাক যোগ করুন")}
                    </Button>
                </header>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                        {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-2xl" />)}
                    </div>
                ) : trucks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trucks.map((truck) => (
                            <div key={truck.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-primary/50 transition-all group">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                            <Truck className="w-6 h-6 text-slate-600 group-hover:text-primary transition-colors" />
                                        </div>
                                        <div className={cn(
                                            "px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5",
                                            getStatusColor(truck.status)
                                        )}>
                                            {getStatusIcon(truck.status)}
                                            {t(truck.status, truck.status === 'PENDING' ? 'অপেক্ষমান' : truck.status === 'APPROVED' ? 'অনুমোদিত' : 'প্রত্যাখ্যাত')}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-black text-slate-900 mb-1">{truck.name}</h3>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tight mb-4 flex items-center gap-1">
                                        {truck.registrationNo}
                                        <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                                        {t(truck.category, truck.category)}
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">{t("Capacity", "ধারণক্ষমতা")}</p>
                                            <p className="text-sm font-bold text-slate-700">{truck.capacityTon} Ton</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase">{t("Utility", "ইউটিলিটি")}</p>
                                            <p className="text-sm font-bold text-slate-700">{truck.isAvailable ? t("On Duty", "ডিউটিতে") : t("Off Duty", "অফ")}</p>
                                        </div>
                                    </div>

                                    {truck.approvalNote && (
                                        <div className="p-3 mb-6 rounded-xl bg-red-50 border border-red-100 flex gap-2">
                                            <Info className="w-4 h-4 text-red-500 shrink-0" />
                                            <p className="text-[10px] font-bold text-red-600 leading-tight">{truck.approvalNote}</p>
                                        </div>
                                    )}

                                    <Button
                                        onClick={() => setSelectedTruck(truck)}
                                        variant="ghost"
                                        className="w-full h-11 rounded-xl text-primary font-bold text-sm bg-primary/5 hover:bg-primary/10"
                                    >
                                        {t("View Details", "বিস্তারিত দেখুন")}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center h-[400px] flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                            <Truck className="w-10 h-10 text-slate-300" />
                        </div>
                        <h2 className="text-xl font-black text-slate-900 mb-2">{t("No trucks registered yet", "কোনো ট্রাক নিবন্ধন করা নেই")}</h2>
                        <p className="text-slate-500 font-bold text-sm mb-8 max-w-sm">
                            {t("You need to register at least one truck and have it approved to start receiving bookings.", "বুকিং পেতে আপনাকে অন্তত একটি ট্রাক নিবন্ধন করতে হবে এবং তা অনুমোদিত হতে হবে।")}
                        </p>
                        <Button onClick={() => router.push("/driver/trucks/new")} className="h-12 px-8 rounded-xl font-black bg-primary text-white">
                            {t("Register My First Truck", "আমার প্রথম ট্রাক নিবন্ধন করুন")}
                        </Button>
                    </div>
                )}

                {/* Truck Details Modal */}
                {selectedTruck && (
                    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900">{selectedTruck.name || selectedTruck.registrationNo}</h3>
                                        <p className="text-xs text-slate-500 font-bold">{selectedTruck.registrationNo}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedTruck(null)}
                                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Status & Approval Note */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                                    <span className="text-xs font-bold text-slate-500">{t("Approval Status", "অনুমোদনের স্ট্যাটাস")}</span>
                                    <span className={cn("px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border", getStatusColor(selectedTruck.status))}>
                                        {selectedTruck.status}
                                    </span>
                                </div>
                                {selectedTruck.approvalNote && (
                                    <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex gap-2">
                                        <Info className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-red-700">{t("Note from Admin", "এডমিন নোট")}:</p>
                                            <p className="text-xs text-red-600 font-medium leading-relaxed">{selectedTruck.approvalNote}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Specifications Grid */}
                            <div>
                                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">{t("Vehicle Specifications", "যানবাহনের বিবরণ")}</h4>
                                <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 block text-[10px] uppercase mb-1">{t("Category", "ক্যাটাগরি")}</span>
                                        <span className="text-slate-900 font-black">{selectedTruck.category || selectedTruck.truckType || "N/A"}</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 block text-[10px] uppercase mb-1">{t("Capacity", "ধারণক্ষমতা")}</span>
                                        <span className="text-slate-900 font-black">{selectedTruck.capacityTon} Ton</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 block text-[10px] uppercase mb-1">{t("Length", "দৈর্ঘ্য")}</span>
                                        <span className="text-slate-900 font-black">{selectedTruck.lengthFt ? `${selectedTruck.lengthFt} Ft` : "N/A"}</span>
                                    </div>
                                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                                        <span className="text-slate-400 block text-[10px] uppercase mb-1">{t("Duty Status", "ডিউটি স্ট্যাটাস")}</span>
                                        <span className="text-slate-900 font-black">{selectedTruck.isAvailable ? t("On Duty", "ডিউটিতে") : t("Off Duty", "অফ")}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Vehicle Documents */}
                            {(selectedTruck.roadPermitUrl || selectedTruck.taxTokenUrl || selectedTruck.blueBookUrl || selectedTruck.numberPlateImageUrl || selectedTruck.drivingLicenseUrl) && (
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">{t("Uploaded Documents", "আপলোডকৃত কাগজপত্র")}</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                        {selectedTruck.roadPermitUrl && (
                                            <a href={getFileUrl(selectedTruck.roadPermitUrl)} target="_blank" rel="noreferrer" className="p-3 rounded-xl border border-slate-200 hover:border-primary flex items-center justify-between font-bold text-slate-700 hover:text-primary transition-colors">
                                                <span>{t("Road Permit", "রোড পারমিট")}</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                        {selectedTruck.taxTokenUrl && (
                                            <a href={getFileUrl(selectedTruck.taxTokenUrl)} target="_blank" rel="noreferrer" className="p-3 rounded-xl border border-slate-200 hover:border-primary flex items-center justify-between font-bold text-slate-700 hover:text-primary transition-colors">
                                                <span>{t("Tax Token", "ট্যাক্স টোকেন")}</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                        {selectedTruck.blueBookUrl && (
                                            <a href={getFileUrl(selectedTruck.blueBookUrl)} target="_blank" rel="noreferrer" className="p-3 rounded-xl border border-slate-200 hover:border-primary flex items-center justify-between font-bold text-slate-700 hover:text-primary transition-colors">
                                                <span>{t("Blue Book", "ব্লু বুক")}</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                        {selectedTruck.numberPlateImageUrl && (
                                            <a href={getFileUrl(selectedTruck.numberPlateImageUrl)} target="_blank" rel="noreferrer" className="p-3 rounded-xl border border-slate-200 hover:border-primary flex items-center justify-between font-bold text-slate-700 hover:text-primary transition-colors">
                                                <span>{t("Number Plate Image", "নাম্বার প্লেট ছবি")}</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                        {selectedTruck.drivingLicenseUrl && (
                                            <a href={getFileUrl(selectedTruck.drivingLicenseUrl)} target="_blank" rel="noreferrer" className="p-3 rounded-xl border border-slate-200 hover:border-primary flex items-center justify-between font-bold text-slate-700 hover:text-primary transition-colors">
                                                <span>{t("Driving License", "ড্রাইভিং লাইসেন্স")}</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            <Button onClick={() => setSelectedTruck(null)} className="w-full h-11 rounded-xl font-bold bg-slate-900 text-white">
                                {t("Close", "বন্ধ করুন")}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
