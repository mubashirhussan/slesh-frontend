// app/account/components/ConnectedApp.tsx
"use client";

import { ALL_SCOPES, AppKey, PERMISSION_MAPPINGS } from "@/lib/constant";
// import { ALL_SCOPES, PERMISSION_MAPPINGS, type AppKey } from "@/lib/constants";
import Image from "next/image";

interface App {
  app_name: AppKey;
  connection_status: "active" | "expired" | "error";
  scopes: string[];
  provider_user_email?: string;
}

interface ConnectedAppProps {
  name: "googleDrive" | "gmail" | "googleCalendar" | "x";
  icon: string;
  title: string;
  description: string;
  connection?: App;
  onConnect: () => void;
  onDisconnect: () => void;
}

const UI_TO_BACKEND: Record<ConnectedAppProps["name"], AppKey> = {
  googleDrive: "google_drive",
  gmail: "gmail",
  googleCalendar: "google_calendar",
  x: "x",
};

export default function ConnectedApp({
  name,
  icon,
  title,
  description,
  connection,
  onConnect,
  onDisconnect,
}: ConnectedAppProps) {
  const appKey = UI_TO_BACKEND[name];
  const isConnected = connection?.connection_status === "active";
  const scopes = connection?.scopes || [];
  const allScopes = ALL_SCOPES[appKey] || [];
  const hasAllScopes = allScopes.every((s) => scopes.includes(s));
  const isPartial = isConnected && !hasAllScopes;

  const status = isConnected
    ? hasAllScopes
      ? "connected"
      : "partial"
    : "disconnected";
  const statusText = isConnected
    ? hasAllScopes
      ? "Connected"
      : "Partially Connected"
    : "Not Connected";

  return (
    <div
      className={`flex items-center justify-between p-5 bg-white border rounded-xl transition-all ${
        status === "disconnected" ? "border-gray-200" : "border-blue-200"
      } hover:border-blue-300`}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
          {icon.startsWith("/") ? (
            <Image src={icon} alt={title} width={24} height={24} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: icon }} />
          )}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div
          className={`flex items-center gap-2 ${
            isPartial || (isConnected && hasAllScopes) ? "group relative" : ""
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              status === "connected"
                ? "bg-green-500"
                : status === "partial"
                ? "bg-yellow-500"
                : "bg-gray-400"
            }`}
          />
          <span className="text-sm font-medium text-gray-900">
            {statusText}
          </span>

          {(isPartial || (isConnected && hasAllScopes)) && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 w-80">
              <div className="bg-gray-900 text-white p-4 rounded-xl text-xs">
                <div className="font-semibold mb-2">{title} Permissions</div>
                <ul className="space-y-2">
                  {allScopes.map((scope) => {
                    const granted = scopes.includes(scope);
                    const perm = PERMISSION_MAPPINGS[appKey]?.[scope];
                    if (!perm) return null;

                    const displayName =
                      name === "x" &&
                      scope === "users.read" &&
                      connection?.provider_user_email
                        ? `Account Verification for @${connection.provider_user_email}`
                        : perm.name;

                    return (
                      <li key={scope} className="flex items-start gap-2">
                        <span
                          className={`w-4 h-4 rounded text-xs flex items-center justify-center ${
                            granted ? "bg-green-500" : "bg-red-500"
                          } text-white`}
                        >
                          {granted ? "✓" : "✗"}
                        </span>
                        <div>
                          <div className="font-medium">{displayName}</div>
                          {perm.description && (
                            <div className="text-gray-300 text-xs">
                              {perm.description}
                            </div>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="w-3 h-3 bg-gray-900 rotate-45 absolute top-full left-1/2 -translate-x-1/2 -mt-1" />
            </div>
          )}
        </div>

        <button
          onClick={isConnected ? onDisconnect : onConnect}
          className={`px-5 py-2 rounded-xl font-medium text-sm transition-all ${
            isConnected
              ? "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isConnected ? "Disconnect" : "Connect"}
        </button>
      </div>
    </div>
  );
}
