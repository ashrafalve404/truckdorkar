"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    MessageSquare,
    Search,
    Loader2,
    CheckCircle,
    Clock,
    AlertCircle,
    User
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmployeeSupportPage() {
    const { t } = useLanguage();

    return (
        <DashboardLayout requiredRole="EMPLOYEE">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Support Tickets", "সাপোর্ট টিকেট")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Handle customer inquiries and resolve issues.", "কাস্টমারদের জিজ্ঞাসা সমাধান করুন এবং সাহায্য করুন।")}
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-950" />
                        <input
                            type="text"
                            placeholder={t("Search tickets...", "টিকেট খুঁজুন...")}
                            className="bg-white h-12 pl-12 pr-6 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/10 outline-none w-72 font-black text-sm text-slate-950 placeholder:text-slate-500"
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                {[
                    { label: t("My Assigned", "আমার দায়িত্ব"), value: "4", icon: User, color: "text-blue-500", bg: "bg-blue-50" },
                    { label: t("Pending", "অপেক্ষমান"), value: "28", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
                    { label: t("Urgent Issues", "জরুরি অভিযোগ"), value: "7", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
                ].map((item, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-lg ${item.bg} ${item.color} flex items-center justify-center`}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-slate-950 text-[10px] font-black uppercase tracking-widest">{item.label}</p>
                            <p className="text-2xl font-black text-slate-950">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-lg border border-slate-100 p-20 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
                    <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-950 mb-2">{t("No Active Tickets", "কোন সক্রিয় টিকেট নেই")}</h3>
                <p className="text-slate-700 font-bold max-w-sm mx-auto mb-8">
                    {t("You have responded to all assigned tickets. Good job!", "আপনার জন্য নির্ধারিত সকল টিকেটের উত্তর দেওয়া হয়েছে। অভিনন্দন!")}
                </p>
                <Button className="rounded-lg font-black h-12 px-8 text-white">
                    {t("Browse Queue", "কিউ দেখুন")}
                </Button>
            </div>
        </DashboardLayout>
    );
}
