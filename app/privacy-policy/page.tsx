"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

export default function PrivacyPolicyPage() {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-24 md:pt-32 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl font-black text-black mb-4">{t("Privacy Policy", "গোপনীয়তা নীতি")}</h1>
                        <p className="text-gray-500 text-lg mb-12">{t("Your privacy is important to us.", "আপনার গোপনীয়তা আমাদের জন্য অত্যন্ত গুরুত্বপূর্ণ।")}</p>
                        <div className="bg-light-gray p-8 rounded-2xl text-gray-500">
                            {t("Privacy Policy content coming soon...", "শীঘ্রই গোপনীয়তা নীতির Contents যাবে...")}
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}