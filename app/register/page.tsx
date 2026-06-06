"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft, User, Truck, Briefcase } from "lucide-react";

export default function RegisterPage() {
    const { t } = useLanguage();
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState<"user" | "driver" | "employee">("user");

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
        {
            id: "employee" as const,
            icon: Briefcase,
            title_en: "Employee",
            title_bn: "কর্মচারী",
            desc_en: "Register as a company employee",
            desc_bn: "কোম্পানির কর্মচারী হিসেবে রেজিস্টার",
        },
    ];

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

                        <div className="bg-white p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-3xl shadow-premium border border-gray-100">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <h1 className="text-2xl md:text-3xl font-black text-black mb-2">
                                    {t("Create Account", "অ্যাকাউন্ট তৈরি করুন")}
                                </h1>
                                <p className="text-gray-500 text-base md:text-lg">
                                    {t("Join TruckDorkar today", "আজই ট্রাক দরকারে যোগ দিন")}
                                </p>
                            </div>

                            {/* Role Selection */}
                            <div className="space-y-2 mb-6 md:mb-8">
                                <label className="text-sm font-bold text-gray-600">
                                    {t("Select Your Role", "আপনার ভূমিকা নির্বাচন করুন")}
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                                    {roles.map((role) => {
                                        const Icon = role.icon;
                                        const isSelected = selectedRole === role.id;
                                        return (
                                            <button
                                                key={role.id}
                                                type="button"
                                                onClick={() => setSelectedRole(role.id)}
                                                className={`p-4 md:p-5 rounded-xl md:rounded-2xl border-2 transition-all text-center group ${
                                                    isSelected
                                                        ? "border-primary bg-primary/5 shadow-md"
                                                        : "border-gray-100 hover:border-primary/30 bg-gray-50"
                                                }`}
                                            >
                                                <div className={`w-10 h-10 md:w-12 md:h-12 mx-auto mb-2 md:mb-3 rounded-full flex items-center justify-center transition-all ${
                                                    isSelected
                                                        ? "bg-primary text-white"
                                                        : "bg-white text-gray-400 group-hover:text-primary"
                                                }`}>
                                                    <Icon className="w-5 h-5 md:w-6 md:h-6" />
                                                </div>
                                                <div className={`text-sm md:text-base font-bold mb-1 ${isSelected ? "text-primary" : "text-black"}`}>
                                                    {t(role.title_en, role.title_bn)}
                                                </div>
                                                <div className="text-xs text-gray-500 leading-snug">
                                                    {t(role.desc_en, role.desc_bn)}
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Form */}
                            <form className="space-y-5 md:space-y-6">
                                                                {selectedRole !== "driver" && selectedRole !== "employee" ? (
                                                                    <div className="space-y-2">
                                                                        <label className="text-sm font-bold text-gray-600">
                                                                            {t("Full Name", "পুরো নাম")}
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            placeholder={t("Enter your full name", "আপনার পুরো নাম লিখুন")}
                                                                            className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                                        />
                                                                    </div>
                                ) : null}

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600">
                                        {t("Phone Number", "ফোন নম্বর")}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="01700-000000"
                                        className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>

                                {selectedRole === "driver" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600">
                                                {t("License Number", "লাইসেন্স নম্বর")}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={t("Enter license number", "লাইসেন্স নম্বর লিখুন")}
                                                className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600">
                                                {t("Experience (Years)", "অভিজ্ঞতা (বছর)")}
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="0"
                                                min="0"
                                                className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                )}

                                {selectedRole === "employee" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600">
                                                {t("Company Name", "কোম্পানির নাম")}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={t("Enter company name", "কোম্পানির নাম লিখুন")}
                                                className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600">
                                                {t("Employee ID", "কর্মচারী আইডি")}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={t("Enter employee ID", "কর্মচারী আইডি লিখুন")}
                                                className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600">
                                        {t("Email", "ইমেইল")}
                                    </label>
                                    <input
                                        type="email"
                                        placeholder={t("Enter your email", "আপনার ইমেইল লিখুন")}
                                        className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600">
                                        {t("Password", "পাসওয়ার্ড")}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            placeholder={t("Create password", "পাসওয়ার্ড তৈরি করুন")}
                                            className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 pr-12 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="text-sm text-gray-600 leading-relaxed">
                                        {t(
                                            "I agree to the",
                                            "আমি সম্মত হচেছি"
                                        )}{" "}
                                        <button type="button" className="font-bold text-primary hover:text-secondary">{t("Terms of Service", "সেবার শর্তাবলী")}</button>{" "}
                                        {t("and", "আর")}{" "}
                                        <button type="button" className="font-bold text-primary hover:text-secondary">{t("Privacy Policy", "গোপনীয়তা নীতি")}</button>
                                    </span>
                                </label>

                                <Button size="lg" className="w-full h-12 md:h-14 rounded-lg md:rounded-xl font-bold text-base md:text-lg transition-all hover:translate-y-[-2px] text-white">
                                    {t("Create Account", "অ্যাকাউন্ট তৈরি করুন")}
                                </Button>
                            </form>

                            {/* Login Link */}
                            <p className="text-center text-sm md:text-base text-gray-500 mt-6 md:mt-8">
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