"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, Apple, Play } from "lucide-react";

export function CorporateClients() {
    const clients = ["PRAN", "Square", "Akij", "Bashundhara", "Beximco", "ACI", "Walton"];

    // Duplicate the array to create a seamless loop
    const displayClients = [...clients, ...clients];

    return (
        <section className="py-16 bg-white border-b border-gray-100 text-black overflow-hidden">
            <div className="container mx-auto px-6 lg:px-12 text-center mb-10">
                <div className="text-gray-400 font-bold uppercase tracking-widest text-xs">Trusted by Bangladesh's Largest Enterprises</div>
            </div>

            <div className="relative flex overflow-x-hidden">
                <motion.div
                    className="flex items-center whitespace-nowrap"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    {displayClients.map((client, index) => (
                        <div key={index} className="flex items-center justify-center px-12 lg:px-20">
                            <span className="text-3xl lg:text-4xl font-black text-black tracking-tighter opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-default">
                                {client}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

export function MobileApp() {
    return (
        <section className="py-24 bg-white overflow-hidden text-black">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="bg-light-gray rounded-3xl p-12 lg:p-24 relative overflow-hidden">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="relative z-10">
                            <div className="text-primary font-bold uppercase tracking-[0.2em] mb-4">Mobile Experience</div>
                            <h2 className="text-4xl lg:text-5xl font-black text-black mb-6">
                                আপনার পকেটে <br /> পুরো লজিস্টিক কোম্পানি
                            </h2>
                            <p className="text-lg text-gray-500 mb-10 max-w-md">
                                ট্রাক দরকার অ্যাপের মাধ্যমে এখন ট্রাক বুকিং এবং ট্র্যাকিং হবে আরও সহজ। ডাউনলোড করুন আজই!
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <Button size="lg" variant="secondary" className="gap-3 px-6 py-7 rounded-xl border border-gray-100 hover:border-primary transition-all">
                                    <Image src="/icons/App_Store.png" alt="App Store" width={28} height={28} className="object-contain" />
                                    <div className="text-left">
                                        <div className="text-[10px] font-bold uppercase opacity-60">Download on the</div>
                                        <div className="text-lg font-black leading-none">App Store</div>
                                    </div>
                                </Button>
                                <Button size="lg" variant="secondary" className="gap-3 px-6 py-7 rounded-xl border border-gray-100 hover:border-primary transition-all">
                                    <Image src="/icons/playstoreicon.png" alt="Google Play" width={28} height={28} className="object-contain" />
                                    <div className="text-left">
                                        <div className="text-[10px] font-bold uppercase opacity-60">Get it on</div>
                                        <div className="text-lg font-black leading-none">Google Play</div>
                                    </div>
                                </Button>
                            </div>
                        </div>

                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true }}
                            className="relative hidden lg:block"
                        >
                            {/* Mockup Placeholder */}
                            <div className="w-[300px] h-[600px] bg-dark-gray rounded-[3rem] border-8 border-black shadow-2xl mx-auto relative overflow-hidden">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20" />
                                <div className="p-6 pt-12 space-y-4">
                                    <div className="h-4 w-2/3 bg-white/10 rounded" />
                                    <div className="h-32 w-full bg-primary/20 rounded-xl" />
                                    <div className="h-8 w-full bg-white/5 rounded" />
                                    <div className="h-8 w-full bg-white/5 rounded" />
                                    <div className="h-8 w-full bg-white/5 rounded" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />
                            </div>

                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl z-0" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function Testimonials() {
    const reviews = [
        { name: "Rafiqul Islam", role: "MD, Food & Co.", bn: "রফিকুল ইসলাম", comment: "ট্রাক দরকার ব্যবহার করে আমাদের ডেলিভারি খরচ আগের চেয়ে ২০% কমেছে। খুবই নির্ভরযোগ্য সার্ভিস।" },
        { name: "Anisur Rahman", role: "Owner, Furniture Hub", bn: "আনিসুর রহমান", comment: "লাইভ ট্র্যাকিং ফিচারটি আমার সবচেয়ে ভালো লেগেছে। সবসময় জানি আমার মালামাল কোথায় আছে।" },
        { name: "Sumaiya Akter", role: "Logistic Manager", bn: "সুমাইয়া আক্তার", comment: "কর্পোরেট বিজনেসের জন্য তারা সেরা। তাদের ড্রাইভারা অনেক বেশি প্রফেশনাল এবং দক্ষ।" },
    ];

    return (
        <section className="py-24 bg-white text-black">
            <div className="container mx-auto px-6 lg:px-12 text-center">
                <h2 className="text-4xl font-black text-black mb-16">আমাদের গ্রাহকেরা কি বলছেন</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((rev, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-10 border border-gray-100 rounded-2xl text-left bg-light-gray/50 hover:bg-white hover:shadow-premium transition-all group"
                        >
                            <div className="flex gap-1 text-primary mb-6">
                                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                            </div>
                            <p className="text-gray-600 mb-8 italic leading-relaxed">"{rev.comment}"</p>
                            <div>
                                <div className="text-black font-black">{rev.bn}</div>
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{rev.role}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
