"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const fleet = [
    { name: "Pickup (1 Ton)", bn: "পিকআপ (১ টন)", capacity: "1,000 KG" },
    { name: "Mini Truck (3 Ton)", bn: "মিনি ট্রাক (৩ টন)", capacity: "3,000 KG" },
    { name: "Medium Truck (5 Ton)", bn: "মাঝারি ট্রাক (৫ টন)", capacity: "5,000 KG" },
    { name: "Large Truck (7 Ton)", bn: "বড় ট্রাক (৭ টন)", capacity: "7,000 KG" },
    { name: "Covered Van", bn: "কাভার্ড ভ্যান", capacity: "Various" },
    { name: "Container Truck", bn: "কন্টেইনার ট্রাক", capacity: "20-40 Ft" },
];

export function Fleet() {
    return (
        <section id="fleet" className="py-24 bg-white text-black">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-primary font-bold uppercase tracking-[0.2em] mb-4">Our Fleet</div>
                        <h2 className="text-4xl lg:text-5xl font-black text-black mb-8">
                            আমাদের আধুনিক <br /> যানবাহন বহর
                        </h2>
                        <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-xl">
                            আপনার ব্যবসার প্রয়োজন অনুযায়ী আমাদের রয়েছে বিভিন্ন সাইজ এবং টাইপের ট্রাক। প্রতিটা গাড়ি নিয়মিত রক্ষণাবেক্ষণ করা হয় এবং দক্ষ ডাইভার দিয়ে পরিচালিত হয়।
                        </p>

                        <div className="grid grid-cols-2 gap-6 mb-10">
                            {fleet.map((item, index) => (
                                <div key={index} className="flex flex-col border-l-4 border-primary/20 pl-4 py-1 hover:border-primary transition-colors cursor-default">
                                    <span className="text-black font-black text-lg">{item.bn}</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{item.name}</span>
                                </div>
                            ))}
                        </div>

                        <Button size="lg" className="rounded-none px-10">
                            ভিউ অল ফ্লিট
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="rounded-md overflow-hidden shadow-premium transition-all duration-700 bg-gray-50">
                            <Image
                                src="/fleet-showcase.png"
                                alt="TruckDorkar Fleet"
                                width={800}
                                height={600}
                                className="w-full h-auto object-contain"
                            />
                        </div>
                        {/* Absolute Badge */}
                        <div className="absolute -bottom-6 -right-6 bg-primary p-4 text-white hidden xl:block shadow-xl">
                            <div className="text-2xl font-black mb-0.5">10k+</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest opacity-80 leading-tight">Verified <br />Vehicles</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
