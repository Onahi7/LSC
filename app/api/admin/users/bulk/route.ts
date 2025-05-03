import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Check if user has admin access
async function isAdmin() {
  const session = await getServerSession(authConfig);
  
  if (!session?.user) {
    return false;
  }
  
  return ["SUPERADMIN", "ADMIN"].includes(session.user.role);
}

// Helper to check if the current user can manage the given role
async function canManageRole(role: string) {
  const session = await getServerSession(authConfig);
  
  if (session?.user.role === "SUPERADMIN") {
    return true;
  }
  
  if (session?.user.role === "ADMIN" && role !== "SUPERADMIN") {
    return true;
  }
  
  return false;
}

// PATCH /api/admin/users/bulk - Bulk update users
export async function PATCH(request: NextRequest) {
  try {
    // Check if user has admin access
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const json = await request.json();
    
    // Validate request body
    const bulkUpdateSchema = z.object({
      userIds: z.array(z.string()),
      data: z.object({
        role: z.enum(["SUPERADMIN", "ADMIN", "PASTOR", "LEADER", "MEMBER"]),
      }),
    });
    
    const { userIds, data } = bulkUpdateSchema.parse(json);
    
    if (userIds.length === 0) {
      return NextResponse.json(
        { error: "No users specified" },
        { status: 400 }
      );
    }
    
    // Check if current user can assign this role
    if (!(await canManageRole(data.role))) {
      return NextResponse.json(
        { error: "You don't have permission to assign this role" },
        { status: 403 }
      );
    }
    
    // Get users to check their roles
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, role: true },
    });
    
    // Filter out users the current user can't manage
    const session = await getServerSession(authConfig);
    const idsToUpdate = [];
    
    for (const user of users) {
      // Skip users that can't be managed by the current user
      if (session?.user.role !== "SUPERADMIN" && user.role === "SUPERADMIN") {
        continue;
      }
      
      // Prevent changing own role
      if (user.id === session?.user.id) {
        continue;
      }
      
      idsToUpdate.push(user.id);
    }
    
    if (idsToUpdate.length === 0) {
      return NextResponse.json(
        { error: "No users that you can manage" },
        { status: 400 }
      );
    }
    
    // Update users
    await prisma.user.updateMany({
      where: { id: { in: idsToUpdate } },
      data: { role: data.role as any },
    });
    
    // Get updated users
    const updatedUsers = await prisma.user.findMany({
      where: { id: { in: idsToUpdate } },
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
    
    return NextResponse.json(updatedUsers);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues },
        { status: 400 }
      );
    }
    
    console.error("Error updating users:", error);
    return NextResponse.json(
      { error: "Failed to update users" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/bulk - Bulk delete users
export async function DELETE(request: NextRequest) {
  try {
    // Check if user has admin access
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const json = await request.json();
    
    // Validate request body
    const bulkDeleteSchema = z.object({
      userIds: z.array(z.string()),
    });
    
    const { userIds } = bulkDeleteSchema.parse(json);
    
    if (userIds.length === 0) {
      return NextResponse.json(
        { error: "No users specified" },
        { status: 400 }
      );
    }
    
    // Get users to check their roles
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, role: true },
    });
    
    // Filter out users the current user can't manage
    const session = await getServerSession(authConfig);
    const idsToDelete = [];
    
    for (const user of users) {
      // Skip users that can't be managed by the current user
      if (session?.user.role !== "SUPERADMIN" && user.role === "SUPERADMIN") {
        continue;
      }
      
      // Prevent deleting own account
      if (user.id === session?.user.id) {
        continue;
      }
      
      idsToDelete.push(user.id);
    }
    
    if (idsToDelete.length === 0) {
      return NextResponse.json(
        { error: "No users that you can delete" },
        { status: 400 }
      );
    }
    
    // Delete users
    await prisma.user.deleteMany({
      where: { id: { in: idsToDelete } },
    });
    
    return NextResponse.json({ success: true, deletedCount: idsToDelete.length });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues },
        { status: 400 }
      );
    }
    
    console.error("Error deleting users:", error);
    return NextResponse.json(
      { error: "Failed to delete users" },
      { status: 500 }
    );
  }
}
