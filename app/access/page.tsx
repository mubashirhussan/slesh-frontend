import AccessClient from "@/components/sections/Access/AccessClient";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Slesh — Access",
  description: "Enter your access code to unlock the Chrome extension download",
};

export default function AccessPage() {
  return <AccessClient />;
}

