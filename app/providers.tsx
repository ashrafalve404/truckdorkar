"use client";

import { LanguageProvider } from "@/context/language-context";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

export function Providers({ children }: { children: React.ReactNode }) {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <LanguageProvider>
                {children}
                <Toaster position="top-center" />
            </LanguageProvider>
        </GoogleOAuthProvider>
    );
}
