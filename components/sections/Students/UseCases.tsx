"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cases = [
  { icon: "⚡", title: "No Screenshots. No Copy-Paste.", desc: "Get AI help instantly..." },
  { icon: "✍️", title: "Get instant writing help on any page", desc: "Whether you're brainstorming..." },
  { icon: "📄", title: "Works with Docs, Sheets, and Slides", desc: "Connect Slesh to Google Docs..." },
  { icon: "🔍", title: "Research Without the All-Nighters", desc: "Compare ten tabs at once..." },
  { icon: "📚", title: "Don't Watch the Same Lecture Twice", desc: "Any lecture video, any page..." },
  { icon: "🎯", title: "Get sources and look up information fast anywhere", desc: "Slesh can help you get sources..." },
];

export default function UseCases() {
  useEffect(() => {
    gsap.fromTo(
      ".use-case-card",
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ".use-cases-grid", start: "top 80%" },
      }
    );
  }, []);

  return (
    <section className="py-16 max-w-6xl mx-auto px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-semibold text-black mb-3">Built for how you study</h2>
        <p className="text-gray-500 max-w-lg mx-auto">
          Slesh is your sidebar assistant, always by your side as you switch between tabs, pages, and apps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 use-cases-grid">
        {cases.map((c, idx) => (
          <div key={idx} className="use-case-card p-6 bg-gray-100/30 rounded-xl backdrop-blur-sm hover:-translate-y-1 hover:shadow-lg transition-all">
            <div className="text-xl mb-4">{c.icon}</div>
            <h3 className="font-semibold text-lg mb-2">{c.title}</h3>
            <p className="text-gray-600">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
