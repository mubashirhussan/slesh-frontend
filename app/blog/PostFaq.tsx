/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function FAQSection(faqs: any) {
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
    <section className="py-16 max-w-4xl mx-auto px-6 bg-white">
      <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">
        Frequently Asked Questions
      </h2>
      <div className="flex flex-col gap-4">
        {faqs.faqs.faq.map((f: any, idx: any) => (
          <div
            key={idx}
            ref={(el) => {
              faqRefs.current[idx] = el;
            }}
            className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <button
              className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => toggle(idx)}
            >
              <span className="text-lg text-gray-800">{f.question}</span>
              <span className="text-2xl text-gray-500">
                {openIndex === idx ? "−" : "+"}
              </span>
            </button>
            {openIndex === idx && (
              <div className="px-6 py-4 bg-white text-gray-600 text-base leading-relaxed">
                {f.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
