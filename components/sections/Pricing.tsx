/* eslint-disable react-hooks/refs */
/* eslint-disable @typescript-eslint/no-explicit-any */
// components/sections/Pricing.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchWithAuth } from "@/lib/auth";
import { API_ENDPOINT } from "@/lib/constant";

export default function PricingPlans() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [subscription, setSubscription] = useState<
    "starter" | "pro" | "unlimited" | null
  >(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const stripeRef = useRef<any>(null);

  // ========================================
  // 1. Initialize Stripe
  // ========================================
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;
    script.onload = () => {
      stripeRef.current = (window as any).Stripe?.(
        "pk_live_51RqKd29UpKTHYnyr2sbrOnSaV5teiR3h3eGYrg2J6VfVHEqYtxnJjdipPQ0D4Ui4IIeJw8NKHEKTq0aPO0ZDmKdH00ne0WBWTr"
      );
    };
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  // ========================================
  // 2. Auth & Subscription Helpers
  // ========================================
  const checkAuth = () => {
    const token =
      localStorage.getItem("authToken") ||
      localStorage.getItem("supabase_access_token");
    const cookie = document.cookie
      .split("; ")
      .find(
        (row) =>
          row.startsWith("authToken=") ||
          row.startsWith("supabase_access_token=")
      )
      ?.split("=")[1];
    return !!(token || cookie);
  };

  const getSubscription = async () => {
    const cache = sessionStorage.getItem("subscriptionCache");
    const now = Date.now();
    if (cache) {
      const { data, timestamp } = JSON.parse(cache);
      if (now - timestamp < 5 * 60 * 1000) return data;
    }

    try {
      const res = await fetch(
        `${API_ENDPOINT}/stripe/dashboard/get-user-subscription`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        const plan = data.subscription_plan || "starter";
        sessionStorage.setItem(
          "subscriptionCache",
          JSON.stringify({ data: plan, timestamp: now })
        );
        return plan;
      }
    } catch (err) {
      console.error(err);
    }
    return "starter";
  };

  // ========================================
  // 3. handleUpgrade — MOVED BEFORE useEffect
  // ========================================
  const handleUpgrade = async (plan: "pro" | "unlimited") => {
    if (!isAuthenticated) {
      localStorage.setItem("intendedPlan", plan);
      localStorage.setItem("intendedAction", "upgrade");
      router.push("/login");
      return;
    }

    const btn = document.getElementById(
      `${plan}-plan-btn`
    ) as HTMLButtonElement;
    if (!btn || !stripeRef.current) return;

    const originalText = btn.textContent;
    btn.textContent = "Loading...";
    btn.disabled = true;

    try {
      const res = await fetchWithAuth(
        "/stripe/dashboard/create-checkout-session",
        {
          method: "POST",
          body: JSON.stringify({
            plan,
            success_url: `${window.location.origin}/pricing?success=true&plan=${plan}`,
            cancel_url: `${window.location.origin}/pricing?canceled=true`,
          }),
        }
      );
      const session = await res.json();
      if (session.id) {
        await stripeRef.current.redirectToCheckout({ sessionId: session.id });
      }
    } catch (err) {
      console.error(err);
      btn.textContent = originalText;
      btn.disabled = false;
    }
  };

  // ========================================
  // 4. openPortal — ALSO BEFORE useEffect
  // ========================================
  const openPortal = async () => {
    try {
      const res = await fetchWithAuth(
        "/stripe/dashboard/create-portal-session",
        { method: "POST" }
      );
      const data = await res.json();
      window.open(data.url, "_blank");
    } catch (err) {
      alert("Failed to open portal");
    }
  };

  // ========================================
  // 5. Initialize Page
  // ========================================
  useEffect(() => {
    const init = async () => {
      const auth = checkAuth();
      setIsAuthenticated(auth);
      if (auth) {
        const sub = await getSubscription();
        setSubscription(sub);
      } else {
        setSubscription("starter");
      }
      setLoading(false);
    };
    init();
  }, []);

  // ========================================
  // 6. OAuth & Post-Login Upgrade — NOW SAFE
  // ========================================
  useEffect(() => {
    const success = searchParams.get("success");
    const urlPlan = searchParams.get("plan");
    const canceled = searchParams.get("canceled");

    if (success === "true" && urlPlan) {
      router.replace("/thank-you");
      return;
    }
    if (canceled === "true") {
      router.replace("/pricing");
      return;
    }

    const intendedPlan = localStorage.getItem("intendedPlan") as
      | "pro"
      | "unlimited"
      | null;
    const intendedAction = localStorage.getItem("intendedAction");

    if (intendedPlan && intendedAction === "upgrade" && isAuthenticated) {
      localStorage.removeItem("intendedPlan");
      localStorage.removeItem("intendedAction");
      // handleUpgrade is now declared above
      setTimeout(() => handleUpgrade(intendedPlan), 1500);
    }
  }, [searchParams, isAuthenticated, router]);

  // ========================================
  // 7. Loading State
  // ========================================
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6" />
        <p className="text-lg font-medium text-gray-900">Loading pricing...</p>
      </div>
    );
  }

  // ========================================
  // 8. Plans Data
  // ========================================
  const plans = [
    {
      name: "Starter",
      price: "$0",
      period: "/month",
      description: "Get started with essential features to explore Slesh.",
      features: [
        "Access to the standard model",
        "Limited usage (~30 messages/month)",
        "View and analyze up to 5 PDFs, 10 Videos, and 25 Web pages",
        "Run up to 10 automation flows",
        "Add context to your messages",
        "Up to 3 Pages and 2 Screenshots",
      ],
      cta: "Get Started",
      popular: false,
      current: subscription === "starter",
      action: () =>
        window.open(
          "https://chromewebstore.google.com/detail/slesh-ask-search-automate/ikfopgggdcafagjeflhomdpolhdcfenp?utm_source=Homepage&utm_medium=homepage-cta&utm_campaign=web-conversion-funnel",
          "_blank"
        ),
    },
    {
      name: "Pro",
      price: "$15",
      period: "/month",
      description: "Unlock a more powerful Slesh with extended capabilities.",
      features: [
        "Access to premium models Sonnet 4, GPT-5, Gemini 2.5 Pro...",
        "10x more messages than starter",
        "20× more PDFs, Videos, Web pages than starter",
        "Run up to 10x more automation flows",
        "Add more context to your messages",
        "Up to 10 Pages and 5 Screenshots",
      ],
      cta: subscription === "pro" ? "Manage Subscription" : "Choose Pro",
      popular: true,
      current: subscription === "pro",
      action: subscription === "pro" ? openPortal : () => handleUpgrade("pro"),
    },
    {
      name: "Unlimited",
      price: "$39",
      period: "/month",
      description: "Unlock the full potential of Slesh with no limits.",
      features: [
        "Everything in Pro",
        "Unlimited chats",
        "Unlimited PDFs, Videos, Web pages",
        "Unlimited automation flows",
        "Early access to new features",
        "*Fair use applies. See Terms.",
      ],
      cta:
        subscription === "unlimited"
          ? "Manage Subscription"
          : subscription === "pro"
          ? "Upgrade to Unlimited"
          : "Choose Unlimited",
      popular: false,
      current: subscription === "unlimited",
      action:
        subscription === "unlimited"
          ? openPortal
          : () => handleUpgrade("unlimited"),
    },
  ];

  // ========================================
  // 9. Render
  // ========================================
  return (
    <div className="min-h-screen bg-white py-12">
      <div className="page-container">
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-bold text-black md:text-5xl">
            Choose Your Plan
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Start free and scale as you grow. Every plan includes our core
            features with different usage limits.
          </p>
        </div>

        <div className="mt-16 space-y-12 lg:grid lg:grid-cols-3 lg:gap-8 lg:space-y-0">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl border bg-white/90 p-8 shadow-sm transition-transform ${
                plan.popular
                  ? "border-[color:var(--color-primary)] shadow-2xl shadow-[color:var(--color-primary-muted)] scale-105 z-10"
                  : "border-gray-200 hover:-translate-y-2 hover:border-[color:var(--color-primary)] hover:shadow-xl hover:shadow-[color:var(--color-primary-muted)]"
              }`}
            >
              {plan.popular && !plan.current && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex items-center rounded-full bg-[color:var(--color-primary)] px-4 py-1 text-sm font-medium text-white shadow">
                    Most Popular
                  </span>
                </div>
              )}
              {plan.current && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <span className="inline-flex items-center rounded-full bg-green-600 px-4 py-1 text-sm font-medium text-white shadow">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline justify-center">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="ml-2 text-lg font-light text-[#6b7280]">
                    {plan.period}
                  </span>
                </div>
                <p className="mt-4 text-gray-600">{plan.description}</p>
              </div>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-6 w-6 text-[color:var(--color-primary)]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="ml-3 text-gray-700">{feature}</p>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <button
                  id={`${plan.name.toLowerCase()}-plan-btn`}
                  onClick={plan.action}
                  className={`w-full py-3 cursor-pointer px-6 rounded-md text-center font-medium transition-colors duration-200 ${
                    plan.current
                      ? "bg-gray-100 text-gray-600 cursor-not-allowed"
                      : plan.popular
                      ? "bg-[color:var(--color-primary)] text-white shadow-lg shadow-[color:var(--color-primary-muted)] hover:bg-[#0042d1]"
                      : "border border-[color:var(--color-primary)] bg-transparent text-[color:var(--color-primary)] hover:bg-[color:var(--color-primary)] hover:text-white"
                  }`}
                  disabled={plan.current}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
