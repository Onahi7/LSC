import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

// GET - Retrieve all devotionals with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse pagination parameters
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "9")
    const skip = (page - 1) * limit
    
    // Parse filter parameters
    const search = searchParams.get("search") || ""
    const authorId = searchParams.get("author") || undefined
    const tag = searchParams.get("tag") || undefined
    const featured = searchParams.get("featured") === "true"
    
    // Build the where clause for filtering
    const where: any = {
      status: "PUBLISHED",
    }
    
    // Add search functionality
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { scripture: { contains: search, mode: "insensitive" } },
      ]
    }
    
    // Apply other filters
    if (authorId) {
      where.authorId = authorId
    }
    
    if (tag) {
      where.tags = { has: tag }
    }
    
    if (featured) {
      where.featured = true
    }
    
    // Get devotionals with pagination
    const [devotionals, total] = await Promise.all([
      prisma.devotional.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      }),
      prisma.devotional.count({ where }),
    ])
    
    return NextResponse.json({
      devotionals,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit
      }
    })
  } catch (error) {
    console.error("Error fetching devotionals:", error)
    return NextResponse.json(
      { error: "Failed to fetch devotionals" },
      { status: 500 }
    )
  }
}

// POST - Create a new devotional
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Get the user ID from the session
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    })
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }
    
    // Parse the request body
    const body = await request.json()
    
    // Validate required fields
    if (!body.title || !body.content || !body.scripture) {
      return NextResponse.json(
        { error: "Missing required fields: title, content, and scripture are required" },
        { status: 400 }
      )
    }
    
    // Auto-publish if status is PUBLISHED and no publishedAt date
    let publishedAt = body.publishedAt || null
    if (body.status === "PUBLISHED" && !publishedAt) {
      publishedAt = new Date()
    }
    
    // Create the devotional
    const devotional = await prisma.devotional.create({
      data: {
        title: body.title,
        content: body.content,
        scripture: body.scripture,
        tags: body.tags || [],
        image: body.image,
        featured: body.featured || false,
        status: body.status || "DRAFT",
        publishedAt,
        authorId: user.id,
      },
    })
    
    return NextResponse.json(devotional, { status: 201 })
  } catch (error) {
    console.error("Error creating devotional:", error)
    return NextResponse.json(
      { error: "Failed to create devotional" },
      { status: 500 }
    )
  }
}
