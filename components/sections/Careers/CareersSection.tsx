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
    <section className="careers-section">
      <div className="careers-wrapper">
        <h2 className="careers-section-heading">Open Positions</h2>
        <p className="careers-section-text">
          Join the Slesh team for our mission of making personal assistants
          accessible to everyone.
        </p>

        <div className="positions-grid">
          {positions.map((pos, idx) => (
            <div key={idx} className="position-card">
              <h3 className="position-title">{pos.title}</h3>
              <p className="position-location">{pos.location}</p>
              <p className="position-description">{pos.description}</p>
              <Link
                href={pos.link}
                target="_blank"
                rel="noopener noreferrer"
                className="position-link"
              >
                Apply Now
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
