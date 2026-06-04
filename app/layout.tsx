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
  title: "TruckDorkar | বাংলাদেশের সবচেয়ে নির্ভরযোগ্য ট্রাক বুকিং প্ল্যাটফর্ম",
  description: "দেশের যেকোনো প্রান্তে দ্রুত, নিরাপদ ও সাশ্রয়ী মূল্যে ট্রাক বুকিং করুন। ট্রাক দরকার - আপনার নির্ভরযোগ্য লজিস্টিক পার্টনার।",
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
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
