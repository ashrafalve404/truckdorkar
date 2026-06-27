"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/language-context";

const services = [
    {
        title: "Truck Booking",
        bn: "ট্রাক বুকিং",
        image: "/images/truckbooking.png",
        description: "Book trucks of various sizes for local or long-distance haulage.",
        descBn: "স্থানীয় বা দূরপাল্লার পরিবহনের জন্য বিভিন্ন আকারের ট্রাক বুক করুন।"
    },
    {
        title: "Mini Truck Rental",
        bn: "মিনি ট্রাক রেন্টাল",
        image: "/images/minipickup.png",
        description: "Perfect for shifting small furniture or moving within the city.",
        descBn: "শহরের মধ্যে ছোট আসবাবপত্র বা মালামাল স্থানান্তরের জন্য উপযুক্ত।"
    },
    {
        title: "Container Transport",
        bn: "কন্টেইনার ট্রান্সপোর্ট",
        image: "/images/containers.png",
        description: "Reliable movement of containers between ports and warehouses.",
        descBn: "বন্দর এবং গুদামের মধ্যে কন্টেইনার পরিবহনের নির্ভরযোগ্য মাধ্যম।"
    },
    {
        title: "Industrial Logistics",
        bn: "ইন্ডাস্ট্রিয়াল লজিস্টিকস",
        image: "/images/industriallogistics.png",
        description: "Specialized logistics solutions for large-scale industrial goods.",
        descBn: "বৃহৎ মাপের শিল্প পণ্যের জন্য বিশেষ লজিস্টিক সমাধান।"
    },
    {
        title: "Warehouse Delivery",
        bn: "ওয়্যারহাউস ডেলিভারি",
        image: "/images/warehouse.png",
        description: "Efficient distribution from central warehouses to any district.",
        descBn: "কেন্দ্রীয় গুদাম থেকে যেকোনো জেলায় দক্ষ বিতরণ ব্যবস্থা।"
    },
    {
        title: "Corporate Fleet",
        bn: "কর্পোরেট ফ্লিট",
        image: "/images/corporate.png",
        description: "Long-term partnership with businesses for dedicated transport.",
        descBn: "ডেডিকেটেড পরিবহনের জন্য ব্যবসার সাথে দীর্ঘমেয়াদী অংশীদারিত্ব।"
    },
];

export function Services() {
    const { t } = useLanguage();

    return (
        <section id="services" className="py-24 bg-light-gray text-black">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="text-primary font-bold mb-4">
                        {t("Our Services", "আমাদের সার্ভিস")}
                    </div>
                    <h2 className="text-4xl lg:text-5xl font-black text-black mb-6">
                        {t("What We Solve", "আমরা যা সমাধান করি")}
                    </h2>
                    <div className="w-20 h-1.5 bg-primary rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <Link href="/bookings/new" key={index} className="block h-full">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{
                                    y: -10,
                                    transition: { duration: 0.3 }
                                }}
                                className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col h-full"
                            >
                                {/* Image Container */}
                                <div className="relative h-56 w-full overflow-hidden">
                                    <Image
                                        src={service.image}
                                        alt={service.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>

                                <div className="p-8 flex flex-col flex-grow">
                                    <h3 className="text-2xl font-black text-black mb-3 group-hover:text-primary transition-colors duration-300">
                                        {t(service.title, service.bn)}
                                    </h3>
                                    <p className="text-gray-500 leading-relaxed mb-6">
                                        {t(service.description, service.descBn)}
                                    </p>

                                    <div className="mt-auto flex items-center gap-2 text-sm font-bold text-primary">
                                        {t("Book Now", "বুকিং শুরু করুন")}
                                        <motion.span
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                        >
                                            →
                                        </motion.span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
