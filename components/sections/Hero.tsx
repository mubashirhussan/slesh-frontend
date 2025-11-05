import type { Hero as HeroType } from "@/types/sanity";
import Link from "next/link";

export default function Hero({ data }: { data?: HeroType }) {
	return (
		<section className="mx-auto max-w-6xl px-4 pb-16 pt-20 text-center md:pt-28">
			<h1 className="text-4xl font-semibold tracking-tight text-black dark:text-white md:text-6xl">
				{data?.title || "Build faster with Slesh"}
			</h1>
			<p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
				{data?.subtitle || "A modern frontend delivering speed, simplicity, and great DX."}
			</p>
			{(data?.ctaText || data?.ctaHref) && (
				<div className="mt-8">
					<Link href={data?.ctaHref || "#pricing"} className="inline-flex rounded-full bg-black px-6 py-3 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
						{data?.ctaText || "Get Started"}
					</Link>
				</div>
			)}
		</section>
	);
}


