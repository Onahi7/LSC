import { AnnouncementForm } from "@/components/AnnouncementForm"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import prisma from "@/lib/prisma"

export const metadata = {
  title: "Edit Announcement | Church Management System",
  description: "Edit an existing announcement",
}

export default async function EditAnnouncementPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  // Check if user is authenticated
  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/announcements")
  }
  
  // Fetch the announcement
  const announcement = await prisma.announcement.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: {
          id: true,
        }
      }
    }
  })
  
  // If announcement not found, show 404
  if (!announcement) {
    notFound()
  }
  
  // Check if user has permission to edit this announcement
  const canEdit = 
    announcement.author.id === session.user.id || 
    ["SUPERADMIN", "PASTOR", "ADMIN"].includes(session.user.role)
  
  if (!canEdit) {
    redirect("/announcements")
  }
  
  // Format dates properly for the form
  const formattedAnnouncement = {
    ...announcement,
    startDate: announcement.startDate ? new Date(announcement.startDate) : undefined,
    endDate: announcement.endDate ? new Date(announcement.endDate) : undefined,
    publishedAt: announcement.publishedAt ? new Date(announcement.publishedAt) : undefined,
  }
  
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Announcement</h1>
        <p className="text-muted-foreground mt-2">
          Update the details of an existing announcement.
        </p>
      </div>
      
      <AnnouncementForm 
        initialData={formattedAnnouncement} 
        isEditing={true}
      />
    </div>
  )
}
