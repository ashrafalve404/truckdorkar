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
    Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/store/use-auth";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

type Tab = "profile" | "truck" | "safety" | "notifications";
type LucideIcon = React.ComponentType<{ className?: string }>;

export default function DriverSettingsPage() {
    const { t } = useLanguage();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        phone: "",
        licenseNumber: "",
        experience: "",
        nidNumber: "",
    });

    const [notifications, setNotifications] = useState({
        bookingAlerts: true,
        quotationAlerts: true,
        paymentAlerts: true,
        supportUpdates: false,
    });

    const fetchProfile = useCallback(async () => {
        try {
            const res = await api.get("/drivers/profile");
            const d = res.data?.data || {};
            setProfile({
                name: d.user?.name || user?.name || "",
                email: d.user?.email || user?.email || "",
                phone: d.user?.phone || user?.phone || "",
                licenseNumber: d.licenseNumber || "",
                experience: d.experience?.toString() || "",
                nidNumber: d.nidNumber || "",
            });
        } catch (error) {
            console.error("Failed to fetch profile", error);
            toast.error(t("Failed to load profile", "প্রোফাইল লোড করতে ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchProfile();
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
        } catch {
            toast.error(t("Failed to update profile", "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে"));
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNotifications = async () => {
        setSaving(true);
        try {
            await api.patch("/drivers/notifications", notifications);
            toast.success(t("Notification preferences saved", "নোটিফিকেশন পছন্দ সংরক্ষিত হয়েছে"));
        } catch {
            toast.error(t("Failed to save preferences", "পছন্দ সংরক্ষণ করতে ব্যর্থ হয়েছে"));
        } finally {
            setSaving(false);
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
                                        {user?.avatar ? (
                                            <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl font-black text-primary bg-primary/5">
                                                {profile.name?.charAt(0) || "D"}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <Camera className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white" />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h3 className="text-xl font-black text-slate-900">{profile.name || "Driver Name"}</h3>
                                    <p className="text-sm text-slate-600 font-bold mt-1">{t("Driver ID:", "ড্রাইভার আইডি:")} {user?.id?.slice(0, 8) || "—"}</p>
                                    <div className="flex flex-wrap gap-3 mt-3 justify-center sm:justify-start">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                                            <UserCheck className="w-3.5 h-3.5" />
                                            {t("Verified", "ভেরিফাইড")}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            {t("Documents Approved", "ডকুমেন্ট অনুমোদিত")}
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
                                    {t("Verified Documents", "ভেরিফাইড ডকুমেন্টস")}
                                </h4>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="relative p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50/50 border border-green-100 group hover:border-green-200 transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-green-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
                                                <ShieldCheck className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-black text-green-700 uppercase tracking-widest">{t("NID CARD", "এনআইডি")}</p>
                                                <p className="text-sm font-bold text-green-900 mt-0.5">{t("Verified", "ভেরিফাইড")}</p>
                                            </div>
                                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                        </div>
                                    </div>
                                    <div className="relative p-5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50/50 border border-green-100 group hover:border-green-200 transition-all">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-green-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
                                                <ShieldCheck className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-black text-green-700 uppercase tracking-widest">{t("LICENSE", "লাইসেন্স")}</p>
                                                <p className="text-sm font-bold text-green-900 mt-0.5">{t("Verified", "ভেরিফাইড")}</p>
                                            </div>
                                            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                                        </div>
                                    </div>
                                </div>

                                <label className="flex items-center gap-4 p-5 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-all group">
                                    <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-primary/10 flex items-center justify-center transition-all">
                                        <Upload className="w-5 h-5 text-slate-500 group-hover:text-primary transition-colors" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-900">{t("Upload New Document", "নতুন ডকুমেন্ট আপলোড করুন")}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{t("PDF, JPG up to 10MB", "PDF, JPG সর্বোচ্চ ১০MB")}</p>
                                    </div>
                                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <Button onClick={handleSaveProfile} disabled={saving} className="h-12 px-8 rounded-xl font-bold gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all text-white">
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
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl p-8 md:p-12 border border-slate-100 text-center">
                            <div className="w-20 h-20 rounded-2xl bg-white shadow-lg shadow-slate-200/50 flex items-center justify-center mx-auto mb-6">
                                <Truck className="w-10 h-10 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">{t("No truck registered", "কোন ট্রাক রেজিস্টার করা নেই")}</h3>
                            <p className="text-sm text-slate-600 font-bold mb-8 max-w-md mx-auto">{t("Register your truck to start receiving job requests from shippers.", "কাজের রিকোয়েস্ট পেতে আপনার ট্রাক রেজিস্টার করুন।")}</p>
                            <Button className="rounded-xl font-bold px-8 h-12 shadow-lg shadow-primary/20 text-white">{t("Add Truck", "ট্রাক যোগ করুন")}</Button>
                        </div>
                    </div>
                );

            case "safety":
                return (
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-slate-50">
                                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                                    <Lock className="w-5 h-5 text-primary" />
                                    {t("Change Password", "পাসওয়ার্ড পরিবর্তন")}
                                </h4>
                                <p className="text-sm text-slate-500 font-bold mt-1">{t("Update your password regularly for security", "নিরাপত্তার জন্য নিয়মিত পাসওয়ার্ড আপডেট করুন")}</p>
                            </div>
                            <div className="p-6 space-y-5 max-w-lg">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t("Current Password", "বর্তমান পাসওয়ার্ড")}</label>
                                    <input type="password" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t("New Password", "নতুন পাসওয়ার্ড")}</label>
                                    <input type="password" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">{t("Confirm New Password", "নতুন পাসওয়ার্ড নিশ্চিত করুন")}</label>
                                    <input type="password" className="w-full h-12 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-900 font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all" />
                                </div>
                                <Button className="rounded-xl font-bold px-8 h-12 shadow-lg shadow-primary/20 text-white">{t("Update Password", "পাসওয়ার্ড আপডেট করুন")}</Button>
                            </div>
                        </div>
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
                                <p className="text-sm text-slate-500 font-bold mt-1">{t("Manage how you receive notifications", "আপনি কীভাবে নোটিফিকেশন পাবেন তা পরিচালনা করুন")}</p>
                            </div>
                            <div className="p-6 space-y-3">
                                {[
                                    { key: "bookingAlerts", label_en: "New Booking Alerts", label_bn: "নতুন বুকিং নোটিফিকেশন", desc_en: "Get notified when new booking requests arrive", desc_bn: "নতুন বুকিং রিকোয়েস্ট এলে নোটিফিকেশন পান" },
                                    { key: "quotationAlerts", label_en: "Quotation Requests", label_bn: "কোটেশন রিকোয়েস্ট", desc_en: "Receive alerts for quotation offers", desc_bn: "কোটেশন অফারের জন্য নোটিফিকেশন পান" },
                                    { key: "paymentAlerts", label_en: "Payment Updates", label_bn: "পেমেন্ট আপডেট", desc_en: "Get notified about payment status changes", desc_bn: "পেমেন্ট স্ট্যাটাস পরিবর্তনের নোটিফিকেশন পান" },
                                    { key: "supportUpdates", label_en: "Support Ticket Updates", label_bn: "সাপোর্ট টিকেট আপডেট", desc_en: "Receive updates on your support tickets", desc_bn: "সাপোর্ট টিকেটের আপডেট পান" },
                                ].map((item) => (
                                    <div key={item.key} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${notifications[item.key as keyof typeof notifications] ? "bg-primary/5 border-primary/20" : "bg-slate-50 border-slate-100"}`}>
                                        <div className="flex-1 min-w-0 mr-4">
                                            <p className="text-sm font-bold text-slate-900">{t(item.label_en, item.label_bn)}</p>
                                            <p className="text-xs text-slate-500 font-bold mt-0.5">{t(item.desc_en, item.desc_bn)}</p>
                                        </div>
                                        <button
                                            onClick={() => setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })}
                                            className={`relative w-12 h-7 rounded-full transition-all duration-300 shrink-0 ${notifications[item.key as keyof typeof notifications] ? "bg-primary" : "bg-slate-200"}`}
                                        >
                                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transform transition-all duration-300 ${notifications[item.key as keyof typeof notifications] ? "left-6" : "left-1"}`} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={handleSaveNotifications} disabled={saving} className="rounded-xl font-bold px-8 h-12 shadow-lg shadow-primary/20 text-white">
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
                <p className="text-slate-600 font-bold">
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
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-slate-700 hover:bg-slate-50"
                                    }`}
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