"use client";
import { useEffect, useRef } from "react";

export default function EnterpriseSection() {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (contentRef.current) observer.observe(contentRef.current);
    if (buttonRef.current) observer.observe(buttonRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 bg-gray-50 w-full">
      <div className="max-w-5xl mx-auto px-6">
        <div
          ref={contentRef}
          className="text-center opacity-0  transition-all duration-700"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Enterprise Solutions
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            For businesses looking to customize how Slesh works on their website
            with full control, integrations, and behavioral tuning.
          </p>

          <div className="flex flex-col gap-4 mb-10 max-w-2xl mx-auto">
            {[
              "Define how Slesh behaves on specific pages of your site",
              "Suggest custom content or actions to your visitors",
              "See how users interact with Slesh through detailed analytics",
            ].map((text, index) => (
              <div key={index} className="flex items-start gap-3 text-left">
                <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-2 min-w-fit" />
                <span className="text-gray-700 text-base">{text}</span>
              </div>
            ))}
          </div>

          <button
            ref={buttonRef}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg opacity-0 scale-90 transition-all duration-500"
          >
            Contact Us
          </button>
        </div>
      </div>

      <style>{`
        .animate-in {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        button.animate-in {
          animation: scaleIn 0.5s ease-out 0.3s forwards;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(48px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
}
