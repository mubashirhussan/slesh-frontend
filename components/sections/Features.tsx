/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "Slesh Follows You Across Tabs",
    subtitle: "Ask Slesh anything",
    description: (
      <>
        Ask Slesh questions about any page—including{" "}
        <span className="font-medium text-[16px] leading-[130%] tracking-[-0.02em] text-center text-[rgba(9,9,11,0.7)]">
          PDFs & Videos
        </span>{" "}
        and get instant answers with{" "}
        <span className="font-medium text-[16px] leading-[130%] tracking-[-0.02em] text-center text-[rgba(9,9,11,0.7)]">
          live page understanding.
        </span>
        <br />
        <span className="font-medium text-[16px] leading-[130%] tracking-[-0.02em] text-center text-[rgba(9,9,11,0.7)]">
          Talk to multiple tabs simultaneously
        </span>
        , so you can make informed decisions without losing track of details.
      </>
    ),
    video: "/videos/Compare Tabs.mp4",
    bgImage: "/feature-1-back.svg",
    color: "#0052ff",
    bg:"rgba(0,82,255,0.07)"
  },
  {
    title: "Slesh Takes You There",
    subtitle: "Stop searching. Start doing.",
    description: (
      <>
        From hidden buttons to buried settings,{" "}
        <span className="font-medium text-[16px] leading-[130%] tracking-[-0.02em] text-center text-[rgba(9,9,11,0.7)]">
          Slesh finds what you need and gets you there fast.
        </span>{" "}
        Simply tell Slesh what you are looking for or would like to do and{" "}
        <span className="font-medium text-[16px] leading-[130%] tracking-[-0.02em] text-center text-[rgba(9,9,11,0.7)]">
          Slesh gets you there automatically.
        </span>
      </>
    ),
    video: "/videos/Slesh Gets You Theere.mp4",
    bgImage: "/feature-2-back.svg",
    color: "#C929FF",
    bg:"rgba(191, 0, 255, 0.07)"
  },
  {
    title: "Access to your apps",
    subtitle: "Connect your favorite tools seamlessly",
    description: (
      <>
        Slesh integrates with your most-used applications and services. Access Gmail, Calendar, Edit your Google Drive Files and more directly from your browser sidebar.{" "}
        <span className="font-medium text-[16px] leading-[130%] tracking-[-0.02em] text-center text-[rgba(9,9,11,0.7)]">
          No more switching between apps—everything you need is right where you are.
        </span>
      </>
    ),
    video: "/videos/Connected Apps.mp4",
    bgImage: "/feature-3-back.png",
    color: "#FE9D2C",
    bg:"rgba(255, 136, 0, 0.07)"
  },
  {
    title: "Slesh Understands Context",
    subtitle: "Highlight anything. Get instant help",
    description: (
      <>
        Need a second opinion or more context?{" "}
        <span className="font-medium text-[16px] leading-[130%] tracking-[-0.02em] text-center text-[rgba(9,9,11,0.7)]">
          Highlight it and ask Slesh
        </span>{" "}
        to <span className="font-medium text-[16px] leading-[130%] tracking-[-0.02em] text-center text-[rgba(9,9,11,0.7)]">explain, rephrase</span>, or find more info on other sites.
        <br />
        <span className="font-medium text-[16px] leading-[130%] tracking-[-0.02em] text-center text-[rgba(9,9,11,0.7)]">
          No more copying and Googling
        </span>
        —it’s all in one chat.
      </>
    ),
    video: "/videos/Slesh Understands Context.mp4",
    bgImage: "/feature-4-back.svg",
    color: "#34E268",
    bg:"rgba(14, 221, 76, 0.07)"
  },
  {
    title: "Slesh Does It For You",
    subtitle: "Skip the busywork. Let Slesh handle it.",
    description: (
      <>
        From forms to follow-ups,{" "}
        <span className="font-medium text-[16px] leading-[130%] tracking-[-0.02em] text-center text-[rgba(9,9,11,0.7)]">
          automate entire web workflows.
        </span>{" "}
        Skip the clicks—just say what you need, and it gets done.
      </>
    ),
    video: "/videos/Slesh Does It For You.mp4",
    bgImage: "/feature-1-back.svg",
    color: "#0052FF",
    bg:"rgba(0, 82, 255, 0.07)"
  },
];


export default function FeaturesSection() {
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    // Animate each feature section
    gsap.utils.toArray(".feature-section").forEach((section: any, idx) => {
      // Text container animation
      gsap.from(section.querySelectorAll("h3, h2, p"), {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });

      // Background image parallax
      const bgImage = section.querySelector("img, .next-image");
      if (bgImage) {
        gsap.fromTo(
          bgImage,
          { y: -30, opacity: 0.5 },
          {
            y: 0,
            opacity: 0.6,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              scrub: true, // smooth parallax effect
            },
          }
        );
      }

      // Video fade-in
      const video = section.querySelector("video");
      if (video) {
        gsap.from(video, {
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
          },
        });
      }

      // Sidebar animation for 2nd feature
      if (idx === 1) {
        const sidebar = section.querySelector(".feature-sidebar");
        if (sidebar) {
          const buttons = sidebar.querySelectorAll("button");
          
          // Set initial state
          gsap.set(buttons, {
            x: 50,
            opacity: 0,
            rotation: 360,
          });

          // Create timeline for each button with stagger
          buttons.forEach((button: any, index: number) => {
            const tl = gsap.timeline({
              delay: index * 0.15, // Stagger delay
              scrollTrigger: {
                trigger: section,
                start: "top 75%",
              },
            });

            // First: Rotate from 360 to 0
            tl.to(button, {
              rotation: 0,
              duration: 0.6,
              ease: "power3.out",
            })
            // Then: Move to position and fade in
            .to(button, {
              x: 0,
              opacity: 1,
              duration: 0.4,
              ease: "power2.out",
            }, "-=0.2"); // Start slightly before rotation ends
          });
        }
      }
    });
  }, []);

  return (
    <section
    className=" py-24 mx-auto px-20"
    id="features"
    style={{ overflow: "visible" }}
    >
    <div className="features-banner banner my-8" id="features"></div>
    <div  className="flex flex-col gap-32">
  {features.map((f, idx) => (
        <div
          key={idx}
          className={`feature-section flex flex-col gap-8 min-h-[80vh] ${
            idx === 0
              ? "w-full items-center"
               : idx === features.length - 1
  ? "w-full md:w-1/2 mx-auto items-center"
              : idx % 2 === 1
              ? "w-full md:w-1/2 items-center"
              : "w-full md:w-1/2 md:ml-auto items-center"
          } ${idx === 1 ? "relative overflow-visible" : ""}`}
          style={idx === 1 ? { overflow: "visible", height: "auto" } : {}}
        >
          {/* Text Content */}
    <div className="flex-1 flex flex-col items-center justify-center text-center max-w-3xl space-y-4 w-full md:w-full">
  <h3 className="relative inline-block pr-4 py-4 px-3.5 rounded-[14px] z-10">
    {/* Decorative background image, smaller than title */}
    <Image
      src={f.bgImage}
      alt=""
      width={150} // smaller width than title
      height={80} // adjust height proportionally
    className="absolute left-1/2 -translate-x-1/2 -translate-y-[8.7753px] opacity-[2.567] pointer-events-none z-0"


    />

    {/* Text with background that fits content */}
    <span
      className="relative z-10 inline-block text-[16px] py-3 px-3.5 rounded-[14px] text-[#0052FF] shadow-[0px_4px_15.5px_0px_#0052FF0D,inset_0px_-1px_1px_0px_#0052FF1A] backdrop-blur-[37.1px]"
      style={{
        color: f.color,
        backgroundColor: f.bg,
      }}
    >
      {f.title}
    </span>
  </h3>

  <h2 className="font-medium text-[24px] leading-[100%] tracking-[-0.02em] text-center">
    {f.subtitle}
  </h2>

  <p className="font-normal text-[16px] leading-[130%] tracking-[-0.02em] text-center text-[#9A9AA5] w-[500px] mx-auto">
      {f.description}
    </p>
</div>




          {/* Video Content */}
          <div
            className={`relative  flex-1 w-full max-w-5xl rounded-2xl overflow-visible shadow-lg ${
              idx === 0 ? "w-full" : "w-full md:w-full"
            }`}
            style={idx === 1 ? { overflow: "visible" } : {}}
          >
            {videoError ? (
              <div className="flex h-full items-center justify-center bg-gray-100 text-gray-500 text-center">
                Video coming soon. Please install the extension to see it in
                action.
              </div>
            ) : (
              <video
                className="w-full h-full object-cover rounded-2xl"
                muted
                playsInline
                preload="none"
                autoPlay
                loop
                onError={() => setVideoError(true)}
              >
                <source src={f.video} type="video/mp4" />
              </video>
            )}
          {idx === features.length - 1 && (
  <div
    className="
      absolute bottom-4 left-1/2 
      flex items-center justify-center 
      gap-[9px]
      font-medium
      bg-[rgba(0,82,255,1)]
      px-[15.2px] py-[11.4px]
      rounded-[22.8px]
      -translate-x-1/2
       z-20
    "
     style={{ bottom: "calc(var(--spacing) * -6)" }}
  >
    <Image
      src="/feature-4-icon.svg"
      alt="Automation"
      width={22}
      height={22}
         className="animate-spin-slow"
style={{
    animation: "spin 3s linear infinite",
    transformOrigin: "center"
  }}
    />
    <p className="text-white text-sm">Starting an automation...</p>
  </div>
)}


          </div>
 
          {/* Right Sidebar Content for 2nd Feature - Outside Video Container */}
          {idx === 1 && (
            <div
              className="absolute flex flex-col gap-3 feature-sidebar hidden  lg:flex"
              style={{
                right: "-210px",
                top: "65%",
                transform: "translateY(-50%)",
                zIndex: 50,
              }}
            >
              <button className="group flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-full px-4 py-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-x-1 hover:scale-105">
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Update my account information
                </span>
              </button>

              <button className="group flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-full px-4 py-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-x-1 hover:scale-105">
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Check daily deals
                </span>
              </button>

              <button className="group flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-full px-4 py-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-x-1 hover:scale-105">
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  See pull requests that mentioned me
                </span>
              </button>

              <button className="group flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-full px-4 py-3 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-x-1 hover:scale-105">
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  Find unread emails from yesterday
                </span>
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
      {/* <h2 className="text-4xl font-bold text-center text-gray-900">Features</h2> */}
    
    </section>
  );
}
