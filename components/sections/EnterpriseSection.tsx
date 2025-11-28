"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function EnterpriseSection() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".enterprise-section",
            start: "top 70%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  return (
    <section className="enterprise-section">
      <div className="enterprise-container">
        <div className="enterprise-content" ref={contentRef}>
          <div className="enterprise-text">
            <h2 className="enterprise-title">Enterprise</h2>
            <p className="enterprise-description">
              For businesses looking to customize how Slesh works on their
              website with full control, integrations, and behavioral tuning.
            </p>

            <div className="enterprise-features">
              <div className="enterprise-feature-item">
                <div className="feature-bullet"></div>
                <span>Define how Slesh behaves on specific pages of your site</span>
              </div>
              <div className="enterprise-feature-item">
                <div className="feature-bullet"></div>
                <span>Suggest custom content or actions to your visitors</span>
              </div>
              <div className="enterprise-feature-item">
                <div className="feature-bullet"></div>
                <span>
                  See how users interact with Slesh through detailed analytics
                </span>
              </div>
            </div>

            <button
              className="enterprise-button"
              onClick={() => {
                window.location.href =
                  "mailto:team@slesh.ai?subject=Enterprise Plan Inquiry";
              }}
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
