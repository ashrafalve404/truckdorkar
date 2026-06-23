"use client";

import React, { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    Shield,
    Image as ImageIcon,
    CheckCircle2,
    Clock,
    XCircle,
    Loader2,
    Camera,
    Info
} from "lucide-react";
import api, { getFileUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function AgentProfilePage() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [agentData, setAgentData] = useState<any>(null);
    const [form, setForm] = useState({
        nidNumber: "",
        nidFront: null as File | null,
        nidBack: null as File | null
    });
    const [previews, setPreviews] = useState({
        front: "",
        back: ""
    });

    const fetchProfile = async () => {
        try {
            const res = await api.get("/agents/profile");
            setAgentData(res.data.data);
            if (res.data.data.nidNumber) {
                setForm(prev => ({ ...prev, nidNumber: res.data.data.nidNumber }));
            }
        } catch (error) {
            console.error("Failed to fetch profile", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
        const file = e.target.files?.[0];
        if (file) {
            setForm(prev => ({ ...prev, [side === 'front' ? 'nidFront' : 'nidBack']: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => ({ ...prev, [side]: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.nidNumber) return toast.error(t("NID number is required", "এনআইডি নম্বর প্রয়োজন"));
        if (!form.nidFront && !agentData?.nidFrontUrl) return toast.error(t("NID front image is required", "এনআইডি সামনের ছবি প্রয়োজন"));
        if (!form.nidBack && !agentData?.nidBackUrl) return toast.error(t("NID back image is required", "এনআইডি পেছনের ছবি প্রয়োজন"));

        setSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("nidNumber", form.nidNumber);
            if (form.nidFront) formData.append("nidFront", form.nidFront);
            if (form.nidBack) formData.append("nidBack", form.nidBack);

            await api.post("/agents/profile/nid", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            toast.success(t("NID documents submitted for verification!", "এনআইডি ডকুমেন্ট ভেরিফিকেশনের জন্য জমা দেওয়া হয়েছে!"));
            fetchProfile();
        } catch (error) {
            console.error("Upload failed", error);
            toast.error(t("Failed to upload documents", "ডকুমেন্ট আপলোড করতে ব্যর্থ হয়েছে"));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout requiredRole="AGENT">
                <div className="p-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
            </DashboardLayout>
        );
    }

    const statusObj = {
        PENDING: { icon: Clock, text: t("Pending Verification", "অপেক্ষমান যাচাইকরণ"), color: "text-amber-500", bg: "bg-amber-50" },
        APPROVED: { icon: CheckCircle2, text: t("Verified Account", "ভেরিফাইড অ্যাকাউন্ট"), color: "text-green-500", bg: "bg-green-50" },
        REJECTED: { icon: XCircle, text: t("Rejected", "প্রত্যাখ্যান করা হয়েছে"), color: "text-red-500", bg: "bg-red-50" },
    }[agentData?.verificationStatus as 'PENDING' | 'APPROVED' | 'REJECTED'] || { icon: Shield, text: t("Unverified", "অযাচাইকৃত"), color: "text-slate-400", bg: "bg-slate-50" };

    const StatusIcon = statusObj.icon;

    return (
        <DashboardLayout requiredRole="AGENT">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    {t("Profile & Verification", "প্রোফাইল এবং ভেরিফিকেশন")}
                </h1>
                <p className="text-slate-700 font-bold">
                    {t("Verify your identity to increase trust and access more features.", "আরও সুবিধা পেতে আপনার পরিচয় নিশ্চিত করুন।")}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Status Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <div className={`p-8 rounded-3xl border border-slate-100 shadow-sm ${statusObj.bg}`}>
                        <div className={`w-16 h-16 rounded-2xl ${statusObj.color} bg-white flex items-center justify-center mb-6 shadow-sm`}>
                            <StatusIcon className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-2">{statusObj.text}</h3>
                        <p className="text-sm font-bold text-slate-600 leading-relaxed">
                            {agentData?.verificationStatus === 'APPROVED'
                                ? t("Your account is fully verified. You can now manage unlimited trucks.", "আপনার অ্যাকাউন্ট ভেরিফাইড। আপনি এখন আনলিমিটেড ট্রাক ম্যানেজ করতে পারবেন।")
                                : t("Please upload clear photos of your NID card for identity verification.", "পরিচয় নিশ্চিত করতে আপনার এনআইডি কার্ডের পরিষ্কার ছবি আপলোড করুন।")}
                        </p>
                    </div>

                    <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
                        <h4 className="font-black text-slate-950 mb-4 flex items-center gap-2">
                            <Info className="w-4 h-4 text-primary" />
                            {t("Personal Details", "ব্যক্তিগত তথ্য")}
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("Full Name", "পুরো নাম")}</p>
                                <p className="text-sm font-bold text-slate-900">{agentData?.user?.name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("Phone", "ফোন")}</p>
                                <p className="text-sm font-bold text-slate-900">{agentData?.user?.phone}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Upload Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 lg:p-10 border border-slate-100 shadow-sm space-y-8">
                        <div className="space-y-4">
                            <label className="text-sm font-black text-slate-950 uppercase tracking-widest leading-none">
                                {t("NID Number", "এনআইডি নম্বর")}
                                <span className="text-red-500 ml-1">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder={t("Enter your 10 or 13 digit NID number", "আপনার এনআইডি নম্বর দিন")}
                                value={form.nidNumber}
                                onChange={e => setForm({ ...form, nidNumber: e.target.value })}
                                disabled={agentData?.verificationStatus === 'APPROVED'}
                                className="w-full h-14 px-6 rounded-2xl bg-slate-50 border border-slate-200 font-bold text-slate-950 focus:ring-2 focus:ring-primary/10 outline-none transition-all disabled:opacity-50"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Front Side */}
                            <div className="space-y-4">
                                <label className="text-sm font-black text-slate-950 uppercase tracking-widest leading-none">
                                    {t("NID Front View", "এনআইডি সামনের দিক")}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative group">
                                    <div className="aspect-[1.6/1] rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden relative">
                                        {previews.front || agentData?.nidFrontUrl ? (
                                            <img
                                                src={previews.front || getFileUrl(agentData?.nidFrontUrl)}
                                                className="w-full h-full object-cover"
                                                alt="NID Front"
                                            />
                                        ) : (
                                            <>
                                                <Camera className="w-8 h-8 text-slate-300 mb-2 group-hover:text-primary transition-colors" />
                                                <p className="text-[10px] font-bold text-slate-400">{t("Click to upload photo", "ছবি আপলোড করতে ক্লিক করুন")}</p>
                                            </>
                                        )}
                                        {agentData?.verificationStatus !== 'APPROVED' && (
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => handleFileChange(e, 'front')}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Back Side */}
                            <div className="space-y-4">
                                <label className="text-sm font-black text-slate-950 uppercase tracking-widest leading-none">
                                    {t("NID Back View", "এনআইডি পেছনের দিক")}
                                    <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative group">
                                    <div className="aspect-[1.6/1] rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden relative">
                                        {previews.back || agentData?.nidBackUrl ? (
                                            <img
                                                src={previews.back || getFileUrl(agentData?.nidBackUrl)}
                                                className="w-full h-full object-cover"
                                                alt="NID Back"
                                            />
                                        ) : (
                                            <>
                                                <Camera className="w-8 h-8 text-slate-300 mb-2 group-hover:text-primary transition-colors" />
                                                <p className="text-[10px] font-bold text-slate-400">{t("Click to upload photo", "ছবি আপলোড করতে ক্লিক করুন")}</p>
                                            </>
                                        )}
                                        {agentData?.verificationStatus !== 'APPROVED' && (
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={e => handleFileChange(e, 'back')}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {agentData?.verificationStatus !== 'APPROVED' && (
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-full h-16 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 gap-3 text-white"
                            >
                                {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <>
                                        <Shield className="w-6 h-6" />
                                        {t("Submit for Verification", "ভেরিফিকেশনের জন্য পাঠান")}
                                    </>
                                )}
                            </Button>
                        )}

                        {agentData?.verificationStatus === 'APPROVED' && (
                            <div className="p-6 rounded-2xl bg-green-50 border border-green-100 flex items-center gap-4">
                                <CheckCircle2 className="w-6 h-6 text-green-500" />
                                <p className="text-sm font-bold text-green-800">{t("Identity verified on", "ভেরিফাইড হয়েছে")}: {new Date(agentData.updatedAt).toLocaleDateString()}</p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
