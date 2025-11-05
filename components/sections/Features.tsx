import type { Feature } from "@/types/sanity";

export default function Features({ items = [] as Feature[] }: { items?: Feature[] }) {
	return (
		<section id="features" className="mx-auto max-w-6xl px-4 py-16">
			<h2 className="text-2xl font-semibold text-black dark:text-white">Features</h2>
			<div className="mt-8 grid gap-6 md:grid-cols-3">
				{(items.length ? items : new Array(3).fill(null)).map((f, i) => (
					<div key={i} className="rounded-2xl border border-zinc-200 p-6 dark:border-zinc-800">
						<div className="text-lg font-medium text-black dark:text-white">{f?.title || `Feature ${i + 1}`}</div>
						<p className="mt-2 text-zinc-600 dark:text-zinc-400">{f?.description || "Short description of the feature."}</p>
					</div>
				))}
			</div>
		</section>
	);
}


