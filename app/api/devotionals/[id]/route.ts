import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

interface DevotionalParams {
  params: {
    id: string
  }
}

// GET - Retrieve a single devotional by ID
export async function GET(
  request: NextRequest,
  { params }: DevotionalParams
) {
  try {
    const devotional = await prisma.devotional.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    })
    
    if (!devotional) {
      return NextResponse.json(
        { error: "Devotional not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(devotional)
  } catch (error) {
    console.error("Error fetching devotional:", error)
    return NextResponse.json(
      { error: "Failed to fetch devotional" },
      { status: 500 }
    )
  }
}

// PATCH - Update a devotional
export async function PATCH(
  request: NextRequest,
  { params }: DevotionalParams
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Find the devotional
    const devotional = await prisma.devotional.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    })
    
    if (!devotional) {
      return NextResponse.json(
        { error: "Devotional not found" },
        { status: 404 }
      )
    }
    
    // Check if user is the author or admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: { id: true, email: true, role: true },
    })
    
    const isAuthor = user?.id === devotional.authorId
    const isAdmin = user?.role === "SUPERADMIN" || user?.role === "ADMIN"
    
    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "You don't have permission to update this devotional" },
        { status: 403 }
      )
    }
    
    // Parse the request body
    const body = await request.json()
    
    // Auto-publish if status changed to PUBLISHED and no publishedAt date
    let publishedAt = body.publishedAt || devotional.publishedAt
    if (body.status === "PUBLISHED" && !publishedAt) {
      publishedAt = new Date()
    }
    
    // Update the devotional
    const updatedDevotional = await prisma.devotional.update({
      where: { id: params.id },
      data: {
        title: body.title,
        content: body.content,
        scripture: body.scripture,
        tags: body.tags || [],
        image: body.image,
        featured: body.featured,
        status: body.status,
        publishedAt,
      },
    })
    
    return NextResponse.json(updatedDevotional)
  } catch (error) {
    console.error("Error updating devotional:", error)
    return NextResponse.json(
      { error: "Failed to update devotional" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a devotional
export async function DELETE(
  request: NextRequest,
  { params }: DevotionalParams
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
    
    // Find the devotional
    const devotional = await prisma.devotional.findUnique({
      where: { id: params.id },
    })
    
    if (!devotional) {
      return NextResponse.json(
        { error: "Devotional not found" },
        { status: 404 }
      )
    }
    
    // Check if user is the author or admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email as string },
      select: { id: true, role: true },
    })
    
    const isAuthor = user?.id === devotional.authorId
    const isAdmin = user?.role === "SUPERADMIN" || user?.role === "ADMIN"
    
    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: "You don't have permission to delete this devotional" },
        { status: 403 }
      )
    }
    
    // Delete the devotional
    await prisma.devotional.delete({
      where: { id: params.id },
    })
    
    return NextResponse.json(
      { message: "Devotional deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting devotional:", error)
    return NextResponse.json(
      { error: "Failed to delete devotional" },
      { status: 500 }
    )
  }
}
