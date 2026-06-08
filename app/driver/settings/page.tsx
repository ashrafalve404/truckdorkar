"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    User,
    Settings,
    Lock,
    Bell,
    Truck,
    Save,
    Camera
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/use-auth";

export default function DriverSettingsPage() {
    const { t } = useLanguage();
    const { user } = useAuth();

    return (
        <DashboardLayout requiredRole="DRIVER">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    {t("Account Settings", "অ্যাকাউন্ট সেটিংস")}
                </h1>
                <p className="text-slate-700 font-bold">
                    {t("Manage your profile, vehicle information, and preferences.", "আপনার প্রোফাইল, যানবাহনের তথ্য এবং পছন্দগুলো পরিচালনা করুন।")}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                {/* Tabs */}
                <div className="lg:col-span-1">
                    <nav className="flex flex-col gap-2">
                        {[
                            { name: t("Profile", "প্রোফাইল"), icon: User, active: true },
                            { name: t("My Truck", "আমার ট্রাক"), icon: Truck, active: false },
                            { name: t("Safety & Privacy", "সুরক্ষা"), icon: Lock, active: false },
                            { name: t("Notifications", "নোটিফিকেশন"), icon: Bell, active: false },
                        ].map((item) => (
                            <button
                                key={item.name}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${item.active ? "bg-primary text-white shadow-lg shadow-primary/10" : "text-slate-700 hover:bg-slate-50"
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {item.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Form Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center gap-6">
                            <div className="w-20 h-20 rounded-2xl bg-slate-100 relative group overflow-hidden">
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Camera className="w-6 h-6 text-white" />
                                </div>
                                <img src="/placeholder-avatar.png" alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-950">{user?.name || "Driver Name"}</h3>
                                <p className="text-sm text-slate-700 font-bold">{user?.phone || "01XXX-XXXXXX"}</p>
                            </div>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-950 ml-1">{t("Full Name", "পুরো নাম")}</label>
                                    <input type="text" defaultValue={user?.name} className="w-full h-12 bg-slate-50 border-none rounded-lg px-6 text-slate-950 font-bold outline-none ring-primary/10 focus:ring-2" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-950 ml-1">{t("Email Address", "ইমেইল")}</label>
                                    <input type="email" defaultValue={user?.email} className="w-full h-12 bg-slate-50 border-none rounded-lg px-6 text-slate-950 font-bold outline-none ring-primary/10 focus:ring-2" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="font-bold text-slate-950 border-b pb-2 mb-4">{t("Verified Documents", "ভেরিফাইড ডকুমেন্টস")}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-4 rounded-lg bg-green-50 border border-green-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-green-500 text-white flex items-center justify-center">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-green-700 uppercase tracking-widest">{t("NID CARD", "এনআইডি")}</p>
                                                <p className="text-sm font-bold text-green-900">{t("Verified", "ভেরিফাইড")}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-green-50 border border-green-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-green-500 text-white flex items-center justify-center">
                                                <Lock className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-green-700 uppercase tracking-widest">{t("LICENSE", "লাইসেন্স")}</p>
                                                <p className="text-sm font-bold text-green-900">{t("Verified", "ভেরিফাইড")}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t">
                                <Button className="h-14 rounded-lg px-10 font-black gap-2 shadow-lg shadow-primary/20 text-white">
                                    <Save className="w-5 h-5" />
                                    {t("Update Profile", "প্রোফাইল আপডেট করুন")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
