// lib/auth.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { API_ENDPOINT } from "./constant";

// import { API_ENDPOINT } from "./constants";

const SUPABASE_URL = "https://app.slesh.ai";
const SLESH_ENDPOINT = "https://api.slesh.ai";
const REDIRECT_URL = `${process.env.NEXT_PUBLIC_SITE_URL}/login/callback`;
const LAST_USED_PROVIDER_KEY = "slesh_last_used_provider";

/* -------------------------------------------------------------------------- */
/*                              Helper Types                                 */
/* -------------------------------------------------------------------------- */
type Provider = "google" | "azure";

// interface SignInCallbacks {
//   setLoading: (v: boolean) => void;
//   setSuccess: (v: boolean) => void;
//   setError: (msg: string | null) => void;
// }

/* -------------------------------------------------------------------------- */
/*                         Last‑Used Provider UI Logic                        */
/* -------------------------------------------------------------------------- */
export function getLastUsedProvider(): Provider | null {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem(LAST_USED_PROVIDER_KEY);
  return val === "google" || val === "azure" ? val : null;
}

export function setLastUsedProvider(provider: Provider): void {
  localStorage.setItem(LAST_USED_PROVIDER_KEY, provider);
}

/** Re‑order the login buttons on the page based on the last used provider */
export function updateLoginButtonsOrder(): void {
  const lastUsed = getLastUsedProvider();
  const container = document.getElementById("loginButtons");
  if (!container || !lastUsed) return;

  const googleBtn = container.querySelector(
    ".google-btn"
  ) as HTMLElement | null;
  const microsoftBtn = container.querySelector(
    ".microsoft-btn"
  ) as HTMLElement | null;
  if (!googleBtn || !microsoftBtn) return;

  container.innerHTML = "";

  if (lastUsed === "google") {
    addLastUsedIndicator(googleBtn, "Google");
    container.appendChild(googleBtn);
    container.appendChild(microsoftBtn);
  } else {
    addLastUsedIndicator(microsoftBtn, "Microsoft");
    container.appendChild(microsoftBtn);
    container.appendChild(googleBtn);
  }
}

/* -------------------------------------------------------------------------- */
/*                         Indicator UI Helper                               */
/* -------------------------------------------------------------------------- */
function addLastUsedIndicator(button: HTMLElement, name: string): void {
  const indicator = document.createElement("div");
  indicator.className = "last-used-indicator";
  indicator.innerHTML = `<span class="last-used-text">Last used</span>`;

  const originalContent = button.innerHTML;
  button.innerHTML = "";
  button.appendChild(indicator);

  const wrapper = document.createElement("div");
  wrapper.className = "button-content";
  wrapper.innerHTML = originalContent;
  button.appendChild(wrapper);

  button.classList.add("last-used-btn");
}

/* -------------------------------------------------------------------------- */
/*                                 Sign‑In Flow                               */
/* -------------------------------------------------------------------------- */
// lib/auth.ts
export type SignInCallbacks = {
  setSuccess: (v: boolean) => void;
  setError: (msg: string | null) => void;
};

export async function signIn(
  provider: Provider,
  { setSuccess, setError }: SignInCallbacks
): Promise<void> {
  let authWindow: Window | null = null;

  try {
    let authUrl = `${SUPABASE_URL}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(
      REDIRECT_URL
    )}`;
    if (provider === "azure") authUrl += "&scopes=email profile openid";

    authWindow = window.open(authUrl, "slesh_auth", "width=500,height=600");
    if (!authWindow) throw new Error("Popup blocked");

    await new Promise<void>((resolve, reject) => {
      const poll = setInterval(() => {
        // USER CLOSED POPUP
        if (authWindow?.closed) {
          clearInterval(poll);
          setError("Sign in cancelled."); // Optional: show message
          resolve(); // This will trigger finally → setLoading(false)
          return;
        }

        try {
          const url = authWindow?.location.href;
          if (!url || !url.startsWith(REDIRECT_URL)) return;

          clearInterval(poll);
          authWindow?.close();

          const hash = url.split("#")[1] || "";
          const query = new URL(url).search;
          const params = new URLSearchParams(hash || query.slice(1));

          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (!accessToken) throw new Error("No access token received");

          localStorage.setItem("supabase_access_token", accessToken);
          localStorage.setItem("authToken", accessToken);
          if (refreshToken)
            localStorage.setItem("supabase_refresh_token", refreshToken);
          setLastUsedProvider(provider);

          getUserInfo(accessToken)
            .then((user) => {
              if (user) {
                setSuccess(true);
                setTimeout(() => (window.location.href = "/account"), 2000);
              } else {
                throw new Error("Failed to fetch user info");
              }
            })
            .catch((err) => {
              setError(err.message || "Authentication failed");
              reject(err);
            })
            .finally(() => {
              resolve();
            });
        } catch (_) {
          // ignore cross-origin
        }
      }, 100);

      // 5-minute timeout
      setTimeout(() => {
        if (authWindow && !authWindow.closed) {
          authWindow.close();
          clearInterval(poll);
          setError("Login timed out. Please try again.");
          reject(new Error("timeout"));
        }
      }, 5 * 60 * 1000);
    });
  } catch (err: any) {
    setError(err?.message ?? "Sign-in failed");
  }
}

/* -------------------------------------------------------------------------- */
/*                         Exchange Supabase token → Slesh user               */
/* -------------------------------------------------------------------------- */
async function getUserInfo(token: string) {
  const res = await fetch(`${SLESH_ENDPOINT}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const data = await res.json();
  return data.success ? data.user : null;
}

/* -------------------------------------------------------------------------- */
/*                         Auto‑login if token exists                         */
/* -------------------------------------------------------------------------- */
export async function checkExistingAuth({
  setSuccess,
  setError,
}: {
  setSuccess: (v: boolean) => void;
  setError: (msg: string | null) => void;
}): Promise<void> {
  const token = getToken();
  if (!token) return;

  const user = await getUserInfo(token);
  if (user) {
    setSuccess(true);
    setTimeout(() => (window.location.href = "/account"), 2000);
  } else {
    localStorage.removeItem("supabase_access_token");
    localStorage.removeItem("authToken");
    setError("Session expired. Please sign in again."); // Optional: show message
  }
}

/* -------------------------------------------------------------------------- */
/*                                 Misc Helpers                               */
/* -------------------------------------------------------------------------- */
export function resetLoginState(): void {
  localStorage.clear();
  window.location.reload();
}

export function getToken(): string | null {
  return (
    localStorage.getItem("authToken") ??
    localStorage.getItem("supabase_access_token")
  );
}

/* -------------------------------------------------------------------------- */
/*                     Authenticated fetch (single export)                   */
/* -------------------------------------------------------------------------- */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getToken();
  return fetch(`${API_ENDPOINT}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

/* -------------------------------------------------------------------------- */
/*                                 Sign‑Out                                   */
/* -------------------------------------------------------------------------- */
export async function signOut(): Promise<void> {
  localStorage.clear();
  // optionally call a logout endpoint if you have one
  window.location.href = "/";
}
