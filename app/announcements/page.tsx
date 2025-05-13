import { Suspense } from "react"
import { AnnouncementsClient } from "./client"
import { Skeleton } from "@/components/ui/skeleton"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Announcements | Church Management System",
  description: "Manage church announcements and important communications",
}

export default async function AnnouncementsPage({
  searchParams,
}: {
  searchParams: {
    page?: string
    status?: string
    priority?: string
    targetGroup?: string
    search?: string
  }
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/announcements")
  }
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
        <p className="text-muted-foreground mt-2">
          Manage church announcements and important communications
        </p>
      </div>
      
      <Suspense fallback={<AnnouncementsSkeleton />}>
        <AnnouncementsClient 
          initialPage={searchParams?.page ? parseInt(searchParams.page) : 1}
          initialStatus={searchParams?.status || ""}
          initialPriority={searchParams?.priority || ""}
          initialTargetGroup={searchParams?.targetGroup || ""}
          initialSearch={searchParams?.search || ""}
        />
      </Suspense>
    </div>
  )
}

function AnnouncementsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[200px] rounded-lg" />
        ))}
      </div>
      
      <div className="flex justify-end mt-6">
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  )
}
