import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Get all unique preachers who have sermons
    const speakers = await prisma.user.findMany({
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
    })

    return NextResponse.json(speakers)
  } catch (error) {
    console.error("Error fetching speakers:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
