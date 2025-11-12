"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Left: Logo */}
        <Link href="/" className="font-semibold text-lg">
          Slesh
        </Link>

        {/* Center: Menu (hidden on mobile) */}
        <nav className="hidden md:flex gap-6">
          <Link
            href="/#features"
            className="text-zinc-700 text-md hover:text-black dark:text-zinc-300 dark:hover:text-white"
          >
            Features
          </Link>
		  <Link
            href="/pricing"
            className="text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
          >
            Pricing
          </Link>
          <Link
            href="/blog"
            className="text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
          >
            Blog
          </Link>
          <Link
            href="/students"
            className="text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
          >
            Students
          </Link>
        <Link
  href="https://docs.slesh.ai"
  prefetch={false}
  target="_blank"
  rel="noopener noreferrer"
  className="text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
>
  Docs
</Link>
		     <Link
            href="/careers"
            className="text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
          >
            Careers
          </Link>
		       <Link
            href="/account"
            className="text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
          >
            Account
          </Link>
        </nav>

        {/* Right: Add to Chrome button (always visible on mobile & desktop) */}
        <div className="flex items-center gap-2">
          <button className="rounded-full bg-black text-white px-4 py-2 text-sm hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
            Add to Chrome
          </button>

          {/* Hamburger menu (visible only on mobile) */}
          <button
            aria-label="Toggle Menu"
            onClick={() => setOpen(!open)}
            className="md:hidden rounded-md border px-3 py-2 text-sm flex items-center justify-center"
          >
            {/* Hamburger Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              {open ? (
                // X icon
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                // Hamburger icon
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-black md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/#features" onClick={() => setOpen(false)}>
              Features
            </Link>
			  <Link href="/pricing" onClick={() => setOpen(false)}>
              Pricing
            </Link>
			 <Link href="/blog" onClick={() => setOpen(false)}>
              Blog
            </Link>
			 <Link href="/students" onClick={() => setOpen(false)}>
              Students
            </Link>
			   <Link
  href="https://docs.slesh.ai"
  prefetch={false}
  onClick={() => setOpen(false)}
  target="_blank"
  rel="noopener noreferrer"
  className="text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white"
>
  Docs
</Link>
		
        
            <Link href="/careers" onClick={() => setOpen(false)}>
              Career
            </Link>
           
          </div>
        </div>
      )}
    </header>
  );
}
