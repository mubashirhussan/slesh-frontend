"use client";

import { useEffect } from "react";

export default function CallbackPage() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
        background: "#FBFCFF",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(154,154,165,0.12)",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "#10b981",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            margin: "0 auto 20px",
          }}
        >
          ✓
        </div>
        <h1>Authentication Complete!</h1>
        <p>You have successfully signed in to Slesh.</p>
        <p style={{ color: "#3b82f6", fontWeight: 500 }}>
          Redirecting you back...
        </p>
      </div>
    </div>
  );
}
