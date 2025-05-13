import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * API endpoint to fetch devotional metadata for filtering
 * Returns available authors and tags in one request
 */
export async function GET() {
  try {
    // Execute all queries in parallel
    const [authors, tagsResult] = await Promise.all([
      // Get all authors who have devotionals
      prisma.user.findMany({
        where: {
          devotionals: {
            some: {
              status: "PUBLISHED"
            }
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
      
      // Get all tags
      prisma.devotional.findMany({
        where: {
          tags: {
            isEmpty: false
          },
          status: "PUBLISHED"
        },
        select: {
          tags: true
        }
      })
    ])

    // Flatten and deduplicate tags
    const uniqueTags = Array.from(
      new Set(
        tagsResult.flatMap(t => t.tags)
      )
    ).sort()

    return NextResponse.json({
      authors,
      tags: uniqueTags
    })
  } catch (error) {
    console.error("Error fetching devotional metadata:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
