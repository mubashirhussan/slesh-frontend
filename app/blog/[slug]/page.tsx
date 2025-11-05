import { sanityClient } from "@/lib/sanity.client";
import { postBySlugQuery, postSlugsQuery } from "@/lib/queries";
import type { Post } from "@/types/sanity";

export const revalidate = 120;

export async function generateStaticParams() {
	const slugs = await sanityClient.fetch<string[]>(postSlugsQuery, {}, { cache: "force-cache" });
	return (slugs || []).map((slug) => ({ slug }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
	const post = await sanityClient.fetch<Post>(postBySlugQuery, { slug: params.slug }, { cache: "force-cache" });

	if (!post) {
		return (
			<main className="mx-auto max-w-3xl px-4 py-16">
				<h1 className="text-2xl font-semibold">Post not found</h1>
			</main>
		);
	}

	return (
		<main className="mx-auto max-w-3xl px-4 py-16">
			<h1 className="text-3xl font-semibold text-black dark:text-white">{post.title}</h1>
			<p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{post.publishedAt && new Date(post.publishedAt).toLocaleDateString()}</p>
			<div className="prose prose-zinc mt-8 dark:prose-invert">
				{/* You can replace this with a proper Portable Text renderer if needed */}
				<pre className="whitespace-pre-wrap text-sm">{typeof post.body === "string" ? post.body : JSON.stringify(post.body, null, 2)}</pre>
			</div>
		</main>
	);
}


