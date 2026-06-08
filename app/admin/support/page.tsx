"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    MessageSquare,
    AlertCircle,
    CheckCircle,
    Clock,
    Search,
    Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminSupportPage() {
    const { t } = useLanguage();

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Support Center", "সাপোর্ট সেন্টার")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Manage customer and driver queries, disputes and tickets.", "কাস্টমার এবং ড্রাইভারদের জিজ্ঞাসা এবং অভিযোগ পরিচালনা করুন।")}
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                    { label: t("Open Tickets", "খোলা টিকেট"), value: "12", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
                    { label: t("Resolved", "সমাধানকৃত"), value: "148", icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" },
                    { label: t("Urgent", "জরুরি"), value: "3", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-950 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-950">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-lg border border-slate-100 p-20 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-8 h-8 text-slate-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 mb-2">{t("No Support Tickets", "কোন সাপোর্ট টিকেট নেই")}</h3>
                <p className="text-slate-700 font-bold max-w-sm mx-auto mb-8">
                    {t("All clear! Currently there are no pending customer or driver tickets that need your attention.", "সব ঠিক আছে! বর্তমানে কোন কাস্টমার বা ড্রাইভার টিকেট আপনার অপেক্ষায় নেই।")}
                </p>
                <Button variant="outline" className="rounded-lg font-bold">
                    {t("View Archive", "আর্কাইভ দেখুন")}
                </Button>
            </div>
        </DashboardLayout>
    );
}
