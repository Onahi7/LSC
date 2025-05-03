import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }    // Get the current user with their imagePublicId using raw query
    const userData = await prisma.$queryRaw`
      SELECT "imagePublicId" 
      FROM "User" 
      WHERE id = ${token.id}
    `;
    
    const user = Array.isArray(userData) ? userData[0] : null;

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
      const formData = await request.formData();
    const file = formData.get("image") as File;
    
    if (!file) {
      return NextResponse.json(
        { error: "No image uploaded" },
        { status: 400 }
      );
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Convert file to base64 string for Cloudinary
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`;

    // Delete old image if exists
    if (user.imagePublicId) {
      try {
        await deleteFromCloudinary(user.imagePublicId);
      } catch (error) {
        console.error("Error deleting old image:", error);
        // Continue even if deletion fails
      }
    }

    // Upload to Cloudinary
    const { url, public_id } = await uploadToCloudinary(
      base64String,
      "church-profiles" // Folder name in Cloudinary
    );    // Update user profile with new image using raw query
    await prisma.$executeRaw`
      UPDATE "User"
      SET 
        "image" = ${url},
        "imagePublicId" = ${public_id}
      WHERE id = ${token.id}
    `;

    return NextResponse.json({ url, publicId: public_id });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
