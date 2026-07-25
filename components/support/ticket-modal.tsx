"use client";

import React, { useEffect, useState } from "react";
import { X, Send, Loader2, MessageSquare, Clock, CheckCircle, AlertCircle, Shield, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

interface TicketReply {
    id: string;
    message: string;
    createdAt: string;
    user: {
        name: string;
        role: string;
        avatar?: string;
    };
}

interface TicketDetail {
    id: string;
    subject: string;
    description: string;
    priority: string;
    status: string;
    createdAt: string;
    user: {
        name: string;
        phone: string;
    };
    replies: TicketReply[];
}

interface TicketModalProps {
    ticketId: string | null;
    onClose: () => void;
    currentRole?: "ADMIN" | "DRIVER" | "AGENT" | "USER";
    onUpdated?: () => void;
}

export function TicketModal({ ticketId, onClose, currentRole, onUpdated }: TicketModalProps) {
    const { t } = useLanguage();
    const [ticket, setTicket] = useState<TicketDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState("");
    const [submittingReply, setSubmittingReply] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    const fetchTicket = async () => {
        if (!ticketId) return;
        try {
            const res = await api.get(`/support/tickets/${ticketId}`);
            setTicket(res.data.data);
        } catch (error) {
            console.error("Failed to fetch ticket", error);
            toast.error(t("Failed to load ticket details", "টিকেট বিস্তারিত লোড করতে ব্যর্থ হয়েছে"));
            onClose();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTicket();
    }, [ticketId]);

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim() || !ticketId) return;

        setSubmittingReply(true);
        try {
            await api.post(`/support/tickets/${ticketId}/replies`, { message: replyText });
            toast.success(t("Reply sent successfully", "উত্তর সফলভাবে পাঠানো হয়েছে"));
            setReplyText("");
            fetchTicket();
            if (onUpdated) onUpdated();
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("Failed to send reply", "উত্তর পাঠাতে ব্যর্থ হয়েছে"));
        } finally {
            setSubmittingReply(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!ticketId) return;
        setUpdatingStatus(true);
        try {
            await api.patch(`/support/tickets/${ticketId}/status`, { status: newStatus });
            toast.success(t("Ticket status updated", "টিকেট স্ট্যাটাস আপডেট করা হয়েছে"));
            fetchTicket();
            if (onUpdated) onUpdated();
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("Failed to update status", "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে"));
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (!ticketId) return null;

    const isAdminOrAgent = currentRole === "ADMIN" || currentRole === "AGENT";

    return (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-black text-slate-400">#{ticketId.slice(-6).toUpperCase()}</span>
                            {ticket && (
                                <span className={cn(
                                    "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider",
                                    ticket.status === "RESOLVED" ? "bg-green-100 text-green-700" :
                                        ticket.status === "IN_PROGRESS" ? "bg-blue-100 text-blue-700" :
                                            ticket.status === "CLOSED" ? "bg-slate-200 text-slate-700" : "bg-amber-100 text-amber-700"
                                )}>
                                    {ticket.status.replace("_", " ")}
                                </span>
                            )}
                        </div>
                        <h2 className="text-lg font-black text-slate-900 line-clamp-1">
                            {ticket?.subject || t("Support Ticket", "সাপোর্ট টিকেট")}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="p-20 flex items-center justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : ticket ? (
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* Ticket Original Problem */}
                        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                            <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-bold">
                                <span className="flex items-center gap-1.5 text-slate-900 font-black">
                                    <UserIcon className="w-4 h-4 text-primary" />
                                    {ticket.user.name} ({ticket.user.phone})
                                </span>
                                <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-sm font-bold text-slate-800 leading-relaxed whitespace-pre-wrap">
                                {ticket.description}
                            </p>
                        </div>

                        {/* Admin / Agent Status Controls */}
                        {isAdminOrAgent && (
                            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                                <span className="text-xs font-black text-slate-900">{t("Change Status:", "স্ট্যাটাস পরিবর্তন করুন:")}</span>
                                <div className="flex items-center gap-2">
                                    {["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"].map((st) => (
                                        <button
                                            key={st}
                                            disabled={updatingStatus || ticket.status === st}
                                            onClick={() => handleStatusChange(st)}
                                            className={cn(
                                                "px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all",
                                                ticket.status === st
                                                    ? "bg-slate-900 text-white shadow-sm"
                                                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                                            )}
                                        >
                                            {st.replace("_", " ")}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Replies Conversation Thread */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                {t("Conversation History", "কথোপকথন হিস্টোরি")} ({ticket.replies.length})
                            </h3>

                            {ticket.replies.length === 0 ? (
                                <p className="text-xs text-slate-400 font-bold italic text-center py-4">
                                    {t("No replies yet. Send a message below to start conversation.", "এখনও কোনো উত্তর নেই। কথা বলা শুরু করতে নিচে মেসেজ লিখুন।")}
                                </p>
                            ) : (
                                ticket.replies.map((reply) => {
                                    const isSupportUser = reply.user.role === "ADMIN" || reply.user.role === "AGENT";
                                    return (
                                        <div
                                            key={reply.id}
                                            className={cn(
                                                "p-4 rounded-2xl max-w-[85%]",
                                                isSupportUser
                                                    ? "bg-primary/10 border border-primary/20 ml-auto text-slate-900"
                                                    : "bg-slate-100 border border-slate-200 mr-auto text-slate-900"
                                            )}
                                        >
                                            <div className="flex items-center justify-between gap-4 mb-1.5">
                                                <span className="text-xs font-black flex items-center gap-1.5">
                                                    {isSupportUser ? (
                                                        <>
                                                            <Shield className="w-3.5 h-3.5 text-primary" />
                                                            <span className="text-primary font-black">{reply.user.name} ({reply.user.role})</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-slate-900 font-bold">{reply.user.name}</span>
                                                    )}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-bold">
                                                    {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-xs font-bold leading-relaxed">{reply.message}</p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                ) : null}

                {/* Footer Reply Form */}
                <form onSubmit={handleSendReply} className="p-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                    <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder={t("Write a reply message...", "আপনার উত্তর লিখুন...")}
                        className="flex-1 bg-white border border-slate-200 rounded-xl px-4 text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <Button
                        type="submit"
                        disabled={submittingReply || !replyText.trim()}
                        className="h-11 px-6 rounded-xl font-bold bg-primary text-white gap-2 shadow-md shadow-primary/20 shrink-0"
                    >
                        {submittingReply ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                            <>
                                <Send className="w-4 h-4" />
                                {t("Reply", "উত্তর")}
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
