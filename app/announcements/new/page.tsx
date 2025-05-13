import { AnnouncementForm } from "@/components/AnnouncementForm"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata = {
  title: "New Announcement | Church Management System",
  description: "Create a new announcement for the church",
}

export default async function NewAnnouncementPage() {
  const session = await getServerSession(authOptions)
  
  // Check if user has permission to create announcements
  if (!session?.user || 
      !["SUPERADMIN", "PASTOR", "ADMIN", "LEADER"].includes(session.user.role)
  ) {
    redirect("/announcements")
  }
  
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Announcement</h1>
        <p className="text-muted-foreground mt-2">
          Create a new announcement to inform the church community about events, 
          news, and important information.
        </p>
      </div>
      
      <AnnouncementForm />
    </div>
  )
}
