/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
 import { loadStripe, Stripe } from "@stripe/stripe-js";
import { authService, SLESH_ENDPOINT } from "@/lib/constant";

// let stripe: Stripe | null = null;
let stripePromise: Promise<Stripe | null>;
export default function PricingPlans() {
  const [subscription, setSubscription] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Stripe initialization
 function initializeStripe() {
  if (!stripePromise) {
    const stripeKey = "pk_live_51RqKd29UpKTHYnyr2sbrOnSaV5teiR3h3eGYrg2J6VfVHEqYtxnJjdipPQ0D4Ui4IIeJw8NKHEKTq0aPO0ZDmKdH00ne0WBWTr";
    stripePromise = loadStripe(stripeKey);
  }
  return stripePromise;
}

  // Auth helpers
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
      localStorage.getItem("authToken") ||
      localStorage.getItem("supabase_access_token") ||
      getCookie("authToken") ||
      getCookie("supabase_access_token");
    return !!token;
  }

  function signOut() {
    if (typeof window === "undefined") return;

    localStorage.removeItem("authToken");
    localStorage.removeItem("supabase_access_token");
    localStorage.removeItem("supabase_refresh_token");
    localStorage.removeItem("intendedPlan");
    localStorage.removeItem("intendedAction");
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("email");

    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "supabase_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    window.location.href = "/";
  }

  // Subscription caching
  const subscriptionCache = {
    data: null as string | null,
    timestamp: 0,
    ttl: 5 * 60 * 1000, // 5 minutes
  };

  async function getSubscriptionStatus(forceRefresh = false) {
    if (!isAuthenticated() || typeof window === "undefined") return null;

    const now = Date.now();
    if (
      !forceRefresh &&
      subscriptionCache.data &&
      now - subscriptionCache.timestamp < subscriptionCache.ttl
    ) {
      return subscriptionCache.data;
    }

    try {
      const response = await fetch(
        `${SLESH_ENDPOINT}/stripe/dashboard/get-user-subscription`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${
              getCookie("authToken") || localStorage.getItem("authToken")
            }`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch subscription");

      const data = await response.json();
      const subscriptionPlan = data.subscription_plan || "starter";
      subscriptionCache.data = subscriptionPlan;
      subscriptionCache.timestamp = now;

      return subscriptionPlan;
    } catch (error) {
      console.error("Error fetching subscription status:", error);
      return null;
    }
  }

// async function createCheckoutSession(sessionId: string) {
//   if (!stripePromise) initializeStripe(); // Ensure it's assigned

//   const stripe = await stripePromise;
//   if (!stripe) throw new Error("Stripe failed to initialize");

//   const result = await stripe.redirectToCheckout({ sessionId });
//   if (result.error) throw new Error(result.error.message);
// }


  async function openManageSubscription() {
    if (!isAuthenticated()) {
      alert("Please sign in to manage your subscription");
      return;
    }

    try {
      const response = await fetch(
        `${SLESH_ENDPOINT}/stripe/dashboard/create-portal-session`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${
              getCookie("authToken") || localStorage.getItem("authToken")
            }`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Unable to open subscription management");

      const data = await response.json();
      const portalWindow = window.open(data.url, "_blank");

      if (portalWindow) {
        const checkClosed = setInterval(() => {
          if (portalWindow.closed) {
            clearInterval(checkClosed);
            handleSubscriptionChange();
          }
        }, 1000);
      }
    } catch (error) {
      console.error("Error opening subscription portal:", error);
      alert("Error opening subscription management. Please try again.");
    }
  }

  async function handleUpgradeClick(planType: string) {
    if (!isAuthenticated()) {
      localStorage.setItem("intendedPlan", planType);
      localStorage.setItem("intendedAction", "upgrade");
      window.location.href = "/login/";
    } else {
      // await createCheckoutSession(planType);
    }
  }

  async function updateSubscriptionDisplay(forceRefresh = false) {
    const plan = await getSubscriptionStatus(forceRefresh);
    setSubscription(plan);
    return plan;
  }

  async function checkPostLoginUpgrade() {
    const intendedPlan = localStorage.getItem("intendedPlan");
    const intendedAction = localStorage.getItem("intendedAction");

    if (intendedPlan && intendedAction === "upgrade" && isAuthenticated()) {
      localStorage.removeItem("intendedPlan");
      localStorage.removeItem("intendedAction");

      const currentSubscription = await getSubscriptionStatus();
      if (currentSubscription === "starter" || !currentSubscription) {
        // await createCheckoutSession(intendedPlan);
      }
    }
  }

  function handleSubscriptionChange() {
    updateSubscriptionDisplay(true);
  }

  // Initialization
  useEffect(() => {
    (async () => {
      await initializeStripe();
      await updateSubscriptionDisplay();
      await checkPostLoginUpgrade();
      setLoading(false);
    })();
  }, []);

  return (
    <main className="pricing-wrapper">
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading pricing information...</div>
          <div className="loading-subtext">
            Please wait while we fetch your subscription details
          </div>
        </div>
      ) : (
        <div id="mainContent">
          <div className="pricing-header">
            <h1 className="pricing-title">Choose Your Plan</h1>
            <p className="pricing-subtitle">
              Start free and scale as you grow. Every plan includes our core
              features with different usage limits.
            </p>
          </div>

          <div className="pricing-grid">
            {/* Starter Plan */}
            <div className="pricing-card" data-plan="starter">
              <h2 className="plan-name">Starter</h2>
              <div className="plan-price">$0</div>
              <div className="plan-price-period">per month</div>
              <p className="plan-description">
                Get started with essential features to explore what Slesh can do.
              </p>
              <ul className="plan-features">
                <li>Access to the standard model</li>
                <li>Limited usage (~30 messages/month)</li>
                <li>View and analyze up to 5 PDFs, 10 videos, and 25 web pages</li>
                <li>Run up to 10 automation flows</li>
              </ul>
              <button
                className="plan-button secondary"
                onClick={() =>
                  window.open(
                    "https://chromewebstore.google.com/detail/slesh-ask-search-automate/ikfopgggdcafagjeflhomdpolhdcfenp?utm_source=Homepage&utm_medium=homepage-cta&utm_campaign=web-conversion-funnel",
                    "_blank"
                  )
                }
              >
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="pricing-card featured" data-badge-text="Most Popular">
              <h2 className="plan-name">Pro</h2>
              <div className="plan-price">$15</div>
              <div className="plan-price-period">per month</div>
              <p className="plan-description">
                Unlock a more powerful Slesh with extended capabilities.
              </p>
              <ul className="plan-features">
                <li>
                  Access to multiple premium models (Claude Sonnet 4, GPT-5,
                  Gemini 2.5 Pro, etc.)
                </li>
                <li>10x more messages than starter</li>
                <li>
                  20× more PDFs, Videos, Web pages than starter
                  <span
                    style={{
                      fontSize: "0.85em",
                      color: "rgba(154, 154, 165, 0.8)",
                      display: "block",
                      marginTop: 4,
                    }}
                  >
                    100 PDFs, 100 videos, 500 pages
                  </span>
                </li>
                <li>Run up to 10x more automation flows</li>
                <li>Priority execution and faster responses</li>
              </ul>
              {subscription === "pro" ? (
                <button
                  className="plan-button manage-subscription-btn"
                  onClick={openManageSubscription}
                >
                  Manage Subscription
                </button>
              ) : (
                <button
                  className="plan-button"
                  onClick={() => handleUpgradeClick("pro")}
                >
                  Choose Pro
                </button>
              )}
            </div>

            {/* Unlimited Plan */}
            <div className="pricing-card" data-plan="unlimited">
              <h2 className="plan-name">Unlimited</h2>
              <div className="plan-price">$39</div>
              <div className="plan-price-period">per month</div>
              <p className="plan-description">
                Unlock the full potential of Slesh with no limits.
              </p>
              <ul className="plan-features">
                <li>Everything in Pro</li>
                <li>Unlimited chats</li>
                <li>Unlimited PDFs, Videos, Web pages</li>
                <li>Unlimited automation flows</li>
                <li>Early access to new features</li>
              </ul>
              <div
                style={{
                  fontSize: "0.85em",
                  color: "rgba(154, 154, 165, 0.8)",
                  textAlign: "center",
                  marginBottom: 16,
                }}
              >
                *Fair use applies. See{" "}
                <a
                  href="/terms/"
                  target="_blank"
                  style={{
                    color: "rgba(154, 154, 165, 0.8)",
                    textDecoration: "underline",
                  }}
                >
                  Terms
                </a>
                .
              </div>
              {subscription === "unlimited" ? (
                <button
                  className="plan-button manage-subscription-btn"
                  onClick={openManageSubscription}
                >
                  Manage Subscription
                </button>
              ) : (
                <button
                  className="plan-button"
                  onClick={() => handleUpgradeClick("unlimited")}
                >
                  Choose Unlimited
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
