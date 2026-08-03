"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";
import { ArrowLeft, PhoneCall, KeyRound, CheckCircle2, Eye, EyeOff, Loader2, RefreshCw } from "lucide-react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
    const { t } = useLanguage();
    const [step, setStep] = useState<"phone" | "otp" | "success">("phone");

    const [phone, setPhone] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [countdown, setCountdown] = useState(60);

    // Countdown Timer for OTP
    useEffect(() => {
        let timer: any;
        if (step === "otp" && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [step, countdown]);

    const validatePhone = (p: string) => {
        const regex = /^01[3-9]\d{8}$/;
        return regex.test(p);
    };

    // Step 1: Send SMS OTP
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePhone(phone)) {
            toast.error(t("Please enter a valid Bangladeshi phone number (e.g., 017xxxxxxxx)", "অনুগ্রহ করে একটি সঠিক বাংলাদেশী ফোন নম্বর দিন (যেমন: ০১৭১xxxxxxx)"));
            return;
        }

        setLoading(true);
        try {
            await api.post("/auth/forgot-password-phone", { phone: phone.trim() });
            setStep("otp");
            setCountdown(60);
            toast.success(t("OTP sent to your phone via SMS!", "আপনার ফোনে SMS এর মাধ্যমে OTP পাঠানো হয়েছে!"));
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("Failed to send OTP", "OTP পাঠাতে ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Resend OTP
    const handleResendOtp = async () => {
        if (countdown > 0) return;
        setResending(true);
        try {
            await api.post("/auth/forgot-password-phone", { phone: phone.trim() });
            setCountdown(60);
            toast.success(t("A new OTP code has been sent!", "একটি নতুন OTP কোড পাঠানো হয়েছে!"));
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("Failed to resend OTP", "OTP পুনরায় পাঠাতে ব্যর্থ হয়েছে"));
        } finally {
            setResending(false);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!otpCode || otpCode.length < 4) {
            toast.error(t("Please enter valid OTP code", "সঠিক OTP কোড দিন"));
            return;
        }

        if (newPassword.length < 6) {
            toast.error(t("Password must be at least 6 characters", "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে"));
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error(t("Passwords do not match", "পাসওয়ার্ড দুটি মেলেনি"));
            return;
        }

        setLoading(true);
        try {
            await api.post("/auth/reset-password-phone", {
                phone: phone.trim(),
                otp: otpCode.trim(),
                newPassword: newPassword,
            });

            setStep("success");
            toast.success(t("Password reset successful!", "পাসওয়ার্ড রিসেট সফল হয়েছে!"));
        } catch (error: any) {
            toast.error(error.response?.data?.message || t("Failed to reset password", "পাসওয়ার্ড রিসেট করতে ব্যর্থ হয়েছে"));
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
                        className="max-w-md mx-auto"
                    >
                        {/* Back Link */}
                        <Link href="/login" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6 md:mb-8">
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-bold">{t("Back to Login", "লগইনে ফিরুন")}</span>
                        </Link>

                        <div className="bg-white p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl shadow-premium border border-gray-100">
                            {step === "phone" && (
                                <>
                                    {/* Header */}
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                            <PhoneCall className="w-8 h-8" />
                                        </div>
                                        <h1 className="text-2xl md:text-3xl font-black text-black mb-2">
                                            {t("Forgot Password?", "পাসওয়ার্ড ভুলে গেছেন?")}
                                        </h1>
                                        <p className="text-slate-600 font-bold text-sm md:text-base">
                                            {t("Enter your registered phone number to receive an SMS OTP.", "SMS OTP পেতে আপনার নিবন্ধিত ফোন নম্বর লিখুন।")}
                                        </p>
                                    </div>

                                    {/* Phone Form */}
                                    <form onSubmit={handleSendOtp} className="space-y-5 md:space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-900">
                                                {t("Phone Number", "ফোন নম্বর")} <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                required
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="017XXXXXXXX"
                                                className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-slate-900 font-normal placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>

                                        <Button size="lg" disabled={loading} className="w-full h-12 md:h-14 rounded-lg md:rounded-xl font-bold text-base md:text-lg transition-all hover:translate-y-[-2px] text-white">
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : t("Send OTP via SMS", "SMS এর মাধ্যমে OTP পাঠান")}
                                        </Button>
                                    </form>
                                </>
                            )}

                            {step === "otp" && (
                                <>
                                    {/* Header */}
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                            <KeyRound className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
                                            {t("Reset Password", "পাসওয়ার্ড রিসেট করুন")}
                                        </h2>
                                        <p className="text-slate-600 text-xs md:text-sm font-semibold">
                                            {t("Enter the 6-digit OTP code sent via SMS to", "আপনার নম্বরে পাঠানো ৬ ডিজিটের OTP কোডটি লিখুন")}{" "}
                                            <span className="font-black text-primary">{phone}</span>
                                        </p>
                                    </div>

                                    {/* Reset Password Form */}
                                    <form onSubmit={handleResetPassword} className="space-y-5">
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
                                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl text-center text-2xl font-bold tracking-[0.3em] text-slate-900 placeholder:font-normal placeholder:text-slate-300 focus:border-primary focus:bg-white outline-none transition-all"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-900">
                                                {t("New Password", "নতুন পাসওয়ার্ড")} <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder={t("Enter new password", "নতুন পাসওয়ার্ড লিখুন")}
                                                    className="w-full h-12 bg-gray-50 border-none rounded-lg px-4 pr-12 text-slate-900 font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                                                >
                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-900">
                                                {t("Confirm New Password", "নতুন পাসওয়ার্ড নিশ্চিত করুন")} <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="password"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder={t("Confirm new password", "পাসওয়ার্ড পুনরায় লিখুন")}
                                                className="w-full h-12 bg-gray-50 border-none rounded-lg px-4 text-slate-900 font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            disabled={loading || otpCode.length < 4}
                                            className="w-full h-12 rounded-xl font-bold text-base text-white bg-primary hover:bg-primary/90 transition-all"
                                        >
                                            {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : t("Update Password", "পাসওয়ার্ড আপডেট করুন")}
                                        </Button>

                                        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                                            <button
                                                type="button"
                                                onClick={() => setStep("phone")}
                                                className="text-slate-500 hover:text-slate-900 font-bold"
                                            >
                                                {t("Change Phone", "ফোন পরিবর্তন")}
                                            </button>

                                            <button
                                                type="button"
                                                disabled={countdown > 0 || resending}
                                                onClick={handleResendOtp}
                                                className={`font-bold flex items-center gap-1.5 ${countdown > 0 ? "text-slate-400 cursor-not-allowed" : "text-primary hover:underline"}`}
                                            >
                                                {resending ? (
                                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                ) : (
                                                    <RefreshCw className="w-3.5 h-3.5" />
                                                )}
                                                {countdown > 0
                                                    ? `${t("Resend OTP in", "পুনরায় পাঠান")} ${countdown}s`
                                                    : t("Resend OTP", "পুনরায় OTP পাঠান")}
                                            </button>
                                        </div>
                                    </form>
                                </>
                            )}

                            {step === "success" && (
                                <div className="text-center py-6">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 mb-2">
                                        {t("Password Reset Successful!", "পাসওয়ার্ড রিসেট সফল হয়েছে!")}
                                    </h2>
                                    <p className="text-slate-600 text-sm md:text-base font-semibold mb-6">
                                        {t("Your password has been updated. You can now login with your new password.", "আপনার পাসওয়ার্ড আপডেট করা হয়েছে। এখন নতুন পাসওয়ার্ড দিয়ে লগইন করুন।")}
                                    </p>
                                    <Link href="/login" className="block">
                                        <Button size="lg" className="w-full h-12 rounded-xl font-bold text-white bg-primary hover:bg-primary/90">
                                            {t("Go to Login", "লগইন করুন")}
                                        </Button>
                                    </Link>
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