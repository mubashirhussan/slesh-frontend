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
    <main className="min-h-screen pt-24 md:pt-28 w-full flex flex-col items-center blog-section">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center mb-12 md:mb-16">
          <div className="mb-6 md:mb-8 text-4xl font-bold text-black md:text-5xl">
            Slesh Resource Hub
          </div>

          <div className="text-[#475467]  mx-auto text-center mb-6 text-lg md:text-xl leading-relaxed">
            Access the latest insights and news regarding to stay updated with
            Slesh
          </div>
        </div>
        <div className="w-full flex justify-center">
          <div className="w-full max-w-7xl">
            <BlogList posts={posts} categories={categories} />
          </div>
        </div>
      </div>
    </main>
  );
}
