"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

export default function PrivacyPolicyPage() {
    const { t, lang } = useLanguage();
    const isBn = lang === "bn";

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-24 md:pt-32 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-3xl md:text-4xl font-black text-black mb-4">{t("Privacy Policy", "গোপনীয়তা নীতি")}</h1>
                            <p className="text-gray-400 text-sm">{isBn ? "শেষ আপডেট: ৬ জুন ২০২৬" : "Last updated: June 6, 2026"}</p>
                        </div>
                        <div className="space-y-6">
                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                {isBn
                                    ? "ট্রাক দরকারে আমরা আপনার ব্যক্তিগত তথ্য ও গোপনীয়তার অধিকার রক্ষা করতে অঙ্গীকারবদ্ধ। এই গোপনীয়তা নীতি ব্যাখ্যা করে যে আমাদের প্ল্যাটফর্ম ব্যবহার করার সময় আমরা আপনার তথ্য কীভাবে সংগ্রহ, ব্যবহার, প্রকাশ ও সুরক্ষিত করছি।"
                                    : "At TruckDorkar, we are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information."}
                            </p>
                            {isBn ? (
                                <div className="space-y-6">
                                    {[
                                        { t: "১. আমরা যে তথ্য সংগ্রহ করি", b: "আমরা নাম, ফোন নম্বর, ইমেইল ঠিকানা ও ডেলিভারি বিবরণ আপনার রেজিস্ট্রেশন বা বুকিংয়ের সময় সরাসরি সংগ্রহ করি। ব্যবহারের ডেটা, ডিভাইসের তথ্য ও অবস্থানের ডেটাও (সম্মতিতে) সংগ্রহ করি আমাদের সেবা আরও উন্নত করতে।" },
                                        { t: "২. আপনার তথ্য কেমন ব্যবহার করি", b: "বুকিং প্রক্রিয়াকরণ, ড্রাইভার যাচাইকরণ, গ্রাহক সহায়তা, আপডেট পাঠানো, প্ল্যাটফর্ম উন্নয়ন ও আইনি দায়িত্ব পালনের জন্য আপনার তথ্য ব্যবহার করা হয়। আমরা কখনও ব্যক্তিগত ডেটা বিক্রি করি না।" },
                                        { t: "৩. তথ্য শেয়ারিং", b: "শুধুমাত্র নির্ভরযোগ্য পরিষেবা প্রদানকারীদের (ড্রাইভার, পেমেন্ট প্রসেসর, ডেলিভারি পার্টনার) সাথে ডেটা শেয়ার করা হয় যা বুকিং সম্পূর্ণ করার জন্য অপরিহার্য। সব তৃতীয় পক্ষ গোপনীয়তা রক্ষা করতে বাধ্য।" },
                                        { t: "৪. ডেটা সুরক্ষা", b: "এনক্রিপশন, সুরক্ষিত সার্ভার ও নিয়মিত সুরক্ষা অডিটসহ শিল্প-মানসম্মত ব্যবস্থা ব্যবহার করা হয় অননুমোদিত অ্যাক্সেস, পরিবর্তন বা ধ্বংস থেকে আপনার তথ্য রক্ষা করতে।" },
                                        { t: "৫. আপনার অধিকার", b: "আপনি যেকোনো সময় আপনার ব্যক্তিগত ডেটা দেখা, আপডেট বা মুছে ফেলার অধিকার রাখেন। সাপোর্ট টিমের মাধ্যমে যে কোন বিষয় থেকে আপনি নিজেকে সরিয়ে নিতে পারেন।" },
                                        { t: "৬. কুকিজ", b: "প্ল্যাটফর্মের কার্যক্ষমতা নিশ্চিত করতে এবং ব্যবহারকারীর অভিজ্ঞতা উন্নত করতে আমরা কুকিজ ব্যবহার করি। ব্রাউজার সেটিংসের মাধ্যমে আপনি এটি পরিচালনা করতে পারেন।" },
                                        { t: "৭. শিশুদের গোপনীয়তা", b: "আমাদের সেবাগুলো ১৮ বছরের নিচে ব্যবহারকারীদের জন্য নয়। আমরা জেনেশুনে শিশুদের কাছ থেকে ব্যক্তিগত তথ্য সংগ্রহ করি না। আমাদের সাথে যোগাযোগ করলে আমরা ব্যবস্থা নিব।" },
                                        { t: "৮. নীতিতে পরিবর্তন", b: "আমরা সময়ে সময়ে এই নীতি আপডেট করতে পারি। নতুন নীতি পোস্ট করা হবে এবং 'শেষ আপডেট' তারিখ পরিবর্তন করা হবে।" },
                                        { t: "৯. যোগাযোগ", b: "আপনার কোনো প্রশ্ন থাকলে contact@truckdorkar.com এ যোগাযোগ করুন অথবা 01826-110036 নম্বরে কল করুন। আমরা ২৪/৭ আপনাদের সেবায় নিয়োজিত।" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-light-gray p-6 md:p-8 rounded-xl">
                                            <h3 className="text-lg font-bold text-black mb-3">{item.t}</h3>
                                            <p className="text-gray-600 leading-relaxed">{item.b}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {[
                                        { t: "1. Information We Collect", b: "We collect name, phone number, email and delivery details during registration or booking. Usage data, device info and location data (with consent) are also collected to improve services." },
                                        { t: "2. How We Use Your Information", b: "Your information is used for booking processing, driver verification, customer support, updates, platform improvement and legal compliance. We never sell your personal data to third parties." },
                                        { t: "3. Information Sharing", b: "We share data only with trusted providers (drivers, payment processors, delivery partners) strictly necessary for your booking. All third parties are bound by confidentiality agreements." },
                                        { t: "4. Data Security", b: "We use encryption, secure servers and regular security audits to protect your personal information from unauthorized access, alteration or destruction." },
                                        { t: "5. Your Rights", b: "You can access, update or delete your personal data anytime. You can opt out of non-essential communications and request data portability via our support team." },
                                        { t: "6. Cookies", b: "Essential cookies ensure platform functionality. Optional analytics cookies improve user experience. Manage cookie preferences via browser settings." },
                                        { t: "7. Children's Privacy", b: "Our services are not intended for users under 18. We do not knowingly collect personal information from children. Contact us immediately if you believe a child has provided data." },
                                        { t: "8. Changes to This Policy", b: "We may update this Privacy Policy periodically. Material changes will be notified via email or platform notification with an updated 'Last updated' date." },
                                        { t: "9. Contact Us", b: "For questions, contact contact@truckdorkar.com or call 01826-110036. Our 24/7 support team is ready to assist." }
                                    ].map((item, idx) => (
                                        <div key={idx} className="bg-light-gray p-6 md:p-8 rounded-xl">
                                            <h3 className="text-lg font-bold text-black mb-3">{item.t}</h3>
                                            <p className="text-gray-600 leading-relaxed">{item.b}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}