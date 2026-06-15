"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const stats = [
    { value: 20000, label: "সফল ডেলিভারি", suffix: "+", subLabel: "Successful Deliveries" },
    { value: 5000, label: "ভেরিফাইড ট্রাক", suffix: "+", subLabel: "Verified Trucks" },
    { value: 64, label: "জেলা কভারেজ", suffix: "", subLabel: "District Coverage" },
    { value: 98, label: "সন্তুষ্ট গ্রাহক", suffix: "%", subLabel: "Customer Satisfaction" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView) {
            let start = 0;
            const end = value;
            const duration = 2000;
            const increment = end / (duration / 16);

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <span ref={ref} className="text-4xl lg:text-6xl font-black text-black">
            {count.toLocaleString()}{suffix}
        </span>
    );
}

export function Statistics() {
    return (
        <section className="py-24 bg-white text-black">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="space-y-2"
                        >
                            <Counter value={stat.value} suffix={stat.suffix} />
                            <div className="text-lg font-bold text-primary">{stat.label}</div>
                            <div className="text-sm font-semibold text-gray-400 uppercase tracking-widest">{stat.subLabel}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
