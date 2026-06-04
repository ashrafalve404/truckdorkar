"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
    {
        number: "01",
        title: "Request Transport",
        bn: "পরিবহন অনুরোধ পাঠান",
        desc: "অ্যাপ বা ওয়েবসাইটের মাধ্যমে আপনার গন্তব্য এবং মালামালের তথ্য দিন।",
    },
    {
        number: "02",
        title: "Receive Quotes",
        bn: "কোটেশন গ্রহণ করুন",
        desc: "আমাদের নেটওয়ার্ক থেকে সেরা এবং সাশ্রয়ী রেট সরাসরি গ্রহণ করুন।",
    },
    {
        number: "03",
        title: "Confirm Booking",
        bn: "বুকিং নিশ্চিত করুন",
        desc: "সব কিছু ঠিক থাকলে ক্লিক করেই আপনার বুকিং নিশ্চিত করে ফেলুন।",
    },
    {
        number: "04",
        title: "Track Live",
        bn: "লাইভ ট্র্যাকিং",
        desc: "পিকআপ থেকে ডেলিভারি পর্যন্ত রিয়েল-টাইমে ট্র্যাক করুন।",
    },
    {
        number: "05",
        title: "Successful Delivery",
        bn: "সফল ডেলিভারি",
        desc: "নিরাপদভাবে নির্দিষ্ট সময়ে আপনার মালামাল পৌঁছে যাবে।",
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-white overflow-hidden text-black">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="text-secondary font-bold uppercase tracking-[0.2em] mb-4">Workflow</div>
                    <h2 className="text-4xl lg:text-5xl font-black text-black">
                        কিভাবে বুক করবেন?
                    </h2>
                </div>

                <div className="relative">
                    {/* Connection Line Desktop */}
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -translate-y-12 hidden lg:block" />

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15 }}
                                viewport={{ once: true }}
                                className="flex flex-col items-center text-center group"
                            >
                                <div className="w-20 h-20 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center text-2xl font-black text-gray-400 mb-8 group-hover:border-primary group-hover:text-primary transition-all duration-300 relative">
                                    {step.number}
                                    {/* Progress Line Animation */}
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        whileInView={{ scaleX: 1 }}
                                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                        className="absolute top-1/2 left-full w-full h-0.5 bg-primary origin-left hidden lg:block"
                                    />
                                    {index === steps.length - 1 && <div className="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-white" />}
                                </div>
                                <h3 className="text-xl font-black text-black mb-2">{step.bn}</h3>
                                <div className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-tighter">
                                    {step.title}
                                </div>
                                <p className="text-sm text-gray-500 leading-relaxed max-w-[200px]">
                                    {step.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
