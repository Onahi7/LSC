import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { authConfig } from "@/app/api/auth/[...nextauth]/route"
import { deleteFromCloudinary } from "@/lib/cloudinary"

const sermonUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  video_url: z.array(z.string().url()).optional(),
  audio_url: z.array(z.string().url()).optional(),
})

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const sermon = await prisma.sermon.findUnique({
      where: {
        id: params.id,
      },
      include: {
        preacher: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    if (!sermon) {
      return NextResponse.json(
        { error: "Sermon not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(sermon)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session || !["SUPERADMIN", "PASTOR", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sermon = await prisma.sermon.findUnique({
      where: {
        id: params.id,
      },
      select: {
        preacherId: true,
        video_url: true,
        audio_url: true,
      },
    })

    if (!sermon) {
      return NextResponse.json({ error: "Sermon not found" }, { status: 404 })
    }

    if (session.user.role !== "SUPERADMIN" && sermon.preacherId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const json = await req.json()
    const body = sermonUpdateSchema.parse(json)

    // Handle file deletions
    if (body.video_url) {
      const removedVideos = sermon.video_url.filter(url => !body.video_url?.includes(url))
      await Promise.all(
        removedVideos.map(url => {
          const publicId = url.split('/').pop()?.split('.')[0]
          if (publicId) return deleteFromCloudinary(publicId, 'video')
        })
      )
    }

    if (body.audio_url) {
      const removedAudios = sermon.audio_url.filter(url => !body.audio_url?.includes(url))
      await Promise.all(
        removedAudios.map(url => {
          const publicId = url.split('/').pop()?.split('.')[0]
          if (publicId) return deleteFromCloudinary(publicId, 'audio')
        })
      )
    }

    const sermon = await prisma.sermon.update({
      where: {
        id: params.id,
      },
      data: validatedData,
    })

    return NextResponse.json(sermon)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authConfig)
    
    if (!session || !["SUPERADMIN", "PASTOR", "ADMIN"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.sermon.delete({
      where: {
        id: params.id,
      },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
