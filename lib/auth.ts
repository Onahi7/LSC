import type { NextAuthConfig } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { JWT } from 'next-auth/jwt';
import type { Session, User } from 'next-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Import any other dependencies

export const authOptions: NextAuthConfig = {
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET || 'your-default-secret-please-change-in-production',
  session: {
    strategy: 'jwt'
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
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
  ],  callbacks: {
    async jwt({ token, user }: { token: JWT; user: User | undefined }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      
      // Check token expiry and set refresh token logic if needed
      const nowTime = Math.floor(Date.now() / 1000);
      const accessTokenExpires = nowTime + 60 * 60; // 1 hour
      const refreshTokenExpires = nowTime + 7 * 24 * 60 * 60; // 7 days
      
      token.accessTokenExpires = accessTokenExpires * 1000; // Convert to milliseconds
      token.refreshTokenExpires = refreshTokenExpires * 1000; // Convert to milliseconds
      
      return token;
    },    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        
        if (token.accessTokenExpires) {
          Object.assign(session, { expires: new Date(token.accessTokenExpires).toISOString() });
        }
        
        if (token.error) {
          session.error = token.error;
        }
      }
      return session;
    }
  }
};

export default authOptions;
