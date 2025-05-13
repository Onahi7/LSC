import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * API endpoint to fetch sermon metadata for filtering
 * Returns available speakers, series, and tags in one request
 */
export async function GET() {
  try {
    // Execute all queries in parallel
    const [speakers, allSeries, tags] = await Promise.all([
      // Get all speakers who have sermons
      prisma.user.findMany({
        where: {
          sermons: {
            some: {}
          }
        },
        select: {
          id: true,
          name: true,
          image: true
        },
        orderBy: {
          name: 'asc'
        }
      }),
      
      // Get all series
      prisma.sermon.findMany({
        where: {
          series: {
            not: null
          }
        },
        select: {
          series: true
        },
        distinct: ['series']
      }),
      
      // Get all tags
      prisma.sermon.findMany({
        where: {
          tags: {
            isEmpty: false
          }
        },
        select: {
          tags: true
        }
      })
    ])

    // Process the series data to get just the name strings
    const series = allSeries
      .map(s => s.series)
      .filter(Boolean) as string[]
    
    // Flatten and deduplicate tags
    const uniqueTags = Array.from(
      new Set(
        tags.flatMap(t => t.tags)
      )
    )

    return NextResponse.json({
      speakers,
      series,
      tags: uniqueTags
    })
  } catch (error) {
    console.error("Error fetching sermon metadata:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
