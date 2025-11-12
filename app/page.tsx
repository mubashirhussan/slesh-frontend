// import { sanityClient } from "@/lib/sanity.client";
// import { landingQuery } from "@/lib/queries";
// import type { LandingData } from "@/types/sanity";
// import Hero from "@/components/sections/Hero";
// import Features from "@/components/sections/Features";
// import About from "@/components/sections/About";
// import Pricing from "@/components/sections/Pricing";
// import BlogPreview from "@/components/sections/BlogPreview";
import HeroSection from "@/components/sections/Hero";
import FeaturesSection from "@/components/sections/Features";
import DataSection from "@/components/sections/DataSection";
import FAQSection from "@/components/sections/FaqSection";
import Footer from "@/components/Footer";

export const revalidate = 60;

export default async function Home() {
  // const data = await sanityClient.fetch<LandingData>(landingQuery, {}, { cache: "force-cache" });

  return (
    <main>
      {/* <Hero data={data?.hero} />
      <Features items={data?.features} />
      <About data={data?.about} />
      <Pricing  />
      <BlogPreview posts={data?.posts} /> */}
       <HeroSection />
      <FeaturesSection />
      <DataSection />
      <FAQSection />
      <Footer />
    </main>
  );
}
