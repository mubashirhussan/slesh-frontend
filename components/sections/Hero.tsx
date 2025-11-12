import type { Hero as HeroType } from "@/types/sanity";
import Link from "next/link";

export default function Hero({ data }: { data?: HeroType }) {
	return (
		<section className="pb-16 pt-20 text-center md:pt-28">
			<div className="page-container">
				<div className="">
				<h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white md:text-6xl">
					{data?.title || "Build faster with Slesh"}
				</h1>
				<p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
					{data?.subtitle || "A modern frontend delivering speed, simplicity, and great DX."}
				</p>
					{(data?.ctaText || data?.ctaHref) && (
						<div className="mt-8">
							<Link href={data?.ctaHref || "#pricing"} className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)] px-8 py-3 text-white shadow-lg shadow-[color:var(--color-primary-muted)] transition hover:translate-y-0.5 hover:bg-[#0042d1]">
								{data?.ctaText || "Get Started"}
							</Link>
						</div>
					)}
				</div>
			</div>
		</section>
	);
}


