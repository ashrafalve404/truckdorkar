"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Globe, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/language-context";

const navLinks = [
    { name: "Home", href: "/", bn: "হোম" },
    { name: "Services", href: "/#services", bn: "সার্ভিস" },
    { name: "How It Works", href: "/#how-it-works", bn: "কিভাবে কাজ করে" },
    { name: "Fleet", href: "/#fleet", bn: "ফ্লিট" },
    { name: "About Us", href: "/about", bn: "আমাদের সম্পর্কে" },
    { name: "Contact", href: "/contact", bn: "যোগাযোগ" },
];

export function Navbar() {
    const { lang, setLang } = useLanguage();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleLang = () => setLang(lang === "en" ? "bn" : "en");

    // Logic to determine if navbar items should be white (only at top of home page)
    const isDarkBackground = pathname === "/" && !isScrolled;

    const [activeHash, setActiveHash] = useState("");

    useEffect(() => {
        const handleHashChange = () => setActiveHash(window.location.hash);
        handleHashChange();
        window.addEventListener("hashchange", handleHashChange);
        // Also listen for scroll to update hash (simplified)
        const handleScrollUpdate = () => {
            const sections = ["services", "how-it-works", "fleet"];
            for (const section of sections) {
                const el = document.getElementById(section);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top >= 0 && rect.top <= 300) {
                        setActiveHash("#" + section);
                        break;
                    }
                }
            }
            if (window.scrollY < 100) setActiveHash("");
        };
        window.addEventListener("scroll", handleScrollUpdate);
        return () => {
            window.removeEventListener("hashchange", handleHashChange);
            window.removeEventListener("scroll", handleScrollUpdate);
        };
    }, []);

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/" && activeHash === "";
        if (href.startsWith("/#")) {
            return pathname === "/" && activeHash === href.substring(1);
        }
        return pathname === href;
    };

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 lg:px-12",
                isScrolled ? "bg-white/90 backdrop-blur-md py-1 shadow-soft" : "bg-transparent py-2"
            )}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-4">
                    <Image
                        src="/logos/mainlogo1.png"
                        alt="TruckDorkar Logo"
                        width={350}
                        height={100}
                        className="h-20 w-auto object-contain"
                        priority
                    />
                    <span className={cn(
                        "text-2xl md:text-3xl font-bold tracking-tight transition-colors",
                        isDarkBackground ? "text-white" : "text-black"
                    )}>
                        Truck Dorkar
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden lg:flex items-center gap-8 h-full">
                    {navLinks.map((link) => {
                        const active = isActive(link.href);
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "relative text-sm font-semibold transition-all duration-300 h-full py-2",
                                    isDarkBackground
                                        ? (active ? "text-red-500" : "text-white hover:text-red-400")
                                        : (active ? "text-red-600" : "text-dark-gray hover:text-red-600")
                                )}
                            >
                                {lang === "en" ? link.name : link.bn}
                                {active && (
                                    <motion.div
                                        layoutId="navUnderline"
                                        className="absolute left-0 right-0 bottom-0 h-0.5 bg-red-600"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Right Side */}
                <div className="hidden lg:flex items-center gap-4">
                    <button
                        onClick={toggleLang}
                        className={cn(
                            "flex items-center gap-1.5 text-sm font-bold transition-colors px-3 py-1.5 rounded-md hover:bg-gray-100/10",
                            isDarkBackground ? "text-white hover:text-primary" : "text-dark-gray hover:text-primary"
                        )}
                    >
                        <Globe className="w-4 h-4" />
                        {lang === "en" ? "বাংলা" : "EN"}
                    </button>
                    <Link href="/login">
                        <Button variant="ghost" size="sm" className={cn(
                            "font-bold",
                            isDarkBackground ? "text-white hover:bg-white/10" : "text-dark-gray hover:bg-black/5"
                        )}>
                            {lang === "en" ? "Login" : "লগইন"}
                        </Button>
                    </Link>
                    <Link href="/register">
                        <Button variant={isDarkBackground ? "default" : "secondary"} size="sm" className="font-bold">
                            {lang === "en" ? "Register" : "রেজিস্টার"}
                        </Button>
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className={cn(
                        "lg:hidden p-2 transition-colors",
                        isDarkBackground ? "text-white" : "text-dark-gray"
                    )}
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
                            <Button variant="outline" className="w-full justify-start text-dark-gray" onClick={toggleLang}>
                                <Globe className="w-4 h-4 mr-2" />
                                {lang === "en" ? "Switch to বাংলা" : "English-এ পরিবর্তন করুন"}
                            </Button>
                            <Button variant="ghost" className="w-full justify-start">
                                {lang === "en" ? "Login" : "লগইন"}
                            </Button>
                            <Link href="/register">
                                <Button className="w-full">
                                    {lang === "en" ? "Register" : "রেজিস্টার"}
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
