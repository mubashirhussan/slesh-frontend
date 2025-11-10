/* eslint-disable @typescript-eslint/no-explicit-any */
// app/blog/[slug]/page.tsx
import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity.client";
import { postBySlugQuery, postSlugsQuery } from "@/lib/queries";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/hooks/ImageBuilder";
import type { Post, FAQItem, CtaCard, HighlightCta } from "@/types/sanity";
import Link from "next/link";

export const revalidate = 120; // ISR: regenerate every 2 minutes

// ✅ Generate static params for SSG
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const slugs = await sanityClient.fetch<string[]>(postSlugsQuery);
  return (slugs || []).map((slug) => ({ slug }));
}

// ✅ Dynamic metadata for SEO
export async function generateMetadata({
  params,
}: {
  params: { slug: string } | Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  if (!slug) return {};

  const post = await sanityClient.fetch<Post>(postBySlugQuery, { slug });
  if (!post) return {};

  const ogImage = post.openGraphImage ? urlFor(post.openGraphImage).url() : undefined;

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || "",
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || "",
      images: ogImage ? [ogImage] : undefined,
      type: "article",
      publishedTime: post.publishedAt,
    },
    twitter: {
      card: post.twitterCardType || "summary_large_image",
      title: post.metaTitle || post.title,
      description: post.metaDescription || "",
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

// ✅ Post Page Component
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!slug) notFound();

  const post = await sanityClient.fetch<Post>(postBySlugQuery, { slug });

  if (!post) return <div>Post not found</div>;

  //  PortableText custom components


 const myPortableTextComponents: PortableTextComponents = {
  types: {
    // 🖼️ Handle inline or block images
    image: ({ value }: { value: any }) => {
      if (!value?.asset?._ref) return null;
      const imageUrl = urlFor(value).width(1000).url();
      return (
        <div className="my-6 flex justify-center">
          <Image
            src={imageUrl}
            alt={value?.alt || "Blog image"}
            width={1000}
            height={600}
            className="rounded-xl object-cover"
          />
        </div>
      );
    },

    // 💻 Handle code blocks
    code: ({ value }: { value: any }) => (
      <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 my-4 overflow-x-auto text-sm">
        <code>{value.code}</code>
      </pre>
    ),

    // 🔖 Handle callouts or custom block types
    callout: ({ value }: { value: any }) => (
      <div className="p-4 my-4 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded">
        <p className="text-blue-800 dark:text-blue-100">{value?.text}</p>
      </div>
    ),
  },

  marks: {
    // 🔗 Hyperlinks
    link: ({ children, value }: { children: React.ReactNode; value?: any }) => {
      const href = value?.href || "#";
      const isExternal = href.startsWith("http");
      return (
        <Link
          href={href}
          target={isExternal ? "_blank" : "_self"}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400"
        >
          {children}
        </Link>
      );
    },

    // 💬 Highlight text
    highlight: ({ children }: { children: React.ReactNode }) => (
      <span className="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">{children}</span>
    ),

    // 🔠 Bold / italic / underline etc.
    strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    underline: ({ children }) => <u>{children}</u>,
  },

  block: {
    // 🏷️ Headings
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mt-10 mb-4 text-black dark:text-white">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-semibold mt-8 mb-3 text-black dark:text-white">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-semibold mt-6 mb-2 text-black dark:text-white">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="text-base leading-7 text-gray-800 dark:text-gray-300 my-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-zinc-400 pl-4 italic text-zinc-600 dark:text-zinc-300 my-4">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc ml-6 space-y-2 text-gray-800 dark:text-gray-300">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal ml-6 space-y-2 text-gray-800 dark:text-gray-300">{children}</ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="leading-6">{children}</li>,
    number: ({ children }) => <li className="leading-6">{children}</li>,
  },
};


  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-semibold text-black dark:text-white">{post.title}</h1>

      {/* Date */}
      {post.publishedAt && (
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

      {/* Main Image */}
      {post.mainImage && (
        <div className="mt-6">
          <Image
            src={urlFor(post.mainImage).width(800).url()}
            alt={post.title}
            width={800}
            height={400}
            className="rounded-lg"
          />
        </div>
      )}

      {/* Body Content */}
      {post.body && (
        <div className="prose prose-zinc mt-8 dark:prose-invert">
          <PortableText value={post.body} components={myPortableTextComponents} />
        </div>
      )}

      {/* FAQ Section */}
      {post.faq && post.faq.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
          {post.faq.map((item: FAQItem, idx: number) => (
            <div key={idx} className="mb-4">
              <h3 className="font-medium">{item.question}</h3>
              <p className="text-zinc-600 dark:text-zinc-400">{item.answer}</p>
            </div>
          ))}
        </section>
      )}

      {/* CTA Card */}
      {post.ctaCard && (
        <section className="mt-12 p-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <h2 className="text-xl font-semibold">{post.ctaCard.headline}</h2>
          <p className="mt-2">{post.ctaCard.description}</p>
          <a
            href={post.ctaCard.buttonUrl}
            className="inline-block mt-4 px-4 py-2 bg-black text-white rounded hover:bg-zinc-900"
          >
            {post.ctaCard.buttonText}
          </a>
        </section>
      )}

      {/* Highlight CTA */}
      {post.highlightCta && (
        <section className="mt-12 p-6 bg-black text-white rounded-lg text-center">
          <h2 className="text-2xl font-bold">{post.highlightCta.headline}</h2>
          <a
            href={post.highlightCta.buttonUrl}
            className="inline-block mt-4 px-6 py-3 bg-white text-black font-semibold rounded hover:bg-zinc-200"
          >
            {post.highlightCta.buttonText}
          </a>
        </section>
      )}
    </main>
  );
}
