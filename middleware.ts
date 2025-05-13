import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export default async function middleware(req: NextRequest) {
    const token = await getToken({ req })
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth")

    // Check if token has a refresh error
    const hasRefreshError = token?.error === "RefreshTokenExpired"
    
    // If token has refresh error, force sign in
    if (hasRefreshError) {
      return NextResponse.redirect(
        new URL(`/auth/signin?error=session_expired`, req.url)
      )
    }

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
      return null
    }

    if (!isAuth) {
      let from = req.nextUrl.pathname
      if (req.nextUrl.search) {
        from += req.nextUrl.search
      }

      return NextResponse.redirect(
        new URL(`/auth/signin?from=${encodeURIComponent(from)}`, req.url)
      )
    }    // Role-based access control
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (token?.role !== "SUPERADMIN" && token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    if (req.nextUrl.pathname.startsWith("/pastor")) {
      if (token?.role !== "PASTOR" && token?.role !== "SUPERADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    if (req.nextUrl.pathname.startsWith("/leader")) {
      if (!["LEADER", "PASTOR", "ADMIN", "SUPERADMIN"].includes(token?.role as string)) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }
    
    // Protect API routes with role-based access
    if (req.nextUrl.pathname.startsWith("/api/admin")) {
      if (token?.role !== "SUPERADMIN" && token?.role !== "ADMIN") {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        })
      }
    }
    
    if (req.nextUrl.pathname.startsWith("/api/finance")) {
      if (!["SUPERADMIN", "ADMIN", "PASTOR"].includes(token?.role as string)) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        })
      }
    }
    
    // Protected content management routes
    if (req.nextUrl.pathname.match(/\/api\/(sermons|devotionals|announcements)\/(create|edit|delete)/)) {
      if (!["SUPERADMIN", "ADMIN", "PASTOR"].includes(token?.role as string)) {
        return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "Content-Type": "application/json" }
        })
      }
    }
}

// Protect these routes with authentication
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/pastor/:path*",
    "/leader/:path*",
    "/auth/:path*",
    "/api/admin/:path*",
    "/api/finance/:path*",
    "/api/sermons/(create|edit|delete)/:path*",
    "/api/devotionals/(create|edit|delete)/:path*",
    "/api/announcements/(create|edit|delete)/:path*",
    "/api/members/:path*",
    "/api/departments/:path*",
  ],
}
