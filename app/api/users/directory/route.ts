import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

interface UserWithPrivacy {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  bio: string | null;
  privacySettings: {
    profileVisibility?: string;
    showEmail?: boolean;
    showPhone?: boolean;
    showBirthday?: boolean;
  } | null;
}

export async function GET(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get users directory using raw SQL query to handle JSON fields
    const users = await prisma.$queryRaw<UserWithPrivacy[]>`
      SELECT 
        id, 
        name, 
        email, 
        image, 
        role, 
        bio,
        "privacySettings"
      FROM "User"      WHERE 
        (("privacySettings"->>'profileVisibility')::text = 'public' OR
        ("privacySettings"->>'profileVisibility')::text = 'members' OR
        "privacySettings" IS NULL OR
        id = ${token.id})
      ORDER BY 
        role ASC,
        name ASC
    `;
    
    // Filter out email if privacy settings don't allow
    const processedUsers = users.map(user => {
      return {
        ...user,
        email: user.privacySettings?.showEmail === false ? null : user.email,
        // Remove privacy settings from response
        privacySettings: undefined,
      };
    });
    
    return NextResponse.json(processedUsers);
  } catch (error) {
    console.error("Error fetching directory:", error);
    return NextResponse.json(
      { error: "Failed to fetch directory" },
      { status: 500 }
    );
  }
}
