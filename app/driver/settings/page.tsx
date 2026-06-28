"use client";

import React, { useEffect, useState, useCallback } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import {
    User,
    Truck,
    Lock,
    Bell,
    Save,
    Camera,
    Upload,
    CheckCircle2,
    ShieldCheck,
    UserCheck,
    Phone,
    Mail,
    AlertCircle,
    Info,
    Clock,
    XCircle,
    Plus,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/use-auth";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type Tab = "profile" | "truck" | "safety" | "notifications";
type LucideIcon = React.ComponentType<{ className?: string }>;

export default function DriverSettingsPage() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [trucks, setTrucks] = useState<any[]>([]);
    const [driverData, setDriverData] = useState<any>(null);

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        licenseNumber: "",
        experience: "",
        nidNumber: "",
    });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [notifications, setNotifications] = useState({
        bookingAlerts: true,
        quotationAlerts: true,
        paymentAlerts: true,
        supportUpdates: false,
    });

    const fetchProfile = useCallback(async () => {
        try {
            const [profileRes, trucksRes] = await Promise.all([
                api.get("/drivers/profile"),
                api.get("/trucks/mine")
            ]);
            const d = profileRes.data?.data || {};
            setDriverData(d);
            setProfile({
                name: d.user?.name || user?.name || "",
                email: d.user?.email || user?.email || "",
                phone: d.user?.phone || user?.phone || "",
                licenseNumber: d.licenseNumber || "",
                experience: d.experience?.toString() || "",
                nidNumber: d.nidNumber || "",
            });
            setTrucks(trucksRes.data?.data || []);
        } catch (error) {
            console.error("Failed to fetch profile/trucks", error);
            toast.error(t("Failed to load profile", "প্রোফাইল লোড করতে ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchProfile();
        // Load notification preferences
        const saved = localStorage.getItem("driver_notification_prefs");
        if (saved) {
            try {
                setNotifications(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse notifications", e);
            }
        }
    }, [fetchProfile]);

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            await api.patch("/drivers/profile", {
                name: profile.name,
                email: profile.email,
                licenseNumber: profile.licenseNumber,
                experience: Number(profile.experience) || 0,
            });
            toast.success(t("Profile updated successfully", "প্রোফাইল সফলভাবে আপডেট হয়েছে"));
            fetchProfile();
        } catch {
            toast.error(t("Failed to update profile", "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে"));
        } finally {
            setSaving(false);
        }
    };

    const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        try {
            const formData = new FormData();
            formData.append("avatar", file);
            await api.post("/users/profile/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success(t("Profile picture updated", "প্রোফাইল ছবি সফলভাবে পরিবর্তন হয়েছে"));
            fetchProfile();
        } catch {
            toast.error(t("Failed to upload avatar", "প্রোফাইল ছবি আপলোড ব্যর্থ হয়েছে"));
        }
    };

    const handleUploadDoc = async (type: string, file: File) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", type);
            await api.post("/drivers/documents", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success(t("Document uploaded successfully", "ডকুমেন্ট সফলভাবে আপলোড করা হয়েছে"));
            fetchProfile();
        } catch {
            toast.error(t("Failed to upload document", "ডকুমেন্ট আপলোড ব্যর্থ হয়েছে"));
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
            toast.error(t("Please fill all password fields", "সব পাসওয়ার্ড ফিল্ড পূরণ করুন"));
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error(t("New passwords do not match", "নতুন পাসওয়ার্ড দুটির মিল নেই"));
            return;
        }
        setSaving(true);
        try {
            await api.post("/auth/change-password", {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            });
            toast.success(t("Password updated successfully. Please login again if requested.", "পাসওয়ার্ড সফলভাবে আপডেট হয়েছে।"));
            setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || t("Password update failed", "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে"));
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNotifications = async () => {
        setSaving(true);
        try {
            localStorage.setItem("driver_notification_prefs", JSON.stringify(notifications));
            await new Promise((resolve) => setTimeout(resolve, 500));
            toast.success(t("Notification preferences saved", "নোটিফিকেশন পছন্দ সংরক্ষিত হয়েছে"));
        } catch {
            toast.error(t("Failed to save preferences", "পছন্দ সংরক্ষণ করতে ব্যর্থ হয়েছে"));
        } finally {
            setSaving(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED": return "bg-green-100 text-green-700 border-green-200";
            case "REJECTED": return "bg-red-100 text-red-700 border-red-200";
            case "PENDING": return "bg-amber-100 text-amber-700 border-amber-200";
            default: return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "APPROVED": return <CheckCircle2 className="w-4 h-4" />;
            case "REJECTED": return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    const tabs: { id: Tab; label_en: string; label_bn: string; icon: LucideIcon }[] = [
        { id: "profile", label_en: "Profile", label_bn: "প্রোফাইল", icon: User },
        { id: "truck", label_en: "My Truck", label_bn: "আমার ট্রাক", icon: Truck },
        { id: "safety", label_en: "Safety & Privacy", label_bn: "সুরক্ষা", icon: Lock },
        { id: "notifications", label_en: "Notifications", label_bn: "নোটিফিকেশন", icon: Bell },
    ];

    const renderTabContent = () => {
        if (loading) {
            return (
                <div className="p-20 flex justify-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                </div>
            );
        }

        switch (activeTab) {
            case "profile":
                return (
                    <div className="space-y-6">
                        {/* Profile Header Card */}
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-6 md:p-8 border border-slate-100">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative group">
                                    <div className="w-24 h-24 rounded-2xl bg-white shadow-lg shadow-slate-200/50 relative overflow-hidden ring-4 ring-white">
                                        {driverData?.user?.avatar ? (
                                            <picture>
                                                <img src={driverData.user.avatar} alt="" className="w-full h-full object-cover" />
                                            </picture>
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl font-black text-primary bg-primary/5">
                                                {profile.name?.charAt(0) || "D"}
                                            </div>
                                        )}
                                        <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <Camera className="w-6 h-6 text-white" />
                                            <input type="file" onChange={handleUploadAvatar} className="hidden" accept="image/*" />
                                        </label>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h3 className="text-xl font-black text-slate-900">{profile.name || "Driver Name"}</h3>
                                    <p className="text-sm text-slate-600 font-bold mt-1">{t("Driver ID:", "ড্রাইভার আইডি:")} {user?.id?.slice(0, 8) || "—"}</p>
                                    <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
                                        <span className={cn(
                                            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold",
                                            driverData?.status === "VERIFIED" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                                        )}>
                                            {driverData?.status === "VERIFIED" ? <UserCheck className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                                            {t(driverData?.status || "PENDING", driverData?.status === "VERIFIED" ? "ভেরিফাইড" : driverData?.status === "REJECTED" ? "বাতিলকৃত" : "অপেক্ষমান")}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            {t("NID/License Document Check", "এনআইডি/লাইসেন্স")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-50">
                                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    {t("Personal Information", "ব্যক্তিগত তথ্য")}
                                </h4>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t("Full Name", "পুরো নাম")}</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t("Phone Number", "ফোন নম্বর")}</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={profile.phone}
                                                disabled
                                                className="w-full h-12 bg-slate-100 border border-slate-200 rounded-xl pl-11 pr-4 text-slate-500 font-bold outline-none cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t("Email Address", "ইমেইল")}</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="email"
                                                value={profile.email}
                                                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t("License Number", "লাইসেন্স নং")}</label>
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                value={profile.licenseNumber}
                                                onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                                                className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Verified Documents */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-50">
                                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    {t("Uploaded Profile Verification Documents", "আপলোডকৃত ভেরিফিকেশন ফাইলসমূহ")}
                                </h4>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { key: "nidFront", label_en: "NID Front", label_bn: "এনআইডি ফ্রন্ট", url: driverData?.nidFront },
                                        { key: "nidBack", label_en: "NID Back", label_bn: "এনআইডি ব্যাক", url: driverData?.nidBack },
                                        { key: "licenseFront", label_en: "License Front", label_bn: "লাইসেন্স ফ্রন্ট", url: driverData?.licenseFront },
                                        { key: "licenseBack", label_en: "License Back", label_bn: "লাইসেন্স ব্যাক", url: driverData?.licenseBack },
                                    ].map((doc) => (
                                        <div key={doc.key} className="relative p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col items-center text-center justify-between min-h-[140px]">
                                            <p className="text-xs font-black text-slate-700 uppercase mb-2">{t(doc.label_en, doc.label_bn)}</p>
                                            {doc.url ? (
                                                <div className="flex flex-col items-center">
                                                    <CheckCircle2 className="w-8 h-8 text-green-500 mb-1" />
                                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary underline font-bold mt-1">
                                                        {t("View Uploaded File", "ভিউপত্র দেখুন")}
                                                    </a>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <AlertCircle className="w-8 h-8 text-amber-500 mb-1" />
                                                    <span className="text-[10px] text-slate-500 font-bold">{t("No File Uploaded", "কোনো ফাইল নেই")}</span>
                                                </div>
                                            )}
                                            <label className="mt-3 cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition-all text-xs font-bold text-slate-700">
                                                <Upload className="w-3.5 h-3.5" />
                                                {t("Change", "পরিবর্তন")}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept=".pdf,image/*"
                                                    onChange={(e) => {
                                                        if (e.target.files?.[0]) handleUploadDoc(doc.key, e.target.files[0]);
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button onClick={handleSaveProfile} disabled={saving} className="h-12 px-8 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all text-white bg-primary">
                                {saving ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4" />
                                )}
                                {t("Update Profile", "প্রোফাইল আপডেট করুন")}
                            </Button>
                        </div>
                    </div>
                );

            case "truck":
                return (
                    <div className="space-y-6 p-6">
                        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <h4 className="text-lg font-black text-slate-900">{t("My Registered Trucks", "আমার নিবন্ধিত ট্রাকসমূহ")}</h4>
                                <p className="text-xs text-slate-500 font-bold mt-0.5">{t("View status of your registered trucks", "আপনার নিবন্ধিত ট্রাকসমূহের অনুমোদন স্ট্যাটাস দেখুন")}</p>
                            </div>
                            <Button onClick={() => router.push("/driver/trucks/new")} className="h-10 px-4 rounded-xl flex items-center gap-1 bg-primary text-white shadow-sm text-xs font-bold">
                                <Plus className="w-4 h-4" />
                                {t("Add New Truck", "নতুন ট্রাক যোগ করুন")}
                            </Button>
                        </header>

                        {trucks.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {trucks.map((truck) => (
                                    <div key={truck.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:border-primary/50 transition-all group">
                                        <div className="p-5">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                    <Truck className="w-5 h-5 text-slate-600 group-hover:text-primary transition-colors" />
                                                </div>
                                                <div className={cn(
                                                    "px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider flex items-center gap-1",
                                                    getStatusColor(truck.status)
                                                )}>
                                                    {getStatusIcon(truck.status)}
                                                    {t(truck.status, truck.status === 'PENDING' ? 'অপেক্ষমান' : truck.status === 'APPROVED' ? 'অনুমোদিত' : 'প্রত্যাখ্যাত')}
                                                </div>
                                            </div>

                                            <h5 className="text-base font-black text-slate-900 mb-1">{truck.name}</h5>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight mb-4 flex items-center gap-1">
                                                {truck.registrationNo}
                                                <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                                                {t(truck.category, truck.category)}
                                            </p>

                                            <div className="grid grid-cols-2 gap-3 mb-4">
                                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase">{t("Capacity", "ধারণক্ষমতা")}</p>
                                                    <p className="text-xs font-bold text-slate-700">{truck.capacityTon} Ton</p>
                                                </div>
                                                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase">{t("Utility", "ডিউটি স্ট্যাটাস")}</p>
                                                    <p className="text-xs font-bold text-slate-700">{truck.isAvailable ? t("On Duty", "ডিউটিতে") : t("Off Duty", "অফ")}</p>
                                                </div>
                                            </div>

                                            {truck.approvalNote && (
                                                <div className="p-2.5 mb-4 rounded-lg bg-red-50 border border-red-100 flex gap-1.5">
                                                    <Info className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                                    <p className="text-[9px] font-bold text-red-600 leading-tight">{truck.approvalNote}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-8 border border-slate-100 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-white shadow-lg shadow-slate-200/50 flex items-center justify-center mx-auto mb-4">
                                    <Truck className="w-8 h-8 text-slate-300" />
                                </div>
                                <h4 className="text-base font-bold text-slate-900 mb-1">{t("No truck registered", "কোন ট্রাক রেজিস্টার করা নেই")}</h4>
                                <p className="text-xs text-slate-600 font-bold mb-6 max-w-sm mx-auto">{t("Register your truck to start receiving job requests from shippers.", "কাজের রিকোয়েস্ট পেতে আপনার ট্রাক রেজিস্টার করুন।")}</p>
                                <Button onClick={() => router.push("/driver/trucks/new")} className="rounded-xl font-bold px-6 h-10 shadow bg-primary text-white text-xs">{t("Add Truck", "ট্রাক যোগ করুন")}</Button>
                            </div>
                        )}
                    </div>
                );

            case "safety":
                return (
                    <div className="space-y-6">
                        <form onSubmit={handleUpdatePassword} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-50">
                                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-primary" />
                                    {t("Change Password", "পাসওয়ার্ড পরিবর্তন")}
                                </h4>
                                <p className="text-xs text-slate-500 font-bold mt-1">{t("Update your password regularly for security", "নিরাপত্তার জন্য নিয়মিত পাসওয়ার্ড আপডেট করুন")}</p>
                            </div>
                            <div className="p-6 space-y-4 max-w-lg">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t("Current Password", "বর্তমান পাসওয়ার্ড")}</label>
                                    <input
                                        type="password"
                                        value={passwords.currentPassword}
                                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t("New Password", "নতুন পাসওয়ার্ড")}</label>
                                    <input
                                        type="password"
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all animate-pulse-once"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t("Confirm New Password", "নতুন পাসওয়ার্ড নিশ্চিত করুন")}</label>
                                    <input
                                        type="password"
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all font-mono"
                                    />
                                </div>
                                <Button type="submit" disabled={saving} className="rounded-xl font-bold px-8 h-12 shadow bg-primary text-white">
                                    {saving ? t("Updating...", "আপডেট হচ্ছে...") : t("Update Password", "পাসওয়ার্ড আপডেট করুন")}
                                </Button>
                            </div>
                        </form>
                    </div>
                );

            case "notifications":
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-50">
                                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                    <Bell className="w-5 h-5 text-primary" />
                                    {t("Notification Preferences", "নোটিফিকেশন পছন্দ")}
                                </h4>
                                <p className="text-xs text-slate-500 font-bold mt-1">{t("Manage how you receive notifications", "আপনি কীভাবে নোটিফিকেশন পাবেন তা পরিচালনা করুন")}</p>
                            </div>
                            <div className="p-6 space-y-3">
                                {[
                                    { key: "bookingAlerts", label_en: "New Booking Alerts", label_bn: "নতুন বুকিং নোটিফিকেশন", desc_en: "Get notified when new booking requests arrive", desc_bn: "নতুন বুকিং রিকোয়েস্ট এলে নোটিফিকেশন পান" },
                                    { key: "quotationAlerts", label_en: "Quotation Requests", label_bn: "কোটেশন রিকোয়েস্ট", desc_en: "Receive alerts for quotation offers", desc_bn: "কোটেশন অফারের জন্য নোটিফিকেশন পান" },
                                    { key: "paymentAlerts", label_en: "Payment Updates", label_bn: "পেমেন্ট আপডেট", desc_en: "Get notified about payment status changes", desc_bn: "পেমেন্ট স্ট্যাটাস পরিবর্তনের নোটিফিকেশন পান" },
                                    { key: "supportUpdates", label_en: "Support Ticket Updates", label_bn: "সাপোর্ট টিকেট আপডেট", desc_en: "Receive updates on your support tickets", desc_bn: "সাপোর্ট টিকেটের আপডেট পান" },
                                ].map((item) => (
                                    <div key={item.key} className={cn(
                                        "flex items-center justify-between p-4 rounded-xl border transition-all",
                                        notifications[item.key as keyof typeof notifications] ? "bg-primary/5 border-primary/20" : "bg-slate-50 border-slate-100"
                                    )}>
                                        <div className="flex-1 min-w-0 mr-4">
                                            <p className="text-sm font-bold text-slate-900">{t(item.label_en, item.label_bn)}</p>
                                            <p className="text-xs text-slate-500 font-bold mt-0.5">{t(item.desc_en, item.desc_bn)}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                                            className={cn(
                                                "relative w-12 h-7 rounded-full transition-all duration-300 shrink-0",
                                                notifications[item.key as keyof typeof notifications] ? "bg-primary" : "bg-slate-200"
                                            )}
                                        >
                                            <div className={cn(
                                                "absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300",
                                                notifications[item.key as keyof typeof notifications] ? "left-6" : "left-1"
                                            )} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleSaveNotifications} disabled={saving} className="rounded-xl font-bold px-8 h-12 shadow bg-primary text-white">
                                {saving ? t("Saving...", "সংরক্ষণ হচ্ছে...") : t("Save Preferences", "পছন্দ সংরক্ষণ করুন")}
                            </Button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <DashboardLayout requiredRole="DRIVER">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 mb-2">
                    {t("Account Settings", "অ্যাকাউন্ট সেটিংস")}
                </h1>
                <p className="text-slate-600 font-bold text-sm">
                    {t("Manage your profile, vehicle information, and preferences.", "আপনার প্রোফাইল, যানবাহনের তথ্য এবং পছন্দগুলো পরিচালনা করুন।")}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Tabs */}
                <div className="lg:col-span-1">
                    <nav className="flex flex-col gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all text-left",
                                    activeTab === tab.id
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "text-slate-700 hover:bg-slate-50"
                                )}
                            >
                                <tab.icon className="w-5 h-5" />
                                {t(tab.label_en, tab.label_bn)}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}