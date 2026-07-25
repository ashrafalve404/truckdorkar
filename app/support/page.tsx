"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import { MessageSquare, Send, Loader2, Info, AlertCircle, Clock, CheckCircle } from "lucide-react";
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

export default function SupportPage() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [userTickets, setUserTickets] = useState<Ticket[]>([]);
    const [fetchingTickets, setFetchingTickets] = useState(true);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

    const [ticket, setTicket] = useState({
        subject: "",
        description: "",
        priority: "MEDIUM"
    });

    const fetchUserTickets = useCallback(async () => {
        try {
            const res = await api.get("/support/tickets");
            setUserTickets(res.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch user tickets", error);
        } finally {
            setFetchingTickets(false);
        }
    }, []);

    useEffect(() => {
        fetchUserTickets();
    }, [fetchUserTickets]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/support/tickets", ticket);
            toast.success(t("Support ticket created. We will contact you soon.", "সাপোর্ট টিকেট তৈরি হয়েছে। আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।"));
            setTicket({ subject: "", description: "", priority: "MEDIUM" });
            fetchUserTickets();
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
                <p className="text-slate-600 font-bold text-sm">
                    {t("Submit a ticket for any issues with your orders or account.", "আপনার অর্ডার বা অ্যাকাউন্ট সংক্রান্ত যেকোনো সমস্যার জন্য টিকেট জমা দিন।")}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 md:p-12 rounded-2xl border border-slate-100 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                            <MessageSquare className="w-6 h-6 text-primary" />
                            {t("Create New Ticket", "নতুন টিকেট তৈরি করুন")}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">{t("Subject", "বিষয়")}</label>
                                <input
                                    type="text"
                                    required
                                    value={ticket.subject}
                                    onChange={(e) => setTicket({ ...ticket, subject: e.target.value })}
                                    placeholder={t("What's the issue about?", "সমস্যাটি কী সংক্রান্ত?")}
                                    className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">{t("Priority", "অগ্রাধিকার")}</label>
                                <div className="grid grid-cols-3 gap-4">
                                    {["LOW", "MEDIUM", "HIGH"].map((p) => (
                                        <button
                                            key={p}
                                            type="button"
                                            onClick={() => setTicket({ ...ticket, priority: p })}
                                            className={`h-12 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${ticket.priority === p
                                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                                                }`}
                                        >
                                            {t(p, p === "LOW" ? "নিচু" : p === "MEDIUM" ? "মাঝারি" : "উচ্চ")}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">{t("Description", "বিস্তারিত বর্ণনা")}</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={ticket.description}
                                    onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
                                    placeholder={t("Tell us more about your problem...", "আপনার সমস্যা সম্পর্কে বিস্তারিত বলুন...")}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                />
                            </div>

                            <Button disabled={loading} className="w-full h-14 rounded-2xl font-black text-base gap-3 bg-primary text-white shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
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
                    <div className="bg-slate-900 p-8 rounded-2xl text-white">
                        <div className="flex items-center gap-3 mb-4">
                            <Info className="w-6 h-6 text-primary" />
                            <h3 className="text-lg font-bold">{t("Quick Support", "দ্রুত সাপোর্ট")}</h3>
                        </div>
                        <p className="text-slate-400 text-xs leading-relaxed mb-6 font-bold">
                            {t("Standard tickets are reviewed within 24 hours. For urgent booking issues, please call our 24/7 hotline directly.", "সাধারণ টিকেটগুলো ২৪ ঘণ্টার মধ্যে পর্যালোচনা করা হয়। জরুরি বুকিং সমস্যার জন্য সরাসরি আমাদের ২৪/৭ হটলাইনে কল করুন।")}
                        </p>
                        <div className="text-2xl font-black text-primary mb-1">01826-110036</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("24/7 Hotline", "২৪/৭ হটলাইন")}</div>
                    </div>

                    {/* Live Active Tickets List */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <AlertCircle className="w-5 h-5 text-primary" />
                            <h3 className="text-base font-black text-slate-900">{t("My Support Tickets", "আমার টিকেটসমূহ")}</h3>
                        </div>

                        {fetchingTickets ? (
                            <div className="py-8 flex justify-center">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        ) : userTickets.length === 0 ? (
                            <p className="text-xs text-slate-500 font-bold text-center py-6">
                                {t("You have no active support tickets.", "আপনার কোনো সক্রিয় সাপোর্ট টিকেট নেই।")}
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {userTickets.map((tck) => (
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
                                        <p className="text-[10px] text-slate-500 font-bold flex items-center gap-2">
                                            <span>{new Date(tck.createdAt).toLocaleDateString()}</span>
                                            <span>•</span>
                                            <span className="text-primary hover:underline">{t("Click to view & reply", "কথোপকথন দেখুন")}</span>
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Conversation Dialog */}
            <TicketModal
                ticketId={selectedTicketId}
                onClose={() => setSelectedTicketId(null)}
                currentRole="USER"
                onUpdated={fetchUserTickets}
            />
        </DashboardLayout>
    );
}
