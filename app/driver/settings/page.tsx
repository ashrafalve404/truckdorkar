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
    ArrowRight,
    Eye,
    EyeOff,
    Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/use-auth";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn, getAvatarUrl } from "@/lib/utils";

type Tab = "profile" | "truck" | "safety" | "notifications";
type LucideIcon = React.ComponentType<{ className?: string }>;

export default function DriverSettingsPage() {
    const { t } = useLanguage();
    const { user, updateUser } = useAuth();
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

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [notifications, setNotifications] = useState({
        bookingAlerts: true,
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
            const res = await api.post("/users/profile/avatar", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const updatedData = res.data?.data || res.data;
            const newAvatar = updatedData.avatar || updatedData.url;
            updateUser({ avatar: newAvatar });
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
                const driverStatusObj = {
                    VERIFIED: { icon: CheckCircle2, text: t("Verified Driver", "ভেরিফাইড ড্রাইভার"), color: "text-green-500", bg: "bg-green-50" },
                    REJECTED: { icon: XCircle, text: t("Rejected", "প্রত্যাখ্যান করা হয়েছে"), color: "text-red-500", bg: "bg-red-50" },
                    PENDING: { icon: Clock, text: t("Pending Verification", "অপেক্ষমান যাচাইকরণ"), color: "text-amber-500", bg: "bg-amber-50" },
                }[driverData?.status as 'VERIFIED' | 'REJECTED' | 'PENDING'] || { icon: ShieldCheck, text: t("Unverified", "অযাচাইকৃত"), color: "text-slate-400", bg: "bg-slate-50" };

                const StatusIconComp = driverStatusObj.icon;

                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Avatar & Verification Banner */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Avatar Card */}
                            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm text-center">
                                <div
                                    className="relative inline-block mb-4 cursor-pointer group"
                                    onClick={() => {
                                        const el = document.getElementById("driver-avatar-input");
                                        if (el) el.click();
                                    }}
                                    title={t("Click to change profile picture", "প্রোফাইল ছবি পরিবর্তন করতে ক্লিক করুন")}
                                >
                                    <input
                                        type="file"
                                        id="driver-avatar-input"
                                        onChange={handleUploadAvatar}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <div className="w-28 h-28 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl relative mx-auto">
                                        {user?.avatar || driverData?.user?.avatar ? (
                                            <img src={getAvatarUrl(user?.avatar || driverData?.user?.avatar) || ""} alt="Driver Avatar" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl font-black text-primary bg-primary/5">
                                                {profile.name?.charAt(0) || "D"}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="absolute bottom-0 right-0 w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white shadow-md group-hover:scale-110 transition-transform"
                                    >
                                        <Camera className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <h3 className="font-black text-slate-900 text-lg">{profile.name || "Driver Name"}</h3>
                                <p className="text-xs text-slate-500 font-bold mt-1">
                                    {t("Driver ID:", "ড্রাইভার আইডি:")} <span className="font-black text-slate-700">#{user?.id?.slice(0, 8).toUpperCase() || "—"}</span>
                                </p>
                            </div>

                            {/* Status Card */}
                            <div className={`p-8 rounded-2xl border border-slate-100 shadow-sm ${driverStatusObj.bg}`}>
                                <div className={`w-14 h-14 rounded-xl ${driverStatusObj.color} bg-white flex items-center justify-center mb-5 shadow-sm`}>
                                    <StatusIconComp className="w-7 h-7" />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 mb-2">{driverStatusObj.text}</h3>
                                <p className="text-xs font-bold text-slate-600 leading-relaxed">
                                    {driverData?.status === 'VERIFIED'
                                        ? t("Your driver profile and documents are fully verified.", "আপনার ড্রাইভার প্রোফাইল এবং ডকুমেন্টস সম্পূর্ণ ভেরিফাইড।")
                                        : t("Please upload your NID and Driving License documents for admin approval.", "অ্যাডমিন অনুমোদনের জন্য আপনার এনআইডি এবং ড্রাইভিং লাইসেন্স আপলোড করুন।")}
                                </p>
                            </div>
                        </div>

                        {/* Right Column: Personal Information & Documents Form */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Personal Information Form */}
                            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-6">
                                <h4 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    {t("Personal Information", "ব্যক্তিগত তথ্য")}
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-700 uppercase tracking-widest">{t("Full Name", "পুরো নাম")}</label>
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-sm font-bold text-slate-950 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-700 uppercase tracking-widest">{t("Phone Number", "ফোন নম্বর")}</label>
                                        <input
                                            type="text"
                                            value={profile.phone}
                                            disabled
                                            className="w-full h-14 bg-slate-100 border border-slate-200 rounded-2xl px-5 text-sm font-bold text-slate-500 outline-none cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-700 uppercase tracking-widest">{t("Email Address", "ইমেইল অ্যাড্রেস")}</label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-sm font-bold text-slate-950 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-700 uppercase tracking-widest">{t("Driving License No", "লাইসেন্স নম্বর")}</label>
                                        <input
                                            type="text"
                                            value={profile.licenseNumber}
                                            onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })}
                                            className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl px-5 text-sm font-bold text-slate-950 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-2 flex justify-end">
                                    <Button
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="h-14 px-8 rounded-2xl font-black bg-slate-950 hover:bg-slate-900 text-white shadow-xl gap-2"
                                    >
                                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        {t("Update Profile", "প্রোফাইল আপডেট করুন")}
                                    </Button>
                                </div>
                            </div>

                            {/* Verification Documents Upload Grid */}
                            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                                <h4 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                    {t("Uploaded Verification Documents", "আপলোডকৃত ভেরিফিকেশন ফাইলসমূহ")}
                                </h4>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        { key: "nidFront", label_en: "NID Front Side", label_bn: "এনআইডি সামনের দিক", url: driverData?.nidFront },
                                        { key: "nidBack", label_en: "NID Back Side", label_bn: "এনআইডি পিছনের দিক", url: driverData?.nidBack },
                                        { key: "licenseFront", label_en: "Driving License Front", label_bn: "লাইসেন্স সামনের দিক", url: driverData?.licenseFront },
                                        { key: "licenseBack", label_en: "Driving License Back", label_bn: "লাইসেন্স পিছনের দিক", url: driverData?.licenseBack },
                                    ].map((doc) => (
                                        <div key={doc.key} className="space-y-3">
                                            <label className="text-xs font-black text-slate-700 uppercase tracking-widest">
                                                {t(doc.label_en, doc.label_bn)}
                                            </label>
                                            <div className="relative group">
                                                <div className="aspect-[1.6/1] rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden relative p-2">
                                                    {doc.url ? (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-center">
                                                            <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                                                            <span className="text-xs font-bold text-slate-900 mb-1">{t("Document Uploaded", "ডকুমেন্ট আপলোড করা হয়েছে")}</span>
                                                            <a href={getAvatarUrl(doc.url) || doc.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary underline font-bold">
                                                                {t("View File", "ফাইল দেখুন")}
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center text-center">
                                                            <Camera className="w-8 h-8 text-slate-300 mb-2 group-hover:text-primary transition-colors" />
                                                            <p className="text-[10px] font-bold text-slate-400">{t("Click to upload photo", "ডকুমেন্টের ছবি আপলোড করতে ক্লিক করুন")}</p>
                                                        </div>
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept=".pdf,image/*"
                                                        onChange={(e) => {
                                                            if (e.target.files?.[0]) handleUploadDoc(doc.key, e.target.files[0]);
                                                        }}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "truck":
                return (
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
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
                    <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-6">
                        <div className="border-b border-slate-100 pb-6">
                            <h4 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                <Lock className="w-5 h-5 text-primary" />
                                {t("Change Password", "পাসওয়ার্ড পরিবর্তন")}
                            </h4>
                            <p className="text-xs font-bold text-slate-500 mt-1">
                                {t("Update your password regularly for security", "নিরাপত্তার জন্য নিয়মিত পাসওয়ার্ড আপডেট করুন")}
                            </p>
                        </div>

                        <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-xl">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">
                                    {t("Current Password", "বর্তমান পাসওয়ার্ড")}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={passwords.currentPassword}
                                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-12 text-sm font-bold text-slate-950 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                                    >
                                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">
                                    {t("New Password", "নতুন পাসওয়ার্ড")}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={passwords.newPassword}
                                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-12 text-sm font-bold text-slate-950 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                                    >
                                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 uppercase tracking-widest ml-1">
                                    {t("Confirm New Password", "নতুন পাসওয়ার্ড নিশ্চিত করুন")}
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={passwords.confirmPassword}
                                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                        placeholder="••••••••"
                                        className="w-full h-14 bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-12 text-sm font-bold text-slate-950 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="h-14 px-8 rounded-2xl font-black bg-slate-950 hover:bg-slate-900 text-white shadow-xl gap-2"
                                >
                                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {t("Update Password", "পাসওয়ার্ড আপডেট করুন")}
                                </Button>
                            </div>
                        </form>
                    </div>
                );

            case "notifications":
                return (
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm space-y-6">
                        <div className="border-b border-slate-100 pb-6">
                            <h4 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                <Bell className="w-5 h-5 text-primary" />
                                {t("Notification Preferences", "নোটিফিকেশন পছন্দ")}
                            </h4>
                            <p className="text-xs font-bold text-slate-500 mt-1">
                                {t("Manage how you receive notifications", "আপনি কীভাবে নোটিফিকেশন পাবেন তা পরিচালনা করুন")}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { key: "bookingAlerts", label_en: "New Booking Alerts", label_bn: "নতুন বুকিং নোটিফিকেশন", desc_en: "Get notified when new booking requests arrive", desc_bn: "নতুন বুকিং রিকোয়েস্ট এলে নোটিফিকেশন পান" },
                                { key: "paymentAlerts", label_en: "Payment Updates", label_bn: "পেমেন্ট আপডেট", desc_en: "Get notified about payment status changes", desc_bn: "পেমেন্ট স্ট্যাটাস পরিবর্তনের নোটিফিকেশন পান" },
                                { key: "supportUpdates", label_en: "Support Ticket Updates", label_bn: "সাপোর্ট টিকেট আপডেট", desc_en: "Receive updates on your support tickets", desc_bn: "সাপোর্ট টিকেটের আপডেট পান" },
                            ].map((item) => (
                                <div key={item.key} className={cn(
                                    "flex items-center justify-between p-5 rounded-2xl border transition-all",
                                    notifications[item.key as keyof typeof notifications] ? "bg-primary/5 border-primary/20" : "bg-slate-50 border-slate-100"
                                )}>
                                    <div className="flex-1 min-w-0 mr-4">
                                        <p className="text-sm font-black text-slate-900">{t(item.label_en, item.label_bn)}</p>
                                        <p className="text-xs text-slate-500 font-bold mt-1">{t(item.desc_en, item.desc_bn)}</p>
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

                        <div className="pt-2 flex justify-end">
                            <Button
                                onClick={handleSaveNotifications}
                                disabled={saving}
                                className="h-14 px-8 rounded-2xl font-black bg-slate-950 hover:bg-slate-900 text-white shadow-xl gap-2"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                {t("Save Preferences", "পছন্দ সংরক্ষণ করুন")}
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
                    {renderTabContent()}
                </div>
            </div>
        </DashboardLayout>
    );
}