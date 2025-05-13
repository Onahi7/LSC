import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { Prisma } from "@prisma/client"

const sermonSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  video_url: z.array(z.string().url()).default([]),
  audio_url: z.array(z.string().url()).default([]),
})

export async function POST(req: Request) {
  try {
    const token = await getToken({ req })
    
    if (!token?.id || !["SUPERADMIN", "PASTOR", "ADMIN"].includes(token.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const validatedData = sermonSchema.parse(body)

    const sermon = await prisma.sermon.create({
      data: {
        ...validatedData,
        preacherId: token.id,
      },
    })

    return NextResponse.json(sermon, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search")
    const series = searchParams.get("series")
    const speaker = searchParams.get("speaker")
    const tag = searchParams.get("tag")
    const featured = searchParams.get("featured") === "true"
    
    const skip = (page - 1) * limit;

    const where: Prisma.SermonWhereInput = {
      AND: [
        // Search filter
        search ? {          OR: [
            { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { series: { contains: search, mode: Prisma.QueryMode.insensitive } },
            { scripture: { contains: search, mode: Prisma.QueryMode.insensitive } },
          ],
        } : {},
        // Series filter
        series ? { series } : {},
        // Speaker filter
        speaker ? { preacher: { name: speaker } } : {},
        // Tag filter
        tag ? { tags: { has: tag } } : {},
        // Featured filter
        featured ? { featured: true } : {},
      ].filter(Boolean), // Remove empty conditions
    }

    const [sermons, total] = await Promise.all([
      prisma.sermon.findMany({
        where,
        skip,
        take: limit,
        include: {
          preacher: {
            select: {
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.sermon.count({ where }),
    ]);
    return NextResponse.json({
      sermons,
      pagination: {
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        limit
      }
    })
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
