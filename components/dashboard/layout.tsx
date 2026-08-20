"use client";

import React, { useEffect } from "react";
import { DashboardSidebar } from "./sidebar";
import { useAuth } from "@/store/use-auth";
import api from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";
import { cn } from "@/lib/utils";
import {
    Loader2,
    Menu,
    Truck,
    LayoutDashboard,
    PlusCircle,
    Package,
    User,
    Wallet,
    Search,
    Briefcase,
    Bell,
    MapPin
} from "lucide-react";

interface DashboardLayoutProps {
    children: React.ReactNode;
    requiredRole?: "ADMIN" | "DRIVER" | "AGENT" | "USER";
}

const getMobileNavItems = (role?: string) => {
    if (role === "USER") {
        return [
            { href: "/dashboard", icon: LayoutDashboard, label_en: "Home", label_bn: "হোম" },
            { href: "/bookings", icon: Package, label_en: "My Trips", label_bn: "মাই ট্রিপস" },
            { href: "/bookings/new", icon: PlusCircle, label_en: "Book Truck", label_bn: "বুকিং", isFab: true },
            { href: "/track", icon: MapPin, label_en: "Tracking", label_bn: "ট্র্যাকিং" },
            { href: "/profile", icon: User, label_en: "Profile", label_bn: "প্রোফাইল" },
        ];
    }
    if (role === "DRIVER") {
        return [
            { href: "/driver/dashboard", icon: LayoutDashboard, label_en: "Overview", label_bn: "হোম" },
            { href: "/driver/bookings", icon: Package, label_en: "My Trips", label_bn: "ট্রিপস" },
            { href: "/driver/jobs", icon: Search, label_en: "Find Trips", label_bn: "ট্রিপ খুঁজুন", isFab: true },
            { href: "/driver/earnings", icon: Wallet, label_en: "Earnings", label_bn: "আয়" },
            { href: "/driver/settings", icon: User, label_en: "Profile", label_bn: "প্রোফাইল" },
        ];
    }
    if (role === "AGENT") {
        return [
            { href: "/agent/dashboard", icon: LayoutDashboard, label_en: "Overview", label_bn: "ড্যাশবোর্ড" },
            { href: "/agent/trucks", icon: Truck, label_en: "My Trucks", label_bn: "আমার ট্রাক" },
            { href: "/agent/earnings", icon: Wallet, label_en: "Earnings", label_bn: "আয়" },
            { href: "/agent/profile", icon: User, label_en: "Profile", label_bn: "প্রোফাইল" },
        ];
    }
    return [];
};

export function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
    const { user, updateUser, isAuthenticated, isHydrated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { t } = useLanguage();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    useEffect(() => {
        if (isHydrated && !isAuthenticated) {
            router.push("/login");
        }

        if (isHydrated && isAuthenticated) {
            api.get("/users/profile")
                .then((res) => {
                    const p = res.data?.data || res.data;
                    if (p) {
                        updateUser({
                            name: p.name,
                            email: p.email,
                            phone: p.phone,
                            avatar: p.avatar,
                        });
                    }
                })
                .catch((err) => console.error("Failed to sync user profile", err));
        }

        if (isHydrated && isAuthenticated && requiredRole && user?.role !== requiredRole) {
            if (user?.role === "ADMIN") router.push("/admin");
            else if (user?.role === "DRIVER") router.push("/driver/dashboard");
            else if (user?.role === "AGENT") router.push("/agent/dashboard");
            else router.push("/dashboard");
        }
    }, [isAuthenticated, isHydrated, requiredRole, router]);

    // Automatic Geolocation updates for logged-in Drivers
    useEffect(() => {
        if (!isAuthenticated || user?.role !== "DRIVER") return;

        const sendLocation = () => {
            if (typeof window === "undefined" || !navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    api.patch("/drivers/availability", {
                        isAvailable: true,
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    }).catch(() => { });
                },
                () => { },
                { enableHighAccuracy: true }
            );
        };

        sendLocation();
        const interval = setInterval(sendLocation, 15000);
        return () => clearInterval(interval);
    }, [isAuthenticated, user?.role]);

    if (!isHydrated || !isAuthenticated) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (requiredRole && user?.role !== requiredRole) return null;

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const mobileNavItems = getMobileNavItems(user?.role);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar with mobile state */}
            <DashboardSidebar
                role={user?.role as any}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Mobile Top Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 fixed top-0 left-0 right-0 z-30 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white">
                        <Truck className="w-5 h-5" />
                    </div>
                    <span className="font-black text-lg text-slate-950">Truck Dorkar</span>
                </div>
                <button onClick={toggleSidebar} className="p-2 text-slate-700 hover:text-primary transition-colors">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Overlay for mobile drawer */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main className="lg:ml-64 p-4 md:p-8 lg:p-12 pt-20 lg:pt-12 pb-24 lg:pb-12 transition-all duration-300">
                {children}
            </main>

            {/* Mobile Bottom Navigation Bar */}
            {mobileNavItems.length > 0 && (
                <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1 flex items-end justify-around">
                    {mobileNavItems.map((item: any) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (
                            item.href !== "/dashboard" &&
                            item.href !== "/driver/dashboard" &&
                            item.href !== "/agent/dashboard" &&
                            pathname.startsWith(item.href)
                        );

                        if (item.isFab) {
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex flex-col items-center justify-center -mt-5 group z-50 shrink-0 px-2 pb-1"
                                >
                                    <div className={cn(
                                        "w-13 h-13 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border-4 border-white",
                                        isActive
                                            ? "bg-primary text-white shadow-primary/40 scale-110 ring-4 ring-primary/20"
                                            : "bg-primary text-white shadow-primary/30 group-hover:scale-105"
                                    )}>
                                        <Icon className="w-6 h-6 stroke-[2.5]" />
                                    </div>
                                    <span className={cn(
                                        "text-[10px] mt-0.5 font-black whitespace-nowrap px-2 py-0.5 rounded-full transition-colors",
                                        isActive ? "text-primary bg-primary/10" : "text-slate-800"
                                    )}>
                                        {t(item.label_en, item.label_bn)}
                                    </span>
                                </Link>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200",
                                    isActive ? "text-primary font-bold" : "text-slate-500 hover:text-slate-900 font-medium"
                                )}
                            >
                                <div className={cn("p-1 rounded-lg transition-transform", isActive && "scale-110 bg-primary/10")}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] mt-0.5 whitespace-nowrap">{t(item.label_en, item.label_bn)}</span>
                            </Link>
                        );
                    })}
                </nav>
            )}
        </div>
    );
}
