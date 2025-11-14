/* eslint-disable @typescript-eslint/no-explicit-any */
// components/LoginClient.tsx
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

  useEffect(() => {
    updateLoginButtonsOrder();
    checkExistingAuth({ setSuccess, setError });
  }, []);

  const handleSignIn = async (provider: "google" | "azure") => {
    const setLoading =
      provider === "google" ? setLoadingGoogle : setLoadingAzure;
    setLoading(true);
    setError(null);

    try {
      await signIn(provider, { setSuccess, setError });
    } catch {
      // Error already set by signIn
    } finally {
      setLoading(false); // Critical: Reset loading even if popup closed
    }
  };

  // Success State
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-600 dark:text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Signed In!
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            Redirecting to your account...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Sign In Failed
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={resetLoginState}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-xl transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Main Login UI
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-lg rounded-3xl shadow-2xl p-10 max-w-md w-full border border-white/20 dark:border-gray-700">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Sign in to continue to your Slesh account
          </p>
        </div>

        <div className="space-y-4">
          {/* Google Button */}
          <button
            onClick={() => handleSignIn("google")}
            disabled={loadingGoogle || loadingAzure}
            className="group relative w-full flex items-center justify-center gap-4 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-600 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 18 18" fill="none">
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
            <span>Continue with Google</span>
            {loadingGoogle && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-t-transparent border-blue-600 rounded-full animate-spin" />
            )}
          </button>

          {/* Microsoft Button */}
          <button
            onClick={() => handleSignIn("azure")}
            disabled={loadingGoogle || loadingAzure}
            className="group relative w-full flex items-center justify-center gap-4 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-4 px-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 dark:border-gray-600 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 18 18" fill="none">
              <path d="M8.5 1.5H1.5V8.5H8.5V1.5Z" fill="#F25022" />
              <path d="M16.5 1.5H9.5V8.5H16.5V1.5Z" fill="#7FBA00" />
              <path d="M8.5 9.5H1.5V16.5H8.5V9.5Z" fill="#00A4EF" />
              <path d="M16.5 9.5H9.5V16.5H16.5V9.5Z" fill="#FFB900" />
            </svg>
            <span>Continue with Microsoft</span>
            {loadingAzure && (
              <div className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-t-transparent border-blue-600 rounded-full animate-spin" />
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            By signing in, you agree to our{" "}
            <a
              href="/terms"
              className="underline hover:text-blue-600 dark:hover:text-blue-400"
            >
              Terms
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="underline hover:text-blue-600 dark:hover:text-blue-400"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <div className="login-footer my-4 text-center">
          <p>
            <Link
              href="/"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Back to Home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
