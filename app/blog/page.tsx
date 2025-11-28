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
    <main className="min-h-screen pt-24 md:pt-28 w-full">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="mb-4 text-4xl font-bold text-black md:text-5xl">
            Slesh Resource Hub
          </h1>

          <p className="text-[#475467] max-w-xl mx-auto text-center mb-6">
            Access the latest insights and news regarding to stay updated with
            Slesh
          </p>
        </div>
        <div className="w-full">
          <BlogList posts={posts} categories={categories} />
        </div>
      </div>
    </main>
  );
}
