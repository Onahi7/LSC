import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { z } from "zod"

// Schema for validating approval data
const approvalSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  comment: z.string().optional(),
})

export async function POST(
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
    
    // Check if user has approval permissions
    if (!["SUPERADMIN", "PASTOR", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json(
        { error: "You don't have permission to approve content" }, 
        { status: 403 }
      )
    }
    
    // Parse and validate the request body
    const body = await request.json()
    const validatedData = approvalSchema.parse(body)
    
    // Find the announcement
    const announcement = await prisma.announcement.findUnique({
      where: { id },
      select: { status: true }
    })
    
    if (announcement) {
      // Only announcements in REVIEW status can be approved/rejected
      if (announcement.status !== "REVIEW") {
        return NextResponse.json(
          { error: "Only content in review status can be approved or rejected" }, 
          { status: 400 }
        )
      }
      
      // Update the announcement status based on approval
      const updatedAnnouncement = await prisma.announcement.update({
        where: { id },
        data: {
          status: validatedData.status === "APPROVED" ? "SCHEDULED" : "REJECTED",
          reviewComment: validatedData.comment,
          reviewedBy: {
            connect: {
              id: session.user.id
            }
          },
          reviewedAt: new Date(),
          // If approved and there's a publishedAt date in the past, mark as PUBLISHED
          ...(validatedData.status === "APPROVED" && {
            status: {
              update: (current: string) => {
                return current === "SCHEDULED" && announcement.publishedAt && 
                  new Date(announcement.publishedAt) <= new Date() 
                  ? "PUBLISHED" 
                  : current
              }
            }
          })
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      })
      
      // Return the updated announcement
      return NextResponse.json({
        success: true,
        contentType: "announcement",
        data: updatedAnnouncement
      })
    }
    
    // If not an announcement, check if it's a devotional
    const devotional = await prisma.devotional.findUnique({
      where: { id },
      select: { status: true }
    })
    
    if (devotional) {
      // Only devotionals in REVIEW status can be approved/rejected
      if (devotional.status !== "REVIEW") {
        return NextResponse.json(
          { error: "Only content in review status can be approved or rejected" }, 
          { status: 400 }
        )
      }
      
      // Update the devotional status based on approval
      const updatedDevotional = await prisma.devotional.update({
        where: { id },
        data: {
          status: validatedData.status === "APPROVED" ? "SCHEDULED" : "REJECTED",
          reviewComment: validatedData.comment,
          reviewedBy: {
            connect: {
              id: session.user.id
            }
          },
          reviewedAt: new Date(),
          // If approved and there's a publishedAt date in the past, mark as PUBLISHED
          ...(validatedData.status === "APPROVED" && {
            status: {
              update: (current: string) => {
                return current === "SCHEDULED" && devotional.publishedAt && 
                  new Date(devotional.publishedAt) <= new Date() 
                  ? "PUBLISHED" 
                  : current
              }
            }
          })
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            }
          }
        }
      })
      
      // Return the updated devotional
      return NextResponse.json({
        success: true,
        contentType: "devotional",
        data: updatedDevotional
      })
    }
    
    // If neither announcement nor devotional was found
    return NextResponse.json(
      { error: "Content not found" }, 
      { status: 404 }
    )
  } catch (error) {
    console.error("Error approving content:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to process approval request" }, 
      { status: 500 }
    )
  }
}
