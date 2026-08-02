"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight, MessageSquare, Send, Share2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/language-context";

const faqs_en = [
    { q: "How do I book a truck?", a: "You can easily book a truck through our website or mobile app by providing your pickup and drop locations." },
    { q: "How is the fare determined?", a: "Our system automatically determines an affordable fare based on distance, truck type, and goods." },
    { q: "What is the safety of my goods?", a: "All our drivers are verified and every trip is tracked in real-time. We also provide insurance facilities." },
    { q: "Is the service available on weekends or holidays?", a: "Yes, TruckDorkar is at your service 24/7. Booking is possible on holidays and nights as well." },
];

const faqs_bn = [
    { q: "কিভাবে ট্রাক বুক করব?", a: "আমাদের ওয়েবসাইট বা মোবাইল অ্যাপে আপনার পিকআপ এবং ড্রপ লোকেশন দিয়ে সহজেই ট্রাক বুক করতে পারেন।" },
    { q: "ভাড়া কিভাবে নির্ধারণ হয়?", a: "দূরত্ব, ট্রাকের ধরণ এবং মালামালের বিষয়ের ওপর ভিত্তি করে আমাদের সিস্টেম স্বয়ংক্রিয়ভাবে সাশ্রয়ী ভাড়া নির্ধারণ করে।" },
    { q: "আমার মালামালের নিরাপত্তা কি?", a: "আমাদের সব ড্রাইভার ভেরিফাইড এবং প্রতিটি ট্রিপ রিয়েল-টাইমে ট্র্যাক করা হয়। এছাড়া আমরা বিমা সুবিধাও প্রদান করে থাকি।" },
    { q: "উইকেন্ড বা ছুটির দিনে কি সার্ভিস চালু থাকে?", a: "হ্যাঁ, ট্রাক দরকার ২৪/৭ আপনার সেবায় নিয়োজিত। ছুটির দিন ও রাতেও বুকিং করা সম্ভব।" },
];

export function FAQ() {
    const { lang, t } = useLanguage();
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const faqs = lang === "en" ? faqs_en : faqs_bn;

    return (
        <section className="py-16 md:py-24 bg-light-gray text-black">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
                    <div>
                        <div className="text-primary font-bold mb-4">{t("Questions", "জিজ্ঞাসা")}</div>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-black mb-6 md:mb-8">
                            {t("Commonly Asked Questions", "সাধারণ কিছু প্রশ্ন")}
                        </h2>
                        <p className="text-base md:text-lg text-gray-500 mb-8 md:mb-10 max-w-md">
                            {t("Find quick answers to common questions about our trucking services and platform.", "আমাদের সার্ভিস এবং প্ল্যাটফর্ম সম্পর্কে সাধারণ কিছু প্রশ্নের উত্তর এখানে দেখে নিন।")}
                        </p>
                        <Button size="lg" className="rounded-xl font-bold gap-2 px-6 md:px-8 h-12 md:h-16 transition-all hover:translate-y-[-4px] text-white">
                            <MessageSquare className="w-5 h-5" />
                            {t("Talk to Support Team", "সাপোর্ট টিমের সাথে কথা বলুন")}
                        </Button>
                    </div>

                    <div className="space-y-3 md:space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl md:rounded-2xl overflow-hidden border border-gray-100 shadow-soft transition-all">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full p-4 md:p-6 lg:p-8 flex items-center justify-between text-left group"
                                >
                                    <span className="text-base md:text-lg font-bold text-black group-hover:text-primary transition-colors">{faq.q}</span>
                                    <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-100 flex items-center justify-center transition-all ${openIndex === index ? 'bg-primary border-primary text-white' : 'text-gray-400'}`}>
                                        {openIndex === index ? <Minus className="w-3 h-3 md:w-4 md:h-4" /> : <Plus className="w-3 h-3 md:w-4 md:h-4" />}
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 text-gray-500 leading-relaxed border-t border-gray-50 pt-4 md:pt-6">{faq.a}</div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function FinalCTA() {
    const { t } = useLanguage();
    return (
        <section className="py-16 md:py-24 bg-primary relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-[-20deg] translate-x-20" />
            <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 text-center">
                <h2 className="text-2xl md:text-3xl lg:text-5xl font-black text-white mb-6 md:mb-8">
                    {t("Ready to transport goods?", "পণ্য পরিবহনে প্রস্তুত?")}
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-8 md:mb-12 max-w-2xl mx-auto">
                    {t("Join thousands of businesses who trust TruckDorkar for their logistics needs.", "হাজারো ব্যবসার সাথে যোগ দিন যারা তাদের লজিস্টিক প্রয়োজনে ট্রাক দরকার-এর ওপর আস্থা রাখে।")}
                </p>
                <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                    <Link href="/bookings/new">
                        <Button size="lg" variant="secondary" className="rounded-xl font-bold px-6 md:px-10 h-12 md:h-16 text-base md:text-lg hover:translate-y-[-4px] transition-all">
                            {t("Book Now", "বুকিং শুরু করুন")}
                        </Button>
                    </Link>
                    <Link href="/contact">
                        <Button size="lg" className="rounded-xl font-bold px-6 md:px-10 h-12 md:h-16 text-base md:text-lg border-2 border-white bg-transparent hover:bg-white hover:text-primary hover:translate-y-[-4px] transition-all text-white">
                            {t("Contact Us", "যোগাযোগ করুন")}
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

export function Footer() {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-light-gray pt-16 md:pt-24 pb-8 md:pb-12 border-t border-gray-200 rounded-t-[32px] md:rounded-t-[64px] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.08)]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 md:gap-16 lg:gap-8 mb-16 md:mb-20">
                    <div className="lg:col-span-4 space-y-4 md:space-y-6 text-black pr-0 lg:pr-8">
                        <div className="flex flex-wrap items-center gap-3 md:gap-4">
                            <Image
                                src="/logos/mainlogo1.png"
                                alt="TruckDorkar Logo"
                                width={500}
                                height={150}
                                className="h-36 w-auto object-contain"
                            />
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl md:text-4xl font-black tracking-tight text-primary">Truck</span>
                                <span className="text-2xl md:text-4xl font-black tracking-tight text-black">Dorkar</span>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            {t(
                                "Bangladesh's number one digital logistics platform. We are making product transportation easier, faster, and more affordable.",
                                "বাংলাদেশের এক নম্বর ডিজিটাল লজিস্টিক প্ল্যাটফর্ম। আমরা পণ্য পরিবহনকে করছি আরও সহজ, দ্রুত এবং সাশ্রয়ী।"
                            )}
                        </p>
                        <div className="flex gap-3 md:gap-4">
                            {[
                                {
                                    label: "Facebook",
                                    href: "https://www.facebook.com/profile.php?id=61579235266143",
                                    icon: (
                                        <Image
                                            src="/icons/facebook-icon.png"
                                            alt="Facebook"
                                            width={20}
                                            height={20}
                                            className="w-5 h-5 md:w-6 md:h-6 object-contain"
                                        />
                                    )
                                },
                                {
                                    label: "WhatsApp",
                                    href: "https://wa.me/8801826110036",
                                    icon: (
                                        <Image
                                            src="/icons/WhatsApp_icon.png"
                                            alt="WhatsApp"
                                            width={20}
                                            height={20}
                                            className="w-5 h-5 md:w-6 md:h-6 object-contain"
                                        />
                                    )
                                },
                                { label: "Share", href: "#", icon: <Share2 className="w-4 h-4 md:w-5 md:h-5" /> }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    target={social.href.startsWith("http") ? "_blank" : undefined}
                                    rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                                    className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-600 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-xs"
                                    aria-label={social.label}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2 sm:mt-0">
                        <h4 className="text-lg font-black text-black mb-6 md:mb-8">{t("Quick Links", "কুইক লিঙ্কস")}</h4>
                        <ul className="space-y-3 md:space-y-4">
                            {[
                                { en: "Home", bn: "হোম", href: "/" },
                                { en: "About Us", bn: "আমাদের সম্পর্কে", href: "/about" },
                                { en: "Book a Truck", bn: "ট্রাক বুক করুন", href: "/bookings/new" },
                                { en: "Services", bn: "সার্ভিস", href: "/#services" },
                                { en: "Trucks", bn: "ট্রাকসমূহ", href: "/#fleet" },
                                { en: "Contact", bn: "যোগাযোগ", href: "/contact" }
                            ].map((link, i) => (
                                <li key={i}>
                                    <Link href={link.href} className="text-gray-500 hover:text-primary transition-colors flex items-center gap-2 group text-sm md:text-base">
                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                        {t(link.en, link.bn)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <h4 className="text-lg font-black text-black mb-6 md:mb-8">{t("Support", "সাপোর্ট")}</h4>
                        <ul className="space-y-3 md:space-y-4">
                            {[
                                { en: "FAQ", bn: "সাধারণ প্রশ্ন", href: "/faq" },
                                { en: "Privacy Policy", bn: "প্রাইভেসি পলিসি", href: "/privacy-policy" },
                                { en: "Terms of Service", bn: "টার্মস অফ সার্ভিস", href: "/terms-of-service" },
                                { en: "Driver Registration", bn: "ড্রাইভার রেজিস্ট্রেশন", href: "/register?role=driver" },
                                { en: "Be an Agent", bn: "এজেন্ট হোন", href: "/partner-with-us" }
                            ].map((item, i) => (
                                <li key={i}>
                                    <Link href={item.href} className="text-gray-500 hover:text-primary transition-colors flex items-center gap-2 group text-sm md:text-base">
                                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                                        {t(item.en, item.bn)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="sm:col-span-2 lg:col-span-3">
                        <h4 className="text-lg font-black text-black mb-6 md:mb-8">{t("Newsletter", "নিউজলেটার")}</h4>
                        <p className="text-sm text-gray-500 mb-4 md:mb-6">{t("Subscribe to get the latest logistics updates.", "সর্বশেষ লজিস্টিক আপডেট পেতে সাবস্ক্রাইব করুন।")}</p>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder={t("Email address", "ইমেইল ঠিকানা")}
                                className="w-full h-12 md:h-14 bg-gray-50 rounded-lg md:rounded-xl px-4 md:px-6 outline-none focus:ring-2 focus:ring-primary/20 text-black placeholder:text-gray-400"
                            />
                            <button className="absolute right-2 top-2 w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white hover:bg-secondary transition-all">
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-6 md:pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
                    <p className="text-gray-400 text-xs md:text-sm text-center md:text-left">
                        &copy; {currentYear} Truck Dorkar. {t("All rights reserved.", "সর্বস্বত্ব সংরক্ষিত।")}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-8">
                        <div className="flex items-center gap-2 text-gray-400 text-xs md:text-sm">
                            <Globe className="w-4 h-4 text-primary" />
                            Bangladesh
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-xs md:text-sm">
                            <Share2 className="w-4 h-4 text-primary" />
                            {t("Social Media", "সোশ্যাল মিডিয়া")}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
