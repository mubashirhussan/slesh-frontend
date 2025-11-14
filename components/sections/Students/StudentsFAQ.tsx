// "use client";

// import { useState, useRef, useLayoutEffect, useEffect } from "react";
// import { usePathname } from "next/navigation"; // <-- for route change detection
// import gsap from "gsap";

// export default function StudentsFAQ() {
//   const pathname = usePathname(); // 👈 detect when route changes
//   const [openIndex, setOpenIndex] = useState<number | null>(null);
//   const faqRefs = useRef<(HTMLDivElement | null)[]>([]);
//   const contentRefs = useRef<(HTMLDivElement | null)[]>([]);

// const faqs = [
//   { q: "Is Slesh free for students?", a: "Yes! Slesh offers a free Starter plan..." },
//   { q: "What is the difference with ChatGPT?", a: "Slesh is a browser extension that lives..." },
//   { q: "What file types can I upload?", a: "File upload is not available yet..." },
//   { q: "How does Slesh help with different subjects?", a: "Slesh works across all academic disciplines..." },
//   { q: "Is my academic data private?", a: "Absolutely. Slesh only accesses your content when you ask..." },
//   { q: "What browsers does Slesh support?", a: "Slesh currently supports Chrome, Edge, Brave, and Opera..." },
// ];

//   const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

//   // 👇 useLayoutEffect reruns when pathname changes
//   useLayoutEffect(() => {
//     const nodes = faqRefs.current.filter(Boolean) as HTMLDivElement[];
//     if (!nodes.length) return;

//     gsap.set(nodes, { y: 40, opacity: 0 });
//     const tl = gsap.timeline();
//     tl.to(nodes, {
//       y: 0,
//       opacity: 1,
//       duration: 0.6,
//       ease: "power3.out",
//       stagger: 0.15,
//     });

//     return () => {
//       tl.kill();
//       gsap.killTweensOf(nodes);
//     };
//   }, [pathname]); // ✅ rerun animation every time you visit this route

//   // Answer expand/collapse
//   useEffect(() => {
//     const els = contentRefs.current;
//     els.forEach((el, idx) => {
//       if (!el) return;
//       const isOpen = openIndex === idx;

//       if (isOpen) {
//         gsap.killTweensOf(el);
//         gsap.to(el, {
//           height: el.scrollHeight,
//           opacity: 1,
//           duration: 0.36,
//           ease: "power2.out",
//           onComplete: () => {
//             el.style.height = "auto";
//           },
//         });
//       } else {
//         const currentHeight =
//           el.style.height === "auto" ? el.scrollHeight : el.getBoundingClientRect().height;
//         gsap.set(el, { height: currentHeight });
//         gsap.to(el, {
//           height: 0,
//           opacity: 0,
//           duration: 0.3,
//           ease: "power2.inOut",
//         });
//       }
//     });
//   }, [openIndex]);
// useLayoutEffect(() => {
//   const nodes = faqRefs.current.filter(Boolean) as HTMLDivElement[];
//   gsap.set(nodes, { y: 40, opacity: 0 });

//   gsap.to(nodes, {
//     scrollTrigger: {
//       trigger: ".faq-section", // add this class to section
//       start: "top 80%",
//     },
//     y: 0,
//     opacity: 1,
//     duration: 0.6,
//     stagger: 0.15,
//     ease: "power3.out",
//   });}, []);
//   return (
//     <section className="py-16 max-w-3xl mx-auto px-6">
//       <div className="text-center mb-12">
//         <h2 className="text-3xl md:text-4xl font-semibold mb-3">FAQ</h2>
//         <p className="text-gray-500">
//           Everything you need to know about using Slesh for your studies
//         </p>
//       </div>

//       <div className="flex flex-col gap-4">
//         {faqs.map((f, idx) => (
//           <div
//             key={idx}
//             ref={(el) => {faqRefs.current[idx] = el}}
//             className="border rounded-lg overflow-hidden"
//           >
//             <button
//               onClick={() => toggle(idx)}
//               className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold bg-gray-50 hover:bg-gray-100 transition"
//             >
//               {f.q}
//               <span
//                 className="text-xl transition-transform duration-300"
//                 style={{
//                   transform: openIndex === idx ? "rotate(180deg)" : "rotate(0deg)",
//                 }}
//               >
//                 {openIndex === idx ? "−" : "+"}
//               </span>
//             </button>
//             <div
//               ref={(el) => {contentRefs.current[idx] = el}}
//               style={{ height: 0, opacity: 0, overflow: "hidden" }}
//               className="bg-white"
//             >
//               <div className="px-4 py-3 text-gray-700">{f.a}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }
"use client";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "Is Slesh free for students?",
    a: "Yes! Slesh offers a free Starter plan...",
  },
  {
    q: "What is the difference with ChatGPT?",
    a: "Slesh is a browser extension that lives...",
  },
  {
    q: "What file types can I upload?",
    a: "File upload is not available yet...",
  },
  {
    q: "How does Slesh help with different subjects?",
    a: "Slesh works across all academic disciplines...",
  },
  {
    q: "Is my academic data private?",
    a: "Absolutely. Slesh only accesses your content when you ask...",
  },
  {
    q: "What browsers does Slesh support?",
    a: "Slesh currently supports Chrome, Edge, Brave, and Opera...",
  },
];

export default function StudentsFAQ() {
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
        {faqs.map((f, idx) => (
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
