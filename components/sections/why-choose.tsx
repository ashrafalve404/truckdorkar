"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Zap, CreditCard, Map, Headphones, Clock } from "lucide-react";

const features = [
    { title: "Real-Time Tracking", bn: "রিয়েল-টাইম ট্র্যাকিং", icon: Map, desc: "See where your goods are at any moment with GPS tracking." },
    { title: "Verified Drivers", bn: "ভেরিফাইড ড্রাইভারা", icon: ShieldCheck, desc: "All our drivers go through rigorous background checks." },
    { title: "Secure Payments", bn: "নিরাপদ পেমেন্ট", icon: CreditCard, desc: "Transparent pricing and secure digital payment options." },
    { title: "Nationwide Service", bn: "দেশব্যাপী সার্ভিস", icon: Zap, desc: "We cover all 64 districts of Bangladesh with efficiency." },
    { title: "Dedicated Support", bn: "ডেডিকেটেড সাপোর্ট", icon: Headphones, desc: "Our support team is available 24/7 to help you." },
    { title: "Instant Quotations", bn: "ইনস্ট্যান্ট কোটেশন", icon: Clock, desc: "Get accurate price quotes within seconds on our app." },
];

export function WhyChoose() {
    return (
        <section className="py-24 bg-dark-gray text-white">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="text-primary font-bold uppercase tracking-[0.2em] mb-4">Why TruckDorkar</div>
                    <h2 className="text-4xl lg:text-5xl font-black mb-6">
                        কেন আমাদের পছন্দ করবেন?
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 bg-black border border-white/5 hover:border-primary/50 transition-colors"
                        >
                            <feature.icon className="w-10 h-10 text-primary mb-6" />
                            <h3 className="text-xl font-bold mb-2">{feature.bn}</h3>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-tighter mb-4">{feature.title}</div>
                            <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
