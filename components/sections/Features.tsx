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

      // Sidebar animation for 2nd feature
      if (idx === 1) {
        const sidebar = section.querySelector(".feature-sidebar");
        if (sidebar) {
          const buttons = sidebar.querySelectorAll("button");
          gsap.from(buttons, {
            x: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
            },
          });
        }
      }
    });
  }, []);

  return (
    <section
      className="flex  flex-col gap-32 py-24  mx-auto px-20"
      id="features"
    >
      <h2 className="text-4xl font-bold text-center text-gray-900">Features</h2>
      {features.map((f, idx) => (
        <div
          key={idx}
          className={`feature-section flex flex-col gap-8 min-h-[80vh] ${
            idx === 0
              ? "w-full items-center"
              : idx % 2 === 1
              ? "w-full md:w-1/2 items-center"
              : "w-full md:w-1/2 md:ml-auto items-center"
          } ${idx === 1 ? "relative" : ""}`}
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

          {/* Right Sidebar Content for 2nd Feature - Outside Video Container */}
          {idx === 1 && (
            <div 
              className="absolute -translate-y-1/2 translate-x-4 md:translate-x-12 flex flex-col gap-3 z-10 feature-sidebar hidden md:flex"
              style={{
                right: 'calc(var(--spacing) * -50)',
                top: '65%'
              }}
            >
              <button className="group flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-full px-4 py-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-x-1 hover:scale-105">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Update my account information</span>
              </button>
              
              <button className="group flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-full px-4 py-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-x-1 hover:scale-105">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Check daily deals</span>
              </button>
              
              <button className="group flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-full px-4 py-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-x-1 hover:scale-105">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">See pull requests that mentioned me</span>
              </button>
              
              <button className="group flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-full px-4 py-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-x-1 hover:scale-105">
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Find unread emails from yesterday</span>
              </button>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
