import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { z } from "zod";

// Check if user has admin access
async function isAdmin() {
  const session = await getServerSession(authConfig);
  
  if (!session?.user) {
    return false;
  }
  
  return ["SUPERADMIN", "ADMIN"].includes(session.user.role);
}

// Helper to check if the current user can manage the target user role
async function canManageRole(targetRole: string) {
  const session = await getServerSession(authConfig);
  
  if (session?.user.role === "SUPERADMIN") {
    return true;
  }
  
  if (session?.user.role === "ADMIN" && targetRole !== "SUPERADMIN") {
    return true;
  }
  
  return false;
}

// GET /api/admin/users/[id] - Get specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user has admin access
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = params;
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
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
        createdAt: true,
        updatedAt: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users/[id] - Update a user
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user has admin access
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = params;
    const json = await request.json();
    
    // Validate request body
    const userUpdateSchema = z.object({
      name: z.string().min(1, "Name is required").optional(),
      email: z.string().email("Invalid email address").optional(),
      role: z.enum(["SUPERADMIN", "ADMIN", "PASTOR", "LEADER", "MEMBER"]).optional(),
      password: z.string().min(8, "Password must be at least 8 characters").optional(),
    });
    
    const data = userUpdateSchema.parse(json);
    
    // Get target user to check their role
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
    
    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Check if current user can manage the target user's role
    if (!(await canManageRole(targetUser.role))) {
      return NextResponse.json(
        { error: "You don't have permission to manage this user" },
        { status: 403 }
      );
    }
    
    // If changing role, check if current user can assign that role
    if (data.role && !(await canManageRole(data.role))) {
      return NextResponse.json(
        { error: "You don't have permission to assign this role" },
        { status: 403 }
      );
    }
    
    // If email is changing, check if it's already in use
    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });
      
      if (existingUser && existingUser.id !== id) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
    }
    
    // Prepare update data
    const updateData: any = {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.role && { role: data.role }),
    };
    
    // Hash password if provided
    if (data.password) {
      updateData.password = await hash(data.password, 10);
    }
    
    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return NextResponse.json(updatedUser);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues },
        { status: 400 }
      );
    }
    
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] - Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user has admin access
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = params;
    const session = await getServerSession(authConfig);
    
    // Get target user to check their role
    const targetUser = await prisma.user.findUnique({
      where: { id },
      select: { role: true },
    });
    
    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Check if current user can manage the target user's role
    if (!(await canManageRole(targetUser.role))) {
      return NextResponse.json(
        { error: "You don't have permission to delete this user" },
        { status: 403 }
      );
    }
    
    // Prevent deleting own account
    if (id === session?.user.id) {
      return NextResponse.json(
        { error: "You cannot delete your own account" },
        { status: 400 }
      );
    }
    
    // Delete user
    await prisma.user.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
