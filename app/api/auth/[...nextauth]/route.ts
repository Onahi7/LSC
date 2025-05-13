import NextAuth from "next-auth"
import { type NextAuthConfig } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { type Prisma, type User } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
      email: string
      name?: string | null
      image?: string | null
    }
    expires: string
    error?: string
  }
  
  interface JWT {
    id: string
    role: string
    accessTokenExpires?: number
    refreshTokenExpires?: number
    error?: string
  }

  interface User extends Omit<Prisma.UserGetPayload<{}>, 'emailVerified'> {
    emailVerified?: Date | null;
  }
}

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-default-secret-please-change-in-production",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role as string;
        token.id = user.id as string;
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        token.refreshTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
      }
      
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }
      
      if (token.refreshTokenExpires && Date.now() < token.refreshTokenExpires) {
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
        console.log("Token refreshed at", new Date().toISOString());
        return token;
      }
      
      return { ...token, error: "RefreshTokenExpired" };
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
        session.user.id = token.id;
        
        if (token.accessTokenExpires) {
          Object.assign(session, { expires: new Date(token.accessTokenExpires).toISOString() });
        }
        
        if (token.error) {
          session.error = token.error;
        }
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        try {
          const creds = credentials as { email: string; password: string } | undefined;
          
          if (!creds?.email || !creds?.password) {
            throw new Error('Invalid credentials');
          }

          const user = await prisma.user.findUnique({
            where: {
              email: creds.email
            }
          });

          if (!user || !user.password) {
            throw new Error('Invalid credentials');
          }

          const isCorrectPassword = await bcrypt.compare(
            creds.password,
            user.password
          );

          if (!isCorrectPassword) {
            throw new Error('Invalid credentials');
          }

          return {
            ...user,
            emailVerified: user.emailVerified || null
          };
        } catch (error) {
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
};

// Initialize NextAuth and extract both route handlers and the auth helper
const { handlers, auth } = NextAuth(authConfig);
export const GET = handlers.GET;
export const POST = handlers.POST;
// Export auth() for session retrieval in other route handlers or server components
export { auth };
