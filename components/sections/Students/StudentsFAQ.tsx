/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "Is Slesh free for students?",
    a: "Yes! Slesh offers a free Starter plan that's perfect for students. You get access to core features with generous usage limits. For heavy users, we also offer student-friendly Pro and Unlimited plans.",
  },
  {
    q: "What is the difference with ChatGPT?",
    a: "Slesh is a browser extension that lives right in your browser. It sees exactly what you see and helps you instantly, without copy-pasting or screenshots—always with the page you're on",
  },
  {
    q: "What file types can I upload?",
    a: "File upload is not available yet. However, Slesh just works on any page, your portal, PDFs, youtube videos, etc so you don't need to upload anything.",
  },
  {
    q: "How does Slesh help with different subjects?",
    a: "Slesh works across all academic disciplines - from STEM to humanities. It can analyze mathematical concepts, explain scientific theories, summarize historical events, help with language learning, and much more.",
  },
  {
    q: "Is my academic data private?",
    a: "Absolutely. Slesh only accesses your content when you ask it to perform a task. We don't store your academic materials or track your browsing. Your data stays private and secure.",
  },
  {
    q: "What browsers does Slesh support?",
    a: "Slesh currently supports Chrome, Edge, Brave, and Opera. Support for Firefox is on the roadmap.",
  },
];

export default function StudentsFAQ() {
  const accordionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // FAQ accordion functionality
    const headers = document.querySelectorAll<HTMLButtonElement>(".accordion-header");
    headers.forEach((header) => {
      header.addEventListener("click", () => {
        const content = header.nextElementSibling as HTMLElement;
        const icon = header.querySelector<HTMLImageElement>(".accordion-icon");

        header.classList.toggle("open");
        if (content) {
          content.classList.toggle("open");
        }

        if (icon) {
          icon.style.opacity = "0";

          setTimeout(() => {
            if (header.classList.contains("open")) {
              icon.src = "/accordion-open.svg";
            } else {
              icon.src = "/accordion-closed.svg";
            }
            icon.style.opacity = "1";
          }, 150);
        }
      });
    });

    // GSAP animations
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.fromTo(
        ".students-faq-header",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".students-faq-header",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".accordion",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".accordions",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    return () => {
      headers.forEach((header) => {
        header.removeEventListener("click", () => {});
      });
    };
  }, []);

  return (
    <section className="students-faq-section">
      <div className="students-faq-header">
        <h2>FAQ</h2>
        <p>Everything you need to know about using Slesh for your studies</p>
      </div>

      <div className="accordions">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            ref={(el) => {
              accordionRefs.current[idx] = el;
            }}
            className="accordion"
          >
            <div className="accordion-item">
              <button className="accordion-header">
                <span className="accordion-title">{faq.q}</span>
                <img
                  className="accordion-icon"
                  src="/accordion-closed.svg"
                  alt="Toggle Icon"
                />
              </button>
              <div className="accordion-content">
                <p>{faq.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
