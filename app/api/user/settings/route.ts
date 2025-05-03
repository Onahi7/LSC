import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Define zod schema for settings validation
const notificationPrefsSchema = z.object({
  emailNotifications: z.boolean().default(true),
  inAppNotifications: z.boolean().default(true),
  eventReminders: z.boolean().default(true),
  churchAnnouncements: z.boolean().default(true),
  prayerRequests: z.boolean().default(true),
});

const privacySettingsSchema = z.object({
  profileVisibility: z.enum(["public", "members", "private"]),
  showEmail: z.boolean(),
  showPhone: z.boolean(),
  showBirthday: z.boolean(),
});

const settingsSchema = z.object({
  notificationPrefs: notificationPrefsSchema,
  theme: z.enum(["light", "dark", "system"]),
  privacySettings: privacySettingsSchema,
});

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
      // Get user settings from database
    const user = await prisma.user.findUnique({
      where: {
        id: token.id as string,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
      // Get raw data directly without select to access JSON fields
    const userData = await prisma.$queryRaw`
      SELECT 
        "notificationPrefs",
        "theme",
        "privacySettings"
      FROM "User" 
      WHERE id = ${token.id}
    `;
    
    const userSettings = Array.isArray(userData) ? userData[0] : null;
    
    // Default notification preferences if not set
    const defaultNotificationPrefs = {
      emailNotifications: true,
      inAppNotifications: true,
      eventReminders: true,
      churchAnnouncements: true,
      prayerRequests: true,
    };
      // Default privacy settings if not set
    const defaultPrivacySettings = {
      profileVisibility: "members",
      showEmail: false,
      showPhone: false,
      showBirthday: false,
    };
    
    return NextResponse.json({
      notificationPrefs: userSettings?.notificationPrefs || defaultNotificationPrefs,
      theme: userSettings?.theme || "system",
      privacySettings: userSettings?.privacySettings || defaultPrivacySettings,
    });
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const json = await request.json();
    
    // Validate request body
    const settings = settingsSchema.parse(json);
      // Convert settings to JSON strings for Prisma
    const notificationPrefsJson = JSON.stringify(settings.notificationPrefs);
    const privacySettingsJson = JSON.stringify(settings.privacySettings);
    
    // Update using raw SQL to ensure compatibility with JSON fields
    await prisma.$executeRaw`
      UPDATE "User"
      SET 
        "notificationPrefs" = ${notificationPrefsJson}::jsonb,
        "theme" = ${settings.theme},
        "privacySettings" = ${privacySettingsJson}::jsonb
      WHERE id = ${token.id}
    `;
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues },
        { status: 400 }
      );
    }
    
    console.error("Error updating user settings:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
