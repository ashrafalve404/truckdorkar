"use client";

import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useLanguage } from "@/context/language-context";

const stats = [
    { value: 20000, label_en: "Successful Deliveries", label_bn: "সফল ডেলিভারি", suffix: "+" },
    { value: 5000, label_en: "Verified Trucks", label_bn: "ভেরিফাইড ট্রাক", suffix: "+" },
    { value: 64, label_en: "District Coverage", label_bn: "জেলা কভারেজ", suffix: "" },
    { value: 98, label_en: "Customer Satisfaction", label_bn: "সন্তুষ্ট গ্রাহক", suffix: "%" },
];

function Counter({ value, suffix }: { value: number; suffix: string }) {
    const { lang } = useLanguage();
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
        <span ref={ref} className="text-3xl lg:text-5xl font-black text-black">
            {lang === "bn" ? count.toLocaleString("bn-BD") : count.toLocaleString("en-US")}{suffix}
        </span>
    );
}

export function Statistics() {
    const { t, lang } = useLanguage();

    return (
        <section className="py-24 bg-white text-black">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={false}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="space-y-1.5"
                        >
                            <Counter value={stat.value} suffix={stat.suffix} />
                            <div className="text-base font-bold text-primary">
                                {t(stat.label_en, stat.label_bn)}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
