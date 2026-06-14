import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://truckdorkar.com'),
  title: {
    default: "Truck Dorkar Limited | Bangladesh's Leading Online Truck Booking Platform",
    template: "%s | Truck Dorkar"
  },
  description: "Truck Dorkar Limited is the most reliable digital logistics platform in Bangladesh. Book trucks online safely and at the best prices. ট্রাক দরকার লিমিটেড - আপনার নির্ভরযোগ্য লজিস্টিক পার্টনার।",
  keywords: [
    "truck dorkar",
    "truck dorkar limited",
    "truckdorkar",
    "truckdorkar limited",
    "truck booking bangladesh",
    "online truck rent bd",
    "logistics service bangladesh",
    "ট্রাক দরকার",
    "ট্রাক বুকিং"
  ],
  authors: [{ name: "Truck Dorkar Limited" }],
  creator: "Truck Dorkar Limited",
  publisher: "Truck Dorkar Limited",
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Truck Dorkar Limited | Bangladesh's Leading Truck Booking Platform",
    description: "Book trucks online fast and safely anywhere in Bangladesh with Truck Dorkar Limited.",
    url: 'https://truckdorkar.com',
    siteName: 'Truck Dorkar',
    images: [
      {
        url: '/logos/mainlogo1.png',
        width: 1200,
        height: 630,
        alt: 'Truck Dorkar Limited - Logistics Simplified',
      },
    ],
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Truck Dorkar Limited | Bangladesh's Leading Truck Booking Platform",
    description: "Book trucks online fast and safely anywhere in Bangladesh with Truck Dorkar Limited.",
    images: ['/logos/mainlogo1.png'],
  },
  icons: {
    icon: "/logos/mainlogo1.png",
    apple: "/logos/mainlogo1.png",
  },
};

import { Providers } from "./providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Truck Dorkar Limited",
              "alternateName": ["TruckDorkar", "truckdorkar.com"],
              "url": "https://truckdorkar.com",
              "logo": "https://truckdorkar.com/logos/mainlogo1.png",
              "sameAs": [
                "https://www.facebook.com/profile.php?id=61579235266143",
                "https://wa.me/8801826110036"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+8801826110036",
                "contactType": "customer service",
                "areaServed": "BD",
                "availableLanguage": ["Bengali", "English"]
              }
            })
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
