"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    MessageSquare,
    Phone,
    Mail,
    LifeBuoy,
    HelpCircle,
    ArrowRight,
    Send,
    Loader2,
    Clock,
    CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { TicketModal } from "@/components/support/ticket-modal";

interface Ticket {
    id: string;
    subject: string;
    description: string;
    priority: string;
    status: string;
    createdAt: string;
}

export default function DriverSupportPage() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [driverTickets, setDriverTickets] = useState<Ticket[]>([]);
    const [fetchingTickets, setFetchingTickets] = useState(true);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

    const [ticket, setTicket] = useState({
        subject: "",
        description: "",
        priority: "MEDIUM"
    });

    const fetchDriverTickets = useCallback(async () => {
        try {
            const res = await api.get("/support/tickets");
            setDriverTickets(res.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch driver tickets", error);
        } finally {
            setFetchingTickets(false);
        }
    }, []);

    useEffect(() => {
        fetchDriverTickets();
    }, [fetchDriverTickets]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/support/tickets", ticket);
            toast.success(t("Support ticket created. Support team will reply soon.", "সাপোর্ট টিকেট তৈরি হয়েছে। সাপোর্ট টিম শীঘ্রই উত্তর দেবে।"));
            setTicket({ subject: "", description: "", priority: "MEDIUM" });
            fetchDriverTickets();
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("Failed to create ticket", "টিকেট তৈরি করতে ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout requiredRole="DRIVER">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    {t("Driver Support Center", "ড্রাইভার সাপোর্ট সেন্টার")}
                </h1>
                <p className="text-slate-600 font-bold text-sm">
                    {t("Need help with a trip or your account? We're here for you.", "ট্রিপ বা অ্যাকাউন্ট নিয়ে সাহায্য প্রয়োজন? আমরা আপনার পাশে আছি।")}
                </p>
            </header>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-slate-900 text-base mb-1">{t("Call Hotline", "হটলাইন কল")}</h3>
                    <p className="text-xs text-slate-500 font-bold mb-4">01826-110036</p>
                    <a href="tel:01826-110036">
                        <Button variant="outline" className="w-full rounded-xl border-primary text-primary font-bold hover:bg-primary hover:text-white">
                            {t("Call Now", "কল করুন")}
                        </Button>
                    </a>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-slate-900 text-base mb-1">{t("Ticket Response", "টিকেট রেসপন্স")}</h3>
                    <p className="text-xs text-slate-500 font-bold mb-4">{t("Avg. response time: ~15 mins", "গড় উত্তর দেওয়ার সময়: ~১৫ মিনিট")}</p>
                    <Button variant="outline" onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })} className="w-full rounded-xl border-slate-200 font-bold">
                        {t("Open Ticket", "টিকেট খুলুন")}
                    </Button>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm text-center">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <HelpCircle className="w-6 h-6" />
                    </div>
                    <h3 className="font-black text-slate-900 text-base mb-1">{t("FAQ & Guides", "সাধারণ প্রশ্ন")}</h3>
                    <p className="text-xs text-slate-500 font-bold mb-4">{t("Rules & payment policies", "নিয়ম ও পেমেন্ট পলিসি")}</p>
                    <a href="/faq">
                        <Button variant="outline" className="w-full rounded-xl border-slate-200 font-bold">
                            {t("View Guides", "গাইড দেখুন")}
                        </Button>
                    </a>
                </div>
            </div>

            {/* Create Ticket & Active List Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Submit Ticket Form */}
                <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                    <h2 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-primary" />
                        {t("Submit Driver Support Ticket", "ড্রাইভার সাপোর্ট টিকেট সাবমিট করুন")}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-700">{t("Subject", "বিষয়")}</label>
                            <input
                                type="text"
                                required
                                value={ticket.subject}
                                onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                                placeholder={t("e.g., Payment issue or trip dispute...", "যেমন: পেমেন্ট বা ট্রিপ সম্পর্কিত সমস্যা...")}
                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-700">{t("Priority", "অগ্রাধিকার")}</label>
                            <div className="grid grid-cols-3 gap-3">
                                {["LOW", "MEDIUM", "HIGH"].map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setTicket({ ...ticket, priority: p })}
                                        className={cn(
                                            "h-10 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                                            ticket.priority === p
                                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                                : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                                        )}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-slate-700">{t("Description", "বিস্তারিত বর্ণনা")}</label>
                            <textarea
                                required
                                rows={4}
                                value={ticket.description}
                                onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
                                placeholder={t("Describe your issue clearly...", "আপনার সমস্যাটি বিস্তারিত লিখুন...")}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                            />
                        </div>

                        <Button disabled={loading} className="w-full h-12 rounded-xl font-black bg-primary text-white shadow-md shadow-primary/20 gap-2">
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>
                                    <Send className="w-4 h-4" />
                                    {t("Submit Ticket", "টিকেট পাঠ জানান")}
                                </>
                            )}
                        </Button>
                    </form>
                </div>

                {/* Driver Active Tickets */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-base font-black text-slate-900 mb-4">{t("My Support Tickets", "আমার টিকেটসমূহ")}</h3>

                    {fetchingTickets ? (
                        <div className="py-12 flex justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                    ) : driverTickets.length === 0 ? (
                        <p className="text-xs text-slate-500 font-bold text-center py-8">
                            {t("No active support tickets.", "কোন সক্রিয় সাপোর্ট টিকেট নেই।")}
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {driverTickets.map((tck) => (
                                <div
                                    key={tck.id}
                                    onClick={() => setSelectedTicketId(tck.id)}
                                    className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer group"
                                >
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <span className="text-xs font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-1">
                                            {tck.subject}
                                        </span>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0",
                                            tck.status === "RESOLVED" ? "bg-green-100 text-green-700" :
                                                tck.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"
                                        )}>
                                            {tck.status}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-bold flex items-center justify-between mt-2">
                                        <span>{new Date(tck.createdAt).toLocaleDateString()}</span>
                                        <span className="text-primary hover:underline">{t("View Conversation", "কথোপকথন")}</span>
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Conversation Dialog */}
            <TicketModal
                ticketId={selectedTicketId}
                onClose={() => setSelectedTicketId(null)}
                currentRole="DRIVER"
                onUpdated={fetchDriverTickets}
            />
        </DashboardLayout>
    );
}
