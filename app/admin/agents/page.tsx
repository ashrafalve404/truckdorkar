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
    Clock,
    UserX,
    UserCheck,
    Trash2,
    Shield,
    X,
    CheckCircle2,
    Plus,
    UserPlus
} from "lucide-react";
import api, { getFileUrl } from "@/lib/api";
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
    const [statusModal, setStatusModal] = useState<{ open: boolean; id: string; name: string; currentActive: boolean }>({ open: false, id: "", name: "", currentActive: true });
    const [viewNidModal, setViewNidModal] = useState<{ open: boolean; agent: any | null }>({ open: false, agent: null });
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerModal, setRegisterModal] = useState(false);
    const [registerFormData, setRegisterFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        designation: "Staff",
        department: "Truck Dorkar Limited",
        nidNumber: "",
        dateOfBirth: ""
    });

    const fetchAgents = async () => {
        setLoading(true);
        try {
            const response = await api.get("/agents/admin/overview");
            setAgents(response.data.data);
        } catch (error) {
            console.error("Failed to fetch agent overview", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        setIsDeleting(true);
        try {
            await api.delete(`/admin/agents/${deleteModal.id}`);
            toast.success(t("Agent permanently deleted", "এজেন্ট চিরতরে মুছে ফেলা হয়েছে"));
            setDeleteModal({ open: false, id: "", name: "" });
            fetchAgents();
        } catch (err) {
            toast.error(t("Failed to delete agent", "এজেন্ট মুছতে ব্যর্থ হয়েছে"));
        } finally {
            setIsDeleting(false);
        }
    };

    const toggleStatus = async () => {
        if (!statusModal.id) return;
        setIsUpdating(true);
        try {
            await api.patch(`/admin/users/${statusModal.id}/status`, { isActive: !statusModal.currentActive });
            toast.success(t("Agent status updated", "এজেন্ট স্ট্যাটাস আপডেট করা হয়েছে"));
            setStatusModal({ open: false, id: "", name: "", currentActive: true });
            fetchAgents();
        } catch (err) {
            toast.error(t("Failed to update status", "স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে"));
        } finally {
            setIsUpdating(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsRegistering(true);
        try {
            await api.post("/agents/admin/register", registerFormData);
            toast.success(t("Agent registered successfully", "এজেন্ট সফলভাবে নিবন্ধিত হয়েছে"));
            setRegisterModal(false);
            setRegisterFormData({
                name: "",
                phone: "",
                email: "",
                password: "",
                designation: "Staff",
                department: "Truck Dorkar Limited",
                nidNumber: "",
                dateOfBirth: ""
            });
            fetchAgents();
        } catch (err: any) {
            toast.error(err.response?.data?.message || t("Registration failed", "নিবন্ধন ব্যর্থ হয়েছে"));
        } finally {
            setIsRegistering(false);
        }
    };

    const handleVerifyAgent = async (agentId: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            await api.patch(`/agents/admin/${agentId}/verify`, { status });
            toast.success(status === 'APPROVED' ? t("Agent verified", "এজেন্ট ভেরিফাইড") : t("Agent rejected", "এজেন্ট রিজেক্টেড"));
            setViewNidModal({ open: false, agent: null });
            fetchAgents();
        } catch (error) {
            toast.error(t("Failed to update verification status", "ভেরিফিকেশন স্ট্যাটাস আপডেট করতে ব্যর্থ হয়েছে"));
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
                        {t("Agent Management", "এজেন্ট ম্যানেজমেন্ট")}
                    </h1>
                    <p className="text-slate-700 font-bold">
                        {t("Monitor agent performance and truck registrations.", "এজেন্টদের পারফরম্যান্স এবং ট্রাক রেজিস্ট্রেশন মনিটর করুন।")}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button onClick={() => setRegisterModal(true)} className="h-12 px-6 rounded-xl font-black gap-2 text-white">
                        <Plus className="w-5 h-5" />
                        {t("Register New Agent", "নতুন এজেন্ট নিবন্ধন")}
                    </Button>
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
                                        {(agent.user.name === "Operations Staff" ? "Agent" : agent.user.name).charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-black text-slate-950 truncate">
                                            {agent.user.name === "Operations Staff" ? "Agent" : agent.user.name}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-slate-500 font-bold">{agent.agentId || "No ID"}</p>
                                            {agent.verificationStatus === 'APPROVED' && (
                                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                            )}
                                        </div>
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
                                        <span className="text-slate-500">{t("Verification", "ভেরিফিকেশন")}:</span>
                                        <span className={cn(
                                            "font-black",
                                            agent.verificationStatus === 'APPROVED' ? "text-green-500" :
                                                agent.verificationStatus === 'REJECTED' ? "text-red-500" : "text-amber-500"
                                        )}>
                                            {agent.verificationStatus || "NOT SUBMITTED"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-slate-500">{t("NID Number", "এনআইডি নম্বর")}:</span>
                                        <span className="text-slate-950">{agent.nidNumber || "N/A"}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        onClick={() => router.push(`/admin/agents/${agent.id}/trucks`)}
                                        className="flex-1 h-10 rounded-lg gap-2 font-black text-white text-xs"
                                    >
                                        <Truck className="w-4 h-4" />
                                        {t("Trucks", "ট্রাক")}
                                    </Button>
                                    {(agent.nidFrontUrl || agent.nidBackUrl) && (
                                        <Button
                                            variant="outline"
                                            onClick={() => setViewNidModal({ open: true, agent })}
                                            className="flex-1 h-10 rounded-lg gap-2 font-black text-xs border-primary/20 text-primary"
                                        >
                                            <Shield className="w-4 h-4" />
                                            {t("ID Card", "পরিচয়পত্র")}
                                        </Button>
                                    )}
                                    <div className="flex gap-2 w-full">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                if (agent.user.isActive) {
                                                    setStatusModal({ open: true, id: agent.user.id, name: agent.user.name === "Operations Staff" ? "Agent" : agent.user.name, currentActive: true });
                                                } else {
                                                    api.patch(`/admin/users/${agent.user.id}/status`, { isActive: true }).then(() => {
                                                        toast.success("Agent activated");
                                                        fetchAgents();
                                                    });
                                                }
                                            }}
                                            className={cn("h-10 flex-1 rounded-lg gap-2 font-black text-xs", agent.user.isActive ? "border-amber-100 text-amber-500 hover:bg-amber-50" : "border-green-100 text-green-500 hover:bg-green-50")}
                                        >
                                            {agent.user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                                            {agent.user.isActive ? t("Suspend", "স্থগিত") : t("Activate", "সক্রিয়")}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setDeleteModal({ open: true, id: agent.id, name: agent.user.name === "Operations Staff" ? "Agent" : agent.user.name });
                                            }}
                                            className="h-10 w-10 rounded-lg p-0 border-red-100 text-red-500 hover:bg-red-50 shrink-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* NID Verification Modal */}
            {viewNidModal.open && viewNidModal.agent && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-black text-slate-950">Verify Agent: {viewNidModal.agent.user.name}</h3>
                                <p className="text-sm font-bold text-slate-500">NID: {viewNidModal.agent.nidNumber}</p>
                            </div>
                            <button onClick={() => setViewNidModal({ open: false, agent: null })} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t("Front Side", "সামনের দিক")}</p>
                                    <div className="aspect-[1.6/1] rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden">
                                        <img src={getFileUrl(viewNidModal.agent.nidFrontUrl)} alt="Front" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{t("Back Side", "পেছনের দিক")}</p>
                                    <div className="aspect-[1.6/1] rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden">
                                        <img src={getFileUrl(viewNidModal.agent.nidBackUrl)} alt="Back" className="w-full h-full object-contain" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-4">
                            <Button
                                onClick={() => handleVerifyAgent(viewNidModal.agent.id, 'REJECTED')}
                                variant="outline"
                                className="flex-1 h-14 rounded-xl font-black text-red-500 border-red-200 hover:bg-red-50 gap-2"
                            >
                                <XCircle className="w-5 h-5" />
                                {t("Reject Identity", "প্রত্যাখ্যান করুন")}
                            </Button>
                            <Button
                                onClick={() => handleVerifyAgent(viewNidModal.agent.id, 'APPROVED')}
                                className="flex-1 h-14 rounded-xl font-black text-white gap-2"
                            >
                                <CheckCircle className="w-5 h-5" />
                                {t("Approve & Verify", "অনুমোদন ও যাচাই")}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <DeleteConfirmModal
                isOpen={statusModal.open}
                onClose={() => setStatusModal({ open: false, id: "", name: "", currentActive: true })}
                onConfirm={toggleStatus}
                isLoading={isUpdating}
                title={t("Suspend Agent", "এজেন্ট স্থগিত করুন")}
                description={`${t("Are you sure you want to suspend", "আপনি কি নিশ্চিত যে আপনি স্থগিত করতে চান")} ${statusModal.name}? ${t("This will revoke their access to the agent panel until reactivated.", "এটি পুনরায় সক্রিয় না করা পর্যন্ত এজেন্ট প্যানেলে তাদের অ্যাক্সেস বাতিল করবে।")}`}
            />

            <DeleteConfirmModal
                isOpen={deleteModal.open}
                onClose={() => setDeleteModal({ open: false, id: "", name: "" })}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                title={t("Permanently Delete Agent", "এজেন্ট চিরতরে মুছুন")}
                description={`${t("Are you sure you want to permanently delete", "আপনি কি নিশ্চিত যে আপনি চিরতরে মুছে ফেলতে চান")} ${deleteModal.name}? ${t("This action is irreversible and will remove all their data from the system.", "এই ক্রিয়াটি অপরিবর্তনীয় এবং সিস্টেম থেকে তাদের সমস্ত ডেটা সরিয়ে দেবে।")}`}
            />

            {/* Register Agent Modal */}
            {registerModal && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md transition-all animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-white/20 animate-in zoom-in-95 duration-300">
                        <form onSubmit={handleRegister} className="flex flex-col max-h-[90vh]">
                            {/* Modal Header */}
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-white to-slate-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                                        <UserPlus className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-slate-950 tracking-tight">{t("Register New Agent", "এজেন্ট নিবন্ধন")}</h3>
                                        <p className="text-sm font-bold text-slate-500">{t("Onboard a new verified representative", "নতুন ভেরিফাইড প্রতিনিধি যোগ করুন")}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setRegisterModal(false)}
                                    className="w-10 h-10 rounded-full bg-slate-100/50 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all duration-200 group"
                                >
                                    <X className="w-5 h-5 text-slate-400 group-hover:rotate-90 transition-transform" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
                                {/* Section 1: Personal Info */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-500 flex items-center justify-center">
                                            <Shield className="w-4 h-4" />
                                        </div>
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t("Personal Information", "ব্যক্তিগত তথ্য")}</h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest ml-1">{t("Full Name", "পুরো নাম")}</label>
                                            <input
                                                type="text"
                                                required
                                                value={registerFormData.name}
                                                onChange={(e) => setRegisterFormData({ ...registerFormData, name: e.target.value })}
                                                placeholder={t("John Doe", "নাম লিখুন")}
                                                className="w-full h-14 bg-slate-50/50 border border-slate-200 rounded-2xl px-5 font-black text-slate-950 placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest ml-1">{t("Phone Number", "ফোন নম্বর")}</label>
                                            <input
                                                type="tel"
                                                required
                                                value={registerFormData.phone}
                                                onChange={(e) => setRegisterFormData({ ...registerFormData, phone: e.target.value })}
                                                placeholder="017XX-XXXXXX"
                                                className="w-full h-14 bg-slate-50/50 border border-slate-200 rounded-2xl px-5 font-black text-slate-950 placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest ml-1">{t("NID Number", "এনআইডি নম্বর")}</label>
                                            <input
                                                type="text"
                                                required
                                                value={registerFormData.nidNumber}
                                                onChange={(e) => setRegisterFormData({ ...registerFormData, nidNumber: e.target.value })}
                                                className="w-full h-14 bg-slate-50/50 border border-slate-200 rounded-2xl px-5 font-black text-slate-950 placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest ml-1">{t("Date of Birth", "জন্ম তারিখ")}</label>
                                            <input
                                                type="date"
                                                required
                                                value={registerFormData.dateOfBirth}
                                                onChange={(e) => setRegisterFormData({ ...registerFormData, dateOfBirth: e.target.value })}
                                                className="w-full h-14 bg-slate-50/50 border border-slate-200 rounded-2xl px-5 font-black text-slate-950 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Account Security */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-500 flex items-center justify-center">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t("Account Security", "অ্যাকাউন্ট নিরাপত্তা")}</h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest ml-1">{t("Email (Optional)", "ইমেইল")}</label>
                                            <input
                                                type="email"
                                                value={registerFormData.email}
                                                onChange={(e) => setRegisterFormData({ ...registerFormData, email: e.target.value })}
                                                placeholder="agent@truckdorkar.com"
                                                className="w-full h-14 bg-slate-50/50 border border-slate-200 rounded-2xl px-5 font-black text-slate-950 placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest ml-1">{t("Login Password", "পাসওয়ার্ড")}</label>
                                            <input
                                                type="password"
                                                required
                                                value={registerFormData.password}
                                                onChange={(e) => setRegisterFormData({ ...registerFormData, password: e.target.value })}
                                                placeholder="••••••••"
                                                className="w-full h-14 bg-slate-50/50 border border-slate-200 rounded-2xl px-5 font-black text-slate-950 placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Professional Info */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                                        <div className="w-6 h-6 rounded-md bg-green-50 text-green-500 flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t("Professional Details", "পেশাদার তথ্য")}</h4>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest ml-1">{t("Designation", "পদবী")}</label>
                                            <input
                                                type="text"
                                                value={registerFormData.designation}
                                                onChange={(e) => setRegisterFormData({ ...registerFormData, designation: e.target.value })}
                                                className="w-full h-14 bg-slate-50/50 border border-slate-200 rounded-2xl px-5 font-black text-slate-950 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest ml-1">{t("Department", "বিভাগ")}</label>
                                            <input
                                                type="text"
                                                value={registerFormData.department}
                                                onChange={(e) => setRegisterFormData({ ...registerFormData, department: e.target.value })}
                                                className="w-full h-14 bg-slate-50/50 border border-slate-200 rounded-2xl px-5 font-black text-slate-950 outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Security Note */}
                                <div className="p-5 bg-amber-50/50 border border-amber-100/50 rounded-[1.5rem] flex gap-4 items-start">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                                        <Shield className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <p className="text-xs text-amber-900 font-bold leading-relaxed">
                                        {t("By registering this agent, they will gain immediate administrative access to truck registrations and booking monitoring. Please ensure all details are verified.", "এই এজেন্টকে নিবন্ধন করার মাধ্যমে, তারা ট্রাক নিবন্ধন এবং বুকিং পর্যবেক্ষণে সরাসরি অ্যাডমিন অ্যাক্সেস পাবে। দয়া করে নিশ্চিত হন যে সমস্ত তথ্য যাচাই করা হয়েছে।")}
                                    </p>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex gap-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => setRegisterModal(false)}
                                    className="flex-1 h-14 rounded-2xl font-black text-slate-500 hover:bg-white hover:text-slate-950 transition-all border border-transparent hover:border-slate-200"
                                >
                                    {t("Cancel", "বাতিল")}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isRegistering}
                                    className="flex-[2] h-14 rounded-2xl font-black text-white shadow-lg shadow-primary/25 relative overflow-hidden group"
                                >
                                    <span className={cn("flex items-center justify-center gap-2 transition-all", isRegistering ? "opacity-0" : "opacity-100")}>
                                        <Plus className="w-5 h-5" />
                                        {t("Complete Registration", "নিবন্ধন সম্পন্ন করুন")}
                                    </span>
                                    {isRegistering && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
