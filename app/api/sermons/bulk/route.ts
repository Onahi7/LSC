import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Define schema for bulk actions
const bulkActionSchema = z.object({
  ids: z.array(z.string()),
  action: z.enum(["delete", "feature", "unfeature"]),
});

export async function POST(req: Request) {
  try {
    const token = await getToken({ req })
    
    if (!token?.id || !["SUPERADMIN", "PASTOR", "ADMIN"].includes(token.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { ids, action } = bulkActionSchema.parse(body)

    // Handle different actions
    switch (action) {
      case "delete":
        // Delete multiple sermons
        await prisma.sermon.deleteMany({
          where: {
            id: { in: ids },
            // Only the author or admins can delete
            OR: [
              { preacherId: token.id },
              { preacherId: token.role === "SUPERADMIN" ? undefined : null },
            ],
          },
        })
        return NextResponse.json({ success: true, message: "Sermons deleted successfully" })
      
      case "feature":
      case "unfeature":
        // Update featured status
        const updatedSermons = await prisma.$transaction(
          ids.map(id => 
            prisma.sermon.update({
              where: { id },
              data: { featured: action === "feature" },
              include: {
                preacher: {
                  select: {
                    name: true,
                    image: true,
                  },
                },
              },
            })
          )
        )
        return NextResponse.json(updatedSermons)
      
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 })
    }
    
    console.error("Bulk action error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
