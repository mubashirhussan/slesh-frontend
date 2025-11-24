"use client";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "What is Slesh?",
    a: "Slesh is an AI-powered sidebar copilot that lives in your browser. It lets you summarize content, automate website actions, search across tabs, and ask natural-language questions about any webpage — all without leaving the site you’re on.",
  },
  {
    q: "How Does Slesh work?",
    a: "Slesh adds a smart sidebar to your browser. You can ask questions, trigger actions (like clicks or searches), summarize articles or videos, and even compare content across tabs — all using plain language.",
  },
  {
    q: "Can I summarize YouTube videos with Slesh?",
    a: "Yes! Slesh can instantly summarize YouTube, Tiktok and other videos — including lectures, podcasts, tutorials, or explainers — directly from the video page. Just open the sidebar and ask for a summary.",
  },
  {
    q: "Does Slesh support automating web actions?",
    a: "Yes. Slesh lets you automate tasks like clicking buttons, filling out forms, navigating between pages, and filtering content — all through natural language commands.",
  },
  {
    q: "Can Slesh compare content across tabs?",
    a: "Yes. Slesh remembers what’s in each tab and can compare pages, summarize multiple sources, or reference earlier tabs when answering your questions.",
  },
  {
    q: "Does Slesh store or track my browsing data?",
    a: "No. Slesh only accesses your page content when you ask it to perform a task. It doesn’t track your browsing or access tabs in the background. We do not store your page content, we only use it to process the task you ask for.",
  },
  {
    q: "How is Slesh different from ChatGPT or other AI Browsing Assistants?",
    a: "Unlike ChatGPT, Slesh is deeply integrated into your browser and understands the live webpage context — no copy-pasting needed. Slesh is also able to navigate and take actions for you directly on the site.",
  },
  {
    q: "What browsers does Slesh support?",
    a: "Slesh currently supports Chrome, Edge, Brave, and Opera. Support for Firefox is on the roadmap.",
  },
  {
    q: "How do I get started with Slesh?",
    a: "Simply install the Chrome extension from the Chrome Web Store and pin it to your toolbar. Open any website, launch the sidebar, and start chatting.",
  },
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
    <section className="py-16 w-full bg-white">
  <div className="faq-banner banner my-8" id="faq"></div>

  <div className="max-w-[575px] mx-auto px-6">
    {faqs.map((f, idx) => (
      <div
        key={idx}
        ref={(el) => {
          faqRefs.current[idx] = el;
        }}
        className="border border-gray-200 my-2 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <button
          className="w-full flex justify-between items-center px-6 py-4 text-left font-semibold bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          onClick={() => toggle(idx)}
        >
          <span className="text-lg text-gray-800">{f.q}</span>
          <span className="text-2xl text-gray-500">
            {openIndex === idx ? "−" : "+"}
          </span>
        </button>

        {openIndex === idx && (
          <div className="px-6 py-4 bg-white text-gray-600 text-base leading-relaxed">
            {f.a}
          </div>
        )}
      </div>
    ))}
  </div>
</section>

  );
}
