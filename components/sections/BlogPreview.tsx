import type { Post } from "@/types/sanity";
import Link from "next/link";

export default function BlogPreview({ posts = [] as Post[] }: { posts?: Post[] }) {
	return (
		<section className="mx-auto max-w-6xl px-4 py-16">
			<div className="flex items-end justify-between">
				<h2 className="text-2xl font-semibold text-black dark:text-white">From the Blog</h2>
				<Link href="/blog" className="text-sm text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white">View all</Link>
			</div>
			<div className="mt-8 grid gap-6 md:grid-cols-3">
				{(posts.length ? posts : new Array(3).fill(null)).map((p, i) => (
					<Link key={i} href={p?.slug?.current ? `/blog/${p.slug.current}` : "#"} className="rounded-2xl border border-zinc-200 p-6 hover:border-black dark:border-zinc-800 dark:hover:border-white">
						<div className="text-lg font-medium text-black dark:text-white">{p?.title || `Sample Post ${i + 1}`}</div>
						<p className="mt-2 line-clamp-3 text-zinc-600 dark:text-zinc-400">{p?.excerpt || "Short excerpt of the blog post."}</p>
					</Link>
				))}
			</div>
		</section>
	);
}


