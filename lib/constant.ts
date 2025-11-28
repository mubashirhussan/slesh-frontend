// constants.ts

export const SLESH_ENDPOINT = "https://api.slesh.ai";

export type AppKey = "google_drive" | "gmail" | "google_calendar" | "x";

export const ALL_SCOPES: Record<AppKey, string[]> = {
  google_drive: [
    "https://www.googleapis.com/auth/drive.readonly",
    "https://www.googleapis.com/auth/drive.file",
  ],
  gmail: [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.modify",
  ],
  google_calendar: [
    "https://www.googleapis.com/auth/calendar.readonly",
    "https://www.googleapis.com/auth/calendar.events",
  ],
  x: ["tweet.read", "tweet.write", "users.read", "offline.access"],
};

export const PERMISSION_MAPPINGS: Record<
  AppKey,
  Record<string, { label: string; description: string }>
> = {
  google_drive: {
    "https://www.googleapis.com/auth/drive.readonly": {
      label: "View files",
      description: "Read access to your Google Drive files",
    },
    "https://www.googleapis.com/auth/drive.file": {
      label: "Create & edit files",
      description: "Create and edit files in your Google Drive",
    },
  },
  gmail: {
    "https://www.googleapis.com/auth/gmail.readonly": {
      label: "Read emails",
      description: "Read your Gmail messages",
    },
    "https://www.googleapis.com/auth/gmail.send": {
      label: "Send emails",
      description: "Send emails on your behalf",
    },
    "https://www.googleapis.com/auth/gmail.modify": {
      label: "Modify emails",
      description: "Modify and manage your emails",
    },
  },
  google_calendar: {
    "https://www.googleapis.com/auth/calendar.readonly": {
      label: "View calendar",
      description: "Read your Google Calendar events",
    },
    "https://www.googleapis.com/auth/calendar.events": {
      label: "Manage events",
      description: "Create and modify calendar events",
    },
  },
  x: {
    "tweet.read": {
      label: "Read tweets",
      description: "Read your X (Twitter) timeline",
    },
    "tweet.write": {
      label: "Post tweets",
      description: "Post tweets on your behalf",
    },
    "users.read": {
      label: "View profile",
      description: "View your X profile information",
    },
    "offline.access": {
      label: "Offline access",
      description: "Maintain access when you're not using the app",
    },
  },
};

export interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export class LandingPageAuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;
  private refreshPromise: Promise<boolean> | null = null;

  constructor() {
    this.initializeTokens();
    this.setupTokenValidation();
  }

  private initializeTokens() {
    try {
      this.accessToken =
        localStorage.getItem("supabase_access_token") ||
        localStorage.getItem("authToken");
      this.refreshToken = localStorage.getItem("supabase_refresh_token");

      const expiryStr = localStorage.getItem("token_expiry");
      if (expiryStr) this.tokenExpiry = parseInt(expiryStr);
    } catch (err) {
      console.error("Error initializing tokens:", err);
    }
  }

  private isTokenExpired() {
    if (!this.tokenExpiry) return false;
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    return now >= this.tokenExpiry - fiveMinutes;
  }

  isAuthenticated() {
    return !!(this.accessToken && !this.isTokenExpired());
  }

  async getAccessToken(): Promise<string | null> {
    if (this.isTokenExpired()) {
      const refreshed = await this.refreshAccessToken();
      if (!refreshed) {
        this.clearStoredTokens();
        return null;
      }
    }
    return this.accessToken;
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = this._performTokenRefresh();
    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async _performTokenRefresh(): Promise<boolean> {
    if (!this.refreshToken) {
      console.error("No refresh token available");
      return false;
    }

    try {
      const res = await fetch(`${SLESH_ENDPOINT}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      if (!res.ok) {
        console.error("Token refresh failed:", res.status, res.statusText);
        this.clearStoredTokens();
        return false;
      }

      const data = await res.json();

      if (data.session?.access_token)
        await this.storeToken(data.session.access_token);
      if (data.session?.refresh_token)
        await this.storeRefreshToken(data.session.refresh_token);
      if (data.session?.expires_at) {
        this.tokenExpiry = data.session.expires_at * 1000;
        localStorage.setItem("token_expiry", this.tokenExpiry.toString());
      }

      return true;
    } catch (err) {
      console.error("Token refresh failed:", err);
      this.clearStoredTokens();
      return false;
    }
  }

  private async storeToken(token: string) {
    this.accessToken = token;
    localStorage.setItem("supabase_access_token", token);
    localStorage.setItem("authToken", token);
  }

  private async storeRefreshToken(token: string) {
    this.refreshToken = token;
    localStorage.setItem("supabase_refresh_token", token);
  }

  clearStoredTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiry = null;

    [
      "supabase_access_token",
      "supabase_refresh_token",
      "authToken",
      "token_expiry",
      "user",
      "user_id",
      "email",
    ].forEach((key) => localStorage.removeItem(key));

    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "supabase_access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  async makeAuthenticatedRequest(
    url: string,
    options: FetchOptions = {}
  ): Promise<Response> {
    let token = await this.getAccessToken();
    if (!token) throw new Error("No authentication token found");

    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    };

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401 || response.status === 403) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        token = await this.getAccessToken();
        if (token) {
          response = await fetch(url, {
            ...options,
            headers: { ...headers, Authorization: `Bearer ${token}` },
          });
        } else {
          throw new Error("Failed to get new token after refresh");
        }
      } else {
        throw new Error("Authentication failed - please sign in again");
      }
    }

    return response;
  }

  private setupTokenValidation() {
    setInterval(async () => {
      if (this.accessToken && this.isTokenExpired()) {
        const refreshed = await this.refreshAccessToken();
        if (!refreshed) this.handleAuthenticationFailure();
      }
    }, 60000);
  }

  private handleAuthenticationFailure() {
    this.clearStoredTokens();
    const path = window.location.pathname;
    if (path.includes("/pricing") || path.includes("/account")) {
      localStorage.setItem("intendedPlan", "");
      localStorage.setItem("intendedAction", "login");
      window.location.href = "/login/";
    }
  }

  async signOut() {
    try {
      if (this.accessToken) {
        await fetch(`${SLESH_ENDPOINT}/auth/signout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (err) {
      console.warn("Error during server sign out, clearing local tokens anyway");
    }
    this.clearStoredTokens();
    sessionStorage.setItem("justSignedOut", "true");
  }
}

export const authService = new LandingPageAuthService();

// Helper functions for AccountClient
export async function fetchWithAuth(
  endpoint: string,
  options: FetchOptions = {}
): Promise<Response> {
  const fullUrl = endpoint.startsWith("http")
    ? endpoint
    : `${SLESH_ENDPOINT}${endpoint}`;
  return authService.makeAuthenticatedRequest(fullUrl, options);
}

export async function signOut(): Promise<void> {
  await authService.signOut();
  window.location.href = "/";
}

