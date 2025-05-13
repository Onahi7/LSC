import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    // Get all unique target groups
    const targetGroups = await prisma.announcement.findMany({
      select: {
        targetGroups: true,
      },
      distinct: ['targetGroups'],
    })
    
    // Flatten and deduplicate target groups
    const uniqueTargetGroups = [...new Set(
      targetGroups.flatMap(a => a.targetGroups)
    )]
    
    // Get all available statuses and priorities
    const statuses = ["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]
    const priorities = ["LOW", "NORMAL", "HIGH", "URGENT"]
    
    // Return the metadata
    return NextResponse.json({
      targetGroups: uniqueTargetGroups,
      statuses,
      priorities,
    })
  } catch (error) {
    console.error("Error fetching announcement metadata:", error)
    return NextResponse.json(
      { error: "Failed to fetch metadata" }, 
      { status: 500 }
    )
  }
}
