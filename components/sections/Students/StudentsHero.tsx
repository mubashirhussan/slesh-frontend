"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function StudentsHero() {
  const [videoError, setVideoError] = useState(false);
  useEffect(() => {
    gsap.fromTo(
      ".hero-title",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
    gsap.fromTo(
      ".hero-desc",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.2, ease: "power3.out" }
    );
    gsap.fromTo(
      ".hero-cta",
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.4, ease: "power3.out" }
    );
    gsap.fromTo(
      ".hero-video",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, delay: 0.6, ease: "power3.out" }
    );
  }, []);

  return (
    <section className="w-full bg-linear-to-br from-blue-100/10 to-purple-100/10">
      <div className="page-container">
        <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-3xl  p-8 md:p-16">
          <div className="z-10 text-center">
            <h1 className="mb-5 text-center text-3xl font-medium text-black sm:text-4xl md:text-5xl lg:text-6xl">
              Slesh for Students
            </h1>
            <p className="mx-auto mb-6 max-w-xl text-center text-gray-500">
              Studying is hard enough. Switching tabs, copy-pasting or screenshots should not add to it.
            </p>

            <div className="hero-video my-8 h-[200px] w-full max-w-3xl overflow-hidden rounded-xl border border-gray-200 bg-gray-100 md:h-[360px]">
              {videoError ? (
                <div className="flex h-full w-full items-center justify-center bg-white text-center text-sm text-[#475467]">
                  Video coming soon. Please install the extension to see it in action.
                </div>
              ) : (
                <video
                  className="h-full w-full object-cover"
                  muted
                  playsInline
                  preload="none"
                  autoPlay
                  loop
                  onError={() => setVideoError(true)}
                >
                  <source src="/videos/students.mp4" type="video/mp4" />
                </video>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="https://chromewebstore.google.com/detail/slesh-ask-search-automate/ikfopgggdcafagjeflhomdpolhdcfenp"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-2 overflow-hidden rounded-lg bg-black px-4 py-2 text-white"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#0052ff] to-[#0052ff] transition-transform duration-500 ease-out group-hover:translate-x-0"></span>
                <span className="relative z-10 flex items-center gap-2">
                  <Image src="/chrome-icon.svg" alt="Chrome" width={18} height={18} />
                  Add to Chrome
                </span>
              </Link>

              <Link
                href="https://docs.google.com/forms/d/e/1FAIpQLSdv5kOpwleJXAokIekcBIua68Bac1ibNLcHLj9U8YYlQIFc8Q/viewform"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center justify-center overflow-hidden rounded-lg border border-blue-600 bg-transparent px-4 py-2 text-blue-600"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-[#0052ff] to-[#0052ff] transition-transform duration-500 ease-out group-hover:translate-x-0"></span>
                <span className="relative z-10 hover:text-white">Apply to be an Ambassador</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
