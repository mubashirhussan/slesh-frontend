/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect } from "react";
import type { Metadata } from "next";

export default function Callback() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/login/";
    }, 2000);
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        margin: 0,
        padding: "40px 20px",
        background: "#FBFCFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        textAlign: "center",
      }}
    >
      <div
        className="callback-container"
        style={{
          maxWidth: "400px",
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 8px 32px rgba(154, 154, 165, 0.12)",
        }}
      >
        <div
          className="success-icon"
          style={{
            width: "60px",
            height: "60px",
            background: "#10b981",
            color: "white",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            fontWeight: "bold",
            margin: "0 auto 20px",
          }}
        >
          ✓
        </div>
        <h1
          style={{
            color: "#0f172a",
            margin: "0 0 16px 0",
            fontSize: "24px",
            fontWeight: 600,
          }}
        >
          Authentication Complete!
        </h1>
        <p
          style={{
            color: "#6b7280",
            margin: "0 0 24px 0",
            fontSize: "16px",
            lineHeight: 1.5,
          }}
        >
          You have successfully signed in to Slesh.
        </p>
        <div
          className="spinner"
          style={{
            width: "24px",
            height: "24px",
            border: "3px solid #f3f4f6",
            borderTop: "3px solid #3b82f6",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto 16px",
          }}
        ></div>
        <p
          className="redirect-text"
          style={{
            color: "#3b82f6",
            fontWeight: 500,
          }}
        >
          Redirecting you back...
        </p>
      </div>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
