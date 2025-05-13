import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET /api/sermons/tags - Get all tags
export async function GET() {
  try {
    // Check for session
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get all unique tags from sermons
    const tags = await prisma.sermon.findMany({
      select: {
        tags: true,
      },
      where: {
        tags: {
          not: null,
        },
      },
    });
    
    // Extract and flatten tags from all sermons
    const allTags = tags
      .flatMap(sermon => sermon.tags as string[])
      .filter(Boolean);
    
    // Count occurrences and create a unique list with counts
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Format the response
    const formattedTags = Object.entries(tagCounts).map(([name, count]) => ({
      name,
      count,
    }));
    
    return NextResponse.json(formattedTags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

// POST /api/sermons/tags - Create a new tag
export async function POST(req: Request) {
  try {
    // Check for session
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Check if user is admin
    if (session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Only admins can create tags" },
        { status: 403 }
      );
    }
    
    // Get tag data from request
    const data = await req.json();
    
    if (!data.name || typeof data.name !== "string") {
      return NextResponse.json(
        { error: "Tag name is required" },
        { status: 400 }
      );
    }
    
    // Since tags are stored directly in sermons, we'll simply return the tag
    // This endpoint exists mainly for consistency and potential future expansion
    
    return NextResponse.json({ name: data.name, count: 0 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
