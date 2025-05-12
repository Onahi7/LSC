import { NextResponse } from "next/server"
import auth from "next-auth"
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
    const session = await auth()
    
    if (!session || !["SUPERADMIN", "PASTOR", "ADMIN"].includes(session.role)) {
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

    if (session.role !== "SUPERADMIN" && sermon.preacherId !== session.id) {
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
          if (publicId) return deleteFromCloudinary(publicId)
        })
      )
    }

    if (body.audio_url) {
      const removedAudios = sermon.audio_url.filter(url => !body.audio_url?.includes(url))
      await Promise.all(
        removedAudios.map(url => {
          const publicId = url.split('/').pop()?.split('.')[0]
          if (publicId) return deleteFromCloudinary(publicId)
        })
      )
    }


    const updatedSermon = await prisma.sermon.update({
      where: {
        id: params.id,
      },
      data: {
        ...body,
      },
    })

    return NextResponse.json(updatedSermon)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth()
    
    if (!session || !["SUPERADMIN", "PASTOR", "ADMIN"].includes(session.role)) {
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
