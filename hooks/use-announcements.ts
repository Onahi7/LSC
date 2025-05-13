import { useState, useEffect, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface Announcement {
  id: string
  title: string
  content: string
  image?: string
  startDate?: Date
  endDate?: Date
  status: string
  priority: string
  targetGroups: string[]
  publishedAt?: Date
  author: {
    id: string
    name: string
    image?: string
  }
  createdAt: Date
  updatedAt: Date
}

interface AnnouncementMetadata {
  targetGroups: string[]
  statuses: string[]
  priorities: string[]
}

interface Pagination {
  total: number
  pageCount: number
  page: number
  limit: number
}

interface UseAnnouncementsProps {
  page?: number
  limit?: number
  status?: string
  priority?: string
  targetGroup?: string
  search?: string
}

export function useAnnouncements({
  page = 1,
  limit = 10,
  status,
  priority,
  targetGroup,
  search
}: UseAnnouncementsProps = {}) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [metadata, setMetadata] = useState<AnnouncementMetadata | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Fetch announcements with optional filtering
  const fetchAnnouncements = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Build query parameters
      const params = new URLSearchParams()
      params.append("page", page.toString())
      params.append("limit", limit.toString())
      
      if (status) params.append("status", status)
      if (priority) params.append("priority", priority)
      if (targetGroup) params.append("targetGroup", targetGroup)
      if (search) params.append("search", search)
      
      const response = await fetch(`/api/announcements?${params.toString()}`)
      
      if (!response.ok) {
        throw new Error("Failed to fetch announcements")
      }
      
      const data = await response.json()
      setAnnouncements(data.announcements)
      setPagination(data.pagination)
    } catch (err) {
      setError("Error loading announcements. Please try again.")
      toast({
        title: "Error",
        description: "Failed to load announcements.",
        variant: "destructive",
      })
      console.error("Error fetching announcements:", err)
    } finally {
      setIsLoading(false)
    }
  }, [page, limit, status, priority, targetGroup, search, toast])
  
  // Fetch announcement metadata (for filters)
  const fetchMetadata = useCallback(async () => {
    try {
      const response = await fetch("/api/announcements/metadata")
      
      if (!response.ok) {
        throw new Error("Failed to fetch metadata")
      }
      
      const data = await response.json()
      setMetadata(data)
    } catch (err) {
      console.error("Error fetching metadata:", err)
    }
  }, [])
  
  // Get a single announcement by ID
  const getAnnouncement = async (id: string): Promise<Announcement | null> => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/announcements/${id}`)
      
      if (response.status === 404) {
        toast({
          title: "Not found",
          description: "The announcement you requested does not exist.",
          variant: "destructive",
        })
        return null
      }
      
      if (!response.ok) {
        throw new Error("Failed to fetch announcement")
      }
      
      const data = await response.json()
      return data
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load announcement details.",
        variant: "destructive",
      })
      console.error("Error fetching announcement:", err)
      return null
    } finally {
      setIsLoading(false)
    }
  }
  
  // Delete an announcement
  const deleteAnnouncement = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/announcements/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete announcement")
      }
      
      toast({
        title: "Success",
        description: "Announcement deleted successfully.",
      })
      
      return true
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete announcement.",
        variant: "destructive",
      })
      console.error("Error deleting announcement:", err)
      return false
    } finally {
      setIsLoading(false)
    }
  }
  
  // Fetch announcements and metadata on component mount or when dependencies change
  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])
  
  useEffect(() => {
    fetchMetadata()
  }, [fetchMetadata])
  
  return {
    announcements,
    pagination,
    metadata,
    isLoading,
    error,
    getAnnouncement,
    deleteAnnouncement,
    refetch: fetchAnnouncements
  }
}
