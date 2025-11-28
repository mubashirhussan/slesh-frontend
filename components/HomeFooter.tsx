/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useEffect } from "react";

export default function HomeFooter() {
  useEffect(() => {
    // --- Footer year ----------------------
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear().toString();

    // Add to Chrome buttons
    document.querySelectorAll<HTMLButtonElement>(".add-to-chrome").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.location.href =
          "https://chromewebstore.google.com/detail/slesh-ask-search-automate/ikfopgggdcafagjeflhomdpolhdcfenp?utm_source=Homepage&utm_medium=homepage-cta&utm_campaign=web-conversion-funnel";
      });
    });

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-top">
          <div className="left">
            <p className="copyright-text">
              ©<span id="year"></span> Slesh by Interphase Labs, Inc.
            </p>
          </div>

          <div className="center">
            <div className="footer-links">
              <a
                href="https://x.com/getslesh"
                target="_blank"
                className="footer-link"
              >
                X
              </a>
              <a
                href="https://discord.gg/7JG597AfWd"
                target="_blank"
                className="footer-link"
              >
                Discord
              </a>
              <a href="/slsh" className="footer-link">
                SLSH
              </a>
              <a
                href="https://docs.slesh.ai/"
                target="_blank"
                className="footer-link"
              >
                Docs
              </a>
              <a href="/careers" className="footer-link">
                Careers
              </a>
              <a href="/terms/" target="_blank" className="footer-link">
                Terms &amp; Conditions
              </a>
              <a href="/privacy/" target="_blank" className="footer-link">
                Privacy Policy
              </a>
            </div>
          </div>

          <div className="right">
            <button className="add-to-chrome btn hover-animation">
              <img src="/chrome-icon.svg" alt="" />
              <p>
                Add to <span className="spectral-font">Chrome</span>
              </p>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}


