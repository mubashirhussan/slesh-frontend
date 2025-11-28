/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect } from "react";

export default function HomeNavbar() {
  useEffect(() => {
    // --- Auth / navigation logic ----------------------
    const isAuthenticated = () => {
      const authService = (window as any).authService;
      if (!authService || typeof authService.isAuthenticated !== "function") {
        return false;
      }
      return authService.isAuthenticated();
    };

    const updateNavigation = () => {
      const loginLinks = document.querySelectorAll<HTMLAnchorElement>(
        ".login-link"
      );
      const loggedIn = isAuthenticated();

      loginLinks.forEach((link) => {
        link.textContent = "Account";
        if (loggedIn) {
          link.href = "/account";
        } else {
          link.href = "/login";
        }
        link.classList.remove("sign-out-link");
        (link as any).onclick = null;
      });
    };

    // Initialize nav
    updateNavigation();

    // When page becomes visible
    const visibilityHandler = () => {
      if (document.visibilityState === "visible") {
        setTimeout(updateNavigation, 100);
      }
    };
    document.addEventListener("visibilitychange", visibilityHandler);

    // When window gains focus
    const focusHandler = () => setTimeout(updateNavigation, 100);
    window.addEventListener("focus", focusHandler);

    // Periodic check
    const authInterval = window.setInterval(updateNavigation, 2000);

    // URL change check
    let currentUrl = window.location.href;
    const urlInterval = window.setInterval(() => {
      if (currentUrl !== window.location.href) {
        currentUrl = window.location.href;
        setTimeout(updateNavigation, 100);
      }
    }, 100);

    // --- Mobile nav toggle ----------------
    const menu = document.getElementById("menuToggle");
    const navLinks = document.querySelector<HTMLElement>(".nav-links-mobile");
    const menuClickHandler = () => {
      if (!menu || !navLinks) return;
      menu.classList.toggle("open");
      navLinks.style.display =
        navLinks.style.display === "flex" ? "none" : "flex";
    };
    if (menu) {
      menu.addEventListener("click", menuClickHandler);
    }

    const navLinksMobile = document.querySelectorAll<HTMLAnchorElement>(
      ".nav-links-mobile a"
    );
    const navLinkClick = () => {
      if (!menu || !navLinks) return;
      menu.classList.remove("open");
      navLinks.style.display = "none";
    };
    navLinksMobile.forEach((link) =>
      link.addEventListener("click", navLinkClick)
    );

    // Add to Chrome buttons
    document.querySelectorAll<HTMLButtonElement>(".add-to-chrome").forEach((btn) => {
      btn.addEventListener("click", () => {
        window.location.href =
          "https://chromewebstore.google.com/detail/slesh-ask-search-automate/ikfopgggdcafagjeflhomdpolhdcfenp?utm_source=Homepage&utm_medium=homepage-cta&utm_campaign=web-conversion-funnel";
      });
    });

    // cleanup
    return () => {
      document.removeEventListener("visibilitychange", visibilityHandler);
      window.removeEventListener("focus", focusHandler);
      clearInterval(authInterval);
      clearInterval(urlInterval);
      if (menu) menu.removeEventListener("click", menuClickHandler);
      navLinksMobile.forEach((link) =>
        link.removeEventListener("click", navLinkClick)
      );
    };
  }, []);

  return (
    <>
      <nav className="navbar nav-desktop">
        <div className="logo">
          <a href="/">
            <img src="/Logo.svg" alt="Slesh" />
          </a>
        </div>
        <ul className="nav-links">
          <a href="#features">Features</a>
          <a href="/pricing">Pricing</a>
          <a href="/blog">Use Cases</a>
          <a href="/students">Students</a>
          <a href="https://docs.slesh.ai/" target="_blank">
            Docs
          </a>
          <a href="/careers">Careers</a>
          <a href="/login" className="login-link">
            Account
          </a>
        </ul>
        <button className="add-to-chrome btn hover-animation">
          <img src="/chrome-icon.svg" alt="" />
          <p>
            Add to <span className="spectral-font">Chrome</span>
          </p>
        </button>
      </nav>

      <nav className="navbar nav-mobile">
        <div className="nav-left">
          <div className="menu-icon" id="menuToggle">
            <span></span>
            <span></span>
          </div>
          <div className="logo">
            <a href="/">
              <img src="/Logo.svg" alt="Slesh" />
            </a>
          </div>
          <ul className="nav-links nav-links-mobile">
            <a href="#features">Features</a>
            <a href="/pricing">Pricing</a>
            <a href="/blog">Use Cases</a>
            <a href="/students">Students</a>
            <a href="https://docs.slesh.ai/" target="_blank">
              Docs
            </a>
            <a href="/careers">Careers</a>
            <a href="/login" className="login-link">
              Account
            </a>
          </ul>
        </div>
        <button className="add-to-chrome btn">
          <img src="/chrome-icon.svg" alt="" />
          <p>
            Add to <span className="spectral-font">Chrome</span>
          </p>
        </button>
      </nav>
    </>
  );
}

