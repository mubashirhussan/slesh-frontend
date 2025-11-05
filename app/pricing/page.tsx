import { sanityClient } from "@/lib/sanity.client";
import { pricingQuery } from "@/lib/queries";
import type { PricingTier } from "@/types/sanity";
import Pricing from "@/components/sections/Pricing";

export const revalidate = 120;

export default async function PricingPage() {
	const tiers = await sanityClient.fetch<PricingTier[]>(pricingQuery, {}, { cache: "force-cache" });
	return (
		<main>
			<section className="mx-auto max-w-6xl px-4 pb-4 pt-16">
				<h1 className="text-3xl font-semibold text-black dark:text-white">Pricing</h1>
				<p className="mt-2 text-zinc-600 dark:text-zinc-400">Choose the plan that fits your needs.</p>
			</section>
			<Pricing tiers={tiers} />
		</main>
	);
}


