/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useState, useEffect, FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AccessClient() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Auto-fill from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const accessCode = urlParams.get("code");
    if (accessCode) {
      setCode(accessCode);
    }

    // GSAP animation
    if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
      gsap.fromTo(
        ".access-card",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".access-card",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }
  }, []);

  const findRedirectUrlFromJson = (data: any) => {
    if (!data || typeof data !== "object") return null;
    return data.access_link || null;
  };

  const isHttpUrl = (value: string | null) => {
    return typeof value === "string" && /^https?:\/\//i.test(value);
  };

  const parseResponseForUrl = async (response: Response) => {
    const contentType = (response.headers.get("Content-Type") || "").toLowerCase();
    if (contentType.includes("application/json")) {
      const json = await response.json();
      const url = findRedirectUrlFromJson(json);
      return isHttpUrl(url) ? url : null;
    }
    const text = (await response.text()).trim();
    return isHttpUrl(text) ? text : null;
  };

  const requestUrlViaPost = async (code: string) => {
    const sleshEndpoint = (window as any).slesh_endpoint || "https://api.slesh.ai";
    const response = await fetch(`${sleshEndpoint}/access`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json, text/plain",
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const maybeUrl = await parseResponseForUrl(response).catch(() => null);
      const error: any = new Error("Invalid access code.");
      error.url = maybeUrl;
      throw error;
    }

    const url = await parseResponseForUrl(response).catch(() => null);
    return isHttpUrl(url) ? url : null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const trimmedCode = code.trim();
    if (!trimmedCode) {
      setError("Please enter your access code.");
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = await requestUrlViaPost(trimmedCode);
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        setError("Invalid access code.");
      }
    } catch (err: any) {
      setError(
        err && err.message ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .access-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          padding-top: 110px;
          position: relative;
          background: #fbfcff;
        }

        .access-wrapper::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
              700px 400px at 20% -10%,
              rgba(0, 82, 255, 0.06),
              rgba(0, 0, 0, 0) 60%
            ),
            radial-gradient(
              600px 350px at 85% 0%,
              rgba(191, 0, 255, 0.05),
              rgba(0, 0, 0, 0) 58%
            ),
            radial-gradient(
              600px 300px at 50% 115%,
              rgba(154, 154, 165, 0.08),
              rgba(0, 0, 0, 0) 62%
            );
          pointer-events: none;
          z-index: 0;
        }

        .access-card {
          width: 100%;
          max-width: 520px;
          background: rgba(154, 154, 165, 0.05);
          border: 1px solid rgba(154, 154, 165, 0.1);
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 16px rgba(154, 154, 165, 0.07),
            inset 0 -1px 4px rgba(154, 154, 165, 0.1);
          z-index: 1;
          position: relative;
        }

        .access-title {
          margin: 0 0 12px;
          font-size: 28px;
          line-height: 1.2;
          color: #0f172a;
          font-family: "Geist", sans-serif;
        }

        .access-subtitle {
          margin: 0 0 20px;
          color: rgba(154, 154, 165, 1);
          font-size: 15px;
          font-family: "Geist", sans-serif;
        }

        .access-form {
          display: flex;
          gap: 10px;
        }

        .access-input {
          flex: 1;
          padding: 12px 14px;
          border-radius: 10px;
          border: 1px solid rgba(154, 154, 165, 0.3);
          background: #fff;
          color: #09090b;
          font-size: 16px;
          outline: none;
          font-family: "Geist", sans-serif;
        }

        .access-input:focus {
          border-color: #6e6eff;
          box-shadow: 0 0 0 3px rgba(110, 110, 255, 0.15);
        }

        .access-button {
          padding: 11.4px 15.2px;
          border-radius: 22.8px;
          border: none;
          background: #0052ff;
          color: #fff;
          font-weight: 500;
          font-size: 15.2px;
          line-height: 130%;
          letter-spacing: -0.02em;
          cursor: pointer;
          min-width: 128px;
          box-shadow: none;
          font-family: "Geist", sans-serif;
        }

        .access-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .access-error {
          margin-top: 14px;
          color: #ff6b6b;
          font-size: 14px;
          min-height: 20px;
          font-family: "Geist", sans-serif;
        }

        .access-footer {
          margin-top: 18px;
          font-size: 14px;
          color: rgba(154, 154, 165, 1);
          font-family: "Geist", sans-serif;
        }

        .access-footer a {
          color: #0052ff;
          text-decoration: underline;
        }
      `}</style>

      <main className="access-wrapper">
        <section className="access-card">
          <h1 className="access-title">Enter your access code</h1>
          <p className="access-subtitle">
            Your friend has invited you to Slesh. Enter your code to unlock the
            Chrome extension download.
          </p>

          <form
            id="access-form"
            className="access-form"
            onSubmit={handleSubmit}
            noValidate
          >
            <input
              id="access-code"
              className="access-input"
              type="text"
              name="code"
              placeholder="Your access code"
              autoComplete="one-time-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <button
              id="access-submit"
              className="access-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Checking…" : "Continue"}
            </button>
          </form>

          <div id="access-error" className="access-error">
            {error}
          </div>

          <div className="access-footer">
            Want to earn referral perks?{" "}
            <a
              href="https://x.com/getslesh"
              target="_blank"
              rel="noopener noreferrer"
            >
              Send us a message
            </a>
            .
          </div>
        </section>
      </main>
    </>
  );
}

