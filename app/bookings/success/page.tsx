"use client";

import React, { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { useLanguage } from "@/context/language-context";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function SuccessContent() {
    const { t } = useLanguage();
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookingId = searchParams.get("bookingId") || "";

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="pt-28 pb-16">
                <div className="container mx-auto px-4 lg:px-12">
                    <div className="max-w-xl mx-auto text-center">
                        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-premium border border-gray-100">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle2 className="w-12 h-12 text-green-600" />
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-black text-black mb-4">
                                {t("Booking Confirmed!", "বুকিং নিশ্চিত!")}
                            </h1>
                            <p className="text-slate-700 font-bold mb-2">
                                {t("Your booking request has been submitted successfully.", "আপনার বুকিং রিকোয়েস্ট সফলভাবে জমা দেওয়া হয়েছে।")}
                            </p>
                            {bookingId && (
                                <p className="text-sm text-slate-500 font-bold mb-8">
                                    {t("Booking ID", "বুকিং আইডি")}: <span className="text-primary">{bookingId}</span>
                                </p>
                            )}
                            <p className="text-slate-600 mb-8">
                                {t("Our drivers will review your request and send you quotes shortly. You can track your booking status from your dashboard.", "আমাদের ড্রাইভাররা আপনার রিকোয়েস্ট পরিদর্শন করবে এবং শীঘ্রই ভাড়া অফার পাঠাবে। আপনি আপনার ড্যাশবোর্ড থেকে বুকিং স্ট্যাটাস ট্র্যাক করতে পারবেন।")}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    onClick={() => router.push("/dashboard")}
                                    className="rounded-xl font-bold px-8 h-12 text-white"
                                >
                                    {t("View My Bookings", "আমার বুকিংস দেখুন")}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => router.push("/")}
                                    className="rounded-xl font-bold px-8 h-12 text-slate-950 border-slate-300 hover:bg-slate-100"
                                >
                                    {t("Back to Home", "হোমে ফিরুন")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default function BookingSuccessPage() {
    return (
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>}>
            <SuccessContent />
        </Suspense>
    );
}
