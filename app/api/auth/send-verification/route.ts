import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { generateVerificationToken } from "@/lib/token";
import { sendEmail, createVerificationHtml } from "@/lib/mail";
import { z } from "zod";

export async function POST(request: NextRequest) {
  try {
    const authToken = await getToken({ req: request });
    
    if (!authToken?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Find the user from the auth token
    const user = await prisma.user.findUnique({
      where: {
        id: authToken.id,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Check if the user's email is already verified
    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }
      // Generate a verification token
    const token = await generateVerificationToken(user.id, user.email);
    
    // Create verification URL
    const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify/${token}`;
    
    // Send verification email
    await sendEmail({
      to: user.email,
      subject: "Verify your email address",
      html: createVerificationHtml(user.name || "", verificationUrl),
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending verification email:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
