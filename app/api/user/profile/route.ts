import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";

// Schema for profile update validation
const profileUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100).optional(),
  image: z.any().optional(), // Will be handled separately
  bio: z.string().max(500).optional(),
  phone: z.string().max(20).optional(),
  address: z.string().max(200).optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional().nullable(),
  occupation: z.string().max(100).optional(),
  maritalStatus: z.string().optional(),
  anniversary: z.string().optional().nullable(),
  joinedChurchDate: z.string().optional().nullable(),
  emergencyContact: z.string().max(50).optional(),
});

export async function GET(req: Request) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Use raw query to access JSON and custom fields
    const userData = await prisma.$queryRaw`
      SELECT 
        id, 
        name, 
        email, 
        "emailVerified", 
        image, 
        "imagePublicId", 
        role, 
        "createdAt", 
        "updatedAt",
        bio: true,
        phone: true,
        address: true,
        gender: true,
        dateOfBirth: true,
        occupation: true,
        maritalStatus: true,
        anniversary: true,
        joinedChurchDate: true,
        emergencyContact: true,
        notificationPrefs: true,
        theme: true,
        privacySettings: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string | null;
    const bio = formData.get("bio") as string | null;
    const phone = formData.get("phone") as string | null;
    const address = formData.get("address") as string | null;
    const gender = formData.get("gender") as string | null;
    const dateOfBirth = formData.get("dateOfBirth") as string | null;
    const occupation = formData.get("occupation") as string | null;
    const maritalStatus = formData.get("maritalStatus") as string | null;
    const anniversary = formData.get("anniversary") as string | null;
    const joinedChurchDate = formData.get("joinedChurchDate") as string | null;
    const emergencyContact = formData.get("emergencyContact") as string | null;
    const imageFile = formData.get("image") as File | null;

    // Validate the data
    const validatedData = profileUpdateSchema.parse({
      name: name || undefined,
      bio: bio || undefined,
      phone: phone || undefined,
      address: address || undefined,
      gender: gender || undefined,
      dateOfBirth: dateOfBirth || undefined,
      occupation: occupation || undefined,
      maritalStatus: maritalStatus || undefined,
      anniversary: anniversary || undefined,
      joinedChurchDate: joinedChurchDate || undefined,
      emergencyContact: emergencyContact || undefined,
    });

    // Process dates
    const processedData = {
      ...validatedData,
      dateOfBirth: validatedData.dateOfBirth ? new Date(validatedData.dateOfBirth) : undefined,
      anniversary: validatedData.anniversary ? new Date(validatedData.anniversary) : undefined,
      joinedChurchDate: validatedData.joinedChurchDate ? new Date(validatedData.joinedChurchDate) : undefined,
    };    // Handle image upload if present
    let imageUrl;
    let imagePublicId;
    if (imageFile && imageFile.size > 0) {
      try {        const arrayBuffer = await imageFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64String = "data:" + imageFile.type + ";base64," + buffer.toString('base64');
        
        // Use Prisma's findUnique method but cast to any to avoid TypeScript errors
        const currentUser = await (prisma.user.findUnique as any)({
          where: { id: token.id as string },
          select: { imagePublicId: true }
        });
        
        // Delete old image if it exists
        if (currentUser?.imagePublicId) {
          try {
            await deleteFromCloudinary(currentUser.imagePublicId);
          } catch (err) {
            console.error("Error deleting old image:", err);
            // Continue even if deletion fails
          }
        }
        
        const result = await uploadToCloudinary(base64String, "church-profiles");
        imageUrl = result.url;
        imagePublicId = result.public_id;
      } catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json(
          { error: "Failed to upload profile image" },
          { status: 500 }
        );
      }
    }

    // Update the user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...processedData,
        ...(imageUrl && { image: imageUrl }),
        ...(imagePublicId && { imagePublicId }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        imagePublicId: true,
        role: true,
        bio: true,
        phone: true,
        address: true,
        gender: true,
        dateOfBirth: true,
        occupation: true,
        maritalStatus: true,
        anniversary: true,
        joinedChurchDate: true, 
        emergencyContact: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }

    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Failed to update user profile" },
      { status: 500 }
    );
  }
}
