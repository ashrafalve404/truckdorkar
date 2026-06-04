import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";
import { BookingWidget } from "@/components/sections/booking-widget";
import { Statistics } from "@/components/sections/statistics";
import { Services } from "@/components/sections/services";
import { HowItWorks } from "@/components/sections/how-it-works";
import { WhyChoose } from "@/components/sections/why-choose";
import { Fleet } from "@/components/sections/fleet";
import { CorporateClients, MobileApp, Testimonials } from "@/components/sections/social-proof";
import { FAQ, FinalCTA, Footer } from "@/components/layout/footer-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <BookingWidget />
        <Statistics />
        <Services />
        <HowItWorks />
        <WhyChoose />
        <Fleet />
        <CorporateClients />
        <MobileApp />
        <Testimonials />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
