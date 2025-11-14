/* eslint-disable @typescript-eslint/no-explicit-any */
// app/blog/[slug]/page.tsx
import React from "react";
import Image from "next/image";
import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity.client";
import { postBySlugQuery, postSlugsQuery } from "@/lib/queries";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import { urlFor } from "@/hooks/ImageBuilder";
import type {
  Post,
  FAQItem,
  CallToActionCard,
  HighlightCta,
} from "@/types/sanity";
import Link from "next/link";
import TableOfContents from "@/components/shared/TableOfContents";
import CtaCard from "@/components/shared/CtaCard";
import PostBottomButtons from "@/components/shared/PostBottomButtons";
import FAQSection from "../PostFaq";

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

  const ogImage = post.openGraphImage
    ? urlFor(post.openGraphImage).url()
    : undefined;

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

  const filteredBody =
    post.body?.filter(
      (block: any) =>
        block._type === "block" &&
        block.children.some((c: any) => c.text.trim() !== "")
    ) || [];
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
        <div className="my-4 rounded border-l-4 border-[color:var(--color-primary)] bg-[color:var(--color-primary-muted)] p-4 dark:bg-blue-900/20">
          <p className="text-[color:var(--color-primary)] dark:text-blue-100">
            {value?.text}
          </p>
        </div>
      ),
    },

    marks: {
      // 🔗 Hyperlinks
      link: ({
        children,
        value,
      }: {
        children: React.ReactNode;
        value?: any;
      }) => {
        const href = value?.href || "#";
        const isExternal = href.startsWith("http");
        return (
          <Link
            href={href}
            target={isExternal ? "_blank" : "_self"}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="text-[color:var(--color-primary)] underline hover:opacity-80"
          >
            {children}
          </Link>
        );
      },

      // 💬 Highlight text
      highlight: ({ children }: { children: React.ReactNode }) => (
        <span className="bg-yellow-200 dark:bg-yellow-600 px-1 rounded">
          {children}
        </span>
      ),

      // 🔠 Bold / italic / underline etc.
      strong: ({ children }) => (
        <strong className="font-semibold">{children}</strong>
      ),
      em: ({ children }) => <em className="italic">{children}</em>,
      underline: ({ children }) => <u>{children}</u>,
    },

    block: {
      // 🏷️ Headings
      h1: ({ children, value }: any) => (
        <h1
          id={value._key}
          className="text-4xl font-bold mt-10 mb-4 text-black dark:text-white"
          style={{ scrollMarginTop: "100px" }}
        >
          {children}
        </h1>
      ),
      h2: ({ children, value }: any) => (
        <h2
          id={value._key}
          className="text-3xl font-semibold mt-8 mb-3 text-black dark:text-white"
          style={{ scrollMarginTop: "100px" }}
        >
          {children}
        </h2>
      ),
      h3: ({ children, value }: any) => (
        <h3
          id={value._key}
          className="text-2xl font-semibold mt-6 mb-2 text-black dark:text-white"
          style={{ scrollMarginTop: "100px" }}
        >
          {children}
        </h3>
      ),
      h4: ({ children, value }: any) => (
        <h4
          id={value._key}
          className="text-xl font-semibold mt-4 mb-2 text-black dark:text-white"
          style={{ scrollMarginTop: "100px" }}
        >
          {children}
        </h4>
      ),
      h5: ({ children, value }: any) => (
        <h5
          id={value._key}
          className="text-lg font-medium mt-3 mb-1 text-black dark:text-white"
          style={{ scrollMarginTop: "100px" }}
        >
          {children}
        </h5>
      ),
      h6: ({ children, value }: any) => (
        <h6
          id={value._key}
          className="text-base font-medium mt-2 mb-1 text-black dark:text-white"
          style={{ scrollMarginTop: "100px" }}
        >
          {children}
        </h6>
      ),
      normal: ({ children }) => (
        <p className="text-base leading-7 text-gray-800 dark:text-gray-300 my-4">
          {children}
        </p>
      ),
      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-zinc-400 pl-4 italic text-zinc-600 dark:text-zinc-300 my-4">
          {children}
        </blockquote>
      ),
    },

    list: {
      bullet: ({ children }) => (
        <ul className="list-disc ml-6 space-y-2 text-gray-800 dark:text-gray-300">
          {children}
        </ul>
      ),
      number: ({ children }) => (
        <ol className="list-decimal ml-6 space-y-2 text-gray-800 dark:text-gray-300">
          {children}
        </ol>
      ),
    },

    listItem: {
      bullet: ({ children }) => <li className="leading-6">{children}</li>,
      number: ({ children }) => <li className="leading-6">{children}</li>,
    },
  };
  // 🔹 Extract h2/h3 headings from PortableText content
  const headings =
    post.body
      ?.filter((block: any) => block.style === "h2" || block.style === "h3")
      ?.map((block: any) => ({
        text: block.children?.[0]?.text || "",
        level: block.style,
        id: block._key,
      })) || [];
  // 🔹 JSON-LD Data: Article schema
  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription || "",
    image: post.mainImage ? urlFor(post.mainImage).width(800).url() : undefined,
    datePublished: post.publishedAt,
    dateModified: post._updatedAt || post._createdAt,
    author: {
      "@type": "Person",
      name: post.author?.name || "Unknown Author",
    },
    publisher: {
      "@type": "Organization",
      name: "KDAC Blogs",
      logo: {
        "@type": "ImageObject",
        url: "/logo.png", // 🔸 replace with your actual logo URL
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://slesh-ai-frontend.vercel.app/blog/${slug}`,
    },
  };
  // 🔹 Add FAQ schema if available
  let faqJsonLd: Record<string, any> | null = null;
  if (post.faq && post.faq.length > 0) {
    faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map((item: FAQItem) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    };
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 flex gap-12">
      {/* 🧠 JSON-LD Structured Data */}
      <script type="application/ld+json" suppressHydrationWarning>
        {JSON.stringify(jsonLd)}
      </script>

      {faqJsonLd && (
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify(faqJsonLd)}
        </script>
      )}

      {/* 🧭 Table of Contents */}
      {headings.length > 0 && (
        <aside className="hidden lg:block w-1/4 sticky top-24 self-start h-fit">
          {/* table of contents */}
          <div className="bg-[#F9F9F9] rounded-lg p-6 hidden lg:block">
            <h2 className="text-lg font-semibold mb-4">Table of Contents</h2>
            <div className="max-h-[calc(100vh-40rem)] overflow-y-auto">
              <TableOfContents headings={headings} />
            </div>
          </div>
          <div className="bg-[#F9F9F9] rounded-lg mt-6 p-6 hidden lg:block">
            <h2 className="text-lg  font-semibold mb-4">
              {post.ctaCard?.headline}
            </h2>
            <div className="max-h-[calc(100vh-18rem)] overflow-y-auto">
              <CtaCard ctaInfo={post.ctaCard} />
            </div>
          </div>
        </aside>
      )}
      <article className="flex-1">
        <h1 className="text-3xl font-semibold text-black dark:text-white">
          {post.title}
        </h1>

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
        {/* <p className="text-sm text-zinc-700 dark:text-zinc-300">
      By <span className="font-medium">{post.author?.name}</span>
    </p> */}
        {/* Main Image */}
        {post.mainImage && (
          <div className="mt-6 w-full">
            <Image
              src={urlFor(post.mainImage).width(800).url()}
              alt={post.title}
              width={1000}
              height={400}
              className="rounded-lg"
            />
          </div>
        )}

        {/* Body Content */}
        {post.body && (
          <div className="prose prose-zinc mt-8 dark:prose-invert">
            <PortableText
              value={filteredBody}
              components={myPortableTextComponents}
            />
          </div>
        )}

        <PostBottomButtons postTitle={post.title} />
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-6">Related Posts</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {post.relatedPosts.map((related, idx) => (
                <Link
                  key={related.slug?.current}
                  href={`/blog/${related.slug?.current}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[color:var(--color-primary)] hover:shadow-2xl hover:shadow-[color:var(--color-primary-muted)] dark:border-zinc-800 dark:bg-zinc-900"
                >
                  {related.mainImage && (
                    <div className="relative w-full h-56 flex-shrink-0">
                      <Image
                        src={urlFor(related.mainImage)
                          .width(800)
                          .height(400)
                          .url()}
                        alt={related.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="flex flex-col justify-between flex-grow px-2 py-4">
                    <div>
                      <h2 className=" line-clamp-2 min-h-[2.5rem] text-xl font-semibold text-black transition group-hover:text-[color:var(--color-primary)] dark:text-white dark:group-hover:text-[color:var(--color-primary)]">
                        {related.title}
                      </h2>
                      <p className="mt-3 text-gray-600 dark:text-zinc-400 line-clamp-2 min-h-[2.5rem]">
                        {related.body?.[0]?.children?.[0]?.text ??
                          "Read more..."}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-zinc-800">
                      {related.author && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {related.author.name}
                          </span>
                        </div>
                      )}
                      <span className="text-sm text-[#667085]">
                        {related.publishedAt
                          ? new Date(related.publishedAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )
                          : "Draft"}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
        {/* FAQ Section */}
        {post.faq && post.faq.length > 0 && <FAQSection faqs={post} />}

        {/* Highlight CTA */}
        {post.highlightCta && (
          <section className="mt-12 rounded-lg bg-gradient-to-r from-[color:var(--color-primary)] to-[#003bbd] p-8 text-center text-white">
            <h2 className="text-xl font-bold">{post.highlightCta.headline}</h2>
            <a
              href={post.highlightCta.buttonUrl}
              className="inline-block mt-4 px-6 py-2 bg-white text-[#005BB5] font-bold rounded hover:bg-zinc-200"
            >
              {post.highlightCta.buttonText}
            </a>
          </section>
        )}
      </article>
    </main>
  );
}
