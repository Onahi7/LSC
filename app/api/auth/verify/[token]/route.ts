import { NextRequest, NextResponse } from "next/server";
import { verifyVerificationToken } from "@/lib/token";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const token = params.token;
    
    // Verify the token
    const user = await verifyVerificationToken(token);
    
    if (!user) {
      return NextResponse.redirect(
        new URL("/auth/error?error=Invalid or expired verification link", request.url)
      );
    }
    
    // Mark the user's email as verified
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        emailVerified: new Date(),
      },
    });
    
    // Delete the verification token
    await prisma.verificationToken.deleteMany({
      where: {
        userId: user.id,
      },
    });
    
    // Redirect to success page
    return NextResponse.redirect(
      new URL("/auth/verify-success", request.url)
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.redirect(
      new URL("/auth/error?error=Something went wrong", request.url)
    );
  }
}
