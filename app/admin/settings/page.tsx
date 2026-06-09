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
    Loader2
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
        baseFarePerKm: 500
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await api.get("/admin/settings");
                setSettings(response.data.data);
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
            });
            toast.success(t("Settings saved successfully", "সেটিংস সফলভাবে সংরক্ষিত হয়েছে"));
        } catch (error: any) {
            console.error("Failed to save settings:", error?.response?.data || error?.message);
            const msg = error?.response?.data?.message || t("Failed to save settings", "সেটিংস সংরক্ষণ করতে ব্যর্থ হয়েছে");
            toast.error(typeof msg === "string" ? msg : JSON.stringify(msg));
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

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">{t("Base Fare (Per KM)", "বেস ভাড়া (প্রতি কিমি)")}</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-slate-950">৳</span>
                                    <input
                                        type="number"
                                        value={settings.baseFarePerKm}
                                        onChange={(e) => setSettings({ ...settings, baseFarePerKm: Number(e.target.value) })}
                                        className="w-full h-12 bg-slate-50 border-none rounded-lg pl-12 pr-6 text-slate-950 font-bold outline-none ring-primary/10 focus:ring-2"
                                    />
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
