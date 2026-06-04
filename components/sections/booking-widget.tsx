"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MapPin, Box, Truck, Weight, Calendar, Search } from "lucide-react";

export function BookingWidget() {
    return (
        <div className="container mx-auto px-6 lg:px-12 relative z-30 -mt-16 lg:-mt-24">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="bg-white rounded-xl shadow-premium border border-gray-100 p-6 lg:p-8"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-end text-black">
                    {/* Pickup */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-tighter flex items-center gap-1.5 ml-1">
                            <MapPin className="w-3 h-3 text-primary" />
                            Pickup Location
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="ঢাকার ভিতর"
                                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-md px-4 text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Drop */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-tighter flex items-center gap-1.5 ml-1">
                            <MapPin className="w-3 h-3 text-secondary" />
                            Drop Location
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="চট্টগ্রাম"
                                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-md px-4 text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* Goods Type */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-tighter flex items-center gap-1.5 ml-1">
                            <Box className="w-3 h-3" />
                            Goods Type
                        </label>
                        <select className="w-full h-12 bg-gray-50 border border-gray-100 rounded-md px-4 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
                            <option className="text-black">Industrial Goods</option>
                            <option className="text-black">Household Items</option>
                            <option className="text-black">Furniture</option>
                            <option className="text-black">Food & Veg</option>
                            <option className="text-black">Construction</option>
                        </select>
                    </div>

                    {/* Truck Type */}
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase text-gray-400 tracking-tighter flex items-center gap-1.5 ml-1">
                            <Truck className="w-3 h-3" />
                            Truck Type
                        </label>
                        <select className="w-full h-12 bg-gray-50 border border-gray-100 rounded-md px-4 text-sm font-semibold text-black focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
                            <option className="text-black">7 Tone Truck</option>
                            <option className="text-black">5 Tone Truck</option>
                            <option className="text-black">Pickup (1 Ton)</option>
                            <option className="text-black">Covered Van</option>
                            <option className="text-black">Trailer</option>
                        </select>
                    </div>

                    {/* Weight & Date */}
                    <div className="grid grid-cols-2 gap-4 lg:col-span-1">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-tighter flex items-center gap-1.5 ml-1">
                                <Weight className="w-3 h-3" />
                                Weight
                            </label>
                            <input
                                type="text"
                                placeholder="5 Tons"
                                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-md px-4 text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase text-gray-400 tracking-tighter flex items-center gap-1.5 ml-1">
                                <Calendar className="w-3 h-3" />
                                Date
                            </label>
                            <input
                                type="text"
                                placeholder="Today"
                                className="w-full h-12 bg-gray-50 border border-gray-100 rounded-md px-4 text-sm font-semibold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="lg:col-span-1">
                        <Button className="w-full h-12 font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-white">
                            <Search className="w-4 h-4" />
                            দ্রুত কোটেশন পান
                        </Button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
