import { verifyVerificationToken } from "@/lib/token";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    token: string;
  };
}

export default async function VerifyEmailPage({ params }: PageProps) {
  const { token } = params;
  
  try {
    // Verify the token
    const user = await verifyVerificationToken(token);
    
    if (!user) {
      redirect("/auth/error?error=Invalid+or+expired+verification+link");
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
    redirect("/auth/verify-success");
  } catch (error) {
    console.error("Error verifying email:", error);
    redirect("/auth/error?error=Something+went+wrong");
  }
  
  // This should never be reached due to redirects
  return null;
}
