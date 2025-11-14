// import { sanityClient } from "@/lib/sanity.client";
// import { pricingQuery } from "@/lib/queries";
// import type { PricingTier } from "@/types/sanity";
import EnterpriseSection from "@/components/sections/EnterpriseSection";
import Pricing from "@/components/sections/Pricing";

export const revalidate = 120;

export default async function PricingPage() {
  // const tiers = await sanityClient.fetch<PricingTier[]>(pricingQuery, {}, { cache: "force-cache" });
  return (
    <main>
      <Pricing />
      <EnterpriseSection />
    </main>
  );
}
