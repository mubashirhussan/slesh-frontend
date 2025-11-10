import { sanityClient } from "@/lib/sanity.client";
import { postsQuery } from "@/lib/queries";
import type { Post } from "@/types/sanity";
import Link from "next/link";

export const revalidate = 120;

export default async function BlogPage() {
	const posts = await sanityClient.fetch<Post[]>(postsQuery, {}, { cache: "force-cache" });

	return (
		<main className="mx-auto max-w-6xl px-4 py-16">
			<h1 className="text-3xl font-semibold text-black dark:text-white">Blog</h1>
			<div className="mt-8 grid gap-6 md:grid-cols-3">
				{(posts?.length ? posts : []).map((p) => (
					<Link key={p.slug?.current} href={`/blog/${p.slug?.current}`} className="rounded-2xl border border-zinc-200 p-6 hover:border-black dark:border-zinc-800 dark:hover:border-white">
						<div className="text-lg font-medium text-black dark:text-white">{p.title}</div>
						<p className="mt-2 line-clamp-3 text-zinc-600 dark:text-zinc-400">{p.metaDescription}</p>
					</Link>
				))}
			</div>
		</main>
	);
}


