"use client";

import React from "react";
import Image from "next/image";

export function FooterBanner() {
    return (
        <section className="w-full bg-white">
            <div className="max-w-4xl mx-auto px-4 py-6">
                <Image
                    src="/images/footerimagebanner.png"
                    alt="TruckDorkar Footer Banner"
                    width={800}
                    height={200}
                    className="w-full h-auto max-h-[180px] object-contain"
                    priority
                />
            </div>
        </section>
    );
}