"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Settings,
    Bell,
    Lock,
    CreditCard,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
    const { t } = useLanguage();

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

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
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
                                    <input type="text" defaultValue="TruckDorkar" className="w-full h-12 bg-slate-50 border-none rounded-lg px-6 text-slate-950 font-bold outline-none ring-primary/10 focus:ring-2" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">{t("Admin Email", "এডমিন ইমেইল")}</label>
                                    <input type="email" defaultValue="admin@truckdorkar.com" className="w-full h-12 bg-slate-50 border-none rounded-lg px-6 text-slate-950 font-bold outline-none ring-primary/10 focus:ring-2" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">{t("Base Fare (Per KM)", "বেস ভাড়া (প্রতি কিমি)")}</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-slate-950">৳</span>
                                    <input type="number" defaultValue="500" className="w-full h-12 bg-slate-50 border-none rounded-lg pl-12 pr-6 text-slate-950 font-bold outline-none ring-primary/10 focus:ring-2" />
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button className="h-14 rounded-lg px-10 font-black gap-2 shadow-lg shadow-primary/20">
                                    <Save className="w-5 h-5" />
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
