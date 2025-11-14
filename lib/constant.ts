// lib/constants.ts
export const API_ENDPOINT = "https://api.slesh.ai";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Define app keys
export type AppKey = "google_drive" | "gmail" | "google_calendar" | "x";

export const ALL_SCOPES: Record<AppKey, string[]> = {
  google_drive: [
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/drive.file",
    "https://www.googleapis.com/auth/documents",
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/presentations",
  ],
  gmail: [
    "https://www.googleapis.com/auth/gmail.readonly",
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.modify",
  ],
  google_calendar: [
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar.freebusy",
  ],
  x: ["users.read"],
};

export const PERMISSION_MAPPINGS: Record<
  AppKey,
  Record<string, { name: string; description: string }>
> = {
  google_drive: {
    "https://www.googleapis.com/auth/drive": {
      name: "Full Drive Access",
      description: "View, edit, create, and delete all files",
    },
    "https://www.googleapis.com/auth/drive.file": {
      name: "Create/Edit Files",
      description: "Create and edit files",
    },
    "https://www.googleapis.com/auth/documents": {
      name: "Google Docs",
      description: "Access and edit Google Docs",
    },
    "https://www.googleapis.com/auth/spreadsheets": {
      name: "Google Sheets",
      description: "Access and edit Google Sheets",
    },
    "https://www.googleapis.com/auth/presentations": {
      name: "Google Slides",
      description: "Access and edit Google Slides",
    },
  },
  gmail: {
    "https://www.googleapis.com/auth/gmail.readonly": {
      name: "Read Messages",
      description: "View your Gmail messages",
    },
    "https://www.googleapis.com/auth/gmail.send": {
      name: "Send Messages",
      description: "Send emails on your behalf",
    },
    "https://www.googleapis.com/auth/gmail.modify": {
      name: "Modify Messages",
      description: "Mark messages as read, delete, or organize",
    },
  },
  google_calendar: {
    "https://www.googleapis.com/auth/calendar": {
      name: "Full Calendar Access",
      description: "View and manage all your calendars",
    },
    "https://www.googleapis.com/auth/calendar.events": {
      name: "Manage Events",
      description: "Create, edit, and delete calendar events",
    },
    "https://www.googleapis.com/auth/calendar.freebusy": {
      name: "Availability",
      description: "View your availability",
    },
  },
  x: {
    "users.read": {
      name: "Account Verification",
      description: "Verify you own this X account for @SleshGo interactions",
    },
  },
};
