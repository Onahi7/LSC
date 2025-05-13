"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  CalendarIcon, 
  UsersIcon, 
  ChevronLeftIcon, 
  PencilIcon, 
  Trash2Icon 
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface AnnouncementViewProps {
  announcement: {
    id: string
    title: string
    content: string
    image?: string | null
    startDate?: Date | null
    endDate?: Date | null
    status: string
    priority: string
    targetGroups: string[]
    publishedAt?: Date | null
    createdAt: Date
    updatedAt: Date
    author: {
      id: string
      name: string | null
      image: string | null
    }
  }
  session: any
}

export function AnnouncementView({ announcement, session }: AnnouncementViewProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Check if user can edit/delete the announcement
  const canEdit = 
    session?.user.id === announcement.author.id || 
    ["SUPERADMIN", "PASTOR", "ADMIN"].includes(session?.user.role || "")
  
  // Format dates for display
  const formatDateRange = () => {
    if (!announcement.startDate) return null
    
    const start = format(new Date(announcement.startDate), "MMMM d, yyyy")
    
    if (!announcement.endDate) return start
    
    const end = format(new Date(announcement.endDate), "MMMM d, yyyy")
    return `${start} - ${end}`
  }
  
  // Handle announcement deletion
  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      
      const response = await fetch(`/api/announcements/${announcement.id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete announcement")
      }
      
      toast({
        title: "Announcement deleted",
        description: "The announcement has been permanently deleted.",
      })
      
      router.push("/announcements")
      router.refresh()
    } catch (error) {
      console.error("Error deleting announcement:", error)
      toast({
        title: "Error",
        description: "Failed to delete the announcement. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }
  
  // Helper function to render status badge
  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      DRAFT: "bg-slate-200 text-slate-800",
      SCHEDULED: "bg-blue-100 text-blue-800",
      PUBLISHED: "bg-green-100 text-green-800",
      ARCHIVED: "bg-gray-100 text-gray-800"
    }
    
    return (
      <Badge className={cn("font-normal", variants[status] || "")}>
        {status.charAt(0) + status.slice(1).toLowerCase()}
      </Badge>
    )
  }
  
  // Helper function to render priority badge
  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      LOW: "bg-slate-100 text-slate-800",
      NORMAL: "bg-blue-100 text-blue-800",
      HIGH: "bg-amber-100 text-amber-800",
      URGENT: "bg-red-100 text-red-800"
    }
    
    return (
      <Badge className={cn("font-normal", variants[priority] || "")}>
        {priority.charAt(0) + priority.slice(1).toLowerCase()}
      </Badge>
    )
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      <Button 
        variant="ghost" 
        size="sm" 
        className="mb-6"
        asChild
      >
        <Link href="/announcements">
          <ChevronLeftIcon className="h-4 w-4 mr-2" />
          Back to Announcements
        </Link>
      </Button>
      
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{announcement.title}</h1>
          
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={announcement.author.image || undefined} alt={announcement.author.name || "Author"} />
                <AvatarFallback>
                  {announcement.author.name?.substring(0, 2) || "US"}
                </AvatarFallback>
              </Avatar>
              <span>{announcement.author.name}</span>
            </div>
            
            <span>&bull;</span>
            
            <span>
              {format(new Date(announcement.createdAt), "MMMM d, yyyy")}
              {announcement.updatedAt > announcement.createdAt && " (updated)"}
            </span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {getStatusBadge(announcement.status)}
          {getPriorityBadge(announcement.priority)}
          
          {formatDateRange() && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>{formatDateRange()}</span>
            </div>
          )}
          
          {announcement.targetGroups.length > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <UsersIcon className="h-4 w-4" />
              <span>
                {announcement.targetGroups.length > 3
                  ? `${announcement.targetGroups.slice(0, 3).join(", ")} +${announcement.targetGroups.length - 3} more`
                  : announcement.targetGroups.join(", ")}
              </span>
            </div>
          )}
        </div>
        
        {announcement.image && (
          <div className="relative w-full h-[300px] rounded-lg overflow-hidden">
            <Image 
              src={announcement.image} 
              alt={announcement.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="prose prose-slate max-w-none">
          {announcement.content.split("\n").map((paragraph, i) => (
            paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
          ))}
        </div>
        
        {canEdit && (
          <div className="flex gap-4 pt-4 border-t">
            <Button asChild>
              <Link href={`/announcements/edit/${announcement.id}`}>
                <PencilIcon className="h-4 w-4 mr-2" />
                Edit
              </Link>
            </Button>
            <Button 
              variant="outline" 
              className="text-destructive border-destructive hover:bg-destructive/10"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2Icon className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        )}
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              announcement and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
