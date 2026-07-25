"use client";

import React, { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/store/use-auth";
import {
    Shield,
    Image as ImageIcon,
    CheckCircle2,
    Clock,
    XCircle,
    Loader2,
    Camera,
    Info,
    User as UserIcon
} from "lucide-react";
import api, { getFileUrl } from "@/lib/api";
import { getAvatarUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

export default function AgentProfilePage() {
    const { t } = useLanguage();
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);

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

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error(t("Image size should be less than 5MB", "ছবি ৫ মেগাবাইটের কম হতে হবে"));
            return;
        }

        setUploadingAvatar(true);
        try {
            const formData = new FormData();
            formData.append("avatar", file);

            const response = await api.post("/users/profile/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            const updatedData = response.data?.data || response.data;
            const newAvatar = updatedData.avatar || updatedData.url;

            updateUser({ avatar: newAvatar });
            toast.success(t("Profile picture updated successfully", "প্রোফাইল ছবি সফলভাবে আপডেট করা হয়েছে"));
        } catch (error: any) {
            console.error("Avatar upload failed", error);
            toast.error(error.response?.data?.message || t("Failed to upload profile picture", "ছবি আপলোড করতে ব্যর্থ হয়েছে"));
        } finally {
            setUploadingAvatar(false);
        }
    };

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
                    {t("Verify your identity and update your agent profile picture.", "আপনার ছবি আপডেট করুন এবং পরিচয় ভেরিফাই করুন।")}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Avatar & Verification Status */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Agent Avatar Upload Card */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                        <div
                            className="relative inline-block mb-4 cursor-pointer group"
                            onClick={() => avatarInputRef.current?.click()}
                            title={t("Click to change profile picture", "প্রোফাইল ছবি পরিবর্তন করতে ক্লিক করুন")}
                        >
                            <input
                                type="file"
                                ref={avatarInputRef}
                                onChange={handleAvatarUpload}
                                accept="image/*"
                                className="hidden"
                            />
                            <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl relative mx-auto">
                                {user?.avatar ? (
                                    <img src={getAvatarUrl(user.avatar) || ""} alt={user.name || "Agent Avatar"} className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-10 h-10 text-slate-400" />
                                )}
                                {uploadingAvatar && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                disabled={uploadingAvatar}
                                className="absolute bottom-0 right-0 w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white shadow-md group-hover:scale-110 transition-transform"
                            >
                                {uploadingAvatar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                        <h3 className="font-black text-slate-900 text-base">{user?.name || agentData?.user?.name || "Agent"}</h3>
                        <p className="text-xs text-slate-500 font-bold">{user?.email || user?.phone}</p>
                    </div>

                    {/* Verification Status Banner */}
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
                                    {t("NID Back View", "এনআইডি পিছনের দিক")}
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
                                disabled={submitting}
                                type="submit"
                                className="w-full h-14 rounded-2xl font-black text-base uppercase tracking-wider bg-slate-950 hover:bg-slate-900 text-white shadow-xl"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : t("Submit For Verification", "যাচাইকরণের জন্য জমা দিন")}
                            </Button>
                        )}
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
