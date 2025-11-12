import type { Feature } from "@/types/sanity";

export default function Features({ items = [] as Feature[] }: { items?: Feature[] }) {
	return (
		<section id="features" className="py-16">
			<div className="page-container">
				<div className="text-center">
				<h2 className="text-2xl font-semibold text-[color:var(--color-primary)] dark:text-[color:var(--color-primary)]">
					Features
				</h2>
				<p className="mx-auto mt-3 max-w-2xl text-[#475467]">
					All your core workflows in one place – automated, fast, and dependable.
				</p>
				</div>
				<div className="mt-10 grid gap-6 md:grid-cols-3">
				{(items.length ? items : new Array(3).fill(null)).map((f, i) => (
					<div
						key={i}
						className="rounded-2xl border border-zinc-200 bg-white/70 p-6 shadow-sm transition hover:-translate-y-1 hover:border-[color:var(--color-primary)] hover:shadow-xl dark:border-zinc-700 dark:bg-zinc-900/70"
					>
						<div className="text-lg font-medium text-neutral-900 dark:text-white">{f?.title || `Feature ${i + 1}`}</div>
						<p className="mt-2 text-zinc-600 dark:text-zinc-400">{f?.description || "Short description of the feature."}</p>
					</div>
				))}
			</div>
			</div>
		</section>
	);
}


