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

export type Post = {
	title?: string;
	slug?: { current?: string };
	excerpt?: string;
	publishedAt?: string;
	body?: unknown;
};

export type LandingData = {
	hero?: Hero;
	features?: Feature[];
	about?: About;
	pricing?: PricingTier[];
	posts?: Post[];
};


