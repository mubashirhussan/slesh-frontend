"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      className="relative w-full h-[600px] p-[14px] rounded-[40px] overflow-hidden bg-red-200"
      style={{ height: "500px" }}
    >
      {/* Forced height with !important, red background for visibility */}
      <div
        className="w-full h-full p-8 rounded-[40px]  flex flex-col bg-blue-200"
        style={{
          borderRadius: "40px",
          width: "100%",
          height: "100%",
          backgroundImage: `
            url('/footer-logo.svg'),
            url('/footer-bg.png')
          `,
          backgroundSize: "110px auto, cover",
          backgroundPosition: "center calc(50% + 35px), center center",
          backgroundRepeat: "no-repeat, no-repeat",
        }}
      >
        {/* Content container */}
        <div className="flex flex-col  md:flex-row  justify-between gap-8 h-full">
          {/* Left: Copyright */}
          <div className="text-white text-sm md:md">
            © {new Date().getFullYear()} Slesh by Interphase Labs, Inc.
          </div>

          {/* Center: Links */}
          <div className="flex flex-wrap justify-center gap-8 text-white font-medium text-md md:text-md">
            <Link
              href="https://x.com/getslesh"
              target="_blank"
              className="hover:text-blue-600 transition-colors"
            >
              X
            </Link>
            <Link
              href="https://discord.gg/7JG597AfWd"
              target="_blank"
              className="hover:text-blue-600 transition-colors"
            >
              Discord
            </Link>
            <Link
              href="/slsh"
              className="hover:text-blue-600 transition-colors"
            >
              SLSH
            </Link>
            <Link
              href="https://docs.slesh.ai/"
              target="_blank"
              className="hover:text-blue-600 transition-colors"
            >
              Docs
            </Link>
            <Link
              href="/terms"
              target="_blank"
              className="hover:text-blue-600 transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href="/privacy"
              target="_blank"
              className="hover:text-blue-600 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>

          {/* Right: Button */}
          <div>
            <Link
              href="https://chromewebstore.google.com/detail/slesh-ask-search-automate/ikfopgggdcafagjeflhomdpolhdcfenp?utm_source=Homepage&utm_medium=homepage-cta&utm_campaign=web-conversion-funnel"
              target="_blank"
              rel="noopener noreferrer"
              className="relative p-8 hidden md:flex items-center gap-2 overflow-hidden rounded-full bg-white px-5 py-3 text-sm text-white transition-all duration-500 group"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#0042d1] to-[#0064ff] transition-transform duration-500 ease-out group-hover:translate-x-0"></span>
              <span className="relative z-10 text-black flex items-center gap-2">
                <Image
                  src="/chrome-icon.svg"
                  alt="Chrome"
                  width={18}
                  height={18}
                  className="object-contain"
                />
                Add to Chrome
              </span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
