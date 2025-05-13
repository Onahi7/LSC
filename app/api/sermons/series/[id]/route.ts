import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const seriesUpdateSchema = z.object({
  name: z.string().min(1, "Series name is required"),
  description: z.string().optional(),
  image: z.string().url().optional().nullable(),
});

// GET, UPDATE, DELETE a specific series
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get series details
    const series = await prisma.sermon.findUnique({
      where: {
        id: params.id,
        isSeriesPlaceholder: true, // Get only the placeholder entry
      },
      select: {
        id: true,
        title: true,
        content: true,
        series: true,
      },
    });
    
    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }
    
    // Get count of sermons in this series
    const sermonCount = await prisma.sermon.count({
      where: {
        series: series.series,
        isSeriesPlaceholder: false, // Don't count placeholder
      },
    });
    
    return NextResponse.json({
      id: series.id,
      name: series.series,
      description: series.content.replace('Series Description: ', ''),
      sermonCount,
    });
  } catch (error) {
    console.error("Error fetching series:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req });
    
    if (!token?.id || !["SUPERADMIN", "PASTOR", "ADMIN"].includes(token.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the current series details
    const currentSeries = await prisma.sermon.findUnique({
      where: {
        id: params.id,
        isSeriesPlaceholder: true,
      },
      select: {
        series: true,
      },
    });
    
    if (!currentSeries) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }
    
    // Validate the update data
    const body = await req.json();
    const validatedData = seriesUpdateSchema.parse(body);
    
    // Update the placeholder sermon
    const updatedSeries = await prisma.sermon.update({
      where: {
        id: params.id,
      },
      data: {
        title: `${validatedData.name} Series Placeholder`,
        content: `Series Description: ${validatedData.description || "No description"}`,
        series: validatedData.name,
      },
    });
    
    // If series name changed, update all sermons in this series
    if (currentSeries.series !== validatedData.name) {
      await prisma.sermon.updateMany({
        where: {
          series: currentSeries.series,
          isSeriesPlaceholder: false,
        },
        data: {
          series: validatedData.name,
        },
      });
    }
    
    // Get count of sermons in this series
    const sermonCount = await prisma.sermon.count({
      where: {
        series: updatedSeries.series,
        isSeriesPlaceholder: false,
      },
    });
    
    return NextResponse.json({
      id: params.id,
      name: updatedSeries.series,
      description: validatedData.description || "",
      sermonCount,
      image: validatedData.image || null,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    
    console.error("Error updating series:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req });
    
    if (!token?.id || !["SUPERADMIN", "PASTOR", "ADMIN"].includes(token.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the current series
    const series = await prisma.sermon.findUnique({
      where: {
        id: params.id,
        isSeriesPlaceholder: true,
      },
      select: {
        series: true,
      },
    });
    
    if (!series) {
      return NextResponse.json({ error: "Series not found" }, { status: 404 });
    }
    
    // Delete the placeholder
    await prisma.sermon.delete({
      where: {
        id: params.id,
      },
    });
    
    // Remove series from all sermons but do not delete the sermons
    await prisma.sermon.updateMany({
      where: {
        series: series.series,
      },
      data: {
        series: null, // Remove the series association
      },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting series:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
