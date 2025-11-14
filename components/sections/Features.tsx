/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Slesh Follows You Across Tabs",
    subtitle: "Ask Slesh anything",
    description:
      "Ask Slesh questions about any page—including PDFs & Videos and get instant answers with live page understanding. Talk to multiple tabs simultaneously so you can make informed decisions without losing track of details.",
    video: "/videos/Compare Tabs.mp4",
    bgImage: "/feature-1-back.svg",
    color: "#0052FF",
  },
  {
    title: "Slesh Takes You There",
    subtitle: "Stop searching. Start doing.",
    description:
      "From hidden buttons to buried settings, Slesh finds what you need and gets you there fast. Simply tell Slesh what you are looking for or would like to do and Slesh gets you there automatically.",
    video: "/videos/Slesh Gets You Theere.mp4",
    bgImage: "/feature-2-back.svg",
    color: "#C929FF",
  },
  {
    title: "Access to your apps",
    subtitle: "Connect your favorite tools seamlessly",
    description:
      "Slesh integrates with your most-used applications and services. Access Gmail, Calendar, Edit your Google Drive Files and more directly from your browser sidebar. No more switching between apps—everything you need is right where you are.",
    video: "/videos/Connected Apps.mp4",
    bgImage: "/feature-3-back.png",
    color: "#FE9D2C",
  },
  {
    title: "Slesh Understands Context",
    subtitle: "Highlight anything. Get instant help",
    description:
      "Need a second opinion or more context? Highlight it and ask Slesh to explain, rephrase, or find more info on other sites. No more copying and Googling—it’s all in one chat.",
    video: "/videos/Slesh Understands Context.mp4",
    bgImage: "/feature-4-back.svg",
    color: "#34E268",
  },
  {
    title: "Slesh Does It For You",
    subtitle: "Skip the busywork. Let Slesh handle it.",
    description:
      "From forms to follow-ups, automate entire web workflows. Skip the clicks—just say what you need, and it gets done.",
    video: "/videos/Slesh Does It For You.mp4",
    bgImage: "/feature-1-back.svg",
    color: "#0052FF",
  },
];

export default function FeaturesSection() {
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Animate each feature section
    gsap.utils.toArray(".feature-section").forEach((section: any, idx) => {
      // Text container animation
      gsap.from(section.querySelectorAll("h3, h2, p"), {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });

      // Background image parallax
      const bgImage = section.querySelector("img, .next-image");
      if (bgImage) {
        gsap.fromTo(
          bgImage,
          { y: -30, opacity: 0.5 },
          {
            y: 0,
            opacity: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              scrub: true, // smooth parallax effect
            },
          }
        );
      }

      // Video fade-in
      const video = section.querySelector("video");
      if (video) {
        gsap.from(video, {
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
          },
        });
      }
    });
  }, []);

  return (
    <section
      className="flex  flex-col gap-32 py-24  mx-auto px-20"
      id="features"
    >
      {features.map((f, idx) => (
        <div
          key={idx}
          className={`feature-section flex flex-col gap-8 min-h-[80vh] ${
            idx === 0
              ? "w-full items-center"
              : idx % 2 === 1
              ? "w-full md:w-1/2 items-center"
              : "w-full md:w-1/2 md:ml-auto items-center"
          }`}
        >
          {/* Text Content */}
          <div
            className={`flex-1 flex flex-col justify-center text-center max-w-3xl space-y-4 ${
              idx === 0 ? "w-full" : "w-full md:w-full"
            }`}
          >
            <h3 className="relative inline-block text-md font-semibold uppercase tracking-wide">
              {/* Decorative background image */}
              <Image
                src={f.bgImage}
                alt=""
                width={200}
                height={160}
                className="absolute left-1/2 -translate-x-1/2 -translate-y-[30%] opacity-60 pointer-events-none z-0"
              />

              {/* Text with background that fits content */}
              <span
                className="relative z-10 inline-block px-3 py-1 rounded-md"
                style={{
                  color: f.color,
                  backgroundColor: f.color + "33", // light background based on text color
                }}
              >
                {f.title}
              </span>
            </h3>

            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              {f.subtitle}
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              {f.description}
            </p>
          </div>

          {/* Video Content */}
          <div
            className={`flex-1 w-full max-w-5xl rounded-2xl overflow-hidden shadow-lg ${
              idx === 0 ? "w-full" : "w-full md:w-full"
            }`}
          >
            {videoError ? (
              <div className="flex h-full items-center justify-center bg-gray-100 text-gray-500 text-center">
                Video coming soon. Please install the extension to see it in
                action.
              </div>
            ) : (
              <video
                className="w-full h-full object-cover rounded-2xl"
                muted
                playsInline
                preload="none"
                autoPlay
                loop
                onError={() => setVideoError(true)}
              >
                <source src={f.video} type="video/mp4" />
              </video>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
