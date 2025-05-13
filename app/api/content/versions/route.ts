import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { 
  createContentVersion, 
  getContentVersionHistory, 
  restoreContentVersion 
} from "@/lib/versioning"
import { z } from "zod"

// Schema for validating version creation/restoration
const versionActionSchema = z.object({
  contentId: z.string(),
  contentType: z.enum(["devotional", "announcement"]),
  versionId: z.string().optional(), // Only needed for restoration
})

// Get version history for a content item
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get("contentId")
    const contentType = searchParams.get("contentType")
    
    // Get the authenticated user
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      )
    }
    
    // Validate params
    if (!contentId || !["devotional", "announcement"].includes(contentType || "")) {
      return NextResponse.json(
        { error: "Invalid request parameters" }, 
        { status: 400 }
      )
    }
    
    // Get the version history
    const history = await getContentVersionHistory({
      contentId,
      contentType: contentType as "devotional" | "announcement"
    })
    
    if (!history.success) {
      return NextResponse.json(
        { error: history.error }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json(history)
  } catch (error) {
    console.error("Error getting version history:", error)
    return NextResponse.json(
      { error: "Failed to get version history" }, 
      { status: 500 }
    )
  }
}

// Create a new version for a content item
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
    const validatedData = versionActionSchema.parse(body)
    
    // Create the content version
    const result = await createContentVersion({
      userId: session.user.id,
      contentId: validatedData.contentId,
      contentType: validatedData.contentType
    })
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error creating content version:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to create content version" }, 
      { status: 500 }
    )
  }
}

// Restore a specific version
export async function PUT(request: NextRequest) {
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
    const validatedData = versionActionSchema.parse(body)
    
    if (!validatedData.versionId) {
      return NextResponse.json(
        { error: "Version ID is required for restoration" }, 
        { status: 400 }
      )
    }
    
    // Restore the content version
    const result = await restoreContentVersion({
      userId: session.user.id,
      contentId: validatedData.contentId,
      contentType: validatedData.contentType,
      versionId: validatedData.versionId
    })
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error }, 
        { status: 500 }
      )
    }
    
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error restoring content version:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors }, 
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to restore content version" }, 
      { status: 500 }
    )
  }
}
