"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Users,
    Truck,
    Search,
    Loader2,
    Eye,
    CheckCircle,
    XCircle,
    Clock
} from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

export default function AdminAgentsPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [agents, setAgents] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; name: string }>({ open: false, id: "", name: "" });
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const response = await api.get("/agents/admin/overview");
                setAgents(response.data.data);
            } catch (error) {
                console.error("Failed to fetch agent overview", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAgents();
    }, []);

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        setIsDeleting(true);
        try {
            await api.delete(`/agents/${deleteModal.id}`);
            toast.success("Agent removed successfully");
            setDeleteModal({ open: false, id: "", name: "" });
            // Re-fetch agents instead of reload
            const response = await api.get("/agents/admin/overview");
            setAgents(response.data.data);
        } catch (err) {
            toast.error("Failed to remove agent");
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredAgents = agents.filter(agent =>
        agent.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.user.phone.includes(searchTerm) ||
        (agent.agentId && agent.agentId.includes(searchTerm))
    );

    return (
        <DashboardLayout requiredRole="ADMIN">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">
                        {t("Agent Operations", "এজেন্ট অপারেশন")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Monitor agent performance and truck registrations.", "এজেন্টদের পারফরম্যান্স এবং ট্রাক রেজিস্ট্রেশন মনিটর করুন।")}
                    </p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t("Search by name or ID...", "নাম বা আইডি দিয়ে খুঁজুন...")}
                        className="bg-white h-12 pl-12 pr-6 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary/10 w-72 font-bold text-sm text-slate-900"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 flex justify-center">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : filteredAgents.length === 0 ? (
                    <div className="col-span-full py-20 bg-white rounded-lg border border-slate-100 text-center">
                        <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                        <p className="text-slate-500 font-bold italic">{t("No agents found.", "কোন এজেন্ট পাওয়া যায়নি।")}</p>
                    </div>
                ) : (
                    filteredAgents.map((agent) => (
                        <div key={agent.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                            <div className="p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-black">
                                        {agent.user.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-black text-slate-950 truncate">{agent.user.name}</h3>
                                        <p className="text-xs text-slate-500 font-bold">{agent.agentId || "No ID"}</p>
                                    </div>
                                    <div className={cn(
                                        "px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                                        agent.user.isActive ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                    )}>
                                        {agent.user.isActive ? t("Active", "সক্রিয়") : t("Suspended", "স্থগিত")}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-2 mb-6">
                                    <div className="bg-slate-50 p-3 rounded-lg text-center">
                                        <p className="text-lg font-black text-slate-950">{agent.trucksTotal}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">{t("Total", "মোট")}</p>
                                    </div>
                                    <div className="bg-amber-50 p-3 rounded-lg text-center">
                                        <p className="text-lg font-black text-amber-600">{agent.trucksPending}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">{t("Pending", "অপেক্ষা")}</p>
                                    </div>
                                    <div className="bg-green-50 p-3 rounded-lg text-center">
                                        <p className="text-lg font-black text-green-600">{agent.trucksApproved}</p>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase">{t("Approved", "অনুমোদিত")}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-500">{t("Phone", "ফোন")}:</span>
                                        <span className="text-slate-950">{agent.user.phone}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-500">{t("Department", "বিভাগ")}:</span>
                                        <span className="text-slate-950">{agent.department || "N/A"}</span>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => router.push(`/admin/agents/${agent.id}/trucks`)}
                                        className="flex-1 h-12 rounded-lg gap-2 font-black text-white"
                                    >
                                        <Truck className="w-5 h-5" />
                                        {t("View Trucks", "ট্রাক দেখুন")}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setDeleteModal({ open: true, id: agent.id, name: agent.user.name });
                                        }}
                                        className="h-12 w-12 rounded-lg p-0 border-red-100 text-red-500 hover:bg-red-50"
                                    >
                                        <XCircle className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <DeleteConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: "", name: "" })}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                title={t("Remove Agent", "এজেন্ট সরান")}
                description={`${t("Are you sure you want to remove agent", "আপনি কি নিশ্চিত যে আপনি এজেন্টকে সরাতে চান")} ${deleteModal.name}? ${t("This will suspend their account and they will no longer have access to the agent panel.", "এটি তাদের অ্যাকাউন্ট স্থগিত করবে এবং তারা আর এজেন্ট প্যানেলে প্রবেশ করতে পারবে না।")}`}
            />
        </DashboardLayout>
    );
}
