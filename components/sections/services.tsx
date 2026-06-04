"use client";

import React from "react";
import { motion } from "framer-motion";
import { Truck, Package, Factory, Warehouse, Building2, ShieldCheck } from "lucide-react";

const services = [
    {
        title: "Truck Booking",
        bn: "ট্রাক বুকিং",
        icon: Truck,
        description: "Book trucks of various sizes for local or long-distance haulage.",
    },
    {
        title: "Mini Truck Rental",
        bn: "মিনি ট্রাক রেন্টাল",
        icon: Package,
        description: "Perfect for shifting small furniture or moving within the city.",
    },
    {
        title: "Container Transport",
        bn: "কন্টেইনার ট্রান্সপোর্ট",
        icon: Factory,
        description: "Reliable movement of containers between ports and warehouses.",
    },
    {
        title: "Industrial Logistics",
        bn: "ইন্ডাস্ট্রিয়াল লজিস্টিকস",
        icon: ShieldCheck,
        description: "Specialized logistics solutions for large-scale industrial goods.",
    },
    {
        title: "Warehouse Delivery",
        bn: "ওয়্যারহাউস ডেলিভারি",
        icon: Warehouse,
        description: "Efficient distribution from central warehouses to any district.",
    },
    {
        title: "Corporate Fleet",
        bn: "কর্পোরেট ফ্লিট",
        icon: Building2,
        description: "Long-term partnership with businesses for dedicated transport.",
    },
];

export function Services() {
    return (
        <section id="services" className="py-24 bg-light-gray text-black">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="text-primary font-bold uppercase tracking-[0.2em] mb-4">Our Services</div>
                    <h2 className="text-4xl lg:text-5xl font-black text-black mb-6">
                        আমরা যা সমাধান করি
                    </h2>
                    <div className="w-20 h-1.5 bg-primary rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{
                                y: -10,
                                boxShadow: "0 20px 40px rgba(0,0,0,0.06)"
                            }}
                            className="bg-white p-8 rounded-none border border-gray-100 transition-all cursor-default group"
                        >
                            <div className="w-14 h-14 bg-gray-50 flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                                <service.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-2xl font-black text-black mb-2">{service.bn}</h3>
                            <div className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-tighter">
                                {service.title}
                            </div>
                            <p className="text-gray-500 leading-relaxed">
                                {service.description}
                            </p>

                            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                Learn More <span>→</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
