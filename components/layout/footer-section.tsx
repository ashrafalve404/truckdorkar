"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, ArrowRight, MessageSquare, Send, Share2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const faqs = [
    { q: "কিভাবে ট্রাক বুক করব?", a: "আমাদের ওয়েবসাইট বা মোবাইল অ্যাপে আপনার পিকআপ এবং ড্রপ লোকেশন দিয়ে সহজেই ট্রাক বুক করতে পারেন।" },
    { q: "ভাড়া কিভাবে নির্ধারণ হয়?", a: "দূরত্ব, ট্রাকের ধরণ এবং মালামালের বিষয়ের ওপর ভিত্তি করে আমাদের সিস্টেম স্বয়ংক্রিয়ভাবে সাশ্রয়ী ভাড়া নির্ধারণ করে।" },
    { q: "আমার মালামালের নিরাপত্তা কি?", a: "আমাদের সব ভেরিফাইড এবং প্রতিটি ট্রিপ রিয়েল-টাইমে ট্র্যাক করা হয়। এছাড়া আমরা বিমা সুবিধাও প্রদান করে থাকি।" },
    { q: "উইকেন্ড বা ছুটির দিনে কি সার্ভিস চালু থাকে?", a: "হ্যাঁ, ট্রাক দরকার ২৪/৭ আপনার সেবায় নিয়োজিত। ছুটির দিন ও রাতেও বুকিং করা সম্ভব।" },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 bg-light-gray text-black">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-16 items-start">
                    <div>
                        <div className="text-secondary font-bold uppercase tracking-[0.2em] mb-4">Support</div>
                        <h2 className="text-4xl font-black text-black mb-6">সাধারণ কিছু <br /> জিজ্ঞাসা</h2>
                        <p className="text-gray-500 mb-8 max-w-md leading-relaxed">
                            আপনার যদি আরও কোনো প্রশ্ন থাকে তবে আমাদের ২৪/৭ সাপোর্ট সেন্টারে যোগাযোগ করুন। আমরা আপনাকে সাহায্য করতে প্রস্তুত।
                        </p>
                        <Button variant="outline" className="font-bold border-black/20 text-black hover:bg-black hover:text-white transition-all">সাপোর্ট টিমের সাথে কথা বলুন</Button>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                <button
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full p-6 text-left flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-bold text-black text-lg">{faq.q}</span>
                                    {openIndex === index ? <Minus className="w-5 h-5 text-primary" /> : <Plus className="w-5 h-5 text-gray-400" />}
                                </button>
                                <AnimatePresence>
                                    {openIndex === index && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="p-6 pt-0 text-gray-500 leading-relaxed">
                                                {faq.a}
                                            </div>
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
    return (
        <section className="py-32 bg-black text-white relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
                <svg width="100%" height="100%">
                    <pattern id="grid-dark" width="100" height="100" patternUnits="userSpaceOnUse">
                        <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid-dark)" />
                </svg>
            </div>

            <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-4xl lg:text-6xl font-black mb-8">
                        আজই আপনার পরিবহন <br /> সমস্যার সমাধান করুন
                    </h2>
                    <p className="text-xl text-gray-400 mb-12">
                        হাজারো ব্যবসায়ীদের মতো আপনিও ট্রাক দরকার-এর ওপর আস্থা রাখুন।
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Button size="lg" className="px-10 font-black h-16 text-lg">ট্রাক বুক করুন</Button>
                        <Button size="lg" variant="outline" className="px-10 font-black h-16 text-lg border-white/20 hover:bg-white hover:text-black">আমাদের সাথে যোগাযোগ করুন</Button>
                    </div>
                </motion.div>
            </div>

            {/* Decorative gradients */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        </section>
    );
}

export function Footer() {
    return (
        <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logos/mainlogo1.png"
                                alt="TruckDorkar Logo"
                                width={450}
                                height={130}
                                className="h-28 w-auto object-contain"
                            />
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            বাংলাদেশের এক নম্বর ডিজিটাল লজিস্টিক প্ল্যাটফর্ম। আমরা পণ্য পরিবহনকে করছি আরও সহজ, দ্রুত এবং সাশ্রয়ী।
                        </p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"><MessageSquare className="w-5 h-5" /></Link>
                            <Link href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"><Send className="w-5 h-5" /></Link>
                            <Link href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"><Share2 className="w-5 h-5" /></Link>
                            <Link href="#" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all"><Globe className="w-5 h-5" /></Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-black font-black mb-6 uppercase tracking-widest text-xs">Services</h4>
                        <ul className="space-y-4 text-sm font-bold text-gray-500">
                            <li><Link href="#" className="hover:text-primary transition-colors">বড় ট্রিপ বুকিং</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">বাসা বদল সার্ভিস</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">কর্পোরেট লজিস্টিকস</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">কভার্ড ভ্যান রেন্টাল</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-black font-black mb-6 uppercase tracking-widest text-xs">Resources</h4>
                        <ul className="space-y-4 text-sm font-bold text-gray-500">
                            <li><Link href="#" className="hover:text-primary transition-colors">ব্যবহার নির্দেশিকা</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">শিপার্স গাইড</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">ব্লগ এবং নিউজ</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">ক্যারিয়ার</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-black font-black mb-6 uppercase tracking-widest text-xs">Newsletter</h4>
                        <p className="text-gray-500 text-sm mb-6">আমাদের নতুন আপডেট পেতে ইমেইল সাবস্ক্রাইব করুন।</p>
                        <div className="flex gap-2">
                            <input type="email" placeholder="আপনার ইমেইল" className="bg-gray-50 border border-gray-100 rounded px-4 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary" />
                            <Button size="icon" className="shrink-0"><ArrowRight className="w-4 h-4" /></Button>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-widest">
                        © 2026 TruckDorkar. All rights reserved. Made for Bangladesh.
                    </div>
                    <div className="flex gap-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <Link href="#" className="hover:text-primary">Privacy Policy</Link>
                        <Link href="#" className="hover:text-primary">Terms of Service</Link>
                        <Link href="#" className="hover:text-primary">Cookie Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
