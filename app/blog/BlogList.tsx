/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/hooks/ImageBuilder";
import type { Post } from "@/types/sanity";

interface BlogListProps {
  posts: Post[];
  categories: any[];
}

const POSTS_PER_PAGE = 6;

export default function BlogList({ posts, categories }: BlogListProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter posts by category
  const filteredPosts = useMemo(() => {
    if (selectedCategory === "All") return posts;
    return posts.filter((p) =>
      p.categories?.some((c) => c.title === selectedCategory)
    );
  }, [posts, selectedCategory]);

  // Calculate paginated posts
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  // Handle page change
  const changePage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="w-full">
      {/* ---------- Category Tabs ---------- */}
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => {
            setSelectedCategory("All");
            setCurrentPage(1);
          }}
          className={`rounded-full cursor-pointer border px-4 py-2 text-sm font-medium transition ${
            selectedCategory === "All"
              ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white shadow"
              : "border-gray-300 text-[#475467] hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)] hover:text-white"
          }`}
        >
          All
        </button>

        {categories?.map((cat,index) => (
          <button
           key={cat?.slug?.current ?? `${cat?.title}-${index}`}
            onClick={() => {
              setSelectedCategory(cat.title);
              setCurrentPage(1);
            }}
            className={`rounded-full cursor-pointer border px-4 py-2 text-sm font-medium transition ${
              selectedCategory === cat.title
                ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white shadow"
                : "border-gray-300 text-[#475467] hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)] hover:text-white"
            }`}
          >
            {cat.title}
          </button>
        ))}
      </div>

      {/* ---------- Blog Cards ---------- */}
      <div className="mx-auto grid w-full gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedPosts?.length ? (
          paginatedPosts.map((p) => (
            <Link
              key={p.slug?.current}
              href={`/blog/${p.slug?.current}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-primary)] hover:shadow-2xl hover:shadow-[color:var(--color-primary-muted)] dark:border-zinc-800 dark:bg-zinc-900"
            >
              {p.mainImage && (
                <div className="relative w-full h-56 flex-shrink-0">
                  <Image
                    src={urlFor(p.mainImage).width(800).height(400).url()}
                    alt={p.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="flex flex-col justify-between flex-grow p-6">
                <div>
                  <h2 className="min-h-[3.5rem] text-xl font-semibold text-black transition group-hover:text-[color:var(--color-primary)] dark:text-white dark:group-hover:text-[color:var(--color-primary)]">
                    {p.title}
                  </h2>
                  <p className="mt-3 text-gray-600 dark:text-zinc-400 line-clamp-3 min-h-[4.5rem]">
                    {p.body?.[0]?.children?.[0]?.text ?? "Read more..."}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-zinc-800">
                  {p.author && (
                    <div className="flex items-center gap-2">
                      {/* {p.author.image?.asset?.url && (
                        <Image
                          src={p.author.image.asset.url}
                          alt={p.author.name}
                          width={28}
                          height={28}
                          className="rounded-full object-cover"
                        />
                      )} */}
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {p.author.name}
                      </span>
                    </div>
                  )}
                  <span className="text-sm text-[#667085]">
                    {p.publishedAt
                      ? new Date(p.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "Draft"}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No posts found.</p>
        )}
      </div>

      {/* ---------- Pagination ---------- */}
      {totalPages > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => changePage(i + 1)}
              className={`h-10 cursor-pointer w-10 rounded-full text-sm font-medium border transition ${
                currentPage === i + 1
                  ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)] text-white"
                  : "border-gray-300 text-[#475467] hover:border-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)] hover:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
