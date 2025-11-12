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
    <main className="pt-12">
		<div className="page-container">
      <div className="text-center mb-8">
   <h1 className="mb-4 text-4xl font-bold text-[color:var(--color-primary)] md:text-5xl">
        Slesh Resource Hub
      </h1>
	 
		<p className="text-[#475467] max-w-xl mx-auto text-center mb-6">Access the latest insights and news regarding to stay updated with Slesh</p>
		</div>
      <div className="">
        <BlogList posts={posts} categories={categories} />
      </div>
    </div>
    </main>
  );
}
