import NextAuth from "next-auth"
import { NextAuthConfig } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.role = user.role
        token.id = user.id
        // Set expiry times
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000 // 15 minutes
        token.refreshTokenExpires = Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
      }
      
      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }
      
      // Access token has expired, try to refresh it
      if (Date.now() < (token.refreshTokenExpires as number)) {
        // Here you could implement a refresh token mechanism
        // For this implementation, we'll simply extend the access token
        token.accessTokenExpires = Date.now() + 15 * 60 * 1000 // Extend by 15 minutes
        
        // Log refresh for debugging
        console.log("Token refreshed at", new Date().toISOString())
        
        return token
      }
      
      // Refresh token has also expired, user must sign in again
      return { ...token, error: "RefreshTokenExpired" }
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role
        session.user.id = token.id
        
        // Add access expiry to session
        session.expires = new Date(token.accessTokenExpires as number).toISOString()
        
        // Add error if present
        if (token.error) {
          session.error = token.error
        }
      }
      return session
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user?.password) {
          throw new Error('Invalid credentials')
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isCorrectPassword) {
          throw new Error('Invalid credentials')
        }

        return user
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
}

const handler = NextAuth(authConfig)
export { handler as GET, handler as POST }
