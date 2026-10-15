import { Navbar } from "@/components/layout/navbar";
import { BannerSlider } from "@/components/sections/banner-slider";
import { Hero } from "@/components/sections/hero";
import { BookingWidget } from "@/components/sections/booking-widget";
import { Statistics } from "@/components/sections/statistics";
import { Services } from "@/components/sections/services";
import { HowItWorks } from "@/components/sections/how-it-works";
import { WhyChoose } from "@/components/sections/why-choose";
import { Fleet } from "@/components/sections/fleet";
import { PartnerHighlight } from "@/components/sections/partner-highlight";
import { MobileApp, Testimonials } from "@/components/sections/social-proof";
import { FAQ, FinalCTA, Footer } from "@/components/layout/footer-section";
import { FooterBanner } from "@/components/sections/footer-banner";
import { MaintenanceScreen } from "@/components/sections/maintenance-screen";

/**
 * Temporary Maintenance Mode Flag
 * Set to `true` to display the maintenance screen when opening the website.
 * Set to `false` to display the normal website.
 * You can also bypass/preview the site anytime using: /?preview=true
 */
const IS_MAINTENANCE_MODE = true;

interface PageProps {
  searchParams?: Promise<{ preview?: string }>;
}

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const isPreview = params?.preview === "true";

  if (IS_MAINTENANCE_MODE && !isPreview) {
    return <MaintenanceScreen />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <BannerSlider />
        <Hero />
        <BookingWidget />
        <Statistics />
        <Services />
        <HowItWorks />
        <WhyChoose />
        <Fleet />
        <PartnerHighlight />
        <MobileApp />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <FooterBanner />
      </main>
      <Footer />
    </div>
  );
}

