import AccountClient from "@/components/sections/Account/AccountClient";
import React from "react";
import type { Metadata } from "next";
import "../account/account.css";

export const metadata: Metadata = {
  title: "Slesh — Account",
  description: "Manage your Slesh account preferences and privacy settings",
};

export default function Account() {
  return <AccountClient />;
}
