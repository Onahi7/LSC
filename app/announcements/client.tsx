"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useAnnouncements } from "@/hooks/use-announcements"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { 
  PlusIcon, 
  SearchIcon, 
  FilterIcon, 
  MoreVerticalIcon, 
  CalendarIcon, 
  UsersIcon, 
  EditIcon, 
  Trash2Icon,
  XIcon
} from "lucide-react"
import { cn } from "@/lib/utils"

export function AnnouncementsClient({
  initialPage = 1,
  initialStatus = "",
  initialPriority = "",
  initialTargetGroup = "",
  initialSearch = "",
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // State for filters and search
  const [page, setPage] = useState(initialPage)
  const [status, setStatus] = useState(initialStatus)
  const [priority, setPriority] = useState(initialPriority)
  const [targetGroup, setTargetGroup] = useState(initialTargetGroup)
  const [search, setSearch] = useState(initialSearch)
  const [searchInput, setSearchInput] = useState(initialSearch)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [announcementToDelete, setAnnouncementToDelete] = useState<string | null>(null)
  
  // Fetch announcements with hooks
  const {
    announcements,
    pagination,
    metadata,
    isLoading,
    error,
    deleteAnnouncement,
    refetch
  } = useAnnouncements({
    page,
    limit: 12,
    status: status || undefined,
    priority: priority || undefined,
    targetGroup: targetGroup || undefined,
    search: search || undefined,
  })
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams)
    
    if (page !== 1) params.set("page", page.toString())
    else params.delete("page")
    
    if (status) params.set("status", status)
    else params.delete("status")
    
    if (priority) params.set("priority", priority)
    else params.delete("priority")
    
    if (targetGroup) params.set("targetGroup", targetGroup)
    else params.delete("targetGroup")
    
    if (search) params.set("search", search)
    else params.delete("search")
    
    const queryString = params.toString()
    const url = queryString ? `${pathname}?${queryString}` : pathname
    
    router.push(url, { scroll: false })
  }, [page, status, priority, targetGroup, search, pathname, router, searchParams])
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1) // Reset to first page on new search
  }
  
  // Handle delete confirmation
  const confirmDelete = async () => {
    if (announcementToDelete) {
      const success = await deleteAnnouncement(announcementToDelete)
      if (success) {
        refetch()
      }
      setAnnouncementToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }
  
  // Reset all filters
  const resetFilters = () => {
    setStatus("")
    setPriority("")
    setTargetGroup("")
    setSearch("")
    setSearchInput("")
    setPage(1)
  }
  
  // Helper function to display status badge
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
  
  // Helper function to display priority badge
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        {/* Search form */}
        <div className="w-full sm:w-2/3">
          <form onSubmit={handleSearch} className="flex w-full max-w-md gap-2">
            <Input
              placeholder="Search announcements..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="outline" size="icon">
              <SearchIcon className="h-4 w-4" />
            </Button>
            {(status || priority || targetGroup || search) && (
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={resetFilters}
                title="Clear all filters"
              >
                <XIcon className="h-4 w-4" />
              </Button>
            )}
          </form>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-row gap-2 sm:justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FilterIcon className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium mb-1">Status</p>
                <Select value={status} onValueChange={(value) => {
                  setStatus(value)
                  setPage(1)
                }}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    {metadata?.statuses.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.charAt(0) + s.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium mb-1">Priority</p>
                <Select value={priority} onValueChange={(value) => {
                  setPriority(value)
                  setPage(1)
                }}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="All priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All priorities</SelectItem>
                    {metadata?.priorities.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p.charAt(0) + p.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium mb-1">Target Group</p>
                <Select value={targetGroup} onValueChange={(value) => {
                  setTargetGroup(value)
                  setPage(1)
                }}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="All groups" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All groups</SelectItem>
                    {metadata?.targetGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {session?.user && ["SUPERADMIN", "PASTOR", "ADMIN", "LEADER"].includes(session.user.role) && (
            <Button asChild>
              <Link href="/announcements/new">
                <PlusIcon className="h-4 w-4 mr-2" />
                New Announcement
              </Link>
            </Button>
          )}
        </div>
      </div>
      
      {/* Active filters display */}
      {(status || priority || targetGroup || search) && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
          {status && (
            <Badge variant="outline" className="flex items-center gap-1">
              Status: {status.charAt(0) + status.slice(1).toLowerCase()}
              <XIcon 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  setStatus("")
                  setPage(1)
                }}
              />
            </Badge>
          )}
          {priority && (
            <Badge variant="outline" className="flex items-center gap-1">
              Priority: {priority.charAt(0) + priority.slice(1).toLowerCase()}
              <XIcon 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  setPriority("")
                  setPage(1)
                }}
              />
            </Badge>
          )}
          {targetGroup && (
            <Badge variant="outline" className="flex items-center gap-1">
              Group: {targetGroup}
              <XIcon 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  setTargetGroup("")
                  setPage(1)
                }}
              />
            </Badge>
          )}
          {search && (
            <Badge variant="outline" className="flex items-center gap-1">
              Search: {search}
              <XIcon 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  setSearch("")
                  setSearchInput("")
                  setPage(1)
                }}
              />
            </Badge>
          )}
        </div>
      )}
      
      {/* Announcements grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-2/3 mt-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-20 bg-muted rounded"></div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-destructive text-lg">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-10 border rounded-lg bg-background">
          <p className="text-muted-foreground mb-4">No announcements found</p>
          {(status || priority || targetGroup || search) ? (
            <Button variant="outline" onClick={resetFilters}>
              Clear Filters
            </Button>
          ) : (
            session?.user && ["SUPERADMIN", "PASTOR", "ADMIN", "LEADER"].includes(session.user.role) && (
              <Button asChild>
                <Link href="/announcements/new">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Your First Announcement
                </Link>
              </Button>
            )
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {announcements.map((announcement) => (
            <Card key={announcement.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <div>
                    <CardTitle>
                      <Link 
                        href={`/announcements/${announcement.id}`}
                        className="hover:underline"
                      >
                        {announcement.title}
                      </Link>
                    </CardTitle>
                    <CardDescription className="flex flex-wrap gap-2 mt-1">
                      {getStatusBadge(announcement.status)}
                      {getPriorityBadge(announcement.priority)}
                    </CardDescription>
                  </div>
                  
                  {session?.user && (
                    ["SUPERADMIN", "PASTOR", "ADMIN"].includes(session.user.role) || 
                    session.user.id === announcement.author.id
                  ) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVerticalIcon className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/announcements/${announcement.id}`}>
                            View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/announcements/edit/${announcement.id}`}>
                            <EditIcon className="h-4 w-4 mr-2" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => {
                            setAnnouncementToDelete(announcement.id)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2Icon className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="line-clamp-3 text-sm">
                  {announcement.content}
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-wrap justify-between pt-2 text-xs text-muted-foreground gap-y-1">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {announcement.startDate && (
                    <span>
                      {format(new Date(announcement.startDate), "MMM d, yyyy")}
                      {announcement.endDate && 
                        " - " + format(new Date(announcement.endDate), "MMM d, yyyy")
                      }
                    </span>
                  )}
                  {!announcement.startDate && "No date set"}
                </div>
                
                <div className="flex items-center gap-1.5">
                  <UsersIcon className="h-3.5 w-3.5" />
                  {announcement.targetGroups.length > 0 
                    ? announcement.targetGroups.length > 1 
                      ? `${announcement.targetGroups[0]} +${announcement.targetGroups.length - 1}` 
                      : announcement.targetGroups[0]
                    : "All members"
                  }
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {pagination && pagination.pageCount > 1 && (
        <Pagination className="mt-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setPage(page > 1 ? page - 1 : 1)}
                className={cn("cursor-pointer", page <= 1 && "pointer-events-none opacity-50")}
              />
            </PaginationItem>
            
            {Array.from({ length: pagination.pageCount }).map((_, i) => {
              // Show first page, last page, and pages around current page
              if (
                i === 0 || 
                i === pagination.pageCount - 1 || 
                (i >= page - 2 && i <= page)
              ) {
                return (
                  <PaginationItem key={i}>
                    <PaginationLink
                      className={cn("cursor-pointer", page === i + 1 && "font-bold")}
                      onClick={() => setPage(i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                )
              }
              
              // Show ellipsis for skipped pages
              if (
                (i === 1 && page > 3) || 
                (i === pagination.pageCount - 2 && page < pagination.pageCount - 2)
              ) {
                return (
                  <PaginationItem key={i}>
                    <span className="flex h-9 w-9 items-center justify-center">
                      &hellip;
                    </span>
                  </PaginationItem>
                )
              }
              
              return null
            })}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setPage(page < pagination.pageCount ? page + 1 : pagination.pageCount)}
                className={cn(
                  "cursor-pointer", 
                  page >= pagination.pageCount && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      
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
            <AlertDialogCancel onClick={() => setAnnouncementToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
