import CareersSection from "@/components/sections/Careers/CareersSection";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers at Slesh – Join Our Team",
  description:
    "Join the Slesh team and help build the future of AI-powered browsing. Explore open positions and career opportunities.",
  openGraph: {
    title: "Careers at Slesh – Join Our Team",
    description:
      "Join the Slesh team and help build the future of AI-powered browsing. Explore open positions and career opportunities.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/header.png",
        width: 1200,
        height: 630,
        alt: "Careers at Slesh",
      },
    ],
  },
};

export default function Career() {
  return <CareersSection />;
}
