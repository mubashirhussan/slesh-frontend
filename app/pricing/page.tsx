import EnterpriseSection from "@/components/sections/EnterpriseSection";
import Pricing from "@/components/sections/Pricing";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slesh — Pricing",
  description: "Choose your plan. Start free and scale as you grow.",
  openGraph: {
    title: "Slesh — Pricing",
    description: "Choose your plan. Start free and scale as you grow.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/assets/header.png",
        width: 1200,
        height: 630,
        alt: "Slesh Pricing",
      },
    ],
  },
  icons: {
    icon: "/assets/shortcut.png",
    shortcut: "/assets/shortcut.png",
    apple: "/assets/shortcut.png",
  },
};

export default function PricingPage() {
  return (
    <>
      <Pricing />
      <EnterpriseSection />
    </>
  );
}
