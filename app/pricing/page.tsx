// import { sanityClient } from "@/lib/sanity.client";
// import { pricingQuery } from "@/lib/queries";
// import type { PricingTier } from "@/types/sanity";
import EnterpriseSection from "@/components/sections/EnterpriseSection";
import Pricing from "@/components/sections/Pricing";
import PricingSkeleton from "@/components/sections/PricingSkeleton";
import { Suspense } from "react";

export const revalidate = 120;

export default async function PricingPage() {
  // const tiers = await sanityClient.fetch<PricingTier[]>(pricingQuery, {}, { cache: "force-cache" });
  return (
    <main>
      <Suspense fallback={<PricingSkeleton />}>
        <Pricing />
      </Suspense>
      <EnterpriseSection />
    </main>
  );
}
