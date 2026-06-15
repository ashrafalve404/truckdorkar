"use client";

import React, { useEffect } from "react";
import { DashboardSidebar } from "./sidebar";
import { useAuth } from "@/store/use-auth";
import { useRouter } from "next/navigation";
import { Loader2, Menu, Truck } from "lucide-react";

interface DashboardLayoutProps {
    children: React.ReactNode;
    requiredRole?: "ADMIN" | "DRIVER" | "AGENT" | "USER";
}

export function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
    const { user, isAuthenticated, isHydrated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isHydrated && !isAuthenticated) {
            router.push("/login");
        }

        if (isHydrated && isAuthenticated && requiredRole && user?.role !== requiredRole) {
            // Role mismatch redirection
            if (user?.role === "ADMIN") router.push("/admin");
            else if (user?.role === "DRIVER") router.push("/driver/dashboard");
            else if (user?.role === "AGENT") router.push("/agent/dashboard");
            else router.push("/dashboard");
        }
    }, [isAuthenticated, isHydrated, user, requiredRole, router]);

    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    if (!isHydrated || !isAuthenticated) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (requiredRole && user?.role !== requiredRole) return null;

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar with mobile state */}
            <DashboardSidebar
                role={user?.role as any}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 fixed top-0 left-0 right-0 z-30">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white">
                        <Truck className="w-5 h-5" />
                    </div>
                    <span className="font-black text-lg text-slate-950">Truck Dorkar</span>
                </div>
                <button onClick={toggleSidebar} className="p-2 text-slate-700">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-950/20 backdrop-blur-sm z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <main className="lg:ml-64 p-4 md:p-8 lg:p-12 pt-20 lg:pt-12 transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
