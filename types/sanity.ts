import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { PortableTextBlock } from "next-sanity";

export type Hero = {
	title?: string;
	subtitle?: string;
	ctaText?: string;
	ctaHref?: string;
};

export type Feature = {
	title?: string;
	description?: string;
	icon?: string;
};

export type About = {
	title?: string;
	body?: string;
};

export type PricingTier = {
	name?: string;
	price?: number;
	interval?: string;
	features?: string[];
	highlight?: boolean;
};
export interface Author {
  _id: string;
  name: string;
  slug?: { current: string };
  image?: SanityImageSource;
}

export interface Category {
  _id: string;
  title: string;
  slug?: { current: string };
}

export interface FAQItem {
  question: string;
  answer: string;
}
export interface CallToActionCard {
  headline: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
}

export interface HighlightCta {
  headline: string;
  buttonText: string;
  buttonUrl: string;
}
export interface CTACard {
  headline: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
}

export interface HighlightCTA {
  headline: string;
  buttonText: string;
  buttonUrl: string;
}
export interface Post {
  _id: string;
  _createdAt: string;
  _updatedAt: string;

  title: string;
  slug: { current: string };
  author?: Author;
  mainImage?: {
    asset: { _ref: string; _type: string };
    hotspot?: { x: number; y: number; height: number; width: number };
  };
  categories?: Category[];
  publishedAt?: string;
  body?: PortableTextBlock[];
  relatedPosts?: { _ref: string }[]; // Reference to other posts

  // --- SEO Fields ---
  metaTitle?: string;
  metaDescription?: string;
  faq?: FAQItem[];

  // --- CTA Card ---
  ctaCard?: CTACard;

  // --- Highlight CTA ---
  highlightCta?: HighlightCTA;

  // --- Other SEO & Social ---
  seoTags?: string[];
  canonicalUrl?: string;
  openGraphImage?: {
    asset: { _ref: string; _type: string };
    hotspot?: { x: number; y: number; height: number; width: number };
  };
  twitterCardType?: 'summary' | 'summary_large_image';
}

export type LandingData = {
	hero?: Hero;
	features?: Feature[];
	about?: About;
	pricing?: PricingTier[];
	posts?: Post[];
};


