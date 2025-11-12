import type { About as AboutType } from "@/types/sanity";

export default function About({ data }: { data?: AboutType }) {
	return (
		<section id="about" className="py-16">
			<div className="page-container">
				<div className="text-center">
				<h2 className="text-2xl font-semibold text-[color:var(--color-primary)] dark:text-[color:var(--color-primary)]">
					{data?.title || "About Us"}
				</h2>
				<p className="mx-auto mt-4 max-w-3xl rounded-2xl bg-[color:var(--color-primary-muted)] px-6 py-4 text-zinc-700 dark:bg-blue-900/30 dark:text-zinc-300">
					{data?.body || "We are focused on delivering a delightful developer experience and blazing fast websites."}
				</p>
				</div>
			</div>
		</section>
	);
}


