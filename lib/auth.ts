/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_ENDPOINT } from "./constant";

// lib/auth.ts
const SUPABASE_URL = "https://app.slesh.ai";
const SLESH_ENDPOINT = "https://api.slesh.ai";
const REDIRECT_URL = `${process.env.NEXT_PUBLIC_SITE_URL}/login/callback`;
const LAST_USED_PROVIDER_KEY = "slesh_last_used_provider";

export function getLastUsedProvider() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LAST_USED_PROVIDER_KEY);
}

export function setLastUsedProvider(provider: string) {
  localStorage.setItem(LAST_USED_PROVIDER_KEY, provider);
}

export function updateLoginButtonsOrder() {
  const lastUsed = getLastUsedProvider();
  const container = document.getElementById("loginButtons");
  if (!container || !lastUsed) return;

  const googleBtn = container.querySelector(".google-btn");
  const microsoftBtn = container.querySelector(".microsoft-btn");
  if (!googleBtn || !microsoftBtn) return;

  container.innerHTML = "";
  if (lastUsed === "google") {
    addLastUsedIndicator(googleBtn, "Google");
    container.appendChild(googleBtn);
    container.appendChild(microsoftBtn);
  } else if (lastUsed === "azure") {
    addLastUsedIndicator(microsoftBtn, "Microsoft");
    container.appendChild(microsoftBtn);
    container.appendChild(googleBtn);
  }
}

function addLastUsedIndicator(button: Element, name: string) {
  const indicator = document.createElement("div");
  indicator.className = "last-used-indicator";
  indicator.innerHTML = `<span class="last-used-text">Last used</span>`;

  const content = button.innerHTML;
  button.innerHTML = "";
  button.appendChild(indicator);

  const wrapper = document.createElement("div");
  wrapper.className = "button-content";
  wrapper.innerHTML = content;
  button.appendChild(wrapper);

  button.classList.add("last-used-btn");
}

export async function signIn(
  provider: "google" | "azure",
  { setLoading, setSuccess, setError }: any
) {
  let authWindow: Window | null = null;
  try {
    let authUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(
      REDIRECT_URL
    )}`;
    if (provider === "azure") authUrl += "&scopes=email profile openid";

    authWindow = window.open(authUrl, "slesh_auth", "width=500,height=600");
    if (!authWindow) throw new Error("Popup blocked");

    const check = setInterval(async () => {
      if (authWindow?.closed) {
        clearInterval(check);
        setLoading(false);
        return;
      }

      try {
        const url = authWindow?.location.href;
        if (url?.startsWith(REDIRECT_URL)) {
          clearInterval(check);
          authWindow?.close();

          const params = new URL(url).hash.slice(1);
          const searchParams = new URL(url).searchParams;
          const accessToken =
            new URLSearchParams(params).get("access_token") ||
            searchParams.get("access_token");
          const refreshToken =
            new URLSearchParams(params).get("refresh_token") ||
            searchParams.get("refresh_token");

          if (!accessToken) throw new Error("No access token");

          localStorage.setItem("supabase_access_token", accessToken);
          localStorage.setItem("authToken", accessToken);
          if (refreshToken)
            localStorage.setItem("supabase_refresh_token", refreshToken);

          setLastUsedProvider(provider);
          const user = await getUserInfo(accessToken);
          if (user) {
            setSuccess(true);
            setTimeout(() => {
              window.location.href = "/account";
            }, 2000);
          }
        }
      } catch (e) {}
    }, 100);

    setTimeout(() => {
      if (authWindow && !authWindow.closed) {
        authWindow.close();
        clearInterval(check);
        setLoading(false);
        setError("Timeout. Try again.");
      }
    }, 300000);
  } catch (err: any) {
    setError(err.message);
    setLoading(false);
  }
}

async function getUserInfo(token: string) {
  const res = await fetch(`${SLESH_ENDPOINT}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const data = await res.json();
  return data.success ? data.user : null;
}

export async function checkExistingAuth({ setSuccess, setError }: any) {
  const token =
    localStorage.getItem("supabase_access_token") ||
    localStorage.getItem("authToken");
  if (!token) return;

  const user = await getUserInfo(token);
  if (user) {
    setSuccess(true);
    setTimeout(() => (window.location.href = "/account"), 2000);
  } else {
    localStorage.removeItem("supabase_access_token");
    localStorage.removeItem("authToken");
  }
}

export function resetLoginState() {
  localStorage.clear();
  window.location.reload();
}
export function getToken() {
  return (
    localStorage.getItem("authToken") ||
    localStorage.getItem("supabase_access_token")
  );
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getToken();
  return fetch(`${API_ENDPOINT}${url}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

export async function signOut() {
  localStorage.clear();
  window.location.href = "/";
}
