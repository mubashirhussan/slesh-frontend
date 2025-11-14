// app/account/AccountClient.tsx
"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth, signOut } from "@/lib/auth";
import { AppKey } from "@/lib/constant";
import ConnectedApp from "./ConnectedApp";
import GoogleWarningDialog from "./GoogleWarningDialog";

interface Profile {
  subscriptionPlan: string;
  limits: Record<string, number>;
  usage: Record<string, number>;
}

interface ConnectedAppData {
  app_name: AppKey;
  connection_status: "active" | "expired" | "error";
  scopes: string[];
  provider_user_email?: string;
}

const UI_TO_BACKEND: Record<string, AppKey> = {
  googleDrive: "google_drive",
  gmail: "gmail",
  googleCalendar: "google_calendar",
  x: "x",
};

export default function AccountClient() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [connectedApps, setConnectedApps] = useState<ConnectedAppData[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [pendingApp, setPendingApp] = useState<string | null>(null);

  const loadProfile = async () => {
    try {
      const res = await fetchWithAuth("/profile/");
      const data = await res.json();
      if (data.success) setProfile(data);
    } catch (err) {
      console.error("Failed to load profile:", err);
    }
  };

  const loadConnectedApps = async () => {
    try {
      const res = await fetchWithAuth("/connected-apps/");
      const data = await res.json();
      if (data.success) setConnectedApps(data.connectedApps || []);
    } catch (err) {
      console.error("Failed to load connected apps:", err);
    }
  };

  const handleOAuthRedirect = () => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    const status = params.get("status");
    if (connected && status === "success") {
      const appName = connected.replace(/-/g, " ");
      alert(`${appName.charAt(0).toUpperCase() + appName.slice(1)} connected!`);
      window.history.replaceState({}, "", "/account");
      loadConnectedApps();
    }
  };

  const initializePage = async () => {
    if (!localStorage.getItem("authToken")) {
      window.location.href = "/login";
      return;
    }
    setLoading(true);
    await Promise.all([loadProfile(), loadConnectedApps()]);
    handleOAuthRedirect();
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      if (!localStorage.getItem("authToken")) {
        window.location.href = "/login";
        return;
      }

      // Start loading
      setLoading(true);

      try {
        await Promise.all([loadProfile(), loadConnectedApps()]);
        handleOAuthRedirect();
      } catch (err) {
        console.error("Initialization failed:", err);
      } finally {
        setLoading(false); // Always stop loading
      }
    };

    init();
  }, []); // Empty deps = run once

  const handleConnect = async (app: string) => {
    if (["googleDrive", "gmail", "googleCalendar"].includes(app)) {
      setPendingApp(app);
      setShowDialog(true);
    } else {
      await connectApp(app);
    }
  };

  const connectApp = async (app: string) => {
    const backendKey = UI_TO_BACKEND[app];
    const res = await fetchWithAuth(`/connected-apps/${backendKey}/connect`, {
      method: "POST",
    });
    const data = await res.json();
    if (data.authUrl) window.location.href = data.authUrl;
  };

  const disconnectApp = async (app: string) => {
    if (!confirm(`Disconnect ${app}?`)) return;
    const backendKey = UI_TO_BACKEND[app];
    await fetchWithAuth(`/connected-apps/${backendKey}/disconnect`, {
      method: "POST",
    });
    loadConnectedApps();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-lg font-medium">Loading your account...</p>
      </div>
    );
  }

  const plan = profile?.subscriptionPlan || "starter";
  const displayPlan =
    plan === "starter" ? "Free" : plan.charAt(0).toUpperCase() + plan.slice(1);

  return (
    <>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-left mb-12">
          <h1 className="text-3xl font-semibold text-gray-900">Account</h1>
          <p className="text-gray-500 mt-2">
            Manage your Slesh account preferences and privacy settings
          </p>
        </div>

        {/* Current Plan */}
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">Current Plan</h2>
          <div className="bg-white rounded-xl p-6 mb-5 border border-blue-200">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xl font-semibold text-blue-600">
                  {displayPlan}
                </div>
                <div className="text-sm text-gray-500">
                  {plan === "starter"
                    ? "No billing required"
                    : "Billing active"}
                </div>
              </div>
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                Active
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              "total_tokens",
              "pdf_counter",
              "video_counter",
              "automations_counter",
            ].map((key) => {
              const used = profile?.usage?.[key] || 0;
              const limit =
                profile?.limits?.[key] === -1
                  ? "∞"
                  : (profile?.limits?.[key] || 0).toLocaleString();
              const label =
                key === "total_tokens"
                  ? "Tokens"
                  : key
                      .replace("_counter", "s")
                      .replace("pdf", "PDF")
                      .replace("video", "Video");
              return (
                <div
                  key={key}
                  className="bg-blue-50 border border-blue-100 rounded-xl p-4"
                >
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    {label}
                  </div>
                  <div className="text-lg font-semibold text-blue-600">
                    {used.toLocaleString()} / {limit}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            {plan === "starter" ? (
              <button
                onClick={() => (window.location.href = "/pricing")}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                Upgrade Plan
              </button>
            ) : (
              <button
                onClick={async () => {
                  const res = await fetchWithAuth(
                    "/stripe/dashboard/create-portal-session",
                    { method: "POST" }
                  );
                  const data = await res.json();
                  window.open(data.url, "_blank");
                }}
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50"
              >
                Manage Subscription
              </button>
            )}
          </div>
        </div>

        {/* Connected Apps */}
        <div className="bg-white border rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-2">Connected Apps</h2>
          <p className="text-gray-500 mb-6">
            Connect your favorite apps to enhance your Slesh experience
          </p>
          <div className="space-y-4">
            <ConnectedApp
              name="googleDrive"
              icon="/gdrive-icon.png"
              title="Google Drive"
              description="Access and edit your Google Drive files"
              connection={connectedApps.find(
                (a) => a.app_name === "google_drive"
              )}
              onConnect={() => handleConnect("googleDrive")}
              onDisconnect={() => disconnectApp("googleDrive")}
            />
            <ConnectedApp
              name="gmail"
              icon="/gmail-icon.png"
              title="Gmail"
              description="Read, send, and manage your Gmail messages"
              connection={connectedApps.find((a) => a.app_name === "gmail")}
              onConnect={() => handleConnect("gmail")}
              onDisconnect={() => disconnectApp("gmail")}
            />
            <ConnectedApp
              name="googleCalendar"
              icon="/gcalendar-icon.png"
              title="Google Calendar"
              description="View and manage your calendar events"
              connection={connectedApps.find(
                (a) => a.app_name === "google_calendar"
              )}
              onConnect={() => handleConnect("googleCalendar")}
              onDisconnect={() => disconnectApp("googleCalendar")}
            />
            <ConnectedApp
              name="x"
              icon={`<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#000"/></svg>`}
              title="X"
              description="Verify your X account for @SleshGo interactions"
              connection={connectedApps.find((a) => a.app_name === "x")}
              onConnect={() => connectApp("x")}
              onDisconnect={() => disconnectApp("x")}
            />
          </div>
        </div>

        {/* Privacy & Danger Zone */}
        <div className="space-y-6">
          <div className="bg-white border rounded-2xl p-6">
            <h2 className="text-xl font-semibold mb-4">Privacy</h2>
            <div className="flex items-center justify-between p-5 border-b">
              <div>
                <div className="font-medium">Allow Usage Data Collection</div>
                <div className="text-sm text-gray-500">
                  Improves service. Disabling deletes conversations.
                </div>
              </div>
              <div className="w-14 h-8 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform" />
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Data Management
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-5 bg-red-100 rounded-xl">
                <div>
                  <h3 className="font-semibold text-red-600">Clear All Data</h3>
                  <p className="text-sm text-gray-600">
                    Clear all conversations
                  </p>
                </div>
                <button
                  onClick={() =>
                    confirm("Clear all data?") && alert("Cleared!")
                  }
                  className="px-5 py-2 border border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white"
                >
                  Clear All
                </button>
              </div>
              <div className="flex justify-between items-center p-5 bg-red-100 rounded-xl">
                <div>
                  <h3 className="font-semibold text-red-600">Delete Account</h3>
                  <p className="text-sm text-gray-600">
                    Permanently delete your account
                  </p>
                </div>
                <button
                  onClick={() =>
                    confirm("Delete account?") && alert("Deletion initiated!")
                  }
                  className="px-5 py-2 border border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-2xl p-6">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">Sign Out</div>
                <div className="text-sm text-gray-500">
                  Sign out of your current session
                </div>
              </div>
              <button
                onClick={() => confirm("Sign out?") && signOut()}
                className="px-5 py-2 border border-red-500 text-red-500 rounded-xl hover:bg-red-500 hover:text-white"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      <GoogleWarningDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onProceed={() => {
          if (pendingApp) connectApp(pendingApp);
          setShowDialog(false);
        }}
      />
    </>
  );
}
