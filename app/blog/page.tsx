/* eslint-disable @typescript-eslint/no-explicit-any */
import { sanityClient } from "@/lib/sanity.client";
import { postsQuery, postCategoryQuery } from "@/lib/queries";
import type { Post } from "@/types/sanity";
import BlogList from "./BlogList";

export const revalidate = 120;

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    sanityClient.fetch<Post[]>(postsQuery, {}, { cache: "force-cache" }),
    sanityClient.fetch(postCategoryQuery),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
		<div className="py-8">
   <h1 className="text-4xl text-center font-semibold text-black dark:text-white mb-8">
        Slesh Resource Hub
      </h1>
	 
		<p className="text-lg text-black text-center">Access the latest insights and news regarding to stay updated with Slesh</p>
		</div>
   

      <BlogList posts={posts} categories={categories} />
    </main>
  );
}
