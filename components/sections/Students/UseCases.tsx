/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

export default function UseCases() {
  useEffect(() => {
    // Use cases animations
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.fromTo(
        ".use-cases-header",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".use-cases-header",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        ".use-case-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".use-cases-grid",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  return (
    <section className="use-cases-section">
      <div className="use-cases-header">
        <h2>Built for how you study</h2>
        <p>
          Slesh is your sidebar assistant, always by your side as you switch
          between tabs, pages, and apps.
        </p>
      </div>

      <div className="use-cases-grid">
        <div className="use-case-card">
          <div className="use-case-icon">⚡</div>
          <h3>No Screenshots. No Copy-Paste.</h3>
          <p>
            Get AI help instantly on any page: your student portal, PDFs,
            slides, even lecture videos. Slesh can{" "}
            <strong>read the text and see the visuals</strong>.
          </p>
        </div>
        <div className="use-case-card">
          <div className="use-case-icon">✍️</div>
          <h3>Get instant writing help on any page</h3>
          <p>
            Whether you're{" "}
            <strong>
              brainstorming ideas, structuring an essay, or starting slides
            </strong>
            , Slesh helps you get unstuck and start making progress.
          </p>
        </div>

        <div className="use-case-card">
          <div className="use-case-icon">📄</div>
          <h3>Works with Docs, Sheets, and Slides</h3>
          <p>
            Connect Slesh to <strong>Google Docs, Sheets, and Slides</strong>{" "}
            to get instant AI help —{" "}
            <strong>
              edit, create, or brainstorm without leaving your workflow
            </strong>
            . <Link href="/blog" target="_blank">Learn more</Link>
          </p>
        </div>
        <div className="use-case-card">
          <div className="use-case-icon">🔍</div>
          <h3>Research Without the All-Nighters</h3>
          <p>
            Compare ten tabs at once. Slesh{" "}
            <strong>finds, summarizes, and highlights what matters</strong> so
            you don't get lost in 40 pages.
          </p>
        </div>

        <div className="use-case-card">
          <div className="use-case-icon">📚</div>
          <h3>Don't Watch the Same Lecture Twice</h3>
          <p>
            Any lecture video, any page — ask Slesh your questions and get{" "}
            <strong>instant answers</strong>. (Youtube, Zoom recordings, etc.)
          </p>
        </div>

        <div className="use-case-card">
          <div className="use-case-icon">🎯</div>
          <h3>Get sources and look up information fast anywhere</h3>
          <p>
            Slesh can help you{" "}
            <strong>get sources or look up information fast anywhere</strong>,
            getting you the source you need quickly.
          </p>
        </div>
      </div>
    </section>
  );
}
