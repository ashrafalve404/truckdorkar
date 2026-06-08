"use client";

import React, { useEffect } from "react";
import { DashboardSidebar } from "./sidebar";
import { useAuth } from "@/store/use-auth";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface DashboardLayoutProps {
    children: React.ReactNode;
    requiredRole?: "ADMIN" | "DRIVER" | "EMPLOYEE" | "USER";
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
            else if (user?.role === "EMPLOYEE") router.push("/employee/dashboard");
            else router.push("/dashboard");
        }
    }, [isAuthenticated, isHydrated, user, requiredRole, router]);

    if (!isHydrated || !isAuthenticated) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-slate-50">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (requiredRole && user?.role !== requiredRole) return null;

    return (
        <div className="min-h-screen bg-slate-50 flex">
            <DashboardSidebar role={user?.role as any} />
            <main className="flex-1 ml-64 p-8 lg:p-12">
                {children}
            </main>
        </div>
    );
}
