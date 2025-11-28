/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import HomeNavbar from "@/components/HomeNavbar";
import HomeFooter from "@/components/HomeFooter";
export const metadata: Metadata = {
  title: "Slesh – AI Browsing Assistant to Summarize, Automate, and Navigate",
  description:
    "Slesh is your AI web copilot and browsing assistant. Summarize PDFs, videos, and tabs, automate tasks, and interact with any site—all in one sidebar",
  openGraph: {
    title: "Slesh – AI Browsing Assistant to Summarize, Automate, and Navigate",
    description:
      "Slesh is your AI web copilot and browsing assistant. Summarize PDFs, videos, and tabs, automate tasks, and interact with any site—all in one sidebar",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/header.png",
        width: 1200,
        height: 630,
        alt: "Slesh - AI Web copilot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Slesh – AI Browsing Assistant to Summarize, Automate, and Navigate",
    description:
      "Slesh is your AI web copilot and browsing assistant. Summarize PDFs, videos, and tabs, automate tasks, and interact with any site—all in one sidebar",
    images: ["https://slesh.ai/header.png"],
  },
  icons: {
    icon: "/shortcut.png",
    shortcut: "/shortcut.png",
    apple: "/shortcut.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        
      

        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-BFM32S80XG"
        />
        <Script id="ga-setup" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){ dataLayer.push(arguments); }
            gtag('js', new Date());
            gtag('config', 'G-BFM32S80XG');
          `}
        </Script>

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
          rel="stylesheet"
        />

        {/* GSAP */}
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"
          integrity="sha384-d+vyQ0dYcymoP8ndq2hW7FGC50nqGdXUEgoOUGxbbkAJwZqL7h+jKN0GGgn9hFDS"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"
          integrity="sha384-poC0r6usQOX2Ayt/VGA+t81H6V3iN9L+Irz9iO8o+s0X20tLpzc9DOOtnKxhaQSE"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />

        {/* auth-utils.js (so window.authService exists) */}
        <Script src="/auth-utils.js" strategy="afterInteractive" />
      </head>
      <body className="bg-[#FBFCFF] overflow-x-hidden">
        <HomeNavbar />
        {children}
        <HomeFooter />
      </body>
    </html>
  );
}
