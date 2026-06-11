"use client";

import React from "react";
import Image from "next/image";

export function FooterBanner() {
    return (
        <section className="w-full bg-white">
            <div className="max-w-3xl mx-auto px-4 py-3">
                <Image
                    src="/images/footerimagebanner.png"
                    alt="TruckDorkar Footer Banner"
                    width={500}
                    height={100}
                    className="w-full max-h-[120px] object-contain"
                    style={{ height: 'auto' }}
                    priority
                />
            </div>
        </section>
    );
}