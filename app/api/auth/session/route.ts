import { NextRequest, NextResponse } from "next/server"
import { getServerSession as getSession } from "next-auth/next"
import { authConfig } from "../[...nextauth]/route"
import { getToken } from "next-auth/jwt"

export async function GET(req: NextRequest) {  try {
    const session = await getSession(authConfig)
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    
    // Check if token is near expiry (less than 5 minutes left)
    const expiryTimeMs = token?.accessTokenExpires as number
    const timeToExpiry = expiryTimeMs - Date.now()
    const isNearExpiry = timeToExpiry > 0 && timeToExpiry < 5 * 60 * 1000
    
    return NextResponse.json({
      session,
      isNearExpiry,
      expiresAt: new Date(expiryTimeMs).toISOString()
    })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
