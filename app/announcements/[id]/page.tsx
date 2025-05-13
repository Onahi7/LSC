import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { AnnouncementView } from "./view"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export const generateMetadata = async ({ params }: { params: { id: string } }) => {
  const announcement = await prisma.announcement.findUnique({
    where: { id: params.id },
    select: { title: true },
  })
  
  if (!announcement) {
    return {
      title: "Announcement Not Found",
    }
  }
  
  return {
    title: `${announcement.title} | Church Announcements`,
  }
}

export default async function AnnouncementPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  
  const announcement = await prisma.announcement.findUnique({
    where: { id: params.id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        }
      }
    }
  })
  
  if (!announcement) {
    notFound()
  }
  
  // Check if user can view the announcement based on status
  const canView = 
    announcement.status === "PUBLISHED" || 
    announcement.status === "ARCHIVED" || 
    session?.user.id === announcement.author.id || 
    ["SUPERADMIN", "PASTOR", "ADMIN"].includes(session?.user.role || "")
  
  if (!canView) {
    notFound()
  }
  
  return (
    <div className="container py-10">
      <Suspense fallback={<AnnouncementSkeleton />}>
        <AnnouncementView 
          announcement={announcement} 
          session={session}
        />
      </Suspense>
    </div>
  )
}

function AnnouncementSkeleton() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-6 w-1/3" />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
      
      <Skeleton className="h-[300px] w-full" />
      
      <div className="space-y-2">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-3/4" />
      </div>
    </div>
  )
}
