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
    UserPlus,
    ExternalLink,
    FileText,
    Phone,
    Camera,
    CreditCard,
    User
} from "lucide-react";
import api, { getFileUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { cn, getAvatarUrl } from "@/lib/utils";
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
    const [profileModal, setProfileModal] = useState<{ open: boolean; agent: any | null }>({ open: false, agent: null });
    const [previewImage, setPreviewImage] = useState<string | null>(null);
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
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-1">
                        {t("Agent Management", "এজেন্ট ম্যানেজমেন্ট")}
                    </h1>
                    <p className="text-slate-600 font-bold text-xs sm:text-sm">
                        {t("Monitor agent performance and truck registrations.", "এজেন্টদের পারফরম্যান্স এবং ট্রাক রেজিস্ট্রেশন মনিটর করুন।")}
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                    <Button onClick={() => router.push("/admin/agents/new")} className="h-12 px-6 rounded-xl font-black gap-2 text-white shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform w-full sm:w-auto shrink-0">
                        <Plus className="w-5 h-5" />
                        {t("Register New Agent", "নতুন এজেন্ট নিবন্ধন")}
                    </Button>
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t("Search by name or ID...", "নাম বা আইডি দিয়ে খুঁজুন...")}
                            className="bg-white h-12 pl-12 pr-4 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-primary/10 w-full font-bold text-sm text-slate-900 shadow-sm"
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
                                    <div
                                        onClick={() => setProfileModal({ open: true, agent })}
                                        className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-black overflow-hidden shrink-0 border border-slate-200 cursor-pointer hover:scale-105 transition-transform hover:ring-2 hover:ring-primary/40 shadow-sm"
                                        title={t("Click to view full agent profile & documents", "সম্পূর্ণ প্রোফাইল ও নথি দেখতে ক্লিক করুন")}
                                    >
                                        {agent.user?.avatar ? (
                                            <img src={getAvatarUrl(agent.user.avatar) || ""} alt={agent.user?.name || "Agent"} className="w-full h-full object-cover" />
                                        ) : (
                                            (agent.user?.name === "Operations Staff" ? "Agent" : agent.user?.name || "A").charAt(0).toUpperCase()
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3
                                            onClick={() => setProfileModal({ open: true, agent })}
                                            className="font-black text-slate-950 truncate cursor-pointer hover:text-primary transition-colors"
                                            title={t("Click to view full agent profile & documents", "সম্পূর্ণ প্রোফাইল ও নথি দেখতে ক্লিক করুন")}
                                        >
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

            {/* FULL AGENT PROFILE & DOCUMENT DETAILS MODAL */}
            {profileModal.open && profileModal.agent && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-4xl max-h-[94vh] sm:max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="p-4 sm:p-6 md:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0 relative">
                            <div className="flex items-center gap-3 sm:gap-4 min-w-0 pr-8 sm:pr-0">
                                <div
                                    onClick={() => {
                                        const url = getAvatarUrl(profileModal.agent.user?.avatar);
                                        if (url) setPreviewImage(url);
                                    }}
                                    className={cn(
                                        "w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-slate-700 border-2 border-white/20 flex items-center justify-center font-black text-lg sm:text-2xl overflow-hidden shrink-0 shadow-lg",
                                        profileModal.agent.user?.avatar ? "cursor-pointer hover:scale-105 transition-transform" : ""
                                    )}
                                    title={profileModal.agent.user?.avatar ? t("Click to zoom profile photo", "ছবি বড় করে দেখুন") : ""}
                                >
                                    {profileModal.agent.user?.avatar ? (
                                        <img src={getAvatarUrl(profileModal.agent.user.avatar) || ""} alt="Agent Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        (profileModal.agent.user?.name || "A").charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h2 className="text-lg sm:text-2xl font-black truncate">{profileModal.agent.user?.name === "Operations Staff" ? "Agent" : profileModal.agent.user?.name}</h2>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider shrink-0",
                                            profileModal.agent.user?.isActive ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" : "bg-red-500/20 text-red-300 border border-red-500/30"
                                        )}>
                                            {profileModal.agent.user?.isActive ? t("ACTIVE", "সক্রিয়") : t("SUSPENDED", "স্থগিত")}
                                        </span>
                                    </div>
                                    <p className="text-[11px] sm:text-xs text-slate-300 font-bold mt-0.5 truncate">
                                        {profileModal.agent.designation || "Representative"} · ID: <span className="text-emerald-400 font-black">{profileModal.agent.agentId || "N/A"}</span>
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setProfileModal({ open: false, agent: null })}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors shrink-0 absolute sm:relative top-4 right-4 sm:top-auto sm:right-auto"
                            >
                                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                        </div>

                        {/* Scrollable Body Content */}
                        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto space-y-6 sm:space-y-8 flex-1">
                            {/* 1. Key Metrics Summary Grid */}
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
                                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("Total Earnings", "মোট অর্জিত আয়")}</p>
                                    <p className="text-base sm:text-xl font-black text-purple-600 truncate">৳{(profileModal.agent.totalEarnings || 0).toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
                                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("Wallet Balance", "ব্যালেন্স")}</p>
                                    <p className="text-base sm:text-xl font-black text-emerald-600 truncate">৳{(profileModal.agent.walletBalance || 0).toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
                                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("Total Trucks", "মোট নিবন্ধিত ট্রাক")}</p>
                                    <p className="text-base sm:text-xl font-black text-slate-900">{profileModal.agent.trucksTotal || 0}</p>
                                </div>
                                <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100">
                                    <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("Verification Status", "ভেরিফিকেশন")}</p>
                                    <span className={cn(
                                        "inline-block px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider",
                                        profileModal.agent.verificationStatus === 'APPROVED' ? "bg-emerald-100 text-emerald-700" :
                                        profileModal.agent.verificationStatus === 'REJECTED' ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                                    )}>
                                        {profileModal.agent.verificationStatus || "PENDING"}
                                    </span>
                                </div>
                            </div>

                            {/* 2. Personal Information Card */}
                            <div className="bg-slate-50/70 p-4 sm:p-6 rounded-2xl border border-slate-100 space-y-4">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" />
                                    {t("Personal Details", "ব্যক্তিগত তথ্য")}
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-xs font-bold">
                                    <div>
                                        <p className="text-slate-400 text-[10px] uppercase mb-0.5">{t("Full Name", "পুরো নাম")}</p>
                                        <p className="text-slate-900 font-black text-sm">{profileModal.agent.user?.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-[10px] uppercase mb-0.5">{t("Phone Number", "ফোন নম্বর")}</p>
                                        <a href={`tel:${profileModal.agent.user?.phone}`} className="text-primary font-black text-sm flex items-center gap-1 hover:underline">
                                            <Phone className="w-3.5 h-3.5" />
                                            {profileModal.agent.user?.phone}
                                        </a>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-[10px] uppercase mb-0.5">{t("Email Address", "ইমেইল")}</p>
                                        <p className="text-slate-900 font-bold truncate">{profileModal.agent.user?.email || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-[10px] uppercase mb-0.5">{t("NID Number", "এনআইডি নম্বর")}</p>
                                        <p className="text-slate-900 font-black">{profileModal.agent.nidNumber || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-[10px] uppercase mb-0.5">{t("Date of Birth", "জন্ম তারিখ")}</p>
                                        <p className="text-slate-900 font-bold">{profileModal.agent.dateOfBirth || "N/A"}</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-[10px] uppercase mb-0.5">{t("Designation & Dept", "পদবী ও বিভাগ")}</p>
                                        <p className="text-slate-900 font-bold">{profileModal.agent.designation || "Representative"} ({profileModal.agent.department || "Operations"})</p>
                                    </div>
                                </div>
                            </div>

                            {/* 3. AGENT UPLOADED DOCUMENTS & IDENTITY ATTACHMENTS */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <h4 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                                        {t("Uploaded Agent Documents & Identity Images", "এজেন্টের আপলোড করা নথিপত্র ও এনআইডি")}
                                    </h4>
                                    <span className="text-[10px] sm:text-xs text-slate-400 font-bold">
                                        {t("Click image to zoom full screen", "ছবিতে ক্লিক করে বড় করে দেখুন")}
                                    </span>
                                </div>

                                {!profileModal.agent.nidFrontUrl && !profileModal.agent.nidBackUrl && !profileModal.agent.user?.avatar ? (
                                    <div className="p-8 sm:p-10 bg-slate-50 border border-slate-100 rounded-2xl text-center text-slate-500 font-bold text-xs">
                                        <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300 mx-auto mb-2" />
                                        {t("No identity document images uploaded yet for this agent.", "এই এজেন্টের কোনো পরিচয়পত্র বা ছবি এখনো আপলোড করা হয়নি।")}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                                        {/* Profile Photo Card */}
                                        {profileModal.agent.user?.avatar && (
                                            <div className="space-y-2">
                                                <p className="text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1">
                                                    <Camera className="w-3.5 h-3.5 text-blue-500" />
                                                    {t("Profile Photo", "প্রোফাইল ছবি")}
                                                </p>
                                                <div
                                                    onClick={() => setPreviewImage(getAvatarUrl(profileModal.agent.user.avatar))}
                                                    className="aspect-[1.6/1] sm:aspect-[4/3] rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                                                >
                                                    <img
                                                        src={getAvatarUrl(profileModal.agent.user.avatar) || ""}
                                                        alt="Profile Avatar"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                                                        <Eye className="w-5 h-5" />
                                                        {t("View Full Image", "বড় করে দেখুন")}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* NID Front View Card */}
                                        {profileModal.agent.nidFrontUrl && (
                                            <div className="space-y-2">
                                                <p className="text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1">
                                                    <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
                                                    {t("NID Front Side", "এনআইডি সামনের দিক")}
                                                </p>
                                                <div
                                                    onClick={() => setPreviewImage(getFileUrl(profileModal.agent.nidFrontUrl))}
                                                    className="aspect-[1.6/1] sm:aspect-[4/3] rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                                                >
                                                    <img
                                                        src={getFileUrl(profileModal.agent.nidFrontUrl)}
                                                        alt="NID Front"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                                                        <Eye className="w-5 h-5" />
                                                        {t("View Full Image", "বড় করে দেখুন")}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* NID Back View Card */}
                                        {profileModal.agent.nidBackUrl && (
                                            <div className="space-y-2">
                                                <p className="text-[11px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-1">
                                                    <CreditCard className="w-3.5 h-3.5 text-purple-500" />
                                                    {t("NID Back Side", "এনআইডি পেছনের দিক")}
                                                </p>
                                                <div
                                                    onClick={() => setPreviewImage(getFileUrl(profileModal.agent.nidBackUrl))}
                                                    className="aspect-[1.6/1] sm:aspect-[4/3] rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden relative cursor-pointer group shadow-sm hover:shadow-md transition-all"
                                                >
                                                    <img
                                                        src={getFileUrl(profileModal.agent.nidBackUrl)}
                                                        alt="NID Back"
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                                                        <Eye className="w-5 h-5" />
                                                        {t("View Full Image", "বড় করে দেখুন")}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Bottom Actions Bar */}
                        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
                            <Button
                                variant="outline"
                                onClick={() => setProfileModal({ open: false, agent: null })}
                                className="h-11 sm:h-12 px-6 rounded-xl font-black text-slate-600 text-xs w-full sm:w-auto"
                            >
                                {t("Close", "বন্ধ করুন")}
                            </Button>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                                <Button
                                    onClick={() => {
                                        setProfileModal({ open: false, agent: null });
                                        router.push(`/admin/agents/${profileModal.agent.id}/trucks`);
                                    }}
                                    className="h-11 sm:h-12 px-6 rounded-xl font-black text-white bg-slate-900 hover:bg-slate-800 text-xs gap-2 w-full sm:w-auto"
                                >
                                    <Truck className="w-4 h-4" />
                                    {t("View Registered Trucks", "নিবন্ধিত ট্রাকসমূহ")}
                                </Button>

                                {profileModal.agent.verificationStatus !== 'APPROVED' && (
                                    <Button
                                        onClick={() => {
                                            handleVerifyAgent(profileModal.agent.id, 'APPROVED');
                                            setProfileModal({ open: false, agent: null });
                                        }}
                                        className="h-11 sm:h-12 px-6 rounded-xl font-black text-white bg-emerald-600 hover:bg-emerald-700 text-xs gap-2 w-full sm:w-auto"
                                    >
                                        <CheckCircle2 className="w-4 h-4" />
                                        {t("Approve Agent", "এজেন্ট অনুমোদন করুন")}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* FULLSCREEN IMAGE LIGHTBOX PREVIEW MODAL */}
            {previewImage && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center">
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img src={previewImage} alt="Document Preview" className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10" />
                        <a
                            href={previewImage}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 px-6 py-2.5 rounded-xl bg-white/10 text-white font-black text-xs hover:bg-white/20 transition-colors border border-white/20 flex items-center gap-2"
                        >
                            <ExternalLink className="w-4 h-4" />
                            {t("Open Original File", "মূল ফাইল খুলুন")}
                        </a>
                    </div>
                </div>
            )}

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
                                        {t("By registering this agent, they will be granted access to onboard trucks and monitor trip activities. Please double-check all details before submitting.", "এই এজেন্টকে নিবন্ধনের মাধ্যমে, তারা নতুন ট্রাক সংযোজন ও ট্রিপ কার্যক্রম পর্যবেক্ষণ করতে পারবে। দয়া করে সঠিক তথ্য নিশ্চিত করুন।")}
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
