"use client";

import React, { useEffect, useState, useRef } from "react";
import { DashboardLayout } from "@/components/dashboard/layout";
import { useLanguage } from "@/context/language-context";
import { useAuth } from "@/store/use-auth";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Camera,
    Shield,
    Clock,
    Loader2,
    Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import api, { getFileUrl } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ProfilePage() {
    const { t } = useLanguage();
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/users/profile");
                const data = response.data.data || response.data;
                setProfileData({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                });
                if (data.avatar) {
                    updateUser({ avatar: data.avatar });
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setFetching(false);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.patch("/users/profile", profileData);
            updateUser(profileData);
            toast.success(t("Profile updated successfully", "প্রোফাইল সফলভাবে আপডেট করা হয়েছে"));
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("Update failed", "আপডেট ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

            const response = await api.post("/users/profile/avatar", formData);

            const updatedData = response.data?.data || response.data;
            const newAvatar = updatedData.avatar || updatedData.url;
            
            updateUser({ avatar: newAvatar });
            toast.success(t("Profile picture updated successfully", "প্রোফাইল ছবি সফলভাবে পরিবর্তন হয়েছে"));
        } catch (error: any) {
            console.error("Avatar upload failed", error);
            toast.error(error.response?.data?.message || t("Failed to upload avatar", "প্রোফাইল ছবি আপলোড ব্যর্থ হয়েছে"));
        } finally {
            setUploadingAvatar(false);
        }
    };

    if (fetching) {
        return (
            <DashboardLayout requiredRole="USER">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout requiredRole="USER">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-black">
                    {t("Account Profile", "অ্যাকাউন্ট প্রোফাইল")}
                </h1>
                <p className="text-gray-500 font-bold">
                    {t("Manage your personal information and security settings.", "আপনার ব্যক্তিগত তথ্য এবং নিরাপত্তা সেটিংস পরিচালনা করুন।")}
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Avatar & Basic Info */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm text-center">
                        <div className="relative inline-block mb-6 cursor-pointer group" onClick={handleAvatarClick}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleAvatarChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl relative">
                                {user?.avatar ? (
                                    <img src={getFileUrl(user.avatar)} alt={user.name || "User Avatar"} className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-12 h-12 text-slate-300" />
                                )}
                                {uploadingAvatar && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <button
                                type="button"
                                disabled={uploadingAvatar}
                                className="absolute bottom-1 right-1 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center border-4 border-white shadow-lg group-hover:scale-110 transition-transform"
                            >
                                {uploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                            </button>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">{user?.name}</h3>
                        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">{user?.role}</p>

                        <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 text-left">
                            <div className="flex items-center gap-3 text-slate-500">
                                <Mail className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">{user?.email || t("No email added", "ইমেইল যোগ করা হয়নি")}</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-500">
                                <Phone className="w-4 h-4 text-primary" />
                                <span className="text-sm font-medium">{user?.phone}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/5 p-8 rounded-xl border border-primary/10">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="w-6 h-6 text-primary" />
                            <h4 className="text-lg font-bold text-slate-900">{t("Account Security", "অ্যাকাউন্ট নিরাপত্তা")}</h4>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6 font-bold">
                            {t("Your account is verified. To change your password, please use the reset option at login.", "আপনার অ্যাকাউন্ট ভেরিফাইড। পাসওয়ার্ড পরিবর্তন করতে লগইন পেজের রিসেট অপশন ব্যবহার করুন।")}
                        </p>
                        <div className="flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest">
                            <Clock className="w-3.5 h-3.5" />
                            {t("Last active: Today", "সর্বশেষ সক্রিয়: আজ")}
                        </div>
                    </div>
                </div>

                {/* Right Column: Edit Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white p-8 md:p-12 rounded-xl border border-slate-100 shadow-sm h-full">
                        <h2 className="text-2xl font-bold text-slate-900 mb-8">{t("Edit Information", "তথ্য পরিবর্তন")}</h2>
                        <form onSubmit={handleUpdate} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 ml-1">{t("Full Name", "পুরো নাম")}</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                        <input
                                            type="text"
                                            value={profileData.name}
                                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                            className="w-full h-14 bg-slate-50 border-none rounded-lg pl-12 pr-6 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-500 ml-1">{t("Phone Number", "ফোন নম্বর")}</label>
                                    <div className="relative">
                                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                        <input
                                            type="text"
                                            disabled
                                            value={profileData.phone}
                                            className="w-full h-14 bg-slate-50/50 border-none rounded-lg pl-12 pr-6 text-slate-400 font-bold cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 ml-1">{t("Email Address", "ইমেইল ঠিকানা")}</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        className="w-full h-14 bg-slate-50 border-none rounded-lg pl-12 pr-6 text-slate-900 font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="example@gmail.com"
                                    />
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button disabled={loading} className="w-full h-16 rounded-xl font-black text-lg gap-3 bg-primary text-white shadow-xl shadow-primary/20 transition-all hover:-translate-y-1">
                                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                        <>
                                            <Save className="w-5 h-5" />
                                            {t("Save Changes", "পরিবর্তন সংরক্ষণ করুন")}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
