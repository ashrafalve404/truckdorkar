"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Settings,
    Bell,
    Lock,
    CreditCard,
    Save,
    Loader2,
    Plus,
    Trash2,
    Truck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function AdminSettingsPage() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        platformName: "TruckDorkar",
        adminEmail: "admin@truckdorkar.com",
        baseFarePerKm: 500,
        truckFares: [] as any[]
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get("/admin/settings");
                const data = response.data.data;
                setSettings({
                    platformName: data.platformName || "TruckDorkar",
                    adminEmail: data.adminEmail || "admin@truckdorkar.com",
                    baseFarePerKm: data.baseFarePerKm || 500,
                    truckFares: Array.isArray(data.truckFares) ? data.truckFares : []
                });
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.patch("/admin/settings", {
                platformName: settings.platformName,
                adminEmail: settings.adminEmail,
                baseFarePerKm: settings.baseFarePerKm,
                truckFares: settings.truckFares,
            });
            toast.success(t("Settings saved successfully", "সেটিংস সফলভাবে সংরক্ষিত হয়েছে"));
        } catch (error: unknown) {
            console.error("Failed to save settings:", (error as Error)?.message || JSON.stringify(error));
            const message = error && typeof error === 'object' && 'response' in error && (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
            const msg = typeof message === 'string' ? message : t("Failed to save settings", "সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে");
            toast.error(msg);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout requiredRole="ADMIN">
                <div className="h-64 w-full flex items-center justify-center">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    {t("System Settings", "সিস্টেম সেটিংস")}
                </h1>
                <p className="text-slate-700 font-bold">
                    {t("Configure platform parameters, pricing, and system notifications.", "প্ল্যাটফর্ম প্যারামিটার, মূল্য নির্ধারণ এবং নোটিফিকেশন কনফিগার করুন।")}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 text-black">
                <div className="lg:col-span-1">
                    <nav className="space-y-1">
                        {[
                            { name: t("General", "সাধারণ"), icon: Settings, active: true },
                            { name: t("Security", "নিরাপত্তা"), icon: Lock, active: false },
                            { name: t("Billing", "বিলিং"), icon: CreditCard, active: false },
                            { name: t("Notifications", "নোটিফিকেশন"), icon: Bell, active: false },
                        ].map((item) => (
                            <button
                                key={item.name}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all",
                                    item.active ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50">
                            <h3 className="text-xl font-bold text-slate-950">{t("General Configuration", "সাধারণ কনফিগারেশন")}</h3>
                        </div>
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-950 ml-1">{t("Platform Name", "প্ল্যাটফর্মের নাম")}</label>
                                    <input
                                        type="text"
                                        value={settings.platformName}
                                        onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                                        className="w-full h-12 bg-slate-50 border-none rounded-lg px-6 text-slate-950 font-bold outline-none ring-primary/10 focus:ring-2"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">{t("Admin Email", "এডমিন ইমেইল")}</label>
                                    <input
                                        type="email"
                                        value={settings.adminEmail}
                                        onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                                        className="w-full h-12 bg-slate-50 border-none rounded-lg px-6 text-slate-950 font-bold outline-none ring-primary/10 focus:ring-2"
                                    />
                                </div>
                            </div>



                            {/* Dynamic Truck Tiers */}
                            <div className="border-t border-slate-100 pt-8 space-y-4">
                                <div>
                                    <h4 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
                                        <Truck className="w-5 h-5 text-primary" />
                                        {t("Truck Fares & Tiers", "ট্রাক ক্যাটাগরি ও ভাড়া নির্ধারণ")}
                                    </h4>
                                    <p className="text-xs text-slate-500 font-bold">
                                        {t("Manage available truck types, capacities, lengths, and minimum fares for 10km.", "ক্যাটাগরি অনুযায়ী ১০কিমি দূরত্বের ন্যূনতম ভাড়া, সাইজ ও ধারণক্ষমতা আপডেট করুন।")}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {settings.truckFares.map((truck, idx) => (
                                        <div key={idx} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center gap-4 transition-all hover:bg-slate-50">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 flex-1">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{t("ID / Code", "আইডি / কোড")}</label>
                                                    <input
                                                        type="text"
                                                        value={truck.id}
                                                        disabled={idx < 6}
                                                        onChange={(e) => {
                                                            const copy = [...settings.truckFares];
                                                            copy[idx].id = e.target.value;
                                                            setSettings({ ...settings, truckFares: copy });
                                                        }}
                                                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-xs font-bold disabled:bg-slate-100/80 disabled:cursor-not-allowed text-slate-800"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{t("Name (EN)", "নাম (ইংরেজি)")}</label>
                                                    <input
                                                        type="text"
                                                        value={truck.nameEn}
                                                        onChange={(e) => {
                                                            const copy = [...settings.truckFares];
                                                            copy[idx].nameEn = e.target.value;
                                                            setSettings({ ...settings, truckFares: copy });
                                                        }}
                                                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{t("Name (BN)", "নাম (বাংলা)")}</label>
                                                    <input
                                                        type="text"
                                                        value={truck.nameBn}
                                                        onChange={(e) => {
                                                            const copy = [...settings.truckFares];
                                                            copy[idx].nameBn = e.target.value;
                                                            setSettings({ ...settings, truckFares: copy });
                                                        }}
                                                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{t("Cap. (Ton)", "ধারণক্ষমতা (টন)")}</label>
                                                        <input
                                                            type="number"
                                                            step="0.1"
                                                            value={truck.capacityTon || 0}
                                                            onChange={(e) => {
                                                                const copy = [...settings.truckFares];
                                                                copy[idx].capacityTon = Number(e.target.value);
                                                                setSettings({ ...settings, truckFares: copy });
                                                            }}
                                                            className="w-full h-10 px-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center text-slate-800"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{t("Len. (Ft)", "দৈর্ঘ্য (ফিট)")}</label>
                                                        <input
                                                            type="number"
                                                            value={truck.lengthFt || 0}
                                                            onChange={(e) => {
                                                                const copy = [...settings.truckFares];
                                                                copy[idx].lengthFt = Number(e.target.value);
                                                                setSettings({ ...settings, truckFares: copy });
                                                            }}
                                                            className="w-full h-10 px-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-center text-slate-800"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{t("Fare 10km (TK)", "ন্যূনতম ভাড়া ১০কিমি")}</label>
                                                    <input
                                                        type="number"
                                                        value={truck.minFare10km}
                                                        onChange={(e) => {
                                                            const copy = [...settings.truckFares];
                                                            copy[idx].minFare10km = Number(e.target.value);
                                                            setSettings({ ...settings, truckFares: copy });
                                                        }}
                                                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-xs font-black text-primary text-center text-slate-800"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-tight">{t("Fare/km (TK)", "ভাড়া প্রতি কিমি")}</label>
                                                    <input
                                                        type="number"
                                                        value={truck.farePerKm || 0}
                                                        onChange={(e) => {
                                                            const copy = [...settings.truckFares];
                                                            copy[idx].farePerKm = Number(e.target.value);
                                                            setSettings({ ...settings, truckFares: copy });
                                                        }}
                                                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-xs font-black text-emerald-600 text-center text-slate-800"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const copy = [...settings.truckFares];
                                                        copy[idx].isActive = !copy[idx].isActive;
                                                        setSettings({ ...settings, truckFares: copy });
                                                    }}
                                                    className={cn(
                                                        "px-2.5 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-tight transition-all",
                                                        truck.isActive
                                                            ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"
                                                            : "bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200"
                                                    )}
                                                >
                                                    {truck.isActive ? t("Active", "সক্রিয়") : t("Inactive", "নিষ্ক্রিয়")}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const copy = settings.truckFares.filter((_, i) => i !== idx);
                                                        setSettings({ ...settings, truckFares: copy });
                                                    }}
                                                    className="p-2 border border-red-200 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newId = "CUSTOM_" + Math.random().toString(36).substring(2, 6).toUpperCase();
                                            const copy = [...settings.truckFares, {
                                                id: newId,
                                                nameEn: "Custom Truck Name",
                                                nameBn: "কাস্টম ট্রাকের নাম",
                                                minFare10km: 1000,
                                                capacityTon: 2.0,
                                                lengthFt: 12,
                                                farePerKm: 50,
                                                isActive: true
                                            }];
                                            setSettings({ ...settings, truckFares: copy });
                                        }}
                                        className="h-10 w-full rounded-xl border border-dashed border-slate-300 flex items-center justify-center font-bold text-xs gap-1.5 text-slate-600 hover:bg-slate-50 transition-colors"
                                    >
                                        <Plus className="w-4 h-4" />
                                        {t("Add Custom Truck Tier", "নতুন কাস্টম ক্যাটাগরি যোগ করুন")}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const defaults = [
                                                { id: "T1_OPEN_7_9FT", nameEn: "1 Ton Open 7/9 Ft Truck", nameBn: "১ টন খোলা ৭/৯ ফিট ট্রাক", minFare10km: 1000, capacityTon: 1.0, lengthFt: 9.0, farePerKm: 50, isActive: true },
                                                { id: "T1_COVER_7_9FT", nameEn: "1 Ton Cover 7/9 Ft Truck", nameBn: "১ টন কাভার ৭/৯ ফিট ট্রাক", minFare10km: 1000, capacityTon: 1.0, lengthFt: 9.0, farePerKm: 50, isActive: true },
                                                { id: "T1_5_OPEN_10_12FT", nameEn: "1.5 Ton Open 10/12 Ft Truck", nameBn: "১.৫ টন খোলা ১০/১২ ফিট ট্রাক", minFare10km: 1500, capacityTon: 1.5, lengthFt: 12.0, farePerKm: 60, isActive: true },
                                                { id: "T1_5_COVER_10_12FT", nameEn: "1.5 Ton Cover 10/12 Ft Truck", nameBn: "১.৫ টন কাভার ১০/১২ ফিট ট্রাক", minFare10km: 1500, capacityTon: 1.5, lengthFt: 12.0, farePerKm: 60, isActive: true },
                                                { id: "T3_OPEN_16_14FT", nameEn: "3 Ton Open 14/16 Ft Truck", nameBn: "৩ টন খোলা ১৪/১৬ ফিট ট্রাক", minFare10km: 3000, capacityTon: 3.0, lengthFt: 16.0, farePerKm: 75, isActive: true },
                                                { id: "T3_COVER_16_14FT", nameEn: "3 Ton Cover 14/16 Ft Truck", nameBn: "৩ টন কাভার ১৪/১৬ ফিট ট্রাক", minFare10km: 3000, capacityTon: 3.0, lengthFt: 16.0, farePerKm: 75, isActive: true }
                                            ];
                                            setSettings({ ...settings, truckFares: defaults });
                                            toast.success(t("Reset local list to defaults. Submit to save.", "ডিফল্ট তালিকা সেট করা হয়েছে। সংরক্ষণ করতে সেটিংস সেভ করুন।"));
                                        }}
                                        className="h-10 w-full rounded-xl border border-dashed border-red-300 mt-2 flex items-center justify-center font-bold text-xs gap-1.5 text-red-650 hover:bg-red-50 transition-colors"
                                    >
                                        {t("Reset to System Defaults", "সিস্টেম ডিফল্টে রিসেট করুন")}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="h-14 rounded-lg px-10 font-black gap-2 shadow-lg shadow-primary/20 text-white"
                                >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {t("Save Settings", "সেটিংস সংরক্ষণ করুন")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
