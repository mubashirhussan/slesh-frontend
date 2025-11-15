import type { Post } from "@/types/sanity";
import Link from "next/link";

export default function BlogPreview({ posts = [] as Post[] }: { posts?: Post[] }) {
	return (
		<section className="py-16">
			<div className="page-container">
				<div className="text-center">
				<h2 className="text-2xl font-semibold text-[color:var(--color-primary)]">
					From the Blog
				</h2>
				<p className="mx-auto mt-3 max-w-2xl text-[#475467]">
					Stories, tips, and guides from the Slesh community.
				</p>
				</div>
				<div className="mt-10 grid gap-6 md:grid-cols-3">
				{(posts.length ? posts : new Array(3).fill(null)).map((p, i) => (
					<Link
						key={i}
						href={p?.slug?.current ? `/blog/${p.slug.current}` : "#"}
						className="rounded-2xl border border-zinc-200 bg-white/70 p-6 transition hover:-translate-y-1 hover:border-[color:var(--color-primary)] hover:shadow-xl hover:shadow-[color:var(--color-primary-muted)]"
					>
						<div className="text-lg font-medium text-neutral-900">{p?.title || `Sample Post ${i + 1}`}</div>
						<p className="mt-2 line-clamp-3 text-zinc-600">{p?.metaDescription || "Short excerpt of the blog post."}</p>
					</Link>
				))}
			</div>
				<div className="mt-10 text-center">
				<Link
					href="/blog"
					className="inline-flex items-center justify-center rounded-full border border-[color:var(--color-primary)] px-6 py-2 text-sm font-medium text-[color:var(--color-primary)] transition hover:bg-[color:var(--color-primary)] hover:text-white"
				>
					View all articles
				</Link>
				</div>
			</div>
		</section>
	);
}


