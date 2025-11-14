import AccountClient from "@/components/sections/Account/AccountClient";
import React from "react";

export default function Account() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <AccountClient />
      </div>
    </div>
  );
}
