import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

// Schema for validating announcement data
const announcementSchema = z.object({
  title: z.string().min(5).max(100),
  content: z.string().min(20),
  image: z.string().optional(),
  startDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  endDate: z.string().optional().transform(val => val ? new Date(val) : undefined),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  priority: z.enum(["LOW", "NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  targetGroups: z.array(z.string()).default([]),
  publishedAt: z.string().optional().transform(val => val ? new Date(val) : undefined),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status")
    const priority = searchParams.get("priority")
    const search = searchParams.get("search")
    const targetGroup = searchParams.get("targetGroup")
    
    const skip = (page - 1) * limit
    
    // Build the query filter
    const filter: any = {}
    
    if (status) {
      filter.status = status
    }
    
    if (priority) {
      filter.priority = priority
    }
    
    if (targetGroup) {
      filter.targetGroups = {
        has: targetGroup
      }
    }
    
    if (search) {
      filter.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } }
      ]
    }
    
    // Fetch announcements with pagination
    const announcements = await prisma.announcement.findMany({
      where: filter,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      skip,
      take: limit,
    })
    
    // Get total count for pagination
    const total = await prisma.announcement.count({
      where: filter
    })
    
    return NextResponse.json({
      announcements,
      pagination: {
        total,
        pageCount: Math.ceil(total / limit),
        page,
        limit
      }
    })
  } catch (error) {
    console.error("Error fetching announcements:", error)
    return NextResponse.json(
      { error: "Failed to fetch announcements" }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      )
    }
    
    // Parse and validate the request body
    const body = await request.json()
    const validatedData = announcementSchema.parse(body)
    
    // Create the announcement
    const announcement = await prisma.announcement.create({
      data: {
        ...validatedData,
        author: {
          connect: {
            id: session.user.id
          }
        }
      }
    })
    
    return NextResponse.json(announcement, { status: 201 })
  } catch (error) {
    console.error("Error creating announcement:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to create announcement" }, 
      { status: 500 }
    )
  }
}
