"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Slesh Follows You Across Tabs",
    subtitle: "Ask Slesh anything",
    description:
      "Ask Slesh questions about any page—including PDFs & Videos and get instant answers with live page understanding. Talk to multiple tabs simultaneously so you can make informed decisions without losing track of details.",
    video: "/Videos/Optimized for web/Compare Tabs.mp4",
  },
  {
    title: "Slesh Takes You There",
    subtitle: "Stop searching. Start doing.",
    description:
      "From hidden buttons to buried settings, Slesh finds what you need and gets you there fast. Simply tell Slesh what you are looking for or would like to do and Slesh gets you there automatically.",
    video: "/Videos/Optimized for web/Slesh Gets You Theere.mp4",
  },
  {
    title: "Access to your apps",
    subtitle: "Connect your favorite tools seamlessly",
    description:
      "Slesh integrates with your most-used applications and services. Access Gmail, Calendar, Edit your Google Drive Files and more directly from your browser sidebar. No more switching between apps—everything you need is right where you are.",
    video: "/Videos/Optimized for web/Connected Apps.mp4",
  },
  {
    title: "Slesh Understands Context",
    subtitle: "Highlight anything. Get instant help",
    description:
      "Need a second opinion or more context? Highlight it and ask Slesh to explain, rephrase, or find more info on other sites. No more copying and Googling—it’s all in one chat.",
    video: "/Videos/Optimized for web/Slesh Understands Context.mp4",
  },
  {
    title: "Slesh Does It For You",
    subtitle: "Skip the busywork. Let Slesh handle it.",
    description:
      "From forms to follow-ups, automate entire web workflows. Skip the clicks—just say what you need, and it gets done.",
    video: "/Videos/Optimized for web/Slesh Does It For You.mp4",
  },
];

export default function FeaturesSection() {
  useEffect(() => {
    features.forEach((_, idx) => {
      gsap.from(`.feature-${idx}`, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: `.feature-${idx}`,
          start: "top 80%",
        },
      });
    });
  }, []);

  return (
    <section className="py-16 max-w-7xl mx-auto px-6 flex flex-col gap-16">
      {features.map((f, idx) => (
        <div
          key={idx}
          className={`feature-${idx} flex flex-col md:flex-row items-center gap-8`}
        >
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-500">{f.title}</h3>
            <h2 className="text-3xl font-bold mt-2">{f.subtitle}</h2>
            <p className="mt-4 text-gray-700">{f.description}</p>
          </div>
          <div className="flex-1">
            <video
              src={f.video}
              muted
              playsInline
              preload="none"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      ))}
    </section>
  );
}
