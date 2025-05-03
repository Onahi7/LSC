import { NextRequest, NextResponse } from "next/server";
import { verifyVerificationToken } from "@/lib/token";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Get the token from the request URL
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.redirect(new URL("/auth/error?error=missing_token", request.url));
    }

    // Verify the token
    const user = await verifyVerificationToken(token);

    if (!user) {
      return NextResponse.redirect(new URL("/auth/error?error=invalid_token", request.url));
    }

    // Update the user's emailVerified field
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

    // Redirect to verification success page
    return NextResponse.redirect(new URL("/auth/verify-success", request.url));
  } catch (error) {
    console.error("Error verifying email:", error);
    return NextResponse.redirect(new URL("/auth/error?error=unknown", request.url));
  }
}
