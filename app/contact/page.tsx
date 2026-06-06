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
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-24 md:pt-32">
                {/* Header */}
                <section className="py-16 md:py-20 bg-light-gray">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-12 text-center text-black">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-2xl md:text-3xl lg:text-5xl font-black text-black mb-6 md:mb-8">
                                {t("Contact Us", "যোগাযোগ করুন")}
                            </h1>
                            <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                                {t(
                                    "We are always here for any of your inquiries or cooperation.",
                                    "আপনার যেকোনো জিজ্ঞাসা বা সহযোগিতার জন্য আমরা সবসময় পাশে আছি।"
                                )}
                            </p>
                        </motion.div>
                    </div>
                </section>

                <section className="py-16 md:py-24">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-12 text-black">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                            {/* Contact Form */}
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="bg-white p-6 md:p-8 lg:p-12 rounded-lg md:rounded-xl shadow-premium border border-gray-100"
                            >
                                <h2 className="text-xl md:text-2xl font-black text-black mb-4 md:mb-6">{t("Send Message", "মেসেজ পাঠান")}</h2>
                                <form className="space-y-5 md:space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600">{t("Name", "নাম")}</label>
                                            <input type="text" placeholder={t("Enter your name", "আপনার নাম লিখুন")} className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-sm md:text-base text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-600">{t("Phone Number", "ফোন নম্বর")}</label>
                                            <input type="text" placeholder={t("Enter phone number", "আপনার ফোন নম্বর")} className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-sm md:text-base text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600">{t("Email", "ইমেইল")}</label>
                                            <input type="email" placeholder={t("Enter email (optional)", "আপনার ইমেইল (ঐচ্ছিক)")} className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-sm md:text-base text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-600">{t("Message", "মেসেজ")}</label>
                                            <textarea placeholder={t("Enter your message...", "আপনার মেসেজ লিখুন...")} rows={4} className="w-full bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none" />
                                    </div>
                                    <Button size="lg" className="w-full h-12 md:h-16 rounded-lg md:rounded-xl font-bold text-base md:text-lg gap-2 transition-all hover:translate-y-[-2px] text-white">
                                        <Send className="w-4 h-4 md:w-5 md:h-5" />
                                        {t("Send Message", "মেসেজ পাঠান")}
                                    </Button>
                                </form>
                            </motion.div>

                            {/* Contact Info */}
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="space-y-8 md:space-y-12"
                            >
                                <div>
                                    <h2 className="text-xl md:text-2xl font-black text-black mb-4 md:mb-6">{t("Direct Contact", "সরাসরি যোগাযোগ")}</h2>
                                    <p className="text-base md:text-lg text-gray-500 mb-6 md:mb-10">
                                        {t(
                                            "You can call our 24/7 customer care number at any time or visit our office directly.",
                                            "আমাদের ২৪/৭ কাস্টমার কেয়ার নাম্বারে যেকোনো সময় কল করতে পারেন অথবা সরাসরি আমাদের অফিসে ভিজিট করতে পারেন।"
                                        )}
                                    </p>

                                    <div className="space-y-6 md:space-y-8 text-black">
                                        <div className="flex items-start gap-4 md:gap-6 group">
                                            <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                                <Phone className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-white" />
                                            </div>
                                            <div>
                                                <div className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{t("Call Us", "ফোন করুন")}</div>
                                                <div className="text-xl md:text-2xl font-black text-black">{t("01826-110036", "০১৮২৬-১১০০৩৬")}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 md:gap-6 group">
                                            <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                                <Mail className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-white" />
                                            </div>
                                            <div>
                                                <div className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{t("Email Us", "ইমেইল করুন")}</div>
                                                <div className="text-xl md:text-2xl font-black text-black">support@truckdorkar.com</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-4 md:gap-6 group">
                                            <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                                <MapPin className="w-5 h-5 md:w-6 md:h-6 text-primary group-hover:text-white" />
                                            </div>
                                            <div>
                                                <div className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">{t("Office Address", "অফিস ঠিকানা")}</div>
                                                <div className="text-xl md:text-2xl font-black text-black">{t("Mohammadpur, Dhaka, Bangladesh", "মোহাম্মদপুর, ঢাকা, বাংলাদেশ")}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 md:p-7 bg-black rounded-lg md:rounded-xl text-white flex items-center justify-between group cursor-pointer hover:bg-primary transition-all duration-500">
                                    <div className="flex items-center gap-4 md:gap-6">
                                        <div className="w-14 h-14 md:w-16 md:h-16 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-all">
                                            <MessageCircle className="w-6 h-6 md:w-8 md:h-8 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-lg md:text-xl font-bold">{t("Live Chat Support", "লাইভ চ্যাট সাপোর্ট")}</div>
                                            <div className="text-xs md:text-sm text-gray-400 group-hover:text-white/80">{t("Talk directly with our team", "আমাদের টিমের সাথে সরাসরি কথা বলুন")}</div>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 md:w-12 md:h-12 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                        <Send className="w-4 h-4 md:w-5 md:h-5 rotate-45" />
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