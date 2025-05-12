import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { randomUUID } from "crypto";
import { sendVerificationEmail } from "@/lib/email";

// Check if user has admin access
async function isAdmin(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token) {
    return false;
  }
  
  return ["SUPERADMIN", "ADMIN"].includes(token.role as string);
}

// POST /api/admin/users/send-verification - Send verification email to user
export async function POST(request: NextRequest) {
  try {
    // Check if user has admin access
    if (!(await isAdmin(request))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const json = await request.json();
    
    // Validate request body
    const schema = z.object({
      userId: z.string(),
    });
    
    const { userId } = schema.parse(json);
    
    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, emailVerified: true },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // If already verified, no need to send another email
    if (user.emailVerified) {
      return NextResponse.json(
        { message: "User is already verified" }
      );
    }
    
    // Delete any existing verification tokens for this user
    await prisma.verificationToken.deleteMany({
      where: { userId: user.id },
    });
    
    // Create a new verification token
    const token = randomUUID();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    
    await prisma.verificationToken.create({
      data: {
        token,
        expires,
        userId: user.id,
      },
    });
    
    // Send verification email
    await sendVerificationEmail({
      email: user.email,
      name: user.name || user.email,
      token,
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues },
        { status: 400 }
      );
    }
    
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
