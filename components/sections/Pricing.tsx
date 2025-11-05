import type { PricingTier } from "@/types/sanity";

export default function Pricing({ tiers = [] as PricingTier[] }: { tiers?: PricingTier[] }) {
	return (
		<section id="pricing" className="mx-auto max-w-6xl px-4 py-16">
			<h2 className="text-2xl font-semibold text-black dark:text-white">Pricing</h2>
			<div className="mt-8 grid gap-6 md:grid-cols-3">
				{(tiers.length ? tiers : new Array(3).fill(null)).map((t, i) => (
					<div key={i} className={`rounded-2xl border p-6 ${t?.highlight ? "border-black dark:border-white" : "border-zinc-200 dark:border-zinc-800"}`}>
						<div className="text-lg font-medium text-black dark:text-white">{t?.name || `Plan ${i + 1}`}</div>
						<div className="mt-2 text-3xl font-semibold">{t?.price ?? (i + 1) * 10}<span className="text-base font-normal text-zinc-600 dark:text-zinc-400">/{t?.interval || "mo"}</span></div>
						<ul className="mt-4 space-y-2 text-zinc-600 dark:text-zinc-400">
							{(t?.features?.length ? t.features : ["Feature A", "Feature B", "Feature C"]).map((f, idx) => (
								<li key={idx}>{f}</li>
							))}
						</ul>
						<button className="mt-6 w-full rounded-full bg-black px-4 py-2 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">Choose</button>
					</div>
				))}
			</div>
		</section>
	);
}


