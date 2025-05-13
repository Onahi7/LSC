import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Series schema
const seriesSchema = z.object({
  name: z.string().min(1, "Series name is required"),
  description: z.string().optional(),
  image: z.string().url().optional().nullable(),
});

// GET all series
export async function GET(req: Request) {
  try {
    // Fetch all series with sermon counts
    const seriesList = await prisma.$queryRaw`
      SELECT 
        s."series" as name,
        COUNT(s.id) as "sermonCount"
      FROM 
        "Sermon" s
      WHERE 
        s."series" IS NOT NULL
      GROUP BY 
        s."series"
      ORDER BY 
        s."series"
    `;
    
    return NextResponse.json(seriesList);
  } catch (error) {
    console.error("Error fetching series:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// CREATE new series
export async function POST(req: Request) {
  try {
    const token = await getToken({ req });
    
    if (!token?.id || !["SUPERADMIN", "PASTOR", "ADMIN"].includes(token.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await req.json();
    const validatedData = seriesSchema.parse(body);
    
    // Create a placeholder sermon to establish the series
    // This is because we're not using a separate Series table
    const createdSeries = await prisma.sermon.create({
      data: {
        title: `${validatedData.name} Series Placeholder`,
        content: `Series Description: ${validatedData.description || "No description"}`,
        series: validatedData.name,
        preacherId: token.id,
        isSeriesPlaceholder: true, // Custom flag to mark this as a placeholder
      },
      select: {
        id: true,
        series: true,
      },
    });
    
    return NextResponse.json({
      id: createdSeries.id,
      name: createdSeries.series,
      description: validatedData.description || "",
      image: validatedData.image || null,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    
    console.error("Error creating series:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
