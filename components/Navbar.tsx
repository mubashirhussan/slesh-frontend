/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Add this import
import { useEffect, useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname(); // Track current pathname
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("supabase_access_token"));
  }, []);
  // Scroll to top on pathname change (route navigation)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <header className="mb-24">
      <nav className="fixed top-0 z-40 w-full py-4 border-zinc-200 bg-white/85 backdrop-blur dark:border-zinc-800 dark:bg-black/60">
        <div className="navbar-grid mx-auto w-full max-w-7xl items-center gap-6 px-4 py-3">
          <div className="md:w-40 w-full">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/sleshLogo.svg"
                alt="Slesh Logo"
                width={74}
                height={74}
                className="rounded-sm"
                priority
              />
            </Link>
          </div>

          <nav className="hidden items-center justify-center gap-6 md:flex">
            <Link
              href="/#features"
              className="text-[#737373] text-md hover:text-black text dark:text-zinc-300 dark:hover:text-white"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-[#737373] hover:text-black dark:text-zinc-300 dark:hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="/blog"
              className="text-[#737373] hover:text-black dark:text-zinc-300 dark:hover:text-white"
            >
              Blog
            </Link>
            <Link
              href="/students"
              className="text-[#737373] hover:text-black dark:text-zinc-300 dark:hover:text-white"
            >
              Students
            </Link>
            <Link
              href="https://docs.slesh.ai"
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#737373] hover:text-black dark:text-zinc-300 dark:hover:text-white"
            >
              Docs
            </Link>
            <Link
              href="/careers"
              className="text-[#737373] hover:text-black dark:text-zinc-300 dark:hover:text-white"
            >
              Careers
            </Link>
            <Link
              href={isLoggedIn ? "/account" : "/login"}
              className="text-[#737373] hover:text-black dark:text-zinc-300 dark:hover:text-white"
            >
              {isLoggedIn ? "Account" : "Sign In"}
            </Link>
          </nav>

          <div className="flex w-full items-center justify-between md:w-40">
            {/* Add to Chrome - visible on mobile + desktop center logic */}
            <Link
              href="https://chromewebstore.google.com/detail/slesh-ask-search-automate/ikfopgggdcafagjeflhomdpolhdcfenp?utm_source=Homepage&utm_medium=homepage-cta&utm_campaign=web-conversion-funnel"
              prefetch={false}
              target="_blank"
              rel="noopener noreferrer"
              className="
      relative 
      flex items-center justify-center gap-2 
      overflow-hidden rounded-full bg-black px-4 py-2 text-sm text-white 
      transition-all duration-500 group
       md:w-auto
    "
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#0042d1] to-[#0064ff] transition-transform duration-500 ease-out group-hover:translate-x-0"></span>
              <span className="relative z-10 flex items-center gap-2">
                <Image
                  src="/chrome-icon.svg"
                  alt="Chrome"
                  width={16}
                  height={16}
                />
                Add to Chrome
              </span>
            </Link>

            {/* Hamburger - visible only on mobile */}
            <button
              aria-label="Toggle Menu"
              onClick={() => setOpen(!open)}
              className="ml-3 flex items-center justify-center rounded-md border border-[color:var(--color-primary)] px-3 py-2 text-sm text-[color:var(--color-primary)] md:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
              >
                {open ? (
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-black md:hidden">
            <div className="flex flex-col gap-3">
              <Link
                className="text-[#475467] transition hover:text-[color:var(--color-primary)]"
                href="/#features"
                onClick={() => setOpen(false)}
              >
                Features
              </Link>
              <Link
                className="text-[#475467] transition hover:text-[color:var(--color-primary)]"
                href="/pricing"
                onClick={() => setOpen(false)}
              >
                Pricing
              </Link>
              <Link
                className="text-[#475467] transition hover:text-[color:var(--color-primary)]"
                href="/blog"
                onClick={() => setOpen(false)}
              >
                Blog
              </Link>
              <Link
                className="text-[#475467] transition hover:text-[color:var(--color-primary)]"
                href="/students"
                onClick={() => setOpen(false)}
              >
                Students
              </Link>
              <Link
                href="https://docs.slesh.ai"
                prefetch={false}
                onClick={() => setOpen(false)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#475467] transition hover:text-[color:var(--color-primary)]"
              >
                Docs
              </Link>
              <Link
                className="text-[#475467] transition hover:text-[color:var(--color-primary)]"
                href="/careers"
                onClick={() => setOpen(false)}
              >
                Career
              </Link>
              <Link
                className="text-[#475467] transition hover:text-[color:var(--color-primary)]"
                href="/login"
                onClick={() => setOpen(false)}
              >
                Account
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
