"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/language-context";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ContactPage() {
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        message: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/contact/submit", {
                name: formData.name,
                phone: formData.phone,
                email: formData.email || undefined,
                message: formData.message,
                subject: "Web Inquiry",
            });
            toast.success(t("Message sent successfully!", "মেসেজ সফলভাবে পাঠানো হয়েছে!"));
            setFormData({ name: "", phone: "", email: "", message: "" });
        } catch (error: unknown) {
            const message = error && typeof error === 'object' && 'response' in error && (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
            toast.error(typeof message === 'string' ? message : t("Failed to send message", "মেসেজ পাঠানো ব্যর্থ হয়েছে"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="pt-24 md:pt-32">
                {/* Header */}
                <section
                    className="relative py-24 md:py-40 bg-cover bg-center overflow-hidden"
                    style={{ backgroundImage: "url('/images/contactpageimage.webp')" }}
                >
                    <div className="absolute inset-0 bg-white/70" />

                    <div className="container mx-auto px-4 sm:px-6 lg:px-12 text-center text-black relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-black mb-6 md:mb-8">
                                {t("Contact Us", "যোগাযোগ করুন")}
                            </h1>
                            <p className="text-lg md:text-xl text-black font-bold max-w-2xl mx-auto leading-relaxed">
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
                                className="bg-white p-6 md:p-8 lg:p-12 rounded-lg md:rounded-3xl shadow-premium border border-gray-100"
                            >
                                <h2 className="text-xl md:text-2xl font-black text-black mb-4 md:mb-6">{t("Send Message", "মেসেজ পাঠান")}</h2>
                                <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950">{t("Name", "নাম")}</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder={t("Enter your name", "আপনার নাম লিখুন")}
                                                className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-sm md:text-base text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-950">{t("Phone Number", "ফোন নম্বর")}</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                placeholder={t("Enter phone number", "আপনার ফোন নম্বর")}
                                                className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-sm md:text-base text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-950">{t("Email", "ইমেইল")}</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder={t("Enter email (optional)", "আপনার ইমেইল (ঐচ্ছিক)")}
                                            className="w-full h-12 md:h-14 bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 text-sm md:text-base text-black placeholder:text-gray-400 focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-950">{t("Message", "মেসেজ")}</label>
                                        <textarea
                                            required
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            placeholder={t("Enter your message...", "আপনার মেসেজ লিখুন...")}
                                            rows={4}
                                            className="w-full bg-gray-50 border-none rounded-lg md:rounded-xl px-4 md:px-6 py-3 md:py-4 text-sm md:text-base text-slate-950 font-bold placeholder:text-slate-500 focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                                        />
                                    </div>
                                    <Button disabled={loading} size="lg" className="w-full h-12 md:h-16 rounded-lg md:rounded-xl font-bold text-base md:text-lg gap-2 transition-all hover:translate-y-[-2px] text-white">
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                            <>
                                                <Send className="w-4 h-4 md:w-5 md:h-5" />
                                                {t("Send Message", "মেসেজ পাঠান")}
                                            </>
                                        )}
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
                                    <h2 className="text-lg md:text-xl font-bold text-black mb-3 md:mb-4">{t("Direct Contact", "সরাসরি যোগাযোগ")}</h2>
                                    <p className="text-sm md:text-base text-slate-600 font-medium mb-4 md:mb-6">
                                        {t(
                                            "You can call our 24/7 customer care number at any time or visit our office directly.",
                                            "আমাদের ২৪/৭ কাস্টমার কেয়ার নাম্বারে যেকোনো সময় কল করতে পারেন অথবা সরাসরি আমাদের অফিসে ভিজিট করতে পারেন।"
                                        )}
                                    </p>

                                    <div className="space-y-4 md:space-y-5 text-black">
                                        <div className="flex items-start gap-3 md:gap-4 group">
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                                <Phone className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:text-white" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] md:text-xs font-semibold text-slate-400 mb-0.5">{t("Call Us", "ফোন করুন")}</div>
                                                <div className="text-base md:text-lg font-bold text-black">{t("01826-110036", "০১৮২৬-১১০০৩৬")}</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 md:gap-4 group">
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                                <Mail className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:text-white" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] md:text-xs font-semibold text-gray-400 mb-0.5">{t("Email Us", "ইমেইল করুন")}</div>
                                                <div className="text-base md:text-lg font-bold text-black">contact@truckdorkar.com</div>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3 md:gap-4 group">
                                            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                                                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary group-hover:text-white" />
                                            </div>
                                            <div>
                                                <div className="text-[10px] md:text-xs font-semibold text-gray-400 mb-0.5">{t("Office Address", "অফিস ঠিকানা")}</div>
                                                <div className="text-base md:text-lg font-bold text-black">{t("Navana Shopping Centre, Gulshan Avenue 01, Gulshan, Dhaka, Bangladesh", "নাভানা শপিং সেন্টার, গুলশান অ্যাভিনিউ ০১, গুলশান, ঢাকা, বাংলাদেশ")}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 md:p-7 bg-black rounded-lg md:rounded-3xl text-white flex items-center justify-between group cursor-pointer hover:bg-primary transition-all duration-500">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-lg md:rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all">
                                            <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-base md:text-lg font-semibold">{t("Live Chat Support", "লাইভ চ্যাট সাপোর্ট")}</div>
                                            <div className="text-[10px] md:text-xs text-gray-400 group-hover:text-white/80">{t("Talk directly with our team", "আমাদের সাথে সরাসরি কথা বলুন")}</div>
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 md:w-10 md:h-10 border border-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                                        <Send className="w-3 h-3 md:w-4 md:h-4 rotate-45" />
                                    </div>
                                </div>

                                <div className="mt-4 md:mt-6 rounded-lg md:rounded-xl overflow-hidden border border-gray-100">
                                    <iframe
                                        src="https://maps.google.com/maps?q=Navana%20Tower%20Shopping%20Complex%20Gulshan%201%20Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                        width="100%"
                                        height="200"
                                        style={{ border: 0 }}
                                        allowFullScreen
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Navana Shopping Centre Location"
                                    />
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