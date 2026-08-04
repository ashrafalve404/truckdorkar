"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import {
    Phone,
    Mail,
    Gift,
    TrendingUp,
    CheckCircle2,
    ArrowRight,
    Briefcase,
    ShieldCheck,
    Wallet,
    Percent,
    PhoneCall,
    Truck
} from "lucide-react";
import Link from "next/link";

export default function PartnerWithUsPage() {
    const { t } = useLanguage();

    const benefits = [
        {
            icon: Gift,
            title_en: "Daily Bonus",
            title_bn: "প্রতিদিন বোনাস",
            desc_en: "Receive 200 TK direct balance top-up every day as an active Truck Dorkar agent.",
            desc_bn: "সক্রিয় এজেন্ট হিসেবে প্রতিদিন ২০০ টাকা সরাসরি ব্যালেন্স টপ-আপ উপভোগ করুন।",
            color: "bg-blue-600"
        },
        {
            icon: Percent,
            title_en: "Company Commission",
            title_bn: "কোম্পানি কমিশন",
            desc_en: "Get a dedicated commission from the company for every successful trip made by your drivers.",
            desc_bn: "আপনার যুক্ত করা ড্রাইভারে প্রতিটি সফল ট্রিপ থেকে কোম্পানি থেকে নির্দিষ্ট কমিশন পান।",
            color: "bg-green-600"
        },
        {
            icon: TrendingUp,
            title_en: "Passive Income",
            title_bn: "প্যাসিভ ইনকাম",
            desc_en: "Build a fleet and earn continuously without active participation in every booking.",
            desc_bn: "একটি বড় বহর তৈরি করুন এবং প্রতিটি বুকিংয়ে সক্রিয় না থেকেও আয় করতে থাকুন।",
            color: "bg-indigo-600"
        }
    ];

    const steps = [
        {
            icon: PhoneCall,
            title_en: "Admin Contact",
            title_bn: "অ্যাডমিন যোগাযোগ",
            desc_en: "Call our official number to start your partnership request.",
            desc_bn: "পার্টনারশিপ শুরু করতে আমাদের অফিসিয়াল নম্বরে কল দিন।"
        },
        {
            icon: Wallet,
            title_en: "Fee Settlement",
            title_bn: "ফি প্রদান",
            desc_en: "Complete the 100,000 TK registration fee to activate your dashboard.",
            desc_bn: "আপনার ড্যাশবোর্ড সক্রিয় করতে ১,০০,০০০ টাকা এককালীন ফি পরিশোধ করুন।"
        },
        {
            icon: Truck,
            title_en: "Fleet Building",
            title_bn: "রিসোর্স ম্যানেজমেন্ট",
            desc_en: "Add trucks and drivers to start receiving daily and trip earnings.",
            desc_bn: "ট্রাক ও ড্রাইভার যুক্ত করুন এবং প্রতিদিনের আয় নিশ্চিত করুন।"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="pt-20">
                <section
                    className="relative py-20 md:py-32 border-b border-slate-100 bg-cover bg-center overflow-hidden"
                    style={{ backgroundImage: "url('/images/agentpagebg.webp')" }}
                >
                    {/* Overlay for readability */}
                    <div className="absolute inset-0 bg-white/50" />

                    <div className="container mx-auto px-6 lg:px-12 text-center max-w-4xl relative z-10">
                        <motion.h1
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-3xl md:text-5xl font-black text-black mb-6 leading-tight"
                        >
                            {t("Become a Truck Dorkar Agent", "ট্রাক দরকার এজেন্ট হোন")}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-base md:text-lg text-black font-bold mb-10 max-w-2xl mx-auto"
                        >
                            {t(
                                "Unlock new revenue streams by joining our logistics platform. Manage your own fleet and earn daily bonuses plus trip-based company commissions.",
                                "আমাদের লজিস্টিক প্ল্যাটফর্মে যোগ দিয়ে আয়ের নতুন পথ উন্মুক্ত করুন। আপনার নিজস্ব বহর পরিচালনা করুন এবং প্রতিদিনের বোনাসসহ কোম্পানি কমিশন পান।"
                            )}
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap justify-center gap-4"
                        >
                            <a href="tel:01826-110036">
                                <Button className="h-14 px-8 rounded-lg font-black text-base gap-3 bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                                    <Phone className="w-5 h-5" />
                                    {t("Call Admin", "অ্যাডমিনকে কল করুন")}
                                </Button>
                            </a>
                            <a href="mailto:contact@truckdorkar.com">
                                <Button variant="outline" className="h-14 px-8 rounded-lg font-black text-base gap-3 border-2 border-white hover:bg-white/10 transition-all text-black">
                                    <Mail className="w-5 h-5 text-primary" />
                                    {t("Email Us", "ইমেইল করুন")}
                                </Button>
                            </a>
                        </motion.div>
                    </div>
                </section>

                {/* Benefits grid - more compact */}
                <section className="py-20 container mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {benefits.map((benefit, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm transition-all hover:shadow-md">
                                <div className={`w-12 h-12 rounded-lg ${benefit.color} text-white flex items-center justify-center mb-6`}>
                                    <benefit.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-3">
                                    {t(benefit.title_en, benefit.title_bn)}
                                </h3>
                                <p className="text-sm text-slate-600 font-bold leading-relaxed">
                                    {t(benefit.desc_en, benefit.desc_bn)}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Key Program Info Box */}
                <section className="pb-20 container mx-auto px-6 lg:px-12">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="bg-slate-900 p-8 md:p-10 text-white">
                                <h2 className="text-2xl font-bold mb-6 tracking-tight">
                                    {t("Investment & Returns", "বিনিয়োগ এবং রিটার্ন")}
                                </h2>
                                <div className="space-y-3">
                                    {[
                                        { en: "Fixed Registration Fee: 100,000 TK", bn: "স্থায়ী রেজিস্ট্রেশন ফি: ১,০০,০০০ টাকা" },
                                        { en: "Daily Recurring Bonus: 200 TK", bn: "প্রতিদিনের বোনাস: ২০০ টাকা" },
                                        { en: "Trip Commission from Company", bn: "কোম্পানি থেকে প্রতি ট্রিপে কমিশন" },
                                        { en: "Full Digital Dashboard Access", bn: "ডিজিটাল ড্যাশবোর্ড ব্যবহারের সুবিধা" }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                                            <span className="text-sm text-slate-300">{t(item.en, item.bn)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-8 md:p-10 text-center">
                                <p className="text-sm font-bold uppercase tracking-normal text-slate-400 mb-3">{t("Registration Fee", "রেজিস্ট্রেশন ফি")}</p>
                                <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">৳{t("100,000", "১,০০,০০০")}</div>
                                <div className="space-y-2">
                                    <a href="tel:01826-110036" className="block">
                                        <Button variant="default" className="w-full h-10 rounded-lg font-bold text-xs bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-2">
                                            <Phone className="w-3.5 h-3.5" />
                                            {t("Call Admin", "অ্যাডমিনকে কল করুন")}
                                        </Button>
                                    </a>
                                    <a href="mailto:contact@truckdorkar.com" className="block">
                                        <Button variant="outline" className="w-full h-10 rounded-lg font-bold text-xs border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center justify-center gap-2">
                                            <Mail className="w-3.5 h-3.5 text-primary" />
                                            {t("Email Us", "ইমেইল করুন")}
                                        </Button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Steps - refined with brand primary background & SVG shape overlay */}
                <section className="py-24 bg-primary text-white relative overflow-hidden">
                    {/* SVG shapes design */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Diagonal skew panels */}
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-white/[0.04] skew-x-[-25deg] translate-x-32" />
                        <div className="absolute top-0 right-12 w-12 h-full bg-white/[0.02] skew-x-[-25deg] translate-x-32" />

                        {/* Abstract vectors */}
                        <svg className="absolute -top-24 -left-20 w-80 h-80 text-white/5 opacity-40" viewBox="0 0 100 100" fill="currentColor">
                            <circle cx="50" cy="50" r="45" />
                        </svg>
                        <svg className="absolute -bottom-32 right-1/4 w-96 h-96 text-black/10 opacity-30" viewBox="0 0 100 100" fill="currentColor">
                            <polygon points="50,15 90,85 10,85" />
                        </svg>
                    </div>

                    <div className="container mx-auto px-6 lg:px-12 relative z-10">
                        <h2 className="text-3xl font-black text-center text-white mb-16">
                            {t("How to Become an Agent", "কিভাবে এজেন্ট হবেন?")}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
                            {steps.map((step, i) => (
                                <div key={i} className="flex flex-col items-center text-center p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                                    <div className="w-16 h-16 rounded-xl bg-white/10 text-white flex items-center justify-center shrink-0 shadow-lg hover:bg-white hover:text-primary transition-all duration-300 mb-6">
                                        <step.icon className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-3">{t(step.title_en, step.title_bn)}</h3>
                                        <p className="text-sm text-white leading-relaxed font-semibold">{t(step.desc_en, step.desc_bn)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}