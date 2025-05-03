import { DefaultSession, DefaultUser } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
    expires: string
    error?: string
  }
  
  interface User extends DefaultUser {
    role: string
    emailVerified?: Date
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    accessTokenExpires?: number
    refreshTokenExpires?: number
    error?: string
  }
}
