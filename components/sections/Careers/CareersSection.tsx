"use client";

import React from "react";
import Link from "next/link";

const positions = [
  {
    title: "Digital Content Creator",
    location: "Remote • Part-time",
    description:
      "Develop creative campaigns and storytelling on Instagram, TikTok, and other social media platforms that highlight product updates, product use cases and the Slesh community.",
    link: "https://form.typeform.com/to/OUbtFUqL",
  },
  {
    title: "School Ambassador",
    location: "Remote • Part-time",
    description:
      "Like your experience with Slesh for your studies? Spread the word about Slesh to your friends and help us grow.",
    link: "https://docs.google.com/forms/d/e/1FAIpQLSdv5kOpwleJXAokIekcBIua68Bac1ibNLcHLj9U8YYlQIFc8Q/viewform",
  },
];

export default function CareersSection() {
  return (
    <section className="relative h-screen w-full  bg-gray-50 flex flex-col justify-start pt-12 px-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto text-center page-container">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
          Open Positions
        </h2>
        <p className="mt-4 text-gray-600 text-lg md:text-xl">
          Join the Slesh team for our mission of making personal assistants
          accessible to everyone.
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {positions.map((pos, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-2xl border border-gray-200 flex flex-col justify-between hover:bg-gray-50 transition-colors duration-300"
            >
              <div>
                <h3 className="text-2xl font-semibold text-gray-900">
                  {pos.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{pos.location}</p>
                <p className="mt-4 text-gray-700">{pos.description}</p>
              </div>
              <div className="mt-6 flex justify-start">
                <Link
                  href={pos.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-3 rounded-full font-medium"
                >
                  Apply Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
