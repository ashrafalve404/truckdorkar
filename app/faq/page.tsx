"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer-section";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { AnimatePresence } from "framer-motion";

const faqs_en = [
    {
        q: "How do I book a truck on TruckDorkar?",
        a: "Simply enter your pickup and drop locations in the booking widget, select your preferred truck type and date, then click 'Get Quotes'. You'll receive instant pricing and can confirm your booking in minutes."
    },
    {
        q: "How is the fare calculated?",
        a: "Fares are calculated based on distance, truck type, load weight, and delivery urgency. Our transparent pricing ensures you see the full cost upfront before confirming any booking."
    },
    {
        q: "Are my goods insured during transit?",
        a: "Yes, all shipments through TruckDorkar include basic insurance coverage. For high-value goods, we recommend purchasing additional premium insurance during the booking process."
    },
    {
        q: "Can I track my shipment in real time?",
        a: "Absolutely. Once your booking is confirmed, you can track your shipment live through our app or website. You'll receive SMS and push notifications at key delivery milestones."
    },
    {
        q: "What payment methods are available?",
        a: "We accept cash on delivery, bKash, Nagad, Rocket, and all major bank cards. Corporate clients can also opt for monthly billing with net-15 or net-30 terms."
    },
    {
        q: "How do I cancel or reschedule a booking?",
        a: "You can cancel or reschedule up to 4 hours before the scheduled pickup time through your dashboard. Cancellation charges may apply based on timing and truck allocation status."
    },
    {
        q: "Are all drivers verified?",
        a: "Yes. Every driver on our platform undergoes rigorous background checks, license verification, and periodic safety training. Only verified drivers are assigned to shipments."
    },
    {
        q: "Do you operate 24/7?",
        a: "TruckDorkar operates 24/7, 365 days a year. You can book trucks and track shipments at any time, including weekends and public holidays."
    }
];

const faqs_bn = [
    {
        q: "ট্রাক দরকারে কিভাবে ট্রাক বুক করব?",
        a: "শুধুমাত্র বুকিং উইজেটে আপনার পিকআপ এবং ড্রপ লোকেশন দিন, পছন্দের ট্রাকের ধরন এবং তারিখ নির্বাচন করুন, তারপর 'ভাড়া দেখুন' ক্লিক করুন। আপনি কয়েক মিনিটের মধ্যেই তাৎক্ষণিক ভাড়া দেখতে পাবেন এবং বুকিং নিশ্চিত করতে পারবেন।"
    },
    {
        q: "ভাড়া কিভাবে হিসাব করা হয়?",
        a: "ভাড়া নির্ধারিত হয় দূরত্ব, ট্রাকের ধরন, মালামালের ওজন এবং ডেলিভারির প্রয়োজনীয়তার ওপর ভিত্তি করে। আমাদের স্বচ্ছ মূল্য নীতি নিশ্চিত করে যে আপনি কোনো বুকিং নিশ্চিত করার আগেই সম্পূর্ণ খরচ দেখতে পাবেন।"
    },
    {
        q: "ট্রানজিটে আমার মালামালের বিমা কভারেজ আছে?",
        a: "হ্যাঁ, ট্রাক দরকারের মাধ্যমে সব শিপমেন্টে বেসিক বিমা কভারেজ অন্তর্ভুক্ত। উচ্চ মূল্যের মালামালের জন্য আমরা বুকিং প্রক্রিয়ায় অতিরিক্ত প্রিমিয়াম বিমা নেয়ার সুপারিশ করি।"
    },
    {
        q: "আমি কি রিয়েল-টাইমে আমার শিপমেন্ট ট্র্যাক করতে পারব?",
        a: "অবশ্যই। আপনার বুকিং নিশ্চিত হওয়ার পর আপনি আমাদের অ্যাপ বা ওয়েবসাইটের মাধ্যমে সরাসরি শিপমেন্ট ট্র্যাক করতে পারবেন। প্রতিটি ডেলিভারি মাইলস্টোনে আপনি SMS এবং পুশ নোটিফিকেশন পাবেন।"
    },
    {
        q: "কোন পেমেন্ট পদ্ধতি গ্রহণযোগ্য?",
        a: "ক্যাশ অন ডেলিভারি, বিকাশ, নগদ, রকেট এবং সব প্রধান ব্যাংক কার্ড গ্রহণ করা হয়। কর্পোরেট ক্লায়েন্টরা মাসিক বিলিংয়ের ক্ষেত্রে ১৫ বা ৩০ দিনের শর্ত বেছে নিতে পারেন।"
    },
    {
        q: "আমি কিভাবে বুকিং বাতিল বা পুনরায় সময় নির্ধারণ করব?",
        a: "নির্ধারিত পিকআপের ৪ ঘণ্টা আগে পর্যন্ত আপনি আপনার ড্যাশবোর্ডের মাধ্যমে বুকিং বাতিল বা পুনরায় সময় নির্ধারণ করতে পারবেন। সময় এবং ট্রাক বরাদ্দের অবস্থার ওপর ভিত্তি করে বাতিলকরণ চার্জ প্রযোজ্য হতে পারে।"
    },
    {
        q: "সব ড্রাইভার কি যাচাইকৃত (Verified)?",
        a: "হ্যাঁ, আমাদের প্ল্যাটফর্মের প্রতিটি ড্রাইভারের ব্যাকগ্রাউন্ড চেক, লাইসেন্স যাচাইকরণ এবং নিয়মিত নিরাপত্তা নিশ্চিত করা হয়। শুধুমাত্র যাচাইকৃত ড্রাইভাররাই শিপমেন্টের জন্য নিযুক্ত হন।"
    },
    {
        q: "আপনারা কি ২৪/৭ সেবা প্রদান করেন?",
        a: "ট্রাক দরকার বছরের ৩৬৫ দিন ২৪ ঘণ্টাই সেবা প্রদান করে। আপনি যেকোনো সময়, এমনকি সাপ্তাহিক এবং সরকারি ছুটির দিনেও ট্রাক বুক করতে এবং শিপমেন্ট ট্র্যাক করতে পারবেন।"
    }
];

export default function FAQPage() {
    const { lang, t } = useLanguage();
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const faqs = lang === "en" ? faqs_en : faqs_bn;

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-24 md:pt-32 pb-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-3xl md:text-4xl font-black text-black mb-4">{t("Frequently Asked Questions", "প্রায়শই জিজ্ঞাসিত প্রশ্ন")}</h1>
                            <p className="text-gray-500 text-lg">{t("Find answers to common questions about our services.", "আমাদের সেবা সম্পর্কে সাধারণ প্রশ্নের উত্তর এখানে পাওয়া যাবে।")}</p>
                        </div>
                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div key={index} className="bg-white border border-gray-100 rounded-lg md:rounded-xl shadow-soft overflow-hidden">
                                    <button
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="w-full p-4 md:p-6 flex items-center justify-between text-left group"
                                    >
                                        <span className="text-sm md:text-base font-bold text-black group-hover:text-primary transition-colors pr-4">{faq.q}</span>
                                        <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full border border-gray-100 flex items-center justify-center transition-all shrink-0 ${openIndex === index ? 'bg-primary border-primary text-white' : 'text-gray-400'}`}>
                                            {openIndex === index ? <Minus className="w-3 h-3 md:w-4 md:h-4" /> : <Plus className="w-3 h-3 md:w-4 md:h-4" />}
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {openIndex === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-4 md:px-6 pb-4 md:pb-6 text-gray-500 leading-relaxed border-t border-gray-50 pt-4 text-sm md:text-base">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </main>
            <Footer />
        </div>
    );
}