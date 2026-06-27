"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, User, Truck, Briefcase, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/use-auth";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const setAuth = useAuth((state) => state.setAuth);

    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<"user" | "driver">("user");
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
        licenseNumber: "",
        experience: "",
        companyName: "",
        agentId: "",
        nidNumber: "",
        dateOfBirth: "",
        agree: false,
    });

    const roles = [
        {
            id: "user" as const,
            icon: User,
            title_en: "Normal User",
            title_bn: "সাধারণ ব্যবহারকারী",
            desc_en: "Book trucks for personal or business needs",
            desc_bn: "ব্যক্তিগত বা ব্যবসার প্রয়োজনে ট্রাক বুক করুন",
        },
        {
            id: "driver" as const,
            icon: Truck,
            title_en: "Truck Driver",
            title_bn: "ট্রাক ড্রাইভার",
            desc_en: "Register as a driver to get booking requests",
            desc_bn: "বুকিং রিকোয়েস্ট পেতে ড্রাইভার হিসেবে রেজিস্টার",
        },
    ];

    const validatePhone = (phone: string) => {
        const regex = /^01[3-9]\d{8}$/;
        return regex.test(phone);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validatePhone(formData.phone)) {
            toast.error(t("Please enter a valid Bangladeshi phone number (e.g., 017xxxxxxxx)", "অনুগ্রহ করে একটি সঠিক বাংলাদেশী ফোন নম্বর দিন (যেমন: ০১৭১xxxxxxx)"));
            return;
        }

        if (!formData.agree) {
            toast.error(t("You must agree to the terms", "আপনাকে শর্তাবলীতে সম্মত হতে হবে"));
            return;
        }

        setLoading(true);
        try {
            const roleMap = {
                user: "USER",
                driver: "DRIVER",
            };

            const payload = {
                name: formData.name,
                phone: formData.phone,
                email: formData.email.trim() === "" ? undefined : formData.email,
                password: formData.password,
                role: roleMap[selectedRole as keyof typeof roleMap],
                licenseNumber: selectedRole === "driver" ? formData.licenseNumber : undefined,
                experience: selectedRole === "driver" ? Number(formData.experience) : undefined,
            };

            const { data } = await api.post("/auth/register", payload);

            setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
            toast.success(t("Registration successful!", "রেজিস্ট্রেশন সফল হয়েছে!"));

            if (payload.role === 'DRIVER') router.push('/driver/dashboard');
            else router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("Registration failed", "রেজিস্ট্রেশন ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-24 md:pt-32 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-2xl mx-auto"
                    >
                        {/* Back Link */}
                        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 md:mb-8">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-bold">{t("Back to Home", "হোম পেজে ফিরুন")}</span>
                        </Link>

                        <div className="bg-white p-6 md:p-8 lg:p-10 rounded-xl md:rounded-2xl shadow-premium border border-gray-100">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-2xl md:text-3xl font-black text-black mb-2">
                                    {t("Create Account", "অ্যাকাউন্ট তৈরি করুন")}
                                </h1>
                                <p className="text-slate-700 font-bold text-base md:text-lg">
                                    {t("Join TruckDorkar today", "আজই ট্রাক দরকারে যোগ দিন")}
                                </p>
                            </div>

                            {/* Role Selection */}
                            <div className="space-y-4 mb-8 text-center max-w-2xl mx-auto">
                                <label className="text-sm font-black text-slate-500 uppercase tracking-widest text-center block">
                                    {t("Select Your Role", "আপনার ভূমিকা নির্বাচন করুন")}
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {roles.map((role) => {
                                        const Icon = role.icon;
                                        const isSelected = selectedRole === role.id;
                                        return (
                                            <button
                                                key={role.id}
                                                type="button"
                                                onClick={() => setSelectedRole(role.id)}
                                                className={`p-4 md:p-5 rounded-lg md:rounded-xl border-2 transition-all text-center group ${isSelected
                                                    ? "border-primary bg-primary/5 shadow-md"
                                                    : "border-gray-100 hover:border-primary/30 bg-gray-50"
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 rounded-full flex items-center justify-center transition-all ${isSelected
                                                    ? "bg-primary text-white"
                                                    : "bg-white text-gray-400 group-hover:text-primary"
                                                    }`}>
                                                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                                                </div>
                                                <div className={`text-sm md:text-base font-bold mb-1 ${isSelected ? "text-primary" : "text-black"}`}>
                                                    {t(role.title_en, role.title_bn)}
                                                </div>
                                                <div className="text-xs text-slate-700 font-bold leading-snug">
                                                    {t(role.desc_en, role.desc_bn)}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-950">
                                        {t("Full Name", "পুরো নাম")} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder={t("Enter your full name", "আপনার পুরো নাম লিখুন")}
                                        className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-slate-950 font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-950">
                                        {t("Phone Number", "ফোন নম্বর")} <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="01700-000000"
                                        className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-slate-950 font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>

                                {selectedRole === "driver" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950">
                                                {t("License Number", "লাইসেন্স নম্বর")} <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.licenseNumber}
                                                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                                placeholder={t("Enter license number", "লাইসেন্স নম্বর লিখুন")}
                                                className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-slate-950 font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950">
                                                {t("Experience (Years)", "অভিজ্ঞতা (বছর)")} <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                value={formData.experience}
                                                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                                placeholder="0"
                                                min="0"
                                                className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-slate-950 font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                )}


                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-950">
                                        {t("Email", "ইমেইল")}
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder={t("Enter your email", "আপনার ইমেইল লিখুন")}
                                        className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-slate-950 font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-950">
                                        {t("Password", "পাসওয়ার্ড")} <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            placeholder={t("Create password", "পাসওয়ার্ড তৈরি করুন")}
                                            className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 pr-12 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        required
                                        checked={formData.agree}
                                        onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                                        className="w-5 h-5 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-slate-700 font-bold leading-relaxed">
                                        {t(
                                            "I agree to the",
                                            "আমি সম্মত হয়েছি"
                                        )}{" "}
                                        <Link href="/terms-of-service" className="font-bold text-primary hover:text-secondary">{t("Terms of Service", "সেবার শর্তাবলী")}</Link>{" "}
                                        {t("and", "আর")}{" "}
                                        <Link href="/privacy-policy" className="font-bold text-primary hover:text-secondary">{t("Privacy Policy", "গোপনীয়তা নীতি")}</Link>
                                    </span>
                                </label>

                                <Button size="lg" disabled={loading} className="w-full h-12 md:h-14 rounded-lg md:rounded-xl font-bold text-base md:text-lg transition-all hover:translate-y-[-2px] text-white">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("Create Account", "অ্যাকাউন্ট তৈরি করুন")}
                                </Button>
                            </form>

                            {/* Login Link */}
                            <p className="text-center text-sm md:text-base text-slate-700 font-bold mt-6 md:mt-8">
                                {t("Already have an account?", "ইতিমধ্যে অ্যাকাউন্ট আছে?")}{" "}
                                <Link href="/login" className="font-bold text-primary hover:text-secondary transition-colors">
                                    {t("Login", "লগইন")}
                                </Link>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}