"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, getAvatarUrl } from "@/lib/utils";
import {
    LayoutDashboard,
    Package,
    Truck,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    Bell,
    TrendingUp,
    Shield,
    FileText,
    Image as ImageIcon,
    Globe,
    DollarSign,
    Wallet
} from "lucide-react";
import { useAuth } from "@/store/use-auth";
import { useLanguage } from "@/context/language-context";
import { useNotifications } from "@/store/use-notifications";
import { useEffect } from "react";

interface SidebarProps {
    role: "ADMIN" | "DRIVER" | "AGENT" | "USER";
    isOpen?: boolean;
    onClose?: () => void;
}

export function DashboardSidebar({ role, isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const { logout, user } = useAuth();
    const { lang, setLang } = useLanguage();
    const { unreadCount, fetchNotifications } = useNotifications();

    useEffect(() => {
        if (user) fetchNotifications();
    }, [user]);

    const menuItems = {
        ADMIN: [
            { name: "Overview", href: "/admin", icon: LayoutDashboard, bn: "ওভারভিউ" },
            { name: "Bookings", href: "/admin/bookings", icon: Package, bn: "বুকিং" },
            { name: "Drivers", href: "/admin/drivers", icon: Truck, bn: "ড্রাইভার" },
            { name: "Trucks", href: "/admin/trucks", icon: Truck, bn: "ট্রাক" },
            { name: "Users", href: "/admin/users", icon: Users, bn: "ইউজার" },
            { name: "Agents", href: "/admin/agents", icon: Users, bn: "এজেন্ট" },
            { name: "Agent Withdrawals", href: "/admin/agent-withdrawals", icon: Wallet, bn: "এজেন্ট উত্তোলন" },
            { name: "Notifications", href: "/admin/notifications", icon: Bell, bn: "নোটিফিকেশন" },
            { name: "Support", href: "/admin/support", icon: MessageSquare, bn: "সাপোর্ট" },
            { name: "Payments", href: "/admin/payments", icon: DollarSign, bn: "পেমেন্ট" },
            { name: "Settings", href: "/admin/settings", icon: Settings, bn: "সেটিংস" },
        ],
        DRIVER: [
            { name: "Dashboard", href: "/driver/dashboard", icon: LayoutDashboard, bn: "ড্যাশবোর্ড" },
            { name: "Find Trips", href: "/driver/jobs", icon: TrendingUp, bn: "ট্রিপ খুঁজুন" },
            { name: "My Trucks", href: "/driver/trucks", icon: Truck, bn: "আমার ট্রাক" },
            { name: "My Bookings", href: "/driver/bookings", icon: Package, bn: "আমার বুকিং" },
            { name: "Payments", href: "/driver/payments", icon: DollarSign, bn: "পেমেন্ট" },
            { name: "Earnings", href: "/driver/earnings", icon: FileText, bn: "উপার্জন" },
            { name: "Notifications", href: "/driver/notifications", icon: Bell, bn: "নোটিফিকেশন" },
            { name: "Support", href: "/driver/support", icon: MessageSquare, bn: "সাপোর্ট" },
            { name: "Settings", href: "/driver/settings", icon: Settings, bn: "সেটিংস" },
        ],
        AGENT: [
            { name: "Dashboard", href: "/agent/dashboard", icon: LayoutDashboard, bn: "ড্যাশবোর্ড" },
            { name: "My Trucks", href: "/agent/trucks", icon: Truck, bn: "আমার ট্রাক" },
            { name: "Earnings", href: "/agent/earnings", icon: TrendingUp, bn: "উপার্জন" },
            { name: "Withdraw Money", href: "/agent/withdraw", icon: DollarSign, bn: "টাকা উত্তোলন" },
            { name: "Support Tickets", href: "/agent/support", icon: MessageSquare, bn: "সাপোর্ট টিকেট" },
            { name: "Verification", href: "/agent/profile", icon: Shield, bn: "ভেরিফিকেশন" },
            { name: "Notifications", href: "/agent/notifications", icon: Bell, bn: "নোটিফিকেশন" },
        ],
        USER: [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, bn: "ড্যাশবোর্ড" },
            { name: "My Trips", href: "/bookings", icon: Package, bn: "আমার ট্রিপস" },
            { name: "New Booking", href: "/bookings/new", icon: FileText, bn: "নতুন বুকিং" },
            { name: "Notifications", href: "/notifications", icon: Bell, bn: "নোটিফিকেশন" },
            { name: "Support", href: "/support", icon: MessageSquare, bn: "সাপোর্ট" },
            { name: "Profile", href: "/profile", icon: Users, bn: "প্রোফাইল" },
        ]
    };

    const currentMenu = menuItems[role] || menuItems.USER;
    const logoMap = {
        ADMIN: "/logos/truckdorkarlogobangla.png",
        DRIVER: "/logos/truckdorkarlogobangla.png",
        AGENT: "/logos/truckdorkarlogobangla.png",
        USER: "/logos/truckdorkarlogobangla.png",
    };

    return (
        <div className={cn(
            "w-64 bg-white border-r border-gray-100 flex flex-col h-[100dvh] fixed left-0 top-0 z-50 transition-transform duration-300 transform lg:translate-x-0 shadow-2xl lg:shadow-none overflow-hidden",
            isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
            {/* Header */}
            <div className="p-6 border-b border-gray-50 shrink-0">
                <Link href="/" className="flex items-center gap-2">
                    <img
                        src={logoMap[role]}
                        alt="Truck Dorkar"
                        className="w-11 h-11 object-contain"
                    />
                    <span className="font-black text-xl tracking-tight text-slate-950">Truck Dorkar</span>
                </Link>
                <div className="mt-4 px-3 py-1.5 bg-slate-100 rounded-md inline-block">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{role} PANEL</span>
                </div>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 min-h-0 p-4 space-y-1 overflow-y-auto">
                {currentMenu.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all group",
                                isActive
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-slate-700 hover:bg-slate-50 hover:text-primary"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-slate-600 group-hover:text-primary")} />
                            <span className="flex-1">{lang === "en" ? item.name : item.bn}</span>
                            {item.name === "Notifications" && unreadCount > 0 && (
                                <span className={cn(
                                    "px-2 py-0.5 rounded-full text-[10px] font-black",
                                    isActive ? "bg-white text-primary" : "bg-primary text-white shadow-sm"
                                )}>
                                    {unreadCount}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer with mobile bottom navbar clearance */}
            <div className="p-4 border-t border-gray-50 space-y-2 shrink-0 bg-white pb-24 lg:pb-4">
                <button
                    onClick={() => setLang(lang === "en" ? "bn" : "en")}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all border border-slate-100"
                >
                    <Globe className="w-5 h-5 text-primary" />
                    {lang === "en" ? "Change to বাংলা" : "English-এ পরিবর্তন"}
                </button>

                <div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                        {user?.avatar ? (
                            <img src={getAvatarUrl(user.avatar) || ""} alt={user.name || "User"} className="w-full h-full object-cover" />
                        ) : (
                            <Users className="w-4 h-4 text-slate-400" />
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-slate-950 truncate">
                            {user?.role === "AGENT" && user?.name === "Operations Staff" ? "Agent" : user?.name}
                        </p>
                        <p className="text-[10px] text-slate-600 font-bold truncate">{user?.email || user?.phone}</p>
                    </div>
                </div>

                <button
                    onClick={() => {
                        if (onClose) onClose();
                        logout();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    {lang === "en" ? "Sign Out" : "লগআউট"}
                </button>
            </div>
        </div>
    );
}
