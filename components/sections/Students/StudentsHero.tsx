/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function StudentsHero() {
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Add to Chrome button functionality
    const addToChromeButtons =
      document.querySelectorAll<HTMLButtonElement>(".add-to-chrome");
    addToChromeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        window.location.href =
          "https://chromewebstore.google.com/detail/slesh-ask-search-automate/ikfopgggdcafagjeflhomdpolhdcfenp?utm_source=Students&utm_medium=students-cta&utm_campaign=student-conversion";
      });
    });

    // GSAP animations
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.fromTo(
        ".students-hero-content h1",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".students-hero-content p",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.2,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".students-cta-container",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".students-video-container",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.5,
          ease: "power3.out",
        }
      );
    }

    return () => {
      addToChromeButtons.forEach((btn) => {
        btn.removeEventListener("click", () => {});
      });
    };
  }, []);

  return (
    <section className="students-hero">
      <div className="students-hero-container">
        <div className="students-hero-content">
          <h1>Slesh for Students</h1>
          <p>
            Studying is hard enough. Switching tabs, copy-pasting or screenshots
            shouldn&apos;t add to it.
          </p>
          <div className="students-video-container">
            {videoError ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  color: "#475467",
                }}
              >
                Your browser does not support the video tag.
              </div>
            ) : (
              <video
                className="students-video"
                muted
                playsInline
                preload="none"
                autoPlay
                loop
                onError={() => setVideoError(true)}
              >
                <source src="/videos/students.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          <div className="students-cta-container">
            <button className="add-to-chrome btn hero-btn btn-animation hover-animation">
              <img src="/chrome-icon.svg" alt="" />
              <p>
                Add to <span className="spectral-font">Chrome</span>
              </p>
            </button>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdv5kOpwleJXAokIekcBIua68Bac1ibNLcHLj9U8YYlQIFc8Q/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="ambassador-btn btn hero-btn btn-animation hover-animation"
            >
              <p>
                Apply to be an <span className="spectral-font">Ambassador</span>
              </p>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
