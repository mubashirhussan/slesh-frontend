"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  { q: "What is Slesh?", a: "Slesh is an AI-powered sidebar copilot that lives in your browser..." },
  { q: "How Does Slesh work?", a: "Slesh adds a smart sidebar to your browser..." },
  { q: "Can I summarize YouTube videos with Slesh?", a: "Yes! Slesh can instantly summarize YouTube, Tiktok and other videos..." },
  { q: "Does Slesh support automating web actions?", a: "Yes. Slesh lets you automate tasks like clicking buttons..." },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  useEffect(() => {
    faqRefs.current.forEach((el, idx) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          delay: idx * 0.2,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        }
      );
    });
  }, []);

  return (
    <section className="py-16 max-w-3xl mx-auto px-6">
      <h2 className="text-3xl font-semibold mb-8 text-center">FAQ</h2>
      <div className="flex flex-col gap-4">
        {faqs.map((f, idx) => (
          <div
            key={idx}
            ref={(el) => {faqRefs.current[idx] = el}}
            className="border rounded-lg overflow-hidden"
          >
            <button
              className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold bg-gray-50 hover:bg-gray-100 transition"
              onClick={() => toggle(idx)}
            >
              {f.q}
              <span>{openIndex === idx ? "−" : "+"}</span>
            </button>
            {openIndex === idx && (
              <div className="px-4 py-3 bg-white text-gray-700">{f.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
