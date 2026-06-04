"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Globe, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
    { name: "Home", href: "/", bn: "হোম" },
    { name: "Services", href: "#services", bn: "সার্ভিস" },
    { name: "How It Works", href: "#how-it-works", bn: "কিভাবে কাজ করে" },
    { name: "Fleet", href: "#fleet", bn: "ফ্লিট" },
    { name: "About Us", href: "#about", bn: "আমাদের সম্পর্কে" },
    { name: "Contact", href: "#contact", bn: "যোগাযোগ" },
];

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [lang, setLang] = useState<"en" | "bn">("bn");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleLang = () => {
        setLang(lang === "en" ? "bn" : "en");
    };

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 lg:px-12",
                isScrolled ? "bg-white/90 backdrop-blur-md py-3 shadow-soft" : "bg-transparent py-5"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/logos/mainlogo1.png"
                        alt="TruckDorkar Logo"
                        width={280}
                        height={80}
                        className="h-16 w-auto object-contain"
                        priority
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-sm font-semibold transition-colors",
                                isScrolled ? "text-dark-gray hover:text-primary" : "text-white hover:text-primary"
                            )}
                        >
                            {lang === "en" ? link.name : link.bn}
                        </Link>
                    ))}
                </div>

                {/* Right Side */}
                <div className="hidden lg:flex items-center gap-4">
                    <button
                        onClick={toggleLang}
                        className={cn(
                            "flex items-center gap-1.5 text-sm font-bold transition-colors px-3 py-1.5 rounded-md hover:bg-gray-100/10",
                            isScrolled ? "text-dark-gray hover:text-primary" : "text-white hover:text-primary"
                        )}
                    >
                        <Globe className="w-4 h-4" />
                        {lang === "en" ? "বাংলা" : "EN"}
                    </button>
                    <div className={cn("h-4 w-[1px] mx-2", isScrolled ? "bg-gray-300" : "bg-white/30")} />
                    <Link
                        href="/login"
                        className={cn(
                            "text-sm font-bold transition-colors",
                            isScrolled ? "text-dark-gray hover:text-primary" : "text-white hover:text-primary"
                        )}
                    >
                        {lang === "en" ? "Login" : "লগইন"}
                    </Link>
                    <Button variant={isScrolled ? "secondary" : "default"} size="sm" className="font-bold">
                        {lang === "en" ? "Register" : "রেজিস্টার"}
                    </Button>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="lg:hidden p-2 text-dark-gray"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 p-6 flex flex-col gap-4 lg:hidden"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-lg font-bold text-dark-gray border-b border-gray-50 pb-2"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {lang === "en" ? link.name : link.bn}
                            </Link>
                        ))}
                        <div className="flex flex-col gap-3 pt-4">
                            <Button variant="outline" className="w-full justify-start text-dark-gray">
                                <Globe className="w-4 h-4 mr-2" />
                                {lang === "en" ? "Switch to বাংলা" : "English-এ পরিবর্তন করুন"}
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                {lang === "en" ? "Login" : "লগইন"}
                            </Button>
                            <Button className="w-full">
                                {lang === "en" ? "Register" : "রেজিস্টার"}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
