/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import { fetchWithAuth, signOut } from "@/lib/auth";
import { AppKey } from "@/lib/constant";
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
  const [usageToggleEnabled, setUsageToggleEnabled] = useState(true);

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
      alert(
        `${appName.charAt(0).toUpperCase() + appName.slice(1)} connected!`
      );
      window.history.replaceState({}, "", "/account");
      loadConnectedApps();
    }
  };

  useEffect(() => {
    const init = async () => {
      if (!localStorage.getItem("authToken")) {
        window.location.href = "/login";
        return;
      }

      setLoading(true);
      try {
        await Promise.all([loadProfile(), loadConnectedApps()]);
        handleOAuthRedirect();
      } catch (err) {
        console.error("Initialization failed:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

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

  const getAppConnection = (appName: string) => {
    const backendKey = UI_TO_BACKEND[appName];
    return connectedApps.find((a) => a.app_name === backendKey);
  };

  const getAppStatus = (appName: string) => {
    const connection = getAppConnection(appName);
    if (!connection || connection.connection_status !== "active") {
      return { status: "disconnected", text: "Not Connected" };
    }
    // Simplified status check - you can enhance this with scope checking
    return { status: "connected", text: "Connected" };
  };

  const plan = profile?.subscriptionPlan || "starter";
  const displayPlan =
    plan === "starter" ? "Free" : plan.charAt(0).toUpperCase() + plan.slice(1);
  const planStatus = plan === "starter" ? "No billing required" : "Billing active";

  const usage = profile?.usage || {};
  const limits = profile?.limits || {};

  const formatUsage = (key: string) => {
    const used = usage[key] || 0;
    const limit =
      limits[key] === -1 ? "∞" : (limits[key] || 0).toLocaleString();
    return `${used.toLocaleString()} / ${limit}`;
  };

  if (loading) {
    return (
      <div className="settings-wrapper">
        <div className="settings-container">
          <div className="loading-container" id="loadingContainer">
            <div className="loading-spinner"></div>
            <div className="loading-text">Loading your account...</div>
            <div className="loading-subtext">
              Please wait while we fetch your account information
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="settings-wrapper">
        <div className="settings-container">
          <div id="mainContent">
            {/* Header */}
            <div className="settings-header">
              <h1 className="settings-title">Account</h1>
              <p className="settings-subtitle">
                Manage your Slesh account preferences and privacy settings
              </p>
            </div>

            {/* Current Plan Section */}
            <div className="settings-section plan-section">
              <h2 className="section-title">Current Plan</h2>
              <p className="section-description">
                View your subscription details and usage statistics
              </p>

              <div className="current-plan">
                <div className="plan-info">
                  <div className="plan-name" id="plan-name-display">
                    {displayPlan}
                  </div>
                  <div className="plan-status" id="plan-status-display">
                    {planStatus}
                  </div>
                </div>
                <div className="plan-badge" id="plan-badge-display">
                  Active
                </div>
              </div>

              <div className="usage-stats" id="usage-stats">
                <div className="usage-item">
                  <div className="usage-label">Tokens Usage</div>
                  <div className="usage-value" id="usage-api">
                    {formatUsage("total_tokens")}
                  </div>
                </div>
                <div className="usage-item">
                  <div className="usage-label">PDFs Analyzed</div>
                  <div className="usage-value" id="usage-pdfs">
                    {formatUsage("pdf_counter")}
                  </div>
                </div>
                <div className="usage-item">
                  <div className="usage-label">Videos Processed</div>
                  <div className="usage-value" id="usage-videos">
                    {formatUsage("video_counter")}
                  </div>
                </div>
                <div className="usage-item">
                  <div className="usage-label">Automations Run</div>
                  <div className="usage-value" id="usage-automations">
                    {formatUsage("automations_counter")}
                  </div>
                </div>
              </div>

              <div className="plan-actions">
                {plan === "starter" ? (
                  <button
                    className="plan-button primary"
                    id="upgradePlanBtn"
                    onClick={() => (window.location.href = "/pricing")}
                  >
                    Upgrade Plan
                  </button>
                ) : (
                  <button
                    className="plan-button secondary"
                    id="manageSubscriptionBtn"
                    onClick={async () => {
                      const res = await fetchWithAuth(
                        "/stripe/dashboard/create-portal-session",
                        { method: "POST" }
                      );
                      const data = await res.json();
                      window.open(data.url, "_blank");
                    }}
                  >
                    Manage Subscription
                  </button>
                )}
              </div>
            </div>

            {/* Connected Apps Section */}
            <div className="settings-section">
              <h2 className="section-title">Connected Apps</h2>
              <p className="section-description">
                Connect your favorite apps to enhance your Slesh experience
              </p>

              <div className="connected-apps-grid" id="connectedAppsGrid">
                {/* Google Drive */}
                <div className="connected-app-item" id="googleDriveApp">
                  <div className="app-info">
                    <div className="app-icon">
                      <img
                        src="/gdrive-icon.png"
                        alt="Google Drive"
                        width="24"
                        height="24"
                        style={{
                          objectFit: "contain",
                          objectPosition: "center",
                        }}
                      />
                    </div>
                    <div className="app-details">
                      <div className="app-name">Google Drive</div>
                      <div className="app-description">
                        Access and edit your Google Drive files
                      </div>
                    </div>
                  </div>
                  <div className="app-status">
                    <div
                      className={`connection-status ${
                        getAppStatus("googleDrive").status === "connected"
                          ? "permission-tooltip connected"
                          : ""
                      }`}
                      id="googleDriveStatus"
                    >
                      <span
                        className={`status-indicator ${
                          getAppStatus("googleDrive").status
                        }`}
                      ></span>
                      <span className="status-text">
                        {getAppStatus("googleDrive").text}
                      </span>
                      <div className="tooltip-content" id="googleDriveTooltip">
                        <div className="permission-section">
                          <div className="permission-title">
                            Google Drive Permissions
                          </div>
                          <ul className="permission-list" id="googleDrivePermissions"></ul>
                        </div>
                      </div>
                    </div>
                    <div className="button-group" id="googleDriveButtonGroup">
                      <button
                        className="connect-button"
                        id="googleDriveConnectBtn"
                        onClick={() => {
                          const status = getAppStatus("googleDrive");
                          if (status.status === "connected") {
                            disconnectApp("googleDrive");
                          } else {
                            handleConnect("googleDrive");
                          }
                        }}
                      >
                        {getAppStatus("googleDrive").status === "connected"
                          ? "Disconnect"
                          : "Connect"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Gmail */}
                <div className="connected-app-item" id="gmailApp">
                  <div className="app-info">
                    <div className="app-icon">
                      <img
                        src="/gmail-icon.png"
                        alt="Gmail"
                        width="24"
                        height="24"
                        style={{
                          objectFit: "contain",
                          objectPosition: "center",
                        }}
                      />
                    </div>
                    <div className="app-details">
                      <div className="app-name">Gmail</div>
                      <div className="app-description">
                        Read, send, and manage your Gmail messages
                      </div>
                    </div>
                  </div>
                  <div className="app-status">
                    <div
                      className={`connection-status ${
                        getAppStatus("gmail").status === "connected"
                          ? "permission-tooltip connected"
                          : ""
                      }`}
                      id="gmailStatus"
                    >
                      <span
                        className={`status-indicator ${getAppStatus("gmail").status}`}
                      ></span>
                      <span className="status-text">
                        {getAppStatus("gmail").text}
                      </span>
                      <div className="tooltip-content" id="gmailTooltip">
                        <div className="permission-section">
                          <div className="permission-title">Gmail Permissions</div>
                          <ul className="permission-list" id="gmailPermissions"></ul>
                        </div>
                      </div>
                    </div>
                    <div className="button-group" id="gmailButtonGroup">
                      <button
                        className="connect-button"
                        id="gmailConnectBtn"
                        onClick={() => {
                          const status = getAppStatus("gmail");
                          if (status.status === "connected") {
                            disconnectApp("gmail");
                          } else {
                            handleConnect("gmail");
                          }
                        }}
                      >
                        {getAppStatus("gmail").status === "connected"
                          ? "Disconnect"
                          : "Connect"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Google Calendar */}
                <div className="connected-app-item" id="googleCalendarApp">
                  <div className="app-info">
                    <div className="app-icon">
                      <img
                        src="/gcalendar-icon.png"
                        alt="Google Calendar"
                        width="24"
                        height="24"
                      />
                    </div>
                    <div className="app-details">
                      <div className="app-name">Google Calendar</div>
                      <div className="app-description">
                        View and manage your calendar events
                      </div>
                    </div>
                  </div>
                  <div className="app-status">
                    <div
                      className={`connection-status ${
                        getAppStatus("googleCalendar").status === "connected"
                          ? "permission-tooltip connected"
                          : ""
                      }`}
                      id="googleCalendarStatus"
                    >
                      <span
                        className={`status-indicator ${getAppStatus("googleCalendar").status}`}
                      ></span>
                      <span className="status-text">
                        {getAppStatus("googleCalendar").text}
                      </span>
                      <div
                        className="tooltip-content"
                        id="googleCalendarTooltip"
                      >
                        <div className="permission-section">
                          <div className="permission-title">
                            Google Calendar Permissions
                          </div>
                          <ul
                            className="permission-list"
                            id="googleCalendarPermissions"
                          ></ul>
                        </div>
                      </div>
                    </div>
                    <div
                      className="button-group"
                      id="googleCalendarButtonGroup"
                    >
                      <button
                        className="connect-button"
                        id="googleCalendarConnectBtn"
                        onClick={() => {
                          const status = getAppStatus("googleCalendar");
                          if (status.status === "connected") {
                            disconnectApp("googleCalendar");
                          } else {
                            handleConnect("googleCalendar");
                          }
                        }}
                      >
                        {getAppStatus("googleCalendar").status === "connected"
                          ? "Disconnect"
                          : "Connect"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* X */}
                <div className="connected-app-item" id="xApp">
                  <div className="app-info">
                    <div className="app-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                          fill="#000"
                        />
                      </svg>
                    </div>
                    <div className="app-details">
                      <div className="app-name">X</div>
                      <div className="app-description">
                        Verify your X account for @SleshGo interactions
                      </div>
                    </div>
                  </div>
                  <div className="app-status">
                    <div
                      className={`connection-status ${
                        getAppStatus("x").status === "connected"
                          ? "permission-tooltip connected"
                          : ""
                      }`}
                      id="xStatus"
                    >
                      <span
                        className={`status-indicator ${getAppStatus("x").status}`}
                      ></span>
                      <span className="status-text">
                        {getAppStatus("x").text}
                      </span>
                      <div className="tooltip-content" id="xTooltip">
                        <div className="permission-section">
                          <div className="permission-title">X Permissions</div>
                          <ul className="permission-list" id="xPermissions"></ul>
                        </div>
                      </div>
                    </div>
                    <div className="button-group" id="xButtonGroup">
                      <button
                        className="connect-button"
                        id="xConnectBtn"
                        onClick={() => {
                          const status = getAppStatus("x");
                          if (status.status === "connected") {
                            disconnectApp("x");
                          } else {
                            connectApp("x");
                          }
                        }}
                      >
                        {getAppStatus("x").status === "connected"
                          ? "Disconnect"
                          : "Connect"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Coming Soon */}
                <div className="connected-app-item coming-soon">
                  <div className="app-info">
                    <div className="app-icon">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          stroke="#9a9aa5"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path
                          d="M9 9h6v6H9z"
                          stroke="#9a9aa5"
                          strokeWidth="2"
                          fill="none"
                        />
                      </svg>
                    </div>
                    <div className="app-details">
                      <div className="app-name">More Apps Coming Soon</div>
                      <div className="app-description">
                        Dropbox, Notion, and your favorite apps
                      </div>
                    </div>
                  </div>
                  <div className="app-status">
                    <div className="connection-status">
                      <span className="status-indicator coming-soon"></span>
                      <span className="status-text">Coming Soon</span>
                    </div>
                    <button className="connect-button disabled" disabled>
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Settings Section */}
            <div className="settings-section">
              <h2 className="section-title">Privacy</h2>

              <div className="setting-item">
                <div className="setting-content">
                  <div className="setting-label">Allow Usage Data Collection</div>
                  <div className="setting-text">
                    Allow Slesh to collect usage data to improve the service.
                    Disabling this will delete all your existing conversations.
                  </div>
                </div>
                <div
                  className={`toggle-switch ${!usageToggleEnabled ? "disabled" : ""}`}
                  id="usageToggle"
                  onClick={() => setUsageToggleEnabled(!usageToggleEnabled)}
                ></div>
              </div>
            </div>

            {/* Data Management Section */}
            <div className="settings-section danger-section">
              <h2 className="section-title">Data Management</h2>
              <p className="section-description">
                Manage your account data and conversation history
              </p>

              <div className="danger-item">
                <div className="danger-content">
                  <h3>Clear All Data</h3>
                  <p>Clear all conversations</p>
                </div>
                <button
                  className="danger-button"
                  id="clearDataBtn"
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to clear all your conversations? This action cannot be undone."
                      )
                    ) {
                      alert("All conversations have been cleared.");
                    }
                  }}
                >
                  Clear All
                </button>
              </div>

              <div className="danger-item">
                <div className="danger-content">
                  <h3>Delete Account</h3>
                  <p>Permanently delete your account</p>
                </div>
                <button
                  className="danger-button"
                  id="deleteAccountBtn"
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data."
                      )
                    ) {
                      alert(
                        "Account deletion initiated. You will receive a confirmation email."
                      );
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            {/* Account Section */}
            <div className="settings-section">
              <h2 className="section-title">Account</h2>
              <p className="section-description">
                Manage your account settings and authentication
              </p>

              <div className="setting-item">
                <div className="setting-content">
                  <div className="setting-label">Sign Out</div>
                  <div className="setting-text">
                    Sign out of your current session and return to the home page
                  </div>
                </div>
                <button
                  className="danger-button"
                  id="signOutBtn"
                  onClick={() => {
                    if (
                      confirm(
                        "Are you sure you want to sign out? You will need to sign in again to access your account."
                      )
                    ) {
                      signOut();
                    }
                  }}
                >
                  Sign Out
                </button>
              </div>
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
