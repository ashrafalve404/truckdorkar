"use client";

import React from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    MessageSquare,
    Phone,
    Mail,
    LifeBuoy,
    HelpCircle,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DriverSupportPage() {
    const { t } = useLanguage();

    return (
        <DashboardLayout requiredRole="DRIVER">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    {t("Support Center", "সাপোর্ট সেন্টার")}
                </h1>
                <p className="text-slate-700 font-bold">
                    {t("Need help with a trip or your account? We're here for you.", "ট্রিপ বা অ্যাকাউন্ট নিয়ে সাহায্য প্রয়োজন? আমরা আপনার পাশে আছি।")}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm text-center">
                    <div className="w-14 h-14 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                        <Phone className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-slate-950 mb-2">{t("Call Support", "কল সাপোর্ট")}</h3>
                    <p className="text-sm text-slate-700 font-bold mb-6">01826-110036</p>
                    <Button variant="outline" className="w-full rounded-lg border-primary text-primary font-bold">
                        {t("Call Now", "কল করুন")}
                    </Button>
                </div>

                <div className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm text-center">
                    <div className="w-14 h-14 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-slate-950 mb-2">{t("Live Chat", "লাইভ চ্যাট")}</h3>
                    <p className="text-sm text-slate-700 font-bold mb-6">{t("Average response time: 2 mins", "গড় উত্তর দেওয়ার সময়: ২ মিনিট")}</p>
                    <Button className="w-full rounded-lg font-bold gap-2 text-white">
                        {t("Start Chat", "চ্যাট শুরু করুন")}
                        <ArrowRight className="w-4 h-4" />
                    </Button>
                </div>

                <div className="bg-white p-8 rounded-lg border border-slate-100 shadow-sm text-center">
                    <div className="w-14 h-14 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                        <HelpCircle className="w-7 h-7" />
                    </div>
                    <h3 className="font-bold text-slate-950 mb-2">{t("FAQ", "সাধারণ জিজ্ঞাসা")}</h3>
                    <p className="text-sm text-slate-700 font-bold mb-6">{t("Find answers to common questions.", "সাধারণ প্রশ্নের উত্তরগুলো খুঁজে নিন।")}</p>
                    <Button variant="outline" className="w-full rounded-lg font-bold border-slate-200 text-slate-900">
                        {t("View FAQ", "FAQ দেখুন")}
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-100 p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-950 mb-6">{t("Recent Tickets", "সাম্প্রতিক টিকেট")}</h3>
                <div className="text-center py-10">
                    <p className="text-slate-600 font-bold">{t("No active support tickets.", "কোন সক্রিয় সাপোর্ট টিকেট নেই।")}</p>
                </div>
            </div>
        </DashboardLayout>
    );
}
