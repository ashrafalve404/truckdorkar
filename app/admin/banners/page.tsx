"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Image as ImageIcon,
    Plus,
    Trash2,
    Edit2,
    Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminBannersPage() {
    const { t } = useLanguage();

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Promotional Banners", "প্রোমোশনাল ব্যানার")}
                    </h1>
                    <p className="text-slate-500 font-bold">
                        {t("Manage the images and promotions displayed on the homepage slider.", "হোমপেজ স্লাইডারে প্রদর্শিত ছবি এবং অফারগুলো পরিচালনা করুন।")}
                    </p>
                </div>
                <Button className="h-12 rounded-lg gap-2 font-black px-8 bg-primary text-white shadow-lg shadow-primary/20">
                    <Plus className="w-5 h-5" />
                    {t("Add New Banner", "নতুন ব্যানার যোগ করুন")}
                </Button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2].map((i) => (
                    <div key={i} className="bg-white rounded-lg border border-slate-100 shadow-sm overflow-hidden group">
                        <div className="aspect-[21/9] bg-slate-100 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold">
                                {t("Banner Preview", "ব্যানার প্রিভিউ")} {i}
                            </div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                <Button variant="secondary" size="icon" className="rounded-full">
                                    <Eye className="w-5 h-5" />
                                </Button>
                                <Button variant="secondary" size="icon" className="rounded-full">
                                    <Edit2 className="w-5 h-5" />
                                </Button>
                                <Button variant="destructive" size="icon" className="rounded-full">
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="p-6 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-slate-900">{t("Summer Discount Offer", "সামার ডিসকাউন্ট অফার")}</h3>
                                <p className="text-xs text-slate-400 font-medium">{t("Active since: June 01, 2026", "চালু হয়েছে: জুন ০১, ২০২৬")}</p>
                            </div>
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                        </div>
                    </div>
                ))}
            </div>
        </DashboardLayout>
    );
}
