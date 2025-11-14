"use client";

import { useEffect } from "react";

export default function Callback() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  }, []);

  return (
    <div className="callback-container">
      <div className="success-icon">✓</div>
      <h1>Authentication Complete!</h1>
      <p>You have successfully signed in to Slesh.</p>
      <div className="spinner"></div>
      <p className="redirect-text">Redirecting you back...</p>
    </div>
  );
}
