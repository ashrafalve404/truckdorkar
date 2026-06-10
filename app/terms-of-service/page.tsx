"use client";

import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/language-context";

export default function TermsOfServicePage() {
    const { t, lang } = useLanguage();
    const isBn = lang === "bn";

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-24 md:pt-32 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-3xl md:text-4xl font-black text-black mb-4">{t("Terms of Service", "সেবার শর্তাবলী")}</h1>
                            <p className="text-gray-400 text-sm">{isBn ? "শেষ আপডেট: ৬ জুন ২০২৬" : "Last updated: June 6, 2026"}</p>
                        </div>
                        <div className="space-y-6">
                            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                {isBn
                                    ? "ট্রাক দরকার-এ আপনাকে স্বাগতম। আমাদের প্ল্যাটফর্ম ব্যবহার করার মাধ্যমে আপনি এই ব্যবহারের শর্তাবলীর সাথে সম্মত হন। আমাদের সেবা ব্যবহার করার আগে দয়া করে সাবধানে পড়ুন।"
                                    : "Welcome to TruckDorkar. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before using our services."}
                            </p>
                            {isBn ? (
                                <div className="space-y-6">
                                    {[
                                        { t: "১. শর্তাবলীর স্বীকারোক্তি", b: "অ্যাকাউন্ট তৈরি বা ট্রাক দরকার ব্যবহার করার মাধ্যমে আপনি নিশ্চিত করেন যে আপনি ১৮ বছরের বেশি বয়সী এবং এই শর্তাবলীতে প্রবেশ করার আইনি ক্ষমতা রাখেন।" },
                                        { t: "২. সেবার বিবরণ", b: "ট্রাক দরকার’ একটি ডিজিটাল লজিস্টিক প্ল্যাটফর্ম, যা শিপার এবং ট্রাক মালিকদের সরাসরি সংযুক্ত করে। আমরা সহজ বুকিং ও নিরাপদ পেমেন্ট সুবিধা নিশ্চিত করি, তবে আমরা কোনো নিজস্ব পরিবহন সেবা প্রদান করি না।" },
                                        { t: "৩. ব্যবহারকারীর দায়িত্ব", b: "ব্যবহারকারীরা সঠিক শিপমেন্ট বিবরণ প্রদান করতে হবে এবং সব প্রযোজ্য আইন মান্য করতে হবে। অবৈধ মাল পরিবহনের অনুরোধ করা যাবে না।" },
                                        { t: "৪. মূল্য ও পেমেন্ট", b: "ভাড়া দূরত্ব, ট্রাকের ধরন, মালের ওজন ও জরুরীতা ভিত্তি করে গণনা করা হয়। পেমেন্ট আমাদের সুরক্ষিত গেটওয়ে মাধ্যমে প্রক্রিয়াজাত হয়।" },
                                        { t: "৫. বাতিলকরণ নীতি", b: "শিডিউল্ড পিকআপের ৪ ঘণ্টা আগে বিনামূল্যে বাতিল করা যায়। ৪ ঘণ্টার মধ্যে বাতিলে ২৫% পর্যন্ত চার্জ প্রয়োগ হতে পারে।" },
                                        { t: "৬. দায়িত্বের সীমা", b: "ট্রাক দরকার প্রযুক্তি মাধ্যম হিসেবে কাজ করে। ড্রাইভারদের কাজ বা গাড়ীর অবস্থার জন্য দায়ী নয়। মোট দায়িত্ব বুকিং অ্যামাউন্ট অতিক্রম করবে না।" },
                                        { t: "৭. বীমা", b: "প্রতিটি বুকিংয়ে বেসিক কার্গো বীমা অন্তর্ভুক্ত। ডেলিভারির ২৪ ঘণ্টার ভেতর দাবি দিতে হবে। উচ্চ মূল্যের সম্পদের জন্য অতিরিক্ত বীমা প্রয়োজন।" },
                                        { t: "৮. নিষিদ্ধ কার্যক্রম", b: "প্ল্যাটফর্ম misuse, অন্যের ছবি, reverse-engineer বা প্রতারণামূলক কার্যক্রম নিষিদ্ধ। লঙ্ঘন হলে অ্যাকাউন্ট স্থগিত ও আইনিকরণ হতে পারে।" },
                                        { t: "৯. বিরোধ সমাধান", b: "বিরোধ প্রথমে আমাদের অভ্যন্তরীণ টিমের মাধ্যমে সমাধান করা হবে। সমাধান না হলে বাংলাদেশের আইনের শাসনে arbitration হবে।" },
                                        { t: "১০. যোগাযোগ", b: "প্রশ্ন থাকলে legal@truckdorkar.com এ যোগাযোগ করুন অথবা 01826-110036 নম্বরে কল করুন।" }
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
                                        { t: "1. Acceptance of Terms", b: "By creating an account or using TruckDorkar, you confirm that you are at least 18 years old and have the legal capacity to enter into these Terms." },
                                        { t: "2. Service Description", b: "TruckDorkar provides a digital logistics platform connecting shippers with truck owners and drivers. We facilitate booking and payment but are not a transportation carrier ourselves." },
                                        { t: "3. User Responsibilities", b: "Users must provide accurate shipment details, ensure proper packaging, and comply with all applicable laws. Illegal goods transportation is strictly prohibited." },
                                        { t: "4. Pricing and Payments", b: "Fares are calculated based on distance, truck type, load weight, and urgency. Payments are processed through our secure payment gateway." },
                                        { t: "5. Cancellation Policy", b: "Free cancellation up to 4 hours before pickup. Cancellations within 4 hours may incur a fee of up to 25% of the booking amount." },
                                        { t: "6. Liability Limitations", b: "TruckDorkar is not liable for driver actions, vehicle conditions, or delays caused by weather or traffic. Our total liability shall not exceed the booking amount." },
                                        { t: "7. Insurance", b: "Basic cargo insurance is included with every booking. Claims must be filed within 24 hours of delivery with supporting evidence." },
                                        { t: "8. Prohibited Activities", b: "Platform misuse, impersonation, reverse-engineering, or fraud is prohibited. Violations may result in account suspension and legal action." },
                                        { t: "9. Dispute Resolution", b: "Disputes shall first be addressed through our internal team. Unresolved disputes are subject to arbitration under Bangladesh Arbitration Act." },
                                        { t: "10. Contact Information", b: "For questions, contact legal@truckdorkar.com or call 01826-110036. Our support team is available 24/7." }
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