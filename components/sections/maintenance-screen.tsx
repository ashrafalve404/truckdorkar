"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Wrench,
  Clock,
  PhoneCall,
  ShieldCheck,
  RefreshCw,
  Truck,
  Mail,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";

export function MaintenanceScreen() {
  const { lang, setLang, t } = useLanguage();

  const handleRefresh = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Decorative Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[300px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* Top Header: Logo & Language Toggle */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative w-36 h-10 md:w-44 md:h-12">
            <Image
              src="/logos/mainlogo1.png"
              alt="Truck Dorkar Limited"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
        </div>

        {/* Language switcher */}
        <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/15 rounded-full p-1 shadow-sm">
          <button
            onClick={() => setLang("bn")}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
              lang === "bn"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-300 hover:text-white"
            }`}
          >
            বাংলা
          </button>
          <button
            onClick={() => setLang("en")}
            className={`px-3 py-1 text-xs font-bold rounded-full transition-all ${
              lang === "en"
                ? "bg-primary text-white shadow-sm"
                : "text-slate-300 hover:text-white"
            }`}
          >
            English
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 flex-1 flex flex-col items-center justify-center text-center">
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-red-300 text-xs md:text-sm font-semibold mb-6 shadow-inner"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <Wrench className="w-3.5 h-3.5 text-primary" />
          <span>
            {t(
              "Under Maintenance",
              "রক্ষণাবেক্ষণ চলছে"
            )}
          </span>
        </motion.div>

        {/* Main Animated Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mb-6"
        >
          <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-gradient-to-tr from-primary/30 via-primary/10 to-transparent border border-primary/30 flex items-center justify-center shadow-2xl shadow-primary/20 backdrop-blur-xl">
            <Truck className="w-12 h-12 md:w-14 md:h-14 text-white animate-pulse" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center backdrop-blur-md">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
        </motion.div>

        {/* Straightforward Message */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-100 text-lg md:text-2xl font-bold max-w-xl mx-auto leading-relaxed mb-8"
        >
          {t(
            "This website is currently under maintenance.",
            "ওয়েবসাইটটিতে বর্তমানে রক্ষণাবেক্ষণের কাজ চলছে।"
          )}
        </motion.p>

        {/* 3 Value Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl mb-8"
        >
          <div className="bg-white/[0.04] border border-white/5 rounded-xl p-3.5 flex items-center gap-3 text-left">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-200">
                {t("Existing Bookings", "পূর্বের বুকিং")}
              </p>
              <p className="text-[11px] text-slate-400">
                {t("Safe & fully active", "সম্পূর্ণ সুরক্ষিত ও সচল")}
              </p>
            </div>
          </div>

          <div className="bg-white/[0.04] border border-white/5 rounded-xl p-3.5 flex items-center gap-3 text-left">
            <Truck className="w-6 h-6 text-primary shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-200">
                {t("Fleet & Drivers", "ট্রাক ও ড্রাইভার")}
              </p>
              <p className="text-[11px] text-slate-400">
                {t("Ready on highways", "সারাদেশে প্রস্তুত")}
              </p>
            </div>
          </div>

          <div className="bg-white/[0.04] border border-white/5 rounded-xl p-3.5 flex items-center gap-3 text-left">
            <PhoneCall className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-200">
                {t("Support Hotline", "সার্বক্ষণিক হেল্পলাইন")}
              </p>
              <p className="text-[11px] text-slate-400">
                {t("24/7 Active service", "২৪/৭ সার্বক্ষণিক সেবা")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Refresh Page Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex items-center gap-4"
        >
          <Button
            onClick={handleRefresh}
            variant="outline"
            className="rounded-full bg-white/10 hover:bg-white/15 border-white/15 text-white hover:text-white px-5 py-2 text-xs md:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            {t("Check If We're Back", "পেজ রিফ্রেশ করুন")}
          </Button>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-4 py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          © {new Date().getFullYear()} Truck Dorkar Limited.{" "}
          {t("All rights reserved.", "সর্বস্বত্ব সংরক্ষিত।")}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="mailto:support@truckdorkar.com"
            className="hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            support@truckdorkar.com
          </a>
          <span className="text-slate-600">|</span>
          <a
            href="/admin"
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            {t("Admin Portal", "অ্যাডমিন পোর্টাল")}
          </a>
        </div>
      </footer>
    </div>
  );
}
