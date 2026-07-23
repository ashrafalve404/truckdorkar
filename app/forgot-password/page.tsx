"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
    const { t } = useLanguage();
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
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
                            {!isSubmitted ? (
                                <>
                                    {/* Header */}
                                    <div className="text-center mb-8">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Mail className="w-8 h-8 text-primary" />
                                        </div>
                                        <h1 className="text-2xl md:text-3xl font-black text-black mb-2">
                                            {t("Forgot Password?", "পাসওয়ার্ড ভুলে গেছেন?")}
                                        </h1>
                                        <p className="text-gray-500 text-base md:text-lg">
                                            {t("No worries, we'll send you reset instructions.", "চিন্তা নয়, আমরা আপনার জন্য পাসওয়ার্ড রিসেটের নির্দেশিকা পাঠাব।")}
                                        </p>
                                    </div>

                                    {/* Form */}
                                    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600">
                                                {t("Email Address", "ইমেইল ঠিকানা")}
                                            </label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder={t("Enter your email", "আপনার ইমেইল লিখুন")}
                                                className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-slate-900 font-normal placeholder:font-normal placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                required
                                            />
                                        </div>

                                        <Button size="lg" className="w-full h-12 md:h-14 rounded-lg md:rounded-xl font-bold text-base md:text-lg transition-all hover:translate-y-[-2px] text-white">
                                            {t("Reset Password", "পাসওয়ার্ড রিসেট করুন")}
                                        </Button>
                                    </form>

                                    {/* Back to Login */}
                                    <p className="text-center text-sm md:text-base text-gray-500 mt-6 md:mt-8">
                                        {t("Remember your password?", "পাসওয়ার্ড মনে পড়ে গেল?")}{" "}
                                        <Link href="/login" className="font-bold text-primary hover:text-secondary transition-colors">
                                            {t("Back to Login", "লগইনে ফিরুন")}
                                        </Link>
                                    </p>
                                </>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-black text-black mb-2">
                                        {t("Check your email", "আপনার ইমেইল চেক করুন")}
                                    </h2>
                                    <p className="text-gray-500 text-base md:text-lg mb-6">
                                        {t("We've sent password reset instructions to", "আমরা পাসওয়ার্ড রিসেট করার নির্দেশিকা পাঠিয়েছি")}{" "}
                                        <span className="font-bold text-primary">{email || "your email"}</span>
                                    </p>
                                    <Button size="lg" className="text-white" onClick={() => setIsSubmitted(false)}>
                                        {t("Try another email", "অন্যান্য ইমেইল চেষ্টা করুন")}
                                    </Button>
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