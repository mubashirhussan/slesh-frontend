/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-before-interactive-script-outside-document */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import "./login.css";

const SUPABASE_URL = "https://app.slesh.ai";
const SLESH_ENDPOINT = "https://api.slesh.ai";
const LAST_USED_PROVIDER_KEY = "slesh_last_used_provider";

let currentAuthProvider: "google" | "azure" | null = null;
let authWindow: Window | null = null;

export default function LoginPage() {
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingAzure, setLoadingAzure] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showButtons, setShowButtons] = useState(true);
  const [showLoading, setShowLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [buttonOrder, setButtonOrder] = useState<"google" | "azure" | null>(
    null
  );
  const [successTitle, setSuccessTitle] = useState("Successfully signed in!");
  const [successSubtitle, setSuccessSubtitle] = useState(
    "Redirecting to dashboard..."
  );

  // Helper functions
  function getLastUsedProvider(): "google" | "azure" | null {
    if (typeof window === "undefined") return null;
    const val = localStorage.getItem(LAST_USED_PROVIDER_KEY);
    return val === "google" || val === "azure" ? val : null;
  }

  function setLastUsedProvider(provider: "google" | "azure") {
    if (typeof window === "undefined") return;
    localStorage.setItem(LAST_USED_PROVIDER_KEY, provider);
  }

  function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  }

  function isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    const token =
      localStorage.getItem("supabase_access_token") ||
      getCookie("supabase_access_token") ||
      localStorage.getItem("authToken");
    return !!token;
  }

  function clearStoredTokens() {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem("supabase_access_token");
      localStorage.removeItem("supabase_refresh_token");
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      localStorage.removeItem("user_id");
      localStorage.removeItem("email");
      sessionStorage.removeItem("justSignedOut");
    } catch (error) {
      console.error("Error clearing tokens:", error);
    }
  }

  async function getUserInfo(token: string) {
    try {
      const response = await fetch(`${SLESH_ENDPOINT}/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error(`Failed to get user information: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.user) {
        return data.user;
      } else {
        throw new Error(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Error getting user info:", error);
      throw error;
    }
  }

  async function storeToken(token: string) {
    try {
      localStorage.setItem("supabase_access_token", token);
      localStorage.setItem("authToken", token);
    } catch (error) {
      console.error("Error storing token:", error);
      throw error;
    }
  }

  async function storeRefreshToken(token: string) {
    try {
      localStorage.setItem("supabase_refresh_token", token);
    } catch (error) {
      console.error("Error storing refresh token:", error);
      throw error;
    }
  }

  async function checkExistingAuth() {
    try {
      const justSignedOut = sessionStorage.getItem("justSignedOut");
      if (justSignedOut) {
        sessionStorage.removeItem("justSignedOut");
        return;
      }

      const hasLocalToken = localStorage.getItem("supabase_access_token");
      const hasCookieToken = getCookie("supabase_access_token");
      const hasAuthToken = localStorage.getItem("authToken");

      if (!hasLocalToken && !hasCookieToken && !hasAuthToken) {
        return;
      }

      const token = hasLocalToken || hasCookieToken || hasAuthToken;
      if (token) {
        const userInfo = await getUserInfo(token);
        if (userInfo) {
          const intendedPlan = localStorage.getItem("intendedPlan");
          const intendedAction = localStorage.getItem("intendedAction");

          if (intendedPlan && intendedAction === "upgrade") {
            setSuccessTitle("Upgrade in progress...");
            setSuccessSubtitle("Redirecting to pricing...");
            setShowSuccess(true);
            setShowButtons(false);
            setShowLoading(false);
            setTimeout(() => {
              window.location.href = "/pricing/";
            }, 2000);
          } else {
            setSuccessTitle("Already signed in!");
            setSuccessSubtitle("Redirecting to account...");
            setShowSuccess(true);
            setShowButtons(false);
            setShowLoading(false);
            setTimeout(() => {
              window.location.href = "/account";
            }, 2000);
          }
          return;
        } else {
          clearStoredTokens();
        }
      }
    } catch (error) {
      console.error("Error in checkExistingAuth:", error);
      clearStoredTokens();
    }
  }

  async function signIn(provider: "google" | "azure") {
    try {
      currentAuthProvider = provider;
      setShowButtons(false);
      setShowLoading(true);
      setShowSuccess(false);
      setShowError(false);
      setError(null);

      const REDIRECT_URL = `${window.location.origin}/login/callback`;
      let authUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(
        REDIRECT_URL
      )}`;

      if (provider === "azure") {
        authUrl += "&scopes=email profile openid";
      }

      authWindow = window.open(
        authUrl,
        "slesh_auth",
        "width=500,height=600,scrollbars=yes,resizable=yes"
      );

      if (!authWindow) {
        throw new Error("Popup blocked. Please allow popups for this site.");
      }

      const checkAuthCompletion = setInterval(async () => {
        try {
          if (!authWindow || authWindow.closed) {
            clearInterval(checkAuthCompletion);
            setShowLoading(false);
            setShowButtons(true);
            return;
          }

          let currentUrl: string;
          try {
            if (!authWindow) return;
            currentUrl = authWindow.location.href;
          } catch (error) {
            // Cross-origin error - this is expected during OAuth flow
            return;
          }

          if (currentUrl.startsWith(REDIRECT_URL)) {
            clearInterval(checkAuthCompletion);
            if (authWindow) {
              authWindow.close();
            }

            const url = new URL(currentUrl);
            const hash = url.hash.substring(1);
            const params = new URLSearchParams(hash);

            let accessToken = params.get("access_token");
            let refreshToken = params.get("refresh_token");

            const searchParams = new URLSearchParams(url.search);
            const accessTokenFromSearch = searchParams.get("access_token");
            const refreshTokenFromSearch = searchParams.get("refresh_token");

            accessToken = accessToken || accessTokenFromSearch;
            refreshToken = refreshToken || refreshTokenFromSearch;

            if (!accessToken) {
              throw new Error("Access token not found in redirect URI");
            }

            await storeToken(accessToken);
            if (refreshToken) {
              await storeRefreshToken(refreshToken);
            }

            const tokenExpiry = Date.now() + 3600 * 1000;
            localStorage.setItem("token_expiry", tokenExpiry.toString());

            const user = await getUserInfo(accessToken);

            if (user) {
              // Store the provider that was successfully used for sign-in
              setLastUsedProvider(provider);

              const intendedPlan = localStorage.getItem("intendedPlan");
              const intendedAction = localStorage.getItem("intendedAction");

              if (intendedPlan && intendedAction === "upgrade") {
                setSuccessTitle("Successfully signed in!");
                setSuccessSubtitle("Redirecting to pricing for upgrade...");
                setShowSuccess(true);
                setShowLoading(false);
                setTimeout(() => {
                  window.location.href = "/pricing/";
                }, 2000);
              } else {
                setSuccessTitle("Successfully signed in!");
                setSuccessSubtitle("Redirecting to account...");
                setShowSuccess(true);
                setShowLoading(false);
                setTimeout(() => {
                  window.location.href = "/account";
                }, 2000);
              }
            } else {
              throw new Error("Failed to get user information");
            }
          }
        } catch (error: any) {
          console.error("Error in auth completion check:", error);
        }
      }, 100);

      setTimeout(() => {
        if (authWindow && !authWindow.closed) {
          authWindow.close();
          clearInterval(checkAuthCompletion);
          setShowLoading(false);
          setShowButtons(true);
          setShowError(true);
          setError("Authentication timed out. Please try again.");
        }
      }, 300000);
    } catch (error: any) {
      console.error("Sign in failed:", error);
      setShowLoading(false);
      setShowButtons(true);
      setShowError(true);
      setError(error.message || "Authentication failed. Please try again.");
    }
  }

  const handleSignIn = async (provider: "google" | "azure") => {
    const setLoading =
      provider === "google" ? setLoadingGoogle : setLoadingAzure;
    setLoading(true);
    await signIn(provider);
    setLoading(false);
  };

  const handleRetry = () => {
    setShowButtons(true);
    setShowLoading(false);
    setShowSuccess(false);
    setShowError(false);
    setError(null);
    clearStoredTokens();
  };

  // Initialize on mount
  useEffect(() => {
    // Get last used provider and set button order
    const lastUsed = getLastUsedProvider();
    if (lastUsed) {
      setButtonOrder(lastUsed);
    }

    // Check for existing auth
    const justSignedOut = sessionStorage.getItem("justSignedOut");
    if (justSignedOut) {
      sessionStorage.removeItem("justSignedOut");
      return;
    }

    setTimeout(() => {
      checkExistingAuth();
    }, 100);

    // Cleanup on unmount
    return () => {
      if (authWindow && !authWindow.closed) {
        authWindow.close();
      }
    };
  }, []);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible" &&
        authWindow &&
        authWindow.closed
      ) {
        const justSignedOut = sessionStorage.getItem("justSignedOut");
        if (justSignedOut) {
          return;
        }

        setTimeout(() => {
          checkExistingAuth();
        }, 1000);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Success State
  if (success || showSuccess) {
    return (
      <div className="login-wrapper">
        <div className="login-container">
          <div className="login-form">
            <div id="successState" className="success-state">
              <div className="success-icon">✓</div>
              <p>{successTitle}</p>
              <p className="redirect-text">{successSubtitle}</p>
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
              {buttonOrder === "azure" ? (
                <>
                  <button
                    className="login-btn microsoft-btn last-used-btn"
                    onClick={() => handleSignIn("azure")}
                    disabled={loadingGoogle || loadingAzure}
                  >
                    <div className="last-used-indicator">
                      <span className="last-used-text">Last used</span>
                    </div>
                    <div className="button-content">
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
                    </div>
                  </button>

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
                </>
              ) : (
                <>
                  <button
                    className={`login-btn google-btn ${
                      buttonOrder === "google" ? "last-used-btn" : ""
                    }`}
                    onClick={() => handleSignIn("google")}
                    disabled={loadingGoogle || loadingAzure}
                  >
                    {buttonOrder === "google" && (
                      <div className="last-used-indicator">
                        <span className="last-used-text">Last used</span>
                      </div>
                    )}
                    {buttonOrder === "google" ? (
                      <div className="button-content">
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
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}
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
                </>
              )}
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
              <p>{successTitle}</p>
              <p className="redirect-text">{successSubtitle}</p>
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
