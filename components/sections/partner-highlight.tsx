"use client";

import React from "react";
import { Briefcase, ArrowRight, Gift, Percent, Phone, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";

export function PartnerHighlight() {
    const { t, lang } = useLanguage();

    return (
        <section className="bg-slate-50 text-black relative border-y border-slate-200/50 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[500px]">

                {/* Left side: text, features, and buttons */}
                <div className="lg:col-span-7 py-20 px-6 sm:px-12 lg:pl-[8%] xl:pl-[12%] lg:pr-16 flex flex-col justify-center relative">
                    {/* Subtle premium background pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(235,52,52,0.02),transparent_60%)] pointer-events-none" />

                    <div className="relative z-10">
                        <div className="text-primary font-bold mb-4">
                            {t("Agent Program", "এজেন্ট প্রোগ্রাম")}
                        </div>
                        <h2 className={cn(
                            "font-black text-slate-900 tracking-tight mb-6 leading-tight",
                            lang === "bn" ? "text-2xl md:text-3xl lg:text-4xl" : "text-3xl md:text-4xl lg:text-5xl"
                        )}>
                            {t("Become a Truck Dorkar Agent & Earn Daily", "ট্রাক দরকার এজেন্ট হয়ে প্রতিদিন আয় করুন")}
                        </h2>
                        <p className={cn(
                            "text-slate-600 font-bold mb-8 leading-relaxed",
                            lang === "bn" ? "text-xs md:text-sm" : "text-sm md:text-base"
                        )}>
                            {t(
                                "Build and manage your own fleet on our logistics platform. Benefit from instant daily bonuses, continuous trip commissions, and full digital dashboard management tools.",
                                "আমাদের লজিস্টিক প্ল্যাটফর্মে আপনার নিজস্ব গাড়ির বহর পরিচালনা করুন। উপভোগ করুন তাৎক্ষণিক প্রতিদিনের বোনাস, নিশ্চিত ট্রিপ কমিশন এবং সম্পূর্ণ ডিজিটাল ম্যানেজমেন্ট সুবিধা।"
                            )}
                        </p>

                        {/* Features list inline */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-200/60 hover:border-primary/20 transition-all duration-300 shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm">
                                    <Gift className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className={cn("font-bold text-slate-900", lang === "bn" ? "text-xs" : "text-sm")}>{t("Daily Bonus", "প্রতিদিন বোনাস")}</h4>
                                    <p className={cn("font-bold text-slate-500", lang === "bn" ? "text-[10px]" : "text-xs")}>{t("Earn 25 TK daily top-up active bonus", "সক্রিয় এজেন্ট হিসেবে প্রতিদিন ২৫ টাকা টপ-আপ")}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-5 rounded-2xl bg-white border border-slate-200/60 hover:border-primary/20 transition-all duration-300 shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-primary/5 text-primary flex items-center justify-center shrink-0 border border-primary/10 shadow-sm">
                                    <Percent className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className={cn("font-bold text-slate-900", lang === "bn" ? "text-xs" : "text-sm")}>{t("Trip Commission", "ট্রিপ কমিশন")}</h4>
                                    <p className={cn("font-bold text-slate-500", lang === "bn" ? "text-[10px]" : "text-xs")}>{t("Get lucrative commissions per trip", "প্রতিটি সফল ট্রিপ থেকে সরাসরি কমিশন পান")}</p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap items-center gap-4">
                            <Link href="/partner-with-us">
                                <Button className="h-14 px-8 rounded-xl font-black text-sm uppercase tracking-wide gap-1.5 bg-slate-950 text-white hover:bg-slate-900 group shadow-md shadow-slate-950/10">
                                    {t("Learn More", "বিস্তারিত জানুন")}
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <a href="tel:01826-110036">
                                <Button variant="outline" className="h-14 px-8 rounded-xl font-black text-sm uppercase tracking-wide gap-1.5 border-2 hover:bg-slate-50 text-slate-800 animate-pulse">
                                    <Phone className="w-4 h-4 text-primary" />
                                    {t("Call Admin", "অ্যাডমিনকে কল করুন")}
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-5 relative min-h-[450px] lg:min-h-full flex flex-col justify-end p-8 md:p-12 lg:p-16 text-white overflow-hidden bg-cover bg-center lg:rounded-l-3xl rounded-t-3xl lg:rounded-tr-none" style={{ backgroundImage: "url('/images/agentpagebg.png')" }}>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-900/60" />

                    <div className="relative z-10 space-y-6">
                        <div className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                            {t("AGENT BENEFITS SUMMARY", "এজেন্টের সুবিধাসমূহ")}
                        </div>
                        <div className="text-2xl md:text-3xl font-black leading-snug">{t("Low investment, high returns.", "স্বল্প বিনিয়োগে সর্বোচ্চ আয়ের সুযোগ।")}</div>
                        <div className="h-0.5 w-12 bg-primary rounded" />
                        <ul className="space-y-4 text-xs md:text-sm text-slate-200 font-bold">
                            <li className="flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>{t("Complete Digital Dashboard Access", "ডিজিটাল ড্যাশবোর্ড ব্যবহারের সুবিধা")}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>{t("Grow Your Fleet with Drivers & Agents", "সহজেই বহর ও চালক বৃদ্ধি")}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                                <span>{t("24/7 dedicated support desk", "২৪/৭ সার্বক্ষণিক হেল্পডেস্ক সমর্থন")}</span>
                            </li>
                        </ul>
                    </div>
                </div>

            </div>
        </section>
    );
}
