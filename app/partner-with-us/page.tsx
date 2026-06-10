"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";

export default function PartnerWithUsPage() {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-24 md:pt-32 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto text-center">
                        <h1 className="text-3xl md:text-4xl font-black text-black mb-4">{t("Partner with Us", "আমাদের সাথে পার্টনার")}</h1>
                        <p className="text-gray-500 text-lg mb-12">{t("Grow your business with TruckDorkar.", "ট্রাক দরকারের সাথে আপনার ব্যবসা বড় করুন।")}</p>
                        <div className="bg-light-gray p-8 rounded-2xl text-gray-500">
                            {t("Partnership inquiry form coming soon...", "শীঘ্রই পার্টনারশিপ অনুসন্ধান ফর্ম যাবে...")}
                        </div>
                        <Button size="lg" className="mt-8 text-white">{t("Become a Partner", "পার্টনার হওয়ার জন্য")}</Button>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}