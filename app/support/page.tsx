"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import { MessageSquare, Send, Loader2, Info, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function SupportPage() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [ticket, setTicket] = useState({
        subject: "",
        description: "",
        priority: "MEDIUM"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/support/tickets", ticket);
            toast.success(t("Support ticket created. We will contact you soon.", "সাপোর্ট টিকেট তৈরি হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।"));
            setTicket({ subject: "", description: "", priority: "MEDIUM" });
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("Failed to create ticket", "টিকেট তৈরি করতে ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout requiredRole="USER">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-black">
                    {t("Help & Support", "সাহায্য এবং সাপোর্ট")}
                </h1>
                <p className="text-gray-500 font-medium font-bold">
                    {t("Submit a ticket for any issues with your orders or account.", "আপনার অর্ডার বা অ্যাকাউন্ট সংক্রান্ত যেকোনো সমস্যার জন্য টিকেট জমা দিন।")}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 md:p-12 rounded-xl border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                            <MessageSquare className="w-6 h-6 text-primary" />
                            {t("Create New Ticket", "নতুন টিকেট তৈরি করুন")}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 ml-1">{t("Subject", "বিষয়")}</label>
                                <input
                                    type="text"
                                    required
                                    value={ticket.subject}
                                    onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                                    placeholder={t("What's the issue about?", "সমস্যাটি কী সংক্রান্ত?")}
                                    className="w-full h-14 bg-slate-50 border-none rounded-2xl px-6 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 ml-1">{t("Priority", "অগ্রাধিকার")}</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {["LOW", "MEDIUM", "HIGH"].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setTicket({ ...ticket, priority: p })}
                                            className={`h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${ticket.priority === p
                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                                                }`}
                                        >
                                            {t(p, p === "LOW" ? "নিচু" : p === "MEDIUM" ? "মাঝারি" : "উচ্চ")}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 ml-1">{t("Description", "বিস্তারিত বর্ণনা")}</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={ticket.description}
                                    onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
                                    placeholder={t("Tell us more about your problem...", "আপনার সমস্যা সম্পর্কে বিস্তারিত বলুন...")}
                                    className="w-full bg-slate-50 border-none rounded-2xl p-6 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 transition-all resize-none"
                                />
                            </div>

                            <Button disabled={loading} className="w-full h-16 rounded-2xl font-black text-lg gap-3 bg-primary text-white shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        {t("Submit Ticket", "টিকেট জমা দিন")}
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-900 p-8 rounded-xl text-white">
                        <div className="flex items-center gap-3 mb-6">
                            <Info className="w-6 h-6 text-primary" />
                            <h3 className="text-lg font-bold">{t("Quick Support", "দ্রুত সাপোর্ট")}</h3>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
                            {t("Standard tickets are reviewed within 24 hours. For urgent booking issues, please call our 24/7 hotline directly.", "সাধারণ টিকেটগুলো ২৪ ঘণ্টার মধ্যে পর্যালোচনা করা হয়। জরুরি বুকিং সমস্যার জন্য সরাসরি আমাদের ২৪/৭ হটলাইনে কল করুন।")}
                        </p>
                        <div className="text-2xl font-black text-primary mb-1">01826-110036</div>
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">{t("Toll Free available", "দেশের যেকোনো প্রান্ত থেকে")}</div>
                    </div>

                    <div className="bg-amber-50 p-8 rounded-xl border border-amber-100">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="w-6 h-6 text-amber-500" />
                            <h3 className="text-lg font-bold text-slate-900">{t("Active Tickets", "সক্রিয় টিকেট")}</h3>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">
                            {t("You have no active support tickets.", "আপনার কোনো সক্রিয় সাপোর্ট টিকেট নেই।")}
                        </p>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
