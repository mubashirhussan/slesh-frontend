/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  checkExistingAuth,
  resetLoginState,
  signIn,
  updateLoginButtonsOrder,
} from "@/lib/auth";
import { useEffect, useState } from "react";
// import { signIn, checkExistingAuth, resetLoginState, updateLoginButtonsOrder } from '@/lib/auth';

const SUPABASE_URL = "https://app.slesh.ai";
const SLESH_ENDPOINT = "https://api.slesh.ai";
const REDIRECT_URL =
  typeof window !== "undefined"
    ? `${window.location.origin}/login/callback`
    : "";

export default function LoginClient() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    updateLoginButtonsOrder();
    checkExistingAuth({ setSuccess, setError });
  }, []);

  const handleSignIn = async (provider: "google" | "azure") => {
    setLoading(true);
    setError("");
    try {
      await signIn(provider, { setLoading, setSuccess, setError });
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="success-state">
        <div className="success-icon">✓</div>
        <p>Successfully signed in!</p>
        <p className="redirect-text">Redirecting to account...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <div className="error-icon">✕</div>
        <p>{error}</p>
        <button className="retry-btn" onClick={resetLoginState}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div id="loginButtons">
        <button
          className="login-btn google-btn"
          onClick={() => handleSignIn("google")}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z"
              fill="#4285F4"
            />
            <path
              d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z"
              fill="#34A853"
            />
            <path
              d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>
        <button
          className="login-btn microsoft-btn"
          onClick={() => handleSignIn("azure")}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M8.5 1.5H1.5V8.5H8.5V1.5Z" fill="#F25022" />
            <path d="M16.5 1.5H9.5V8.5H16.5V1.5Z" fill="#7FBA00" />
            <path d="M8.5 9.5H1.5V16.5H8.5V9.5Z" fill="#00A4EF" />
            <path d="M16.5 9.5H9.5V16.5H16.5V9.5Z" fill="#FFB900" />
          </svg>
          Sign in with Microsoft
        </button>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Signing you in...</p>
        </div>
      )}
    </>
  );
}
