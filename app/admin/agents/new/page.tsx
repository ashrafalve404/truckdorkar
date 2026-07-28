"use client";

import React, { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    UserPlus,
    ArrowLeft,
    Shield,
    Users,
    CheckCircle,
    Loader2,
    Eye,
    EyeOff,
    User,
    Phone,
    Mail,
    Lock,
    CreditCard,
    Calendar,
    Briefcase,
    Building2,
    Upload,
    FileText,
    Camera,
    X,
    Check
} from "lucide-react";
import api, { getFileUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function RegisterAgentPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [uploadingField, setUploadingField] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        designation: "Staff",
        department: "Truck Dorkar Limited",
        nidNumber: "",
        dateOfBirth: "",
        avatar: "",
        nidFrontUrl: "",
        nidBackUrl: ""
    });

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "avatar" | "nidFrontUrl" | "nidBackUrl") => {
        const file = e.target.files?.[0];
        if (!file) return;

        const data = new FormData();
        data.append("file", file);
        setUploadingField(field);

        try {
            const res = await api.post("/storage/upload", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            const fileUrl = res.data?.url || res.data?.data?.url || res.data?.path;
            setFormData(prev => ({ ...prev, [field]: fileUrl }));
            toast.success(t("Document uploaded successfully", "ডকুমেন্ট আপলোড করা হয়েছে"));
        } catch (err) {
            console.error("Upload error", err);
            toast.error(t("Failed to upload document", "ডকুমেন্ট আপলোড করতে ব্যর্থ হয়েছে"));
        } finally {
            setUploadingField(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.phone || !formData.password || !formData.nidNumber || !formData.dateOfBirth) {
            toast.error(t("Please fill in all required fields", "দয়া করে সমস্ত প্রয়োজনীয় ঘরগুলো পূরণ করুন"));
            return;
        }

        setIsSubmitting(true);
        try {
            await api.post("/agents/admin/register", formData);
            toast.success(t("Agent registered successfully!", "এজেন্ট সফলভাবে নিবন্ধিত হয়েছে!"));
            router.push("/admin/agents");
        } catch (err: any) {
            console.error("Agent registration error:", err);
            toast.error(err.response?.data?.message || t("Registration failed. Please try again.", "নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DashboardLayout requiredRole="ADMIN">
            <div className="max-w-4xl mx-auto pb-16">
                {/* Top Navigation */}
                <div className="mb-8">
                    <Link
                        href="/admin/agents"
                        className="inline-flex items-center gap-2 text-xs font-black text-slate-500 hover:text-primary transition-colors bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-sm mb-6"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {t("Back to Agents List", "এজেন্ট তালিকায় ফিরুন")}
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                            <UserPlus className="w-7 h-7" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-950 tracking-tight">
                                {t("Register New Agent", "নতুন এজেন্ট রেজিস্ট্রেশন")}
                            </h1>
                            <p className="text-slate-600 font-bold text-sm mt-1">
                                {t("Onboard a new verified representative to manage truck registrations and monitor operations.", "নতুন ভেরিফাইড প্রতিনিধি যোগ করুন যিনি ট্রাক রেজিস্ট্রেশন ও পরিচালনা করবেন।")}
                            </p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* SECTION 1: Personal & Verification Info */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                <User className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">{t("Personal Information", "ব্যক্তিগত তথ্য")}</h3>
                                <p className="text-xs text-slate-500 font-medium">{t("Agent's identity and government verification details", "এজেন্টের পরিচয় ও এনআইডি বিবরণ")}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-slate-400" />
                                    {t("Full Name", "পুরো নাম")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder={t("e.g. John Doe", "যেমন: তানভীর আহমেদ")}
                                    className="w-full h-13 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                                    {t("Phone Number", "ফোন নম্বর")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="017XXXXXXXX"
                                    className="w-full h-13 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>

                            {/* NID Number */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                                    {t("NID Number", "এনআইডি নম্বর")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.nidNumber}
                                    onChange={(e) => setFormData({ ...formData, nidNumber: e.target.value })}
                                    placeholder="1990XXXXXXXXXXXXX"
                                    className="w-full h-13 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>

                            {/* Date of Birth */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                    {t("Date of Birth", "জন্ম তারিখ")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    required
                                    value={formData.dateOfBirth}
                                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                    className="w-full h-13 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-900 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Account & Security */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                <Lock className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">{t("Account Credentials & Security", "অ্যাকাউন্ট সিকিউরিটি")}</h3>
                                <p className="text-xs text-slate-500 font-medium">{t("Agent's login email and access password", "এজেন্টের লগইন ইমেইল ও পাসওয়ার্ড")}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Email Address */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                                    {t("Email Address (Optional)", "ইমেইল ঠিকানা")}
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="agent@truckdorkar.com"
                                    className="w-full h-13 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>

                            {/* Password with Eye Toggle */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                                    {t("Login Password", "লগইন পাসওয়ার্ড")} <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full h-13 bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                                        title={showPassword ? t("Hide Password", "পাসওয়ার্ড লুকান") : t("Show Password", "পাসওয়ার্ড দেখুন")}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: Professional Info */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900">{t("Professional Details", "পেশাদার তথ্য")}</h3>
                                <p className="text-xs text-slate-500 font-medium">{t("Agent's designation and department assignment", "এজেন্টের পদবী ও বিভাগ")}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Designation */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                                    {t("Designation", "পদবী")}
                                </label>
                                <input
                                    type="text"
                                    value={formData.designation}
                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                    placeholder={t("e.g. Senior Representative", "যেমন: ফিল্ড অফিসার")}
                                    className="w-full h-13 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>

                            {/* Department */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                                    {t("Department", "বিভাগ")}
                                </label>
                                <input
                                    type="text"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    placeholder="Truck Dorkar Limited"
                                    className="w-full h-13 bg-slate-50 border border-slate-200 rounded-xl px-4 font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: OPTIONAL DOCUMENTS & IDENTITY UPLOAD */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">{t("Documents & Identity Attachments", "ডকুমেন্টস ও আইডি কার্ড")}</h3>
                                    <p className="text-xs text-slate-500 font-medium">{t("Store agent ID card copy or profile photo for verification records", "এজেন্ট আইডি কার্ড বা ছবি সংরক্ষণ করুন")}</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-wider">
                                {t("Optional / Not Mandatory", "ঐচ্ছিক (বাধ্যতামূলক নয়)")}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* Avatar Upload Slot */}
                            <div className="space-y-2 text-center">
                                <p className="text-xs font-bold text-slate-700 flex items-center justify-center gap-1">
                                    <Camera className="w-3.5 h-3.5 text-slate-400" />
                                    {t("Profile Photo", "এজেন্ট ছবি")}
                                </p>

                                {formData.avatar ? (
                                    <div className="relative w-full h-36 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden group shadow-sm">
                                        <img src={getFileUrl(formData.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, avatar: "" }))}
                                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="relative w-full h-36 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/50 bg-slate-50/70 hover:bg-primary/5 transition-all flex flex-col items-center justify-center cursor-pointer p-4 group">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleFileUpload(e, "avatar")}
                                            className="hidden"
                                            disabled={uploadingField === "avatar"}
                                        />
                                        {uploadingField === "avatar" ? (
                                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                        ) : (
                                            <>
                                                <div className="w-10 h-10 rounded-full bg-white text-slate-400 group-hover:text-primary flex items-center justify-center shadow-sm mb-2 transition-colors">
                                                    <Upload className="w-5 h-5" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-600 group-hover:text-primary transition-colors">{t("Upload Photo", "ছবি আপলোড")}</span>
                                                <span className="text-[10px] text-slate-400 font-medium mt-0.5">PNG, JPG, WEBP</span>
                                            </>
                                        )}
                                    </label>
                                )}
                            </div>

                            {/* NID Front Slot */}
                            <div className="space-y-2 text-center">
                                <p className="text-xs font-bold text-slate-700 flex items-center justify-center gap-1">
                                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                                    {t("NID / ID Card Front", "এনআইডি/আইডি কার্ড ফ্রন্ট")}
                                </p>

                                {formData.nidFrontUrl ? (
                                    <div className="relative w-full h-36 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden group shadow-sm">
                                        <img src={getFileUrl(formData.nidFrontUrl)} alt="NID Front" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, nidFrontUrl: "" }))}
                                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="relative w-full h-36 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/50 bg-slate-50/70 hover:bg-primary/5 transition-all flex flex-col items-center justify-center cursor-pointer p-4 group">
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileUpload(e, "nidFrontUrl")}
                                            className="hidden"
                                            disabled={uploadingField === "nidFrontUrl"}
                                        />
                                        {uploadingField === "nidFrontUrl" ? (
                                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                        ) : (
                                            <>
                                                <div className="w-10 h-10 rounded-full bg-white text-slate-400 group-hover:text-primary flex items-center justify-center shadow-sm mb-2 transition-colors">
                                                    <Upload className="w-5 h-5" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-600 group-hover:text-primary transition-colors">{t("Upload Front", "ফ্রন্ট সাইড আপলোড")}</span>
                                                <span className="text-[10px] text-slate-400 font-medium mt-0.5">Image / Document</span>
                                            </>
                                        )}
                                    </label>
                                )}
                            </div>

                            {/* NID Back Slot */}
                            <div className="space-y-2 text-center">
                                <p className="text-xs font-bold text-slate-700 flex items-center justify-center gap-1">
                                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                                    {t("NID / ID Card Back", "এনআইডি/আইডি কার্ড ব্যাক")}
                                </p>

                                {formData.nidBackUrl ? (
                                    <div className="relative w-full h-36 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden group shadow-sm">
                                        <img src={getFileUrl(formData.nidBackUrl)} alt="NID Back" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, nidBackUrl: "" }))}
                                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label className="relative w-full h-36 rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary/50 bg-slate-50/70 hover:bg-primary/5 transition-all flex flex-col items-center justify-center cursor-pointer p-4 group">
                                        <input
                                            type="file"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleFileUpload(e, "nidBackUrl")}
                                            className="hidden"
                                            disabled={uploadingField === "nidBackUrl"}
                                        />
                                        {uploadingField === "nidBackUrl" ? (
                                            <Loader2 className="w-6 h-6 animate-spin text-primary" />
                                        ) : (
                                            <>
                                                <div className="w-10 h-10 rounded-full bg-white text-slate-400 group-hover:text-primary flex items-center justify-center shadow-sm mb-2 transition-colors">
                                                    <Upload className="w-5 h-5" />
                                                </div>
                                                <span className="text-xs font-bold text-slate-600 group-hover:text-primary transition-colors">{t("Upload Back", "ব্যাক সাইড আপলোড")}</span>
                                                <span className="text-[10px] text-slate-400 font-medium mt-0.5">Image / Document</span>
                                            </>
                                        )}
                                    </label>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Security Access Banner */}
                    <div className="p-6 bg-amber-50/80 border border-amber-200/60 rounded-3xl flex gap-4 items-start shadow-sm">
                        <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shrink-0">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-amber-950 mb-1">
                                {t("Administrative Privileges Note", "অ্যাডমিন অ্যাক্সেস সতর্কতা")}
                            </h4>
                            <p className="text-xs text-amber-900 font-bold leading-relaxed">
                                {t("By registering this agent, they will be granted access to onboard trucks and monitor trip activities. Please double-check all details before submitting.", "এই এজেন্টকে নিবন্ধনের মাধ্যমে, তারা নতুন ট্রাক সংযোজন ও ট্রিপ কার্যক্রম পর্যবেক্ষণ করতে পারবে। দয়া করে সঠিক তথ্য নিশ্চিত করুন।")}
                            </p>
                        </div>
                    </div>

                    {/* Action Submit Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
                        <Link
                            href="/admin/agents"
                            className="w-full sm:w-auto px-8 h-13 rounded-2xl font-black text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200 flex items-center justify-center text-sm"
                        >
                            {t("Cancel", "বাতিল")}
                        </Link>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full sm:w-auto px-10 h-13 rounded-2xl font-black text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all text-sm gap-2"
                        >
                            {isSubmitting ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                t("Register Agent Account", "এজেন্ট অ্যাকাউন্ট তৈরি করুন")
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
