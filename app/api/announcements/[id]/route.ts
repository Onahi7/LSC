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

// Get a single announcement by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Fetch the announcement with author details
    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    })
    
    if (!announcement) {
      return NextResponse.json(
        { error: "Announcement not found" }, 
        { status: 404 }
      )
    }
    
    return NextResponse.json(announcement)
  } catch (error) {
    console.error("Error fetching announcement:", error)
    return NextResponse.json(
      { error: "Failed to fetch announcement" }, 
      { status: 500 }
    )
  }
}

// Update an existing announcement
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Get the authenticated user
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      )
    }
    
    // Find the announcement
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id },
      select: { authorId: true }
    })
    
    if (!existingAnnouncement) {
      return NextResponse.json(
        { error: "Announcement not found" }, 
        { status: 404 }
      )
    }
    
    // Check if user is the author or has admin privileges
    if (
      existingAnnouncement.authorId !== session.user.id && 
      !["SUPERADMIN", "PASTOR", "ADMIN"].includes(session.user.role)
    ) {
      return NextResponse.json(
        { error: "You don't have permission to update this announcement" }, 
        { status: 403 }
      )
    }
    
    // Parse and validate the request body
    const body = await request.json()
    const validatedData = announcementSchema.parse(body)
    
    // Update the announcement
    const updatedAnnouncement = await prisma.announcement.update({
      where: { id },
      data: validatedData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    })
    
    return NextResponse.json(updatedAnnouncement)
  } catch (error) {
    console.error("Error updating announcement:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to update announcement" }, 
      { status: 500 }
    )
  }
}

// Delete an announcement
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    // Get the authenticated user
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      )
    }
    
    // Find the announcement
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id },
      select: { authorId: true }
    })
    
    if (!existingAnnouncement) {
      return NextResponse.json(
        { error: "Announcement not found" }, 
        { status: 404 }
      )
    }
    
    // Check if user is the author or has admin privileges
    if (
      existingAnnouncement.authorId !== session.user.id && 
      !["SUPERADMIN", "PASTOR", "ADMIN"].includes(session.user.role)
    ) {
      return NextResponse.json(
        { error: "You don't have permission to delete this announcement" }, 
        { status: 403 }
      )
    }
    
    // Delete the announcement
    await prisma.announcement.delete({
      where: { id }
    })
    
    return NextResponse.json(
      { message: "Announcement deleted successfully" }
    )
  } catch (error) {
    console.error("Error deleting announcement:", error)
    return NextResponse.json(
      { error: "Failed to delete announcement" }, 
      { status: 500 }
    )
  }
}
