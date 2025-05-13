import { NextRequest, NextResponse } from "next/server"
import { publishScheduledContent, archiveExpiredAnnouncements } from "@/lib/scheduler"

// This endpoint will be called by a cron job to publish scheduled content
// and archive expired announcements
export async function GET(request: NextRequest) {
  // Validate API key for security (should be set as an environment variable)
  const apiKey = request.headers.get("x-api-key")
  const validApiKey = process.env.SCHEDULER_API_KEY
  
  if (!apiKey || apiKey !== validApiKey) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }
  
  try {
    // Run the content publishing and archiving functions
    const [publishResult, archiveResult] = await Promise.all([
      publishScheduledContent(),
      archiveExpiredAnnouncements()
    ])
    
    // Return the results
    return NextResponse.json({
      success: publishResult.success && archiveResult.success,
      publishResult,
      archiveResult,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error("Error in scheduler API:", error)
    return NextResponse.json(
      { 
        error: "Failed to run scheduler tasks",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
