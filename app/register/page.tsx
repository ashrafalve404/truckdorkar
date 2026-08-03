"use client";

import React, { useState, useEffect, Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, User, Truck, Loader2, PhoneCall, KeyRound, RefreshCw } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/store/use-auth";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

function RegisterForm() {
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const setAuth = useAuth((state) => state.setAuth);

    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<"user" | "driver">("user");
    const [loading, setLoading] = useState(false);

    // ── OTP State ──
    const [showOtpStep, setShowOtpStep] = useState(false);
    const [otpCode, setOtpCode] = useState("");
    const [verifyingOtp, setVerifyingOtp] = useState(false);
    const [resendingOtp, setResendingOtp] = useState(false);
    const [countdown, setCountdown] = useState(60);

    // Sync role from URL
    useEffect(() => {
        const role = searchParams.get("role");
        if (role === "driver") {
            setSelectedRole("driver");
        }
    }, [searchParams]);

    // Countdown Timer for OTP
    useEffect(() => {
        let timer: any;
        if (showOtpStep && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [showOtpStep, countdown]);

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

    const [signupToken, setSignupToken] = useState("");

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

            if (data.data?.requiresOtp) {
                if (data.data.signupToken) {
                    setSignupToken(data.data.signupToken);
                }
                setShowOtpStep(true);
                setCountdown(60);
                toast.success(t("OTP code sent to your phone!", "আপনার ফোনে OTP কোড পাঠানো হয়েছে!"));
            } else {
                setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
                toast.success(t("Registration successful!", "রেজিস্ট্রেশন সফল হয়েছে!"));
                if (payload.role === 'DRIVER') router.push('/driver/dashboard');
                else router.push('/dashboard');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("Registration failed", "রেজিস্ট্রেশন ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!otpCode || otpCode.length < 4) {
            toast.error(t("Please enter valid OTP code", "সঠিক OTP কোড দিন"));
            return;
        }

        setVerifyingOtp(true);
        try {
            const { data } = await api.post("/auth/verify-phone-otp", {
                phone: formData.phone,
                otp: otpCode.trim(),
                signupToken: signupToken || undefined,
            });

            setAuth(data.data.user, data.data.accessToken, data.data.refreshToken);
            toast.success(t("Phone verified! Welcome to TruckDorkar", "ফোন ভেরিফাইড হয়েছে! ট্রাক দরকার-এ স্বাগতম"));

            const role = data.data.user?.role;
            if (role === 'DRIVER') router.push('/driver/dashboard');
            else router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("Invalid OTP code", "ভুল OTP কোড"));
        } finally {
            setVerifyingOtp(false);
        }
    };

    const handleResendOtp = async () => {
        if (countdown > 0) return;
        setResendingOtp(true);
        try {
            const { data } = await api.post("/auth/resend-registration-otp", {
                phone: formData.phone,
                signupToken: signupToken || undefined,
            });
            if (data.data?.signupToken) {
                setSignupToken(data.data.signupToken);
            }
            setCountdown(60);
            toast.success(t("A new OTP code has been sent!", "একটি নতুন OTP কোড পাঠানো হয়েছে!"));
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("Failed to resend OTP", "OTP পুনরায় পাঠাতে ব্যর্থ হয়েছে"));
        } finally {
            setResendingOtp(false);
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
                            {!showOtpStep ? (
                                <>
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
                                        <label className="text-xs font-bold text-slate-700 text-center block">
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
                                                className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-slate-900 font-normal placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
                                                placeholder="017XXXXXXXX"
                                                className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-slate-900 font-normal placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>

                                        {selectedRole === "driver" && (
                                            <>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-slate-950">
                                                        {t("Driving License Number", "ড্রাইভিং লাইসেন্স নম্বর")} <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        value={formData.licenseNumber}
                                                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                                                        placeholder={t("Enter license number", "লাইসেন্স নম্বর লিখুন")}
                                                        className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-slate-900 font-normal placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-slate-950">
                                                        {t("Years of Experience", "অভিজ্ঞতা (বছর)")}
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={formData.experience}
                                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                                        placeholder="e.g. 5"
                                                        className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-slate-900 font-normal placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950">
                                                {t("Email Address (Optional)", "ইমেইল ঠিকানা (ঐচ্ছিক)")}
                                            </label>
                                            <input
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                placeholder={t("Enter your email", "আপনার ইমেইল লিখুন")}
                                                className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-slate-900 font-normal placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
                                                    className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 pr-12 text-slate-900 font-normal placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
                                            <span className="text-sm text-slate-600 font-normal leading-relaxed">
                                                {t(
                                                    "I agree to the",
                                                    "আমি সম্মত হয়েছি"
                                                )}{" "}
                                                <Link href="/terms-of-service" className="font-medium text-primary hover:text-secondary">{t("Terms of Service", "সেবার শর্তাবলী")}</Link>{" "}
                                                {t("and", "আর")}{" "}
                                                <Link href="/privacy-policy" className="font-medium text-primary hover:text-secondary">{t("Privacy Policy", "গোপনীয়তা নীতি")}</Link>
                                            </span>
                                        </label>

                                        <Button size="lg" disabled={loading} className="w-full h-12 md:h-14 rounded-lg md:rounded-xl font-semibold text-base md:text-lg transition-all hover:translate-y-[-2px] text-white">
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("Create Account", "অ্যাকাউন্ট তৈরি করুন")}
                                        </Button>
                                    </form>

                                    {/* Login Link */}
                                    <p className="text-center text-sm md:text-base text-slate-600 font-medium mt-6 md:mt-8">
                                        {t("Already have an account?", "ইতিমধ্যে অ্যাকাউন্ট আছে?")}{" "}
                                        <Link href="/login" className="font-semibold text-primary hover:text-secondary transition-colors">
                                            {t("Login", "লগইন")}
                                        </Link>
                                    </p>
                                </>
                            ) : (
                                /* ── 6-Digit OTP Verification Screen ── */
                                <div className="py-4">
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                            <KeyRound className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                                            {t("Verify Phone Number", "ফোন নম্বর ভেরিফাই করুন")}
                                        </h2>
                                        <p className="text-slate-600 text-sm md:text-base font-semibold">
                                            {t("Enter the 6-digit OTP code sent via SMS to", "আপনার নম্বরে পাঠানো ৬ ডিজিটের OTP কোডটি লিখুন")}{" "}
                                            <span className="font-black text-primary">{formData.phone}</span>
                                        </p>
                                    </div>

                                    <form onSubmit={handleVerifyOtp} className="space-y-6 max-w-md mx-auto">
                                        <div className="space-y-2 text-center">
                                            <label className="text-xs font-normal text-slate-500 block mb-2">
                                                {t("6-Digit OTP Code", "৬ ডিজিটের OTP কোড")}
                                            </label>
                                            <input
                                                type="text"
                                                maxLength={6}
                                                required
                                                value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                                                placeholder="123456"
                                                className="w-full h-16 bg-slate-50 border border-slate-200 rounded-xl text-center text-3xl font-bold tracking-[0.4em] text-slate-900 placeholder:font-normal placeholder:text-slate-300 focus:border-primary focus:bg-white outline-none transition-all"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={verifyingOtp || otpCode.length < 4}
                                            className="w-full h-14 rounded-xl font-bold text-lg text-white bg-primary hover:bg-primary/90 transition-all"
                                        >
                                            {verifyingOtp ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : t("Complete Registration", "রেজিস্ট্রেশন সম্পন্ন করুন")}
                                        </Button>

                                        <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100">
                                            <button
                                                type="button"
                                                onClick={() => setShowOtpStep(false)}
                                                className="text-slate-500 hover:text-slate-900 font-bold"
                                            >
                                                {t("Change Phone Number", "ফোন নম্বর পরিবর্তন")}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={countdown > 0 || resendingOtp}
                                                onClick={handleResendOtp}
                                                className={`font-bold flex items-center gap-1.5 ${countdown > 0 ? "text-slate-400 cursor-not-allowed" : "text-primary hover:underline"}`}
                                            >
                                                {resendingOtp ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <RefreshCw className="w-4 h-4" />
                                                )}
                                                {countdown > 0
                                                    ? `${t("Resend OTP in", "পুনরায় পাঠান")} ${countdown}s`
                                                    : t("Resend OTP", "পুনরায় OTP পাঠান")}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <RegisterForm />
        </Suspense>
    );
}