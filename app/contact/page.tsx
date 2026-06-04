"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";

export default function ContactPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-white" suppressHydrationWarning>
            <Navbar />

            <main className="pt-32">
                {/* Header */}
                <section className="py-20 bg-light-gray">
                    <div className="container mx-auto px-6 lg:px-12 text-center text-black">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-3xl lg:text-5xl font-black text-black mb-8" suppressHydrationWarning>
                                {t("Contact Us", "যোগাযোগ করুন")}
                            </h1>
                            <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                                {t(
                                    "We are always here for any of your inquiries or cooperation.",
                                    "আপনার যেকোনো জিজ্ঞাসা বা সহযোগিতার জন্য আমরা সবসময় পাশে আছি।"
                                )}
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="py-24">
                    <div className="container mx-auto px-6 lg:px-12 text-black">
                        <div className="grid lg:grid-cols-2 gap-16">
                            {/* Contact Form */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 lg:p-12 rounded-3xl shadow-premium border border-gray-100"
                            >
                                <h2 className="text-2xl font-black text-black mb-8" suppressHydrationWarning>{t("Send Message", "মেসেজ পাঠান")}</h2>
                                <form className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600">{t("Name", "নাম")}</label>
                                            <input type="text" placeholder={t("Enter your name", "আপনার নাম লিখুন")} className="w-full h-14 bg-gray-50 border-none rounded-xl px-6 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600">{t("Phone Number", "ফোন নম্বর")}</label>
                                            <input type="text" placeholder={t("Enter phone number", "আপনার ফোন নম্বর")} className="w-full h-14 bg-gray-50 border-none rounded-xl px-6 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600">{t("Email", "ইমেইল")}</label>
                                        <input type="email" placeholder={t("Enter email (optional)", "আপনার ইমেইল (ঐচ্ছিক)")} className="w-full h-14 bg-gray-50 border-none rounded-xl px-6 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600">{t("Message", "মেসেজ")}</label>
                                        <textarea placeholder={t("Enter your message...", "আপনার মেসেজ লিখুন...")} rows={5} className="w-full bg-gray-50 border-none rounded-xl px-6 py-4 text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" />
                                    </div>
                                    <Button size="lg" className="w-full h-16 rounded-xl font-bold text-lg gap-2 mt-4 transition-all hover:translate-y-[-2px] text-white">
                                        <Send className="w-5 h-5" />
                                        {t("Send Message", "মেসেজ পাঠান")}
                                    </Button>
                                </form>
                            </motion.div>

                            {/* Contact Info */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-12"
                            >
                                <div>
                                    <h2 className="text-2xl font-black text-black mb-8" suppressHydrationWarning>{t("Direct Contact", "সরাসরি যোগাযোগ")}</h2>
                                    <p className="text-lg text-gray-500 mb-12">
                                        {t(
                                            "You can call our 24/7 customer care number at any time or visit our office directly.",
                                            "আমাদের ২৪/৭ কাস্টমার কেয়ার নাম্বারে যেকোনো সময় কল করতে পারেন অথবা সরাসরি আমাদের অফিসে ভিজিট করতে পারেন।"
                                        )}
                                    </p>

                                    <div className="space-y-8 text-black">
                                        <div className="flex items-start gap-6 group">
                                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                                <Phone className="w-6 h-6 text-primary group-hover:text-white" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{t("Call Us", "ফোন করুন")}</div>
                                                <div className="text-2xl font-black text-black" suppressHydrationWarning>{t("01826-110036", "০১৮২৬-১১০০৩৬")}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-6 group">
                                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                                <Mail className="w-6 h-6 text-primary group-hover:text-white" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{t("Email Us", "ইমেইল করুন")}</div>
                                                <div className="text-2xl font-black text-black">support@truckdorkar.com</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-6 group">
                                            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                                <MapPin className="w-6 h-6 text-primary group-hover:text-white" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{t("Office Address", "অফিস ঠিকানা")}</div>
                                                <div className="text-2xl font-black text-black">{t("Mohammadpur, Dhaka, Bangladesh", "মোহাম্মদপুর, ঢাকা, বাংলাদেশ")}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-black rounded-3xl text-white flex items-center justify-between group cursor-pointer hover:bg-primary transition-all duration-500">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all">
                                            <MessageCircle className="w-8 h-8 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xl font-bold">{t("Live Chat Support", "লাইভ চ্যাট সাপোর্ট")}</div>
                                            <div className="text-sm text-gray-400 group-hover:text-white/80">{t("Talk directly with our team", "আমাদের টিমের সাথে সরাসরি কথা বলুন")}</div>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                        <Send className="w-5 h-5 rotate-45" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
