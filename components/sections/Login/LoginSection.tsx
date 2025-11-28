/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  signIn,
  checkExistingAuth,
  updateLoginButtonsOrder,
  resetLoginState,
} from "@/lib/auth";
import Link from "next/link";

export default function LoginClient() {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingAzure, setLoadingAzure] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showButtons, setShowButtons] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    updateLoginButtonsOrder();
    checkExistingAuth({ setSuccess, setError });
  }, []);

  const handleSignIn = async (provider: "google" | "azure") => {
    const setLoading =
      provider === "google" ? setLoadingGoogle : setLoadingAzure;
    setLoading(true);
    setError(null);
    setShowButtons(false);
    setShowLoading(true);
    setShowSuccess(false);
    setShowError(false);

    try {
      await signIn(provider, { setSuccess, setError });
      if (success) {
        setShowLoading(false);
        setShowSuccess(true);
      }
    } catch (err: any) {
      setShowLoading(false);
      setShowError(true);
      setError(err?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setShowButtons(true);
    setShowLoading(false);
    setShowSuccess(false);
    setShowError(false);
    setError(null);
    resetLoginState();
  };

  // Success State
  if (success || showSuccess) {
    return (
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-form">
            <div id="successState" className="success-state">
              <div className="success-icon">✓</div>
              <p>Successfully signed in!</p>
              <p className="redirect-text">Redirecting to dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-wrapper">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your Slesh account to continue</p>
        </div>

        <div className="login-form">
          {showButtons && (
            <div id="loginButtons">
              <button
                className="login-btn google-btn"
                onClick={() => handleSignIn("google")}
                disabled={loadingGoogle || loadingAzure}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
                disabled={loadingGoogle || loadingAzure}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M8.5 1.5H1.5V8.5H8.5V1.5Z" fill="#F25022" />
                  <path d="M16.5 1.5H9.5V8.5H16.5V1.5Z" fill="#7FBA00" />
                  <path d="M8.5 9.5H1.5V16.5H8.5V9.5Z" fill="#00A4EF" />
                  <path d="M16.5 9.5H9.5V16.5H16.5V9.5Z" fill="#FFB900" />
                </svg>
                Sign in with Microsoft
              </button>
            </div>
          )}

          {showLoading && (
            <div id="loadingState" className="loading-state">
              <div className="spinner"></div>
              <p>Signing you in...</p>
            </div>
          )}

          {showSuccess && (
            <div id="successState" className="success-state">
              <div className="success-icon">✓</div>
              <p>Successfully signed in!</p>
              <p className="redirect-text">Redirecting to dashboard...</p>
            </div>
          )}

          {showError && (
            <div id="errorState" className="error-state">
              <div className="error-icon">✕</div>
              <p id="errorMessage">
                {error || "An error occurred during sign in"}
              </p>
              <button className="retry-btn" onClick={handleRetry}>
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="login-footer">
          <p>
            <Link href="/">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
