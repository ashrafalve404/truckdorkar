"use client";

import { LanguageProvider } from "@/context/language-context";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            {children}
            <Toaster position="top-center" />
        </LanguageProvider>
    );
}
