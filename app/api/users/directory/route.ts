import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authConfig);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get users with public profiles or members-only profiles (since the requester is a member)
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { privacySettings: { path: ["profileVisibility"], equals: "public" } },
          { privacySettings: { path: ["profileVisibility"], equals: "members" } },
          // If user has no privacy settings, show them by default
          { privacySettings: null },
          // Always include the current user
          { id: session.user.id },
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        bio: true,
        occupation: true,
        privacySettings: true,
      },
      orderBy: [
        // Order by role importance
        {
          role: "asc",
        },
        // Then by name
        {
          name: "asc",
        }
      ],
    });
    
    // Filter out email if privacy settings don't allow
    const processedUsers = users.map(user => {
      const privacySettings = user.privacySettings as any;
      
      return {
        ...user,
        email: privacySettings?.showEmail === false ? null : user.email,
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
