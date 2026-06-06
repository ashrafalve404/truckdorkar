"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

export default function TermsOfServicePage() {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-24 md:pt-32 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl font-black text-black mb-4">{t("Terms of Service", "সেবার শর্তাবলী")}</h1>
                        <p className="text-gray-500 text-lg mb-12">{t("Please read our terms and conditions carefully.", "অনুগ্রহ করে আমাদের শর্তাবলী সাবধানে পড়ুন।")}</p>
                        <div className="bg-light-gray p-8 rounded-2xl text-gray-500">
                            {t("Terms of Service content coming soon...", "শীঘ্রই সেবার শর্তাবলীর Contents যাবে...")}
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}