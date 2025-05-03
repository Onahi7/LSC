import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generatePasswordResetToken } from "@/lib/token";
import { sendEmail, createPasswordResetHtml } from "@/lib/mail";
import { z } from "zod";

const resetRequestSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const body = resetRequestSchema.parse(json);
    
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    
    // Always return success even if user not found (security best practice)
    if (!user) {
      return NextResponse.json({ success: true });
    }
    
    // Generate a password reset token
    const token = await generatePasswordResetToken(user.id, user.email);
    
    // Create reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password/${token}`;
    
    // Send password reset email
    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: createPasswordResetHtml(user.name || "", resetUrl),
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    
    console.error("Error sending password reset email:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
