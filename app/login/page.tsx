import LoginClient from "@/components/sections/Login/LoginSection";
import React from "react";
import type { Metadata } from "next";
import "./login.css";

export const metadata: Metadata = {
  title: "Sign In - Slesh AI Browsing Assistant",
  description: "Sign in to Slesh - Your AI web copilot and browsing assistant",
  openGraph: {
    title: "Sign In - Slesh AI Browsing Assistant",
    description: "Sign in to Slesh - Your AI web copilot and browsing assistant",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/header.png",
        width: 1200,
        height: 630,
        alt: "Sign In - Slesh",
      },
    ],
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
