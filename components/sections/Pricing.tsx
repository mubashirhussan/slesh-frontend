/* eslint-disable @next/next/no-before-interactive-script-outside-document */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
import { authService, SLESH_ENDPOINT } from "@/lib/constant";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import Script from "next/script";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    Stripe: any;
    authService: any;
    slesh_endpoint: string;
  }
}

let stripe: any = null;

export default function PricingPlans() {
  const [loading, setLoading] = useState(true);
  const [stripeLoaded, setStripeLoaded] = useState(false);

  const pricingGridRef = useRef<HTMLDivElement>(null);
  const pricingHeaderRef = useRef<HTMLDivElement>(null);

  // Subscription caching
  const subscriptionCacheRef = useRef<{
    data: string | null;
    timestamp: number;
    ttl: number;
  }>({
    data: null,
    timestamp: 0,
    ttl: 5 * 60 * 1000, // 5 minutes
  });

  // Initialize Stripe from CDN (exact same as HTML)
  function initializeStripe() {
    if (typeof window === "undefined" || !window.Stripe) {
      console.error("Stripe not loaded");
      return;
    }

    try {
      const stripeKey =
        "pk_live_51RqKd29UpKTHYnyr2sbrOnSaV5teiR3h3eGYrg2J6VfVHEqYtxnJjdipPQ0D4Ui4IIeJw8NKHEKTq0aPO0ZDmKdH00ne0WBWTr";
      stripe = window.Stripe(stripeKey);
    } catch (error) {
      console.error("Failed to initialize Stripe:", error);
    }
  }

  // Auth helpers (exact same as HTML)
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

  function handleUpgradeClick(planType: string) {
    if (!isAuthenticated()) {
      localStorage.setItem("intendedPlan", planType);
      localStorage.setItem("intendedAction", "upgrade");
      window.location.href = "/login/";
    } else {
      createCheckoutSession(planType);
    }
  }

  async function createCheckoutSession(planType: string) {
    try {
      const button = document.getElementById(`${planType}-plan-btn`);
      const originalText = button?.textContent || "";
      if (button) {
        button.textContent = "Loading...";
        (button as HTMLButtonElement).disabled = true;
      }

      const response = await window.authService.makeAuthenticatedRequest(
        `${window.slesh_endpoint}/stripe/dashboard/create-checkout-session`,
        {
          method: "POST",
          body: JSON.stringify({
            plan: planType,
            success_url:
              window.location.origin + "/pricing?success=true&plan=" + planType,
            cancel_url: window.location.origin + "/pricing?canceled=true",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const session = await response.json();
      console.log("API Response:", session);

      if (!session || !session.id) {
        console.error("Invalid session response:", session);
        throw new Error("Invalid checkout session response from server");
      }

      // Ensure Stripe is initialized before using redirectToCheckout
      if (!stripe) {
        if (window.Stripe) {
          initializeStripe();
        } else {
          throw new Error("Stripe not loaded. Please refresh the page.");
        }
      }

      // Wait for Stripe to be initialized (max 3 seconds)
      let attempts = 0;
      while (!stripe && attempts < 30) {
        if (window.Stripe && !stripe) {
          initializeStripe();
        }
        if (stripe) break;
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }

      if (!stripe) {
        throw new Error("Stripe failed to initialize. Please refresh the page.");
      }

      // Use redirectToCheckout exactly as in HTML (it works with CDN Stripe.js)
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (error: any) {
      console.error("Error creating checkout session:", error);
      const button = document.getElementById(`${planType}-plan-btn`);
      if (button) {
        button.textContent =
          planType === "pro" ? "Choose Pro" : "Choose Unlimited";
        (button as HTMLButtonElement).disabled = false;
      }
      alert(
        error.message || "Failed to create checkout session. Please try again."
      );
    }
  }

  async function getSubscriptionStatus(
    forceRefresh = false
  ): Promise<string | null> {
    if (!isAuthenticated() || typeof window === "undefined") return null;

    const now = Date.now();
    if (
      !forceRefresh &&
      subscriptionCacheRef.current.data &&
      now - subscriptionCacheRef.current.timestamp <
        subscriptionCacheRef.current.ttl
    ) {
      return subscriptionCacheRef.current.data;
    }

    try {
      const response = await fetch(
        `${window.slesh_endpoint}/stripe/dashboard/get-user-subscription`,
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

      if (response.ok) {
        const data = await response.json();
        const subscriptionPlan = data.subscription_plan || "starter";
        subscriptionCacheRef.current.data = subscriptionPlan;
        subscriptionCacheRef.current.timestamp = now;
        return subscriptionPlan;
      }
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    }
    return null;
  }

  function resetBadgeToDefault() {
    const proPlanCard = document.querySelector(
      '.pricing-card[data-plan="pro"]'
    );
    const unlimitedPlanCard = document.querySelector(
      '.pricing-card[data-plan="unlimited"]'
    );

    if (proPlanCard) {
      proPlanCard.setAttribute("data-badge-text", "Most Popular");
      proPlanCard.classList.remove("current-plan", "no-badge");
    }

    if (unlimitedPlanCard) {
      unlimitedPlanCard.classList.remove("current-plan");
    }

    const proManageBtn = document.getElementById("pro-manage-btn");
    const unlimitedManageBtn = document.getElementById("unlimited-manage-btn");

    if (proManageBtn) {
      proManageBtn.style.display = "none";
    }
    if (unlimitedManageBtn) {
      unlimitedManageBtn.style.display = "none";
    }

    const proPlanBtn = document.getElementById("pro-plan-btn");
    const unlimitedPlanBtn = document.getElementById("unlimited-plan-btn");

    if (proPlanBtn) {
      proPlanBtn.style.display = "block";
      proPlanBtn.textContent = "Choose Pro";
    }
    if (unlimitedPlanBtn) {
      unlimitedPlanBtn.style.display = "block";
      unlimitedPlanBtn.textContent = "Choose Unlimited";
    }
  }

  async function updateSubscriptionDisplay(forceRefresh = false) {
    if (!isAuthenticated()) {
      resetBadgeToDefault();
      return;
    }

    const subscriptionPlan = await getSubscriptionStatus(forceRefresh);
    if (!subscriptionPlan || subscriptionPlan === "starter") {
      resetBadgeToDefault();
      return;
    }

    const proPlanCard = document.querySelector(
      '.pricing-card[data-plan="pro"]'
    );
    const unlimitedPlanCard = document.querySelector(
      '.pricing-card[data-plan="unlimited"]'
    );

    if (proPlanCard) {
      proPlanCard.classList.remove("current-plan");
    }
    if (unlimitedPlanCard) {
      unlimitedPlanCard.classList.remove("current-plan");
    }

    if (subscriptionPlan === "pro") {
      if (proPlanCard) {
        proPlanCard.setAttribute("data-badge-text", "Current Plan");
        proPlanCard.classList.add("current-plan");
      }

      const currentPlanBtn = document.getElementById(
        `${subscriptionPlan}-plan-btn`
      );
      if (currentPlanBtn) {
        currentPlanBtn.style.display = "none";
      }

      const manageSubscriptionBtn = document.getElementById("pro-manage-btn");
      if (manageSubscriptionBtn) {
        manageSubscriptionBtn.style.display = "block";
      }

      const unlimitedPlanBtn = document.getElementById("unlimited-plan-btn");
      if (unlimitedPlanBtn) {
        unlimitedPlanBtn.textContent = "Upgrade to Unlimited";
        unlimitedPlanBtn.removeAttribute("onclick");
        const newUnlimitedBtn = unlimitedPlanBtn.cloneNode(
          true
        ) as HTMLButtonElement;
        unlimitedPlanBtn.parentNode?.replaceChild(
          newUnlimitedBtn,
          unlimitedPlanBtn
        );
        newUnlimitedBtn.addEventListener("click", openManageSubscription);
      }
    } else if (subscriptionPlan === "unlimited") {
      if (proPlanCard) {
        proPlanCard.classList.add("no-badge");
      }

      if (unlimitedPlanCard) {
        unlimitedPlanCard.classList.add("current-plan");
      }

      const currentPlanBtn = document.getElementById(
        `${subscriptionPlan}-plan-btn`
      );
      if (currentPlanBtn) {
        currentPlanBtn.style.display = "none";
      }

      const manageSubscriptionBtn = document.getElementById(
        "unlimited-manage-btn"
      );
      if (manageSubscriptionBtn) {
        manageSubscriptionBtn.style.display = "block";
      }

      const proPlanBtn = document.getElementById("pro-plan-btn");
      if (proPlanBtn) {
        proPlanBtn.textContent = "Change to Pro";
        proPlanBtn.onclick = () => openManageSubscription();
      }
    }
  }

  async function openManageSubscription() {
    if (!isAuthenticated()) {
      alert("Please sign in to manage your subscription");
      return;
    }

    try {
      const response = await fetch(
        `${window.slesh_endpoint}/stripe/dashboard/create-portal-session`,
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

      if (response.ok) {
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
      } else {
        alert("Unable to open subscription management. Please try again.");
      }
    } catch (error) {
      console.error("Error opening subscription portal:", error);
      alert("Error opening subscription management. Please try again.");
    }
  }

  function handleSubscriptionChange() {
    setTimeout(() => {
      updateSubscriptionDisplay(true);
    }, 1000);
  }

  async function initializePage() {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      await updateSubscriptionDisplay();
      setLoading(false);
    } catch (error) {
      console.error("Error initializing page:", error);
      setLoading(false);
    }
  }

  async function checkPostLoginUpgrade() {
    const intendedPlan = localStorage.getItem("intendedPlan");
    const intendedAction = localStorage.getItem("intendedAction");

    if (intendedPlan && intendedAction === "upgrade" && isAuthenticated()) {
      localStorage.removeItem("intendedPlan");
      localStorage.removeItem("intendedAction");

      if (!isAuthenticated()) {
        console.log("User is no longer authenticated, skipping upgrade check");
        return;
      }

      const currentSubscription = await getSubscriptionStatus();

      if (
        currentSubscription === "pro" ||
        currentSubscription === "unlimited"
      ) {
        return;
      } else if (currentSubscription === "starter" || !currentSubscription) {
        const planName = intendedPlan === "pro" ? "Pro" : "Unlimited";
        const button = document.getElementById(`${intendedPlan}-plan-btn`);
        const originalText = button?.textContent || "";

        if (button) {
          button.textContent = `Proceeding to ${planName}...`;
          (button as HTMLButtonElement).style.background =
            "linear-gradient(135deg, #10b981 0%, #059669 100%)";
        }

        setTimeout(() => {
          createCheckoutSession(intendedPlan);
        }, 1500);
      }
    }
  }

  // GSAP Animations (exact same as HTML)
  useEffect(() => {
    if (typeof window === "undefined" || loading) return;

    if (pricingGridRef.current && pricingHeaderRef.current) {
      gsap.fromTo(
        ".pricing-card",
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: pricingGridRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        pricingHeaderRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
        }
      );
    }
  }, [loading]);

  // Initialization (exact same as HTML)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Set window globals (exact same as HTML)
    (window as any).slesh_endpoint = SLESH_ENDPOINT;
    (window as any).authService = authService;

    // Initialize Stripe when script loads
    if (stripeLoaded && window.Stripe) {
      initializeStripe();
    }

    // Event listeners are now handled via React onClick handlers in JSX

    // Initialize page (exact same as HTML)
    initializePage().then(() => {
      checkPostLoginUpgrade().catch((error) => {
        console.error("Error checking post-login upgrade:", error);
      });
    });

    // Handle URL parameters (exact same as HTML)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("success") === "true") {
      const planType = urlParams.get("plan") || "pro";
      window.location.href = `/thank-you.html?plan=${planType}`;
      return;
    } else if (urlParams.get("canceled") === "true") {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [stripeLoaded]);

  return (
    <>
      <Script
        src="https://js.stripe.com/v3/"
        strategy="beforeInteractive"
        onLoad={() => {
          setStripeLoaded(true);
          if (typeof window !== "undefined" && window.Stripe) {
            initializeStripe();
          }
        }}
      />
      <main className="pricing-wrapper">
        {loading ? (
          <div className="loading-container" id="loadingContainer">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading pricing information...</div>
            <div className="loading-subtext">
              Please wait while we fetch your subscription details
            </div>
          </div>
        ) : (
          <div id="mainContent">
            <div className="pricing-header" ref={pricingHeaderRef}>
              <h1 className="pricing-title">Choose Your Plan</h1>
              <p className="pricing-subtitle">
                Start free and scale as you grow. Every plan includes our core
                features with different usage limits.
              </p>
            </div>

            <div className="pricing-grid" ref={pricingGridRef}>
              {/* Starter Plan */}
              <div className="pricing-card" data-plan="starter">
                <h2 className="plan-name">Starter</h2>
                <div className="plan-price">$0</div>
                <div className="plan-price-period">per month</div>
                <p className="plan-description">
                  Get started with essential features to explore Slesh.
                </p>
                <ul className="plan-features">
                  <li>Access to the standard model</li>
                  <li>Limited usage (~30 messages/month)</li>
                  <li>
                    View and analyze up to 5 PDFs, 10 Videos, and 25 Web pages
                  </li>
                  <li>Run up to 10 automation flows</li>
                  <li>
                    Add context to your messages
                    <span
                      style={{
                        fontSize: "0.85em",
                        color: "rgba(154, 154, 165, 0.8)",
                        display: "block",
                        marginTop: "4px",
                      }}
                    >
                      Up to 3 Pages and 2 Screenshots
                    </span>
                  </li>
                </ul>
                <button
                  className="plan-button secondary"
                  onClick={() =>
                    (window.location.href =
                      "https://chromewebstore.google.com/detail/slesh-ask-search-automate/ikfopgggdcafagjeflhomdpolhdcfenp?utm_source=Homepage&utm_medium=homepage-cta&utm_campaign=web-conversion-funnel")
                  }
                >
                  Get Started
                </button>
              </div>

              {/* Pro Plan */}
              <div
                className="pricing-card featured"
                data-badge-text="Most Popular"
                data-plan="pro"
              >
                <h2 className="plan-name">Pro</h2>
                <div className="plan-price">$15</div>
                <div className="plan-price-period">per month</div>
                <p className="plan-description">
                  Unlock a more powerful Slesh with extended capabilities.
                </p>
                <ul className="plan-features">
                  <li>
                    Access to premium models
                    <span
                      style={{
                        fontSize: "0.85em",
                        color: "rgba(154, 154, 165, 0.8)",
                        display: "block",
                        marginTop: "4px",
                      }}
                    >
                      Sonnet 4, GPT-5, Gemini 2.5 Pro...
                    </span>
                  </li>
                  <li>10x more messages than starter</li>
                  <li>20× more PDFs, Videos, Web pages than starter</li>
                  <li>Run up to 10x more automation flows</li>
                  <li>
                    Add more context to your messages
                    <span
                      style={{
                        fontSize: "0.85em",
                        color: "rgba(154, 154, 165, 0.8)",
                        display: "block",
                        marginTop: "4px",
                      }}
                    >
                      Up to 10 Pages and 5 Screenshots
                    </span>
                  </li>
                </ul>
                <button
                  className="plan-button manage-subscription-btn"
                  id="pro-manage-btn"
                  onClick={openManageSubscription}
                  style={{ display: "none" }}
                >
                  Manage Subscription
                </button>
                <button
                  className="plan-button"
                  id="pro-plan-btn"
                  data-plan="pro"
                  onClick={() => handleUpgradeClick("pro")}
                >
                  Choose Pro
                </button>
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
                    marginBottom: "16px",
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
                <button
                  className="plan-button manage-subscription-btn"
                  id="unlimited-manage-btn"
                  onClick={openManageSubscription}
                  style={{ display: "none" }}
                >
                  Manage Subscription
                </button>
                <button
                  className="plan-button"
                  id="unlimited-plan-btn"
                  data-plan="unlimited"
                  onClick={() => handleUpgradeClick("unlimited")}
                >
                  Choose Unlimited
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
