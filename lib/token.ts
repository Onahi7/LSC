import crypto from "crypto";
import { prisma } from "./prisma";
import { sign, verify } from "jsonwebtoken";

const TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface TokenPayload {
  userId: string;
  email: string;
  type: "verification" | "passwordReset";
}

export async function generateVerificationToken(userId: string, email: string) {
  // First, delete any existing verification tokens for this user
  await prisma.verificationToken.deleteMany({
    where: {
      userId,
    },
  });

  // Create a new token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + TOKEN_EXPIRY);

  // Save token to database
  await prisma.verificationToken.create({
    data: {
      token,
      expires,
      userId,
    },
  });

  return token;
}

export async function generatePasswordResetToken(userId: string, email: string) {
  // First, delete any existing reset tokens for this user
  await prisma.passwordResetToken.deleteMany({
    where: {
      userId,
    },
  });

  // Create a new token
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + TOKEN_EXPIRY);

  // Save token to database
  await prisma.passwordResetToken.create({
    data: {
      token,
      expires,
      userId,
    },
  });

  return token;
}

export async function verifyVerificationToken(token: string) {
  const verificationToken = await prisma.verificationToken.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });

  if (!verificationToken) {
    return null;
  }

  if (new Date() > verificationToken.expires) {
    // Token has expired - delete it
    await prisma.verificationToken.delete({
      where: {
        id: verificationToken.id,
      },
    });
    return null;
  }

  return verificationToken.user;
}

export async function verifyPasswordResetToken(token: string) {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });

  if (!resetToken) {
    return null;
  }

  if (new Date() > resetToken.expires) {
    // Token has expired - delete it
    await prisma.passwordResetToken.delete({
      where: {
        id: resetToken.id,
      },
    });
    return null;
  }

  return resetToken.user;
}

// JWT-based tokens (alternative approach)
export function createJWT(payload: TokenPayload) {
  return sign(payload, process.env.JWT_SECRET!, { expiresIn: "24h" });
}

export function verifyJWT(token: string): TokenPayload | null {
  try {
    return verify(token, process.env.JWT_SECRET!) as TokenPayload;
  } catch (error) {
    return null;
  }
}
