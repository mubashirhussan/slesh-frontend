/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/page.tsx
"use client";

import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {

    // --- GSAP animations / interactions ----------------
    const gsap = (window as any).gsap;
    const ScrollTrigger = (window as any).ScrollTrigger;

    if (gsap && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      const button = document.querySelector<HTMLButtonElement>(".btn-animation");
      const icon = document.querySelector<HTMLElement>(".btn-animation-icon");

      function startAnimation() {
        if (!icon || !button) return;
        icon.style.animation = "spin360 1.8s linear forwards";
        icon.addEventListener(
          "animationend",
          () => {
            button.classList.add("black-bg");
          },
          { once: true }
        );
      }
      startAnimation();

      // Add to Chrome buttons
      document.querySelectorAll<HTMLButtonElement>(".add-to-chrome").forEach((btn) => {
        btn.addEventListener("click", () => {
          window.location.href =
            "https://chromewebstore.google.com/detail/slesh-ask-search-automate/ikfopgggdcafagjeflhomdpolhdcfenp?utm_source=Homepage&utm_medium=homepage-cta&utm_campaign=web-conversion-funnel";
        });
      });

      // Explore buttons
      document.querySelectorAll<HTMLButtonElement>(".explore-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          document
            .getElementById("features")
            ?.scrollIntoView({ behavior: "smooth" });
        });
      });

      // Messages image
      gsap.from(".messages-img", {
        scrollTrigger: {
          trigger: ".messages-img",
          start: "top 80%",
          toggleActions: "play none none none",
        },
        opacity: 0,
        y: 40,
        duration: 3,
        ease: "power3.out",
      });

      // Features banner
      gsap.fromTo(
        ".features-banner",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-banner",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // First feature
      gsap.fromTo(
        ".f-1-heading",
        { x: -100, opacity: 0 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".f-1-heading",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      gsap.fromTo(
        ".first-feature .feature-sub-heading",
        { y: 100, opacity: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".first-feature .feature-sub-heading",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      gsap.fromTo(
        ".first-feature .feature-text",
        { y: 100, opacity: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".first-feature .feature-text",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      gsap.fromTo(
        ".f1-video-wrapper",
        { x: 100, opacity: 0 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".f1-video-wrapper",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // Video info boxes rotations
      const firstVideoInfoBox = document.querySelector(".vib-1");
      const secondVideoInfoBox = document.querySelector(".vib-2");
      const thirdVideoInfoBox = document.querySelector(".vib-3");
      const fourthVideoInfoBox = document.querySelector(".vib-4");

      if (firstVideoInfoBox) {
        gsap.fromTo(
          firstVideoInfoBox,
          { rotation: -45 },
          {
            rotation: 0,
            ease: "none",
            scrollTrigger: {
              trigger: firstVideoInfoBox,
              start: "top bottom",
              end: "top 60%",
              scrub: true,
            },
          }
        );
      }
      if (secondVideoInfoBox) {
        gsap.fromTo(
          secondVideoInfoBox,
          { rotation: 45 },
          {
            rotation: 0,
            ease: "none",
            scrollTrigger: {
              trigger: secondVideoInfoBox,
              start: "top bottom",
              end: "top 60%",
              scrub: true,
            },
          }
        );
      }
      if (thirdVideoInfoBox) {
        gsap.fromTo(
          thirdVideoInfoBox,
          { rotation: -45 },
          {
            rotation: 0,
            ease: "none",
            scrollTrigger: {
              trigger: thirdVideoInfoBox,
              start: "top bottom",
              end: "top 60%",
              scrub: true,
            },
          }
        );
      }
      if (fourthVideoInfoBox) {
        gsap.fromTo(
          fourthVideoInfoBox,
          { rotation: 45 },
          {
            rotation: 0,
            ease: "none",
            scrollTrigger: {
              trigger: fourthVideoInfoBox,
              start: "top bottom",
              end: "top 60%",
              scrub: true,
            },
          }
        );
      }

      // Second feature
      gsap.fromTo(
        ".f-2-heading",
        { x: 100, opacity: 0 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".f-2-heading",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      gsap.fromTo(
        ".second-feature .feature-sub-heading",
        { y: 100, opacity: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".second-feature .feature-sub-heading",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      gsap.fromTo(
        ".second-feature .feature-text",
        { y: 100, opacity: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".second-feature .feature-text",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // Third feature
      gsap.fromTo(
        ".f-3-heading",
        { x: -100, opacity: 0 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".f-3-heading",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      gsap.fromTo(
        ".third-feature .feature-sub-heading",
        { y: 100, opacity: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".third-feature .feature-sub-heading",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      gsap.fromTo(
        ".third-feature .feature-text",
        { y: 100, opacity: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".third-feature .feature-text",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      gsap.fromTo(
        ".f3-video-wrapper",
        { x: -100, opacity: 0 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".f3-video-wrapper",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      gsap.fromTo(
        ".connected-apps-grid .app-item",
        { y: 50, opacity: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: ".connected-apps-grid",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
      gsap.fromTo(
        ".third-feature-img",
        { y: 100, opacity: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".third-feature-img",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // Fourth feature
      gsap.fromTo(
        ".f-4-heading",
        { x: -100, opacity: 0 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".f-4-heading",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      gsap.fromTo(
        ".fourth-feature .feature-sub-heading",
        { y: 100, opacity: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".fourth-feature .feature-sub-heading",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      gsap.fromTo(
        ".fourth-feature .feature-text",
        { y: 100, opacity: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".fourth-feature .feature-text",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      gsap.fromTo(
        ".f4-video-wrapper",
        { x: 100, opacity: 0 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".f4-video-wrapper",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // Fifth feature
      gsap.fromTo(
        ".fifth-feature .f-1-heading",
        { x: -100, opacity: 0 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".fifth-feature .f-1-heading",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      gsap.fromTo(
        ".fifth-feature .feature-sub-heading",
        { y: 100, opacity: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".fifth-feature .feature-sub-heading",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      gsap.fromTo(
        ".fifth-feature .feature-text",
        { y: 100, opacity: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".fifth-feature .feature-text",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      gsap.fromTo(
        ".f5-video-wrapper",
        { x: 100, opacity: 0 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".f5-video-wrapper",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // Data section
      gsap.fromTo(
        ".ds-text .feature-sub-heading",
        { x: 100, opacity: 0 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ds-text .feature-sub-heading",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
      gsap.fromTo(
        ".ds-text .feature-text",
        { x: -100, opacity: 0 },
        {
          opacity: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".ds-text .feature-text",
            start: "top 70%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // FAQ banner
      gsap.fromTo(
        ".faq-banner",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".faq-banner",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      document.querySelectorAll(".accordion").forEach((header) => {
        gsap.fromTo(
          header,
          { y: 100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: header,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    }


    // --- Video intersection observer ----------------
    const videos = document.querySelectorAll<HTMLVideoElement>(".custom-video");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        });
      },
      { threshold: 0.5 }
    );
    videos.forEach((video) => observer.observe(video));

    // --- FAQ accordion toggle ----------------
    const headers = document.querySelectorAll<HTMLButtonElement>(
      ".accordion-header"
    );
    headers.forEach((header) => {
      header.addEventListener("click", () => {
        const content = header.nextElementSibling as HTMLElement | null;
        const icon = header.querySelector<HTMLImageElement>(".accordion-icon");
        if (!content || !icon) return;

        header.classList.toggle("open");
        content.classList.toggle("open");

        icon.style.opacity = "0";

        setTimeout(() => {
          icon.src = header.classList.contains("open")
            ? "/accordion-open.svg"
            : "/accordion-closed.svg";
          icon.style.opacity = "1";
        }, 150);
      });
    });

    // cleanup
    return () => {
      observer.disconnect();
      headers.forEach((header) => header.replaceWith(header.cloneNode(true)));
    };
  }, []);

  // ---------- JSX (same structure & classes as your HTML) ----------
  return (
    <>
      <section className="hero">
        <div className="hero-container">
          <div className="messages-img"></div>

          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-heading-inner">Browse. Ask. Done.</h1>
              <br />
            </div>
            <div className="hero-btns">
              <button className="btn explore-btn hero-btn">
                <p>
                  Explore <span className="spectral-font">Slesh</span>
                </p>
              </button>
              <button className="add-to-chrome btn hero-btn btn-animation hover-animation">
                <img
                  src="/chrome-icon.svg"
                  alt=""
                  className="btn-animation-icon"
                />
                <p>
                  Add to <span className="spectral-font">Chrome</span>
                </p>
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="features-banner banner" id="features"></div>

      {/* Feature sections – markup unchanged, just JSX */}
      <section className="feature-section first-feature">
        <div className="features-wrapper">
          <div className="feature-heading f-1-heading">
            <img src="/feature-1-back.svg" alt="" className="feature-back" />
            <p className="feature-title">Slesh Follows You Across Tabs</p>
          </div>
          <h2 className="feature-sub-heading">Ask Slesh anything</h2>
          <p className="feature-text">
            Ask Slesh questions about any page—including
            <span className="feature-span"> PDFs & videos</span> and get instant
            answers with <span className="feature-span">live page understanding.</span>
            <br />
            <span className="feature-span">Talk to multiple tabs simultaneously</span>,
            so you can make informed decisions without losing track of details.
          </p>

          <div className="video-container">
            <div className="video-wrapper f1-video-wrapper">
              <video className="custom-video" muted playsInline preload="none">
                <source
                  src="/videos/Compare Tabs.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <div className="video-btns-container">
                <div className="video-btn">
                  <div className="video-btn-left">
                    <img src="/yt-icon.svg" alt="" />
                    <p>Youtube</p>
                  </div>
                  <div className="video-btn-right">
                    <img src="/pin-icon.svg" alt="" />
                    <img src="/close-icon.svg" alt="" />
                  </div>
                </div>

                <div className="video-btn">
                  <div className="video-btn-left">
                    <img src="/wiki-icon.svg" alt="" />
                    <p>Wikipedia</p>
                  </div>
                  <div className="video-btn-right">
                    <img src="/pin-icon.svg" alt="" />
                    <img src="/close-icon.svg" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-section second-feature">
        <div className="features-wrapper">
          <div className="feature-heading f-2-heading">
            <img src="/feature-2-back.svg" alt="" className="feature-back" />
            <p className="feature-title">Slesh Takes You There</p>
          </div>
          <h2 className="feature-sub-heading">Stop searching. Start doing.</h2>
          <p className="feature-text">
            From hidden buttons to buried settings,
            <span className="feature-span">
              {" "}
              Slesh finds what you need and gets you there fast.
            </span>
            Simply tell Slesh what you are looking for or would like to do and
            Slesh gets you there automatically.
          </p>

          <div className="video-container">
            <div className="video-wrapper f2-video-wrapper">
              <video className="custom-video" muted playsInline preload="none">
                <source
                  src="/videos/Slesh Gets You Theere.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              <div className="video-information">
                <div className="video-info-box vib-1">
                  <img src="/x-icon.svg" alt="" className="vib-icon" />
                  <p className="vib-text">Update my account information</p>
                </div>
                <div className="video-info-box vib-2">
                  <img src="/ebay-icon.svg" alt="" className="vib-icon" />
                  <p className="vib-text">Check daily deals</p>
                </div>
                <div className="video-info-box vib-3">
                  <img
                    src="/github-icon.svg"
                    alt=""
                    className="vib-icon"
                  />
                  <p className="vib-text">See pull requests that mentioned me</p>
                </div>
                <div className="video-info-box vib-4">
                  <img
                    src="/gmail-icon.svg"
                    alt=""
                    className="vib-icon"
                  />
                  <p className="vib-text">Find unread emails from yesterday</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-section third-feature">
        <div className="features-wrapper">
          <div className="feature-heading f-3-heading">
            <img src="/feature-3-back.png" alt="" className="feature-back" />
            <p className="feature-title">Access to your apps</p>
          </div>
          <h2 className="feature-sub-heading">
            Connect your favorite tools seamlessly
          </h2>
          <p className="feature-text">
            Slesh integrates with your most-used applications and services.
            <span className="feature-span">
              {" "}
              Access Gmail, Calendar, Edit your Google Drive Files and more
            </span>{" "}
            directly from your browser sidebar.
            <span className="feature-span">No more switching between apps</span>
            —everything you need is right where you are.
          </p>

          <div className="video-container">
            <div className="video-wrapper f3-video-wrapper">
              <video className="custom-video" muted playsInline preload="none">
                <source
                  src="/videos/Connected Apps.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-section fourth-feature">
        <div className="features-wrapper">
          <div className="feature-heading f-4-heading">
            <img src="/feature-3-back.png" alt="" className="feature-back" />
            <p className="feature-title">Slesh Understands Context</p>
          </div>
          <h2 className="feature-sub-heading">
            Highlight anything. Get instant help
          </h2>
          <p className="feature-text">
            Need a second opinion or more context?
            <span className="feature-span">Highlight it and ask Slesh</span> to
            <span className="feature-span">explain, rephrase</span>, or find more
            info on other sites.
            <br />
            <span className="feature-span">No more copying and Googling</span>—it’s
            all in one chat.
          </p>

          <div className="video-container">
            <div className="video-wrapper f4-video-wrapper">
              <video className="custom-video" muted playsInline preload="none">
                <source
                  src="/videos/Slesh Understands Context.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
        <img
          src="./third-feature-img.svg"
          alt=""
          className="third-feature-img"
        />
      </section>

      <section className="feature-section fifth-feature">
        <div className="features-wrapper">
          <div className="feature-heading f-1-heading">
            <img src="/feature-1-back.svg" alt="" className="feature-back" />
            <p className="feature-title">Slesh Does It For You</p>
          </div>
          <h2 className="feature-sub-heading">
            Skip the busywork. Let Slesh handle it.
          </h2>
          <p className="feature-text">
            From forms to follow-ups,
            <span className="feature-span">
              {" "}
              automate entire web workflows.
            </span>
            Skip the clicks—just say what you need, and it gets done.
          </p>
          <div className="video-container">
            <div className="video-wrapper f5-video-wrapper">
              <video className="custom-video" muted playsInline preload="none">
                <source
                  src="/videos/Slesh Does It For You.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>

              <div className="feature-4-item">
                <img src="/feature-4-icon.svg" alt="" />
                <p>Starting an automation...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="data-section">
        <div className="ds-bg-image"></div>

        <div className="ds-content">
          <div className="ds-text">
            <h2 className="feature-sub-heading">Your data stays yours.</h2>
            <p className="feature-text">
              You have full control over your account, including access and
              deletion.
              <span className="feature-span">
                Every feature that uses your data is optional and can be turned off
                at any time.
              </span>
              <br />
              <br />
              Slesh always asks before doing anything on your behalf, giving you
              full visibility and control every step of the way.
            </p>
          </div>
        </div>
      </section>

      <div className="faq-banner banner" id="FAQ"></div>

      <section className="faq-section">
        <div className="accordions">
          {/* FAQ accordions – same markup */}
          {[
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
              a: "No. Slesh only accesses your page content when you ask it to perform a task. It doesn’t track your browsing or access tabs in the background.We do not store your page content, we only use it to process the task you ask for.",
            },
            {
              q: "How is Slesh different from ChatGPT or other AI Browsing Assistants ?",
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
          ].map((item) => (
            <div className="accordion" key={item.q}>
              <div className="accordion-item">
                <button className="accordion-header">
                  <span className="accordion-title">{item.q}</span>
                  <img
                    className="accordion-icon"
                    src="/accordion-closed.svg"
                    alt="Toggle Icon"
                  />
                </button>
                <div className="accordion-content">
                  <p>{item.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
