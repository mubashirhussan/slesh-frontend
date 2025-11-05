"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
	const [open, setOpen] = useState(false);

	return (
		<header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
			<div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
				<Link href="/" className="font-semibold">
					Slesh
				</Link>
				<nav className="hidden gap-6 md:flex">
					<Link href="/#features" className="text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white">Features</Link>
					<Link href="/#about" className="text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white">About</Link>
					<Link href="/pricing" className="text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white">Pricing</Link>
					<Link href="/blog" className="text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white">Blog</Link>
				</nav>
				<button aria-label="Toggle Menu" onClick={() => setOpen(!open)} className="md:hidden rounded-md border px-3 py-1 text-sm">
					Menu
				</button>
			</div>
			{open && (
				<div className="border-t border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-black md:hidden">
					<div className="flex flex-col gap-3">
						<Link href="/#features" onClick={() => setOpen(false)}>Features</Link>
						<Link href="/#about" onClick={() => setOpen(false)}>About</Link>
						<Link href="/pricing" onClick={() => setOpen(false)}>Pricing</Link>
						<Link href="/blog" onClick={() => setOpen(false)}>Blog</Link>
					</div>
				</div>
			)}
		</header>
	);
}


