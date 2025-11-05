export default function Footer() {
	return (
		<footer className="border-t border-zinc-200 py-10 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
			<div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
				<p>© {new Date().getFullYear()} Slesh. All rights reserved.</p>
				<div className="flex gap-5">
					<a href="#" className="hover:text-black dark:hover:text-white">Privacy</a>
					<a href="#" className="hover:text-black dark:hover:text-white">Terms</a>
				</div>
			</div>
		</footer>
	);
}


