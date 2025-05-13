import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string, type: string } }
) {
  try {
    const { id, type } = params
    
    // Get the authenticated user
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      )
    }
    
    // Validate content type
    if (!["announcement", "devotional"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid content type" }, 
        { status: 400 }
      )
    }
    
    if (type === "announcement") {
      // Find the announcement
      const announcement = await prisma.announcement.findUnique({
        where: { id },
        select: { authorId: true, status: true }
      })
      
      if (!announcement) {
        return NextResponse.json(
          { error: "Announcement not found" }, 
          { status: 404 }
        )
      }
      
      // Check if user is the author
      if (announcement.authorId !== session.user.id && 
          !["SUPERADMIN", "PASTOR", "ADMIN"].includes(session.user.role)) {
        return NextResponse.json(
          { error: "You don't have permission to submit this content for review" }, 
          { status: 403 }
        )
      }
      
      // Only DRAFT or REJECTED announcements can be submitted for review
      if (!["DRAFT", "REJECTED"].includes(announcement.status)) {
        return NextResponse.json(
          { error: "Only draft or rejected content can be submitted for review" }, 
          { status: 400 }
        )
      }
      
      // Update the announcement status to REVIEW
      const updatedAnnouncement = await prisma.announcement.update({
        where: { id },
        data: {
          status: "REVIEW",
          reviewComment: null,
          reviewerId: null,
          reviewedAt: null,
        }
      })
      
      return NextResponse.json({
        success: true,
        message: "Announcement submitted for review",
        data: updatedAnnouncement
      })
    } else {
      // Find the devotional
      const devotional = await prisma.devotional.findUnique({
        where: { id },
        select: { authorId: true, status: true }
      })
      
      if (!devotional) {
        return NextResponse.json(
          { error: "Devotional not found" }, 
          { status: 404 }
        )
      }
      
      // Check if user is the author
      if (devotional.authorId !== session.user.id && 
          !["SUPERADMIN", "PASTOR", "ADMIN"].includes(session.user.role)) {
        return NextResponse.json(
          { error: "You don't have permission to submit this content for review" }, 
          { status: 403 }
        )
      }
      
      // Only DRAFT or REJECTED devotionals can be submitted for review
      if (!["DRAFT", "REJECTED"].includes(devotional.status)) {
        return NextResponse.json(
          { error: "Only draft or rejected content can be submitted for review" }, 
          { status: 400 }
        )
      }
      
      // Update the devotional status to REVIEW
      const updatedDevotional = await prisma.devotional.update({
        where: { id },
        data: {
          status: "REVIEW",
          reviewComment: null,
          reviewerId: null,
          reviewedAt: null,
        }
      })
      
      return NextResponse.json({
        success: true,
        message: "Devotional submitted for review",
        data: updatedDevotional
      })
    }
  } catch (error) {
    console.error("Error submitting content for review:", error)
    return NextResponse.json(
      { error: "Failed to submit content for review" }, 
      { status: 500 }
    )
  }
}
