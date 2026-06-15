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
import { useAuth } from "@/store/use-auth";
import { User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";

const navLinks = [
    { name: "Home", href: "/", bn: "হোম" },
    { name: "Booking", href: "/bookings/new", bn: "বুকিং" },
    { name: "Services", href: "/#services", bn: "সার্ভিস" },
    { name: "Trucks", href: "/#fleet", bn: "ট্রাকসমূহ" },
    { name: "About Us", href: "/about", bn: "আমাদের সম্পর্কে" },
    { name: "Contact", href: "/contact", bn: "যোগাযোগ" },
];

export function Navbar() {
    const { lang, setLang } = useLanguage();
    const { user, isAuthenticated, logout } = useAuth();
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

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isMobileMenuOpen]);

    const toggleLang = () => setLang(lang === "en" ? "bn" : "en");

    const isDarkBackground = false;

    const [activeHash, setActiveHash] = useState("");

    useEffect(() => {
        const handleHashChange = () => setActiveHash(window.location.hash);
        handleHashChange();
        window.addEventListener("hashchange", handleHashChange);
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
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-2 md:px-6",
                isScrolled ? "translate-y-2" : "translate-y-0"
            )}
        >
            <div className={cn(
                "mx-auto transition-all duration-500 rounded-b-[32px]",
                isScrolled
                    ? "bg-light-gray/95 backdrop-blur-md shadow-premium border-b border-x border-slate-200 py-1"
                    : "bg-transparent py-4"
            )}>
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-4">
                        <Image
                            src="/logos/mainlogo1.png"
                            alt="Truck Dorkar Logo"
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

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                {(() => {
                                    let dashboardLink = "/dashboard";
                                    if (user?.role === "ADMIN") dashboardLink = "/admin";
                                    else if (user?.role === "DRIVER") dashboardLink = "/driver/dashboard";
                                    else if (user?.role === "AGENT") dashboardLink = "/agent/dashboard";

                                    return (
                                        <Link href={dashboardLink} className="flex items-center gap-2 text-sm font-bold text-dark-gray hover:text-primary transition-all">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                                <UserIcon className="w-4 h-4" />
                                            </div>
                                            <span className="hidden md:inline">{user?.name}</span>
                                        </Link>
                                    );
                                })()}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={logout}
                                    className="font-bold text-red-500 hover:text-red-100 hover:bg-red-50 rounded-md px-4"
                                >
                                    <LogOut className="w-4 h-4 md:mr-2" />
                                    <span className="hidden md:inline">{lang === "en" ? "Logout" : "লগআউট"}</span>
                                </Button>
                            </div>
                        ) : (
                            <>
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
                            </>
                        )}
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
                            className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 p-6 flex flex-col gap-4 lg:hidden overflow-y-auto max-h-[calc(100dvh-5rem)] overscroll-contain rounded-b-[32px]"
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
                                <Button variant="outline" className="w-full justify-start text-dark-gray font-bold" onClick={() => { toggleLang(); setIsMobileMenuOpen(false); }}>
                                    <Globe className="w-4 h-4 mr-2" />
                                    {lang === "en" ? "বাংলা" : "English"}
                                </Button>

                                {isAuthenticated ? (
                                    <>
                                        {(() => {
                                            let dashboardLink = "/dashboard";
                                            if (user?.role === "ADMIN") dashboardLink = "/admin";
                                            else if (user?.role === "DRIVER") dashboardLink = "/driver/dashboard";
                                            else if (user?.role === "AGENT") dashboardLink = "/agent/dashboard";

                                            return (
                                                <Link href={dashboardLink} onClick={() => setIsMobileMenuOpen(false)}>
                                                    <Button variant="ghost" className="w-full justify-start font-bold text-slate-950">
                                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                                        {lang === "en" ? "Dashboard" : "ড্যাশবোর্ড"}
                                                    </Button>
                                                </Link>
                                            );
                                        })()}
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start font-bold text-red-500 hover:text-red-600"
                                            onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            {lang === "en" ? "Logout" : "লগআউট"}
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start font-bold text-slate-950">
                                                <UserIcon className="w-4 h-4 mr-2" />
                                                {lang === "en" ? "Login" : "লগইন"}
                                            </Button>
                                        </Link>
                                        <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button className="w-full font-bold text-white shadow-lg shadow-primary/20">
                                                {lang === "en" ? "Register" : "রেজিস্টার"}
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
