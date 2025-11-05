import type { About as AboutType } from "@/types/sanity";

export default function About({ data }: { data?: AboutType }) {
	return (
		<section id="about" className="mx-auto max-w-6xl px-4 py-16">
			<h2 className="text-2xl font-semibold text-black dark:text-white">{data?.title || "About Us"}</h2>
			<p className="mt-4 max-w-3xl text-zinc-600 dark:text-zinc-400">
				{data?.body || "We are focused on delivering a delightful developer experience and blazing fast websites."}
			</p>
		</section>
	);
}


