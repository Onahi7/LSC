import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request });
    
    if (!token?.id || !token?.role) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const userId = params.id;
    
    // Get the user with privacy settings
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        bio: true,
        phone: true,
        address: true,
        gender: true,
        dateOfBirth: true,
        occupation: true,
        maritalStatus: true,
        anniversary: true,
        joinedChurchDate: true,
        privacySettings: true,
        emergencyContact: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Parse privacy settings
    const privacySettings = user.privacySettings as any;
    
    // If current user is admin or superadmin, they can see all details
    if (["SUPERADMIN", "ADMIN"].includes(token.role)) {
      return NextResponse.json(user);
    }
    
    // If viewing own profile, return all details
    if (userId === token.id) {
      return NextResponse.json(user);
    }
    
    // Handle privacy settings
    if (privacySettings?.profileVisibility === "private") {
      return NextResponse.json(
        { error: "This profile is private" },
        { status: 403 }
      );
    }
    
    if (privacySettings?.profileVisibility === "members") {
      // Only church members can view this profile
      // We already verified the user is logged in, so they are a member
      
      // Return user with appropriate privacy filters
      return NextResponse.json({
        ...user,
        phone: privacySettings.showPhone ? user.phone : null,
        email: privacySettings.showEmail ? user.email : null,
        dateOfBirth: privacySettings.showBirthday ? user.dateOfBirth : null,
        emergencyContact: null, // Always hide emergency contact
      });
    }
    
    // For public profiles
    return NextResponse.json({
      ...user,
      phone: privacySettings?.showPhone ? user.phone : null,
      email: privacySettings?.showEmail ? user.email : null,
      dateOfBirth: privacySettings?.showBirthday ? user.dateOfBirth : null,
      emergencyContact: null, // Always hide emergency contact
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}
