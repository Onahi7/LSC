"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
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
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  HistoryIcon, 
  Loader2Icon, 
  RotateCwIcon, 
  ClockIcon,
  CheckIcon,
  DiffIcon
} from "lucide-react"
import { format } from "date-fns"

type ContentType = "devotional" | "announcement"

interface ContentVersioningProps {
  contentId: string
  contentType: ContentType
  currentVersion: number
  onVersionRestored?: () => void
}

interface VersionRecord {
  id: string
  version: number
  title: string
  content: string
  status: string
  createdAt: string
  createdBy: {
    id: string
    name: string | null
    image: string | null
  }
  // Fields specific to devotionals
  scripture?: string | null
  tags?: string[]
  // Fields specific to announcements
  startDate?: string | null
  endDate?: string | null
  priority?: string
  targetGroups?: string[]
}

export function ContentVersioning({
  contentId,
  contentType,
  currentVersion,
  onVersionRestored
}: ContentVersioningProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [versions, setVersions] = useState<VersionRecord[]>([])
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false)
  const [versionToRestore, setVersionToRestore] = useState<VersionRecord | null>(null)
  const [isRestoring, setIsRestoring] = useState(false)
  
  // Fetch version history when dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      fetchVersionHistory()
    }
  }, [isDialogOpen])
  
  // Fetch version history
  const fetchVersionHistory = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch(
        `/api/content/versions?contentId=${contentId}&contentType=${contentType}`
      )
      
      if (!response.ok) {
        throw new Error("Failed to fetch version history")
      }
      
      const data = await response.json()
      
      if (data.success && data.history) {
        setVersions(data.history)
      } else {
        throw new Error(data.error || "Failed to fetch version history")
      }
    } catch (error) {
      console.error("Error fetching version history:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch version history",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Create a new version
  const createVersion = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch("/api/content/versions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentId,
          contentType,
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to create version")
      }
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Version created",
          description: "Created a new snapshot of the current content.",
        })
        
        // Refresh history
        fetchVersionHistory()
      } else {
        throw new Error(data.error || "Failed to create version")
      }
    } catch (error) {
      console.error("Error creating version:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create version",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Restore a specific version
  const restoreVersion = async () => {
    if (!versionToRestore) return
    
    try {
      setIsRestoring(true)
      
      const response = await fetch("/api/content/versions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contentId,
          contentType,
          versionId: versionToRestore.id,
        }),
      })
      
      if (!response.ok) {
        throw new Error("Failed to restore version")
      }
      
      const data = await response.json()
      
      if (data.success) {
        toast({
          title: "Version restored",
          description: `Restored to version ${versionToRestore.version}.`,
        })
        
        // Close dialogs
        setRestoreDialogOpen(false)
        setIsDialogOpen(false)
        
        // Refresh the page or component
        if (onVersionRestored) {
          onVersionRestored()
        } else {
          router.refresh()
        }
      } else {
        throw new Error(data.error || "Failed to restore version")
      }
    } catch (error) {
      console.error("Error restoring version:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to restore version",
        variant: "destructive",
      })
    } finally {
      setIsRestoring(false)
      setVersionToRestore(null)
    }
  }
  
  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <HistoryIcon className="h-4 w-4" />
            <span>Version History</span>
            <Badge variant="outline" className="ml-1 text-xs font-normal">
              v{currentVersion}
            </Badge>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Content Version History</DialogTitle>
            <DialogDescription>
              View and restore previous versions of this {contentType}.
              Current version: <Badge variant="outline">v{currentVersion}</Badge>
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={createVersion}
              disabled={isLoading}
            >
              {isLoading ? <Loader2Icon className="h-4 w-4 mr-2 animate-spin" /> : <DiffIcon className="h-4 w-4 mr-2" />}
              Create Snapshot
            </Button>
          </div>
          
          <div className="mt-4 max-h-[400px] overflow-y-auto pr-2">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : versions.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">
                No version history found for this content.
              </p>
            ) : (
              <Accordion type="single" collapsible className="border-none">
                {versions.map((version) => (
                  <AccordionItem 
                    key={version.id} 
                    value={version.id}
                    className="border px-4 rounded-md mb-3 hover:bg-muted/30"
                  >
                    <AccordionTrigger className="py-3">
                      <div className="flex items-center gap-2 text-left">
                        <Badge variant="outline" className="font-normal">
                          v{version.version}
                        </Badge>
                        <span className="font-medium">{version.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 py-2">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={version.createdBy.image || undefined} />
                            <AvatarFallback>
                              {version.createdBy.name?.substring(0, 2) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            Created by {version.createdBy.name} on {format(new Date(version.createdAt), "MMM d, yyyy 'at' h:mm a")}
                          </span>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <div className="text-sm">
                            <span className="font-medium">Status:</span>{" "}
                            <Badge variant="secondary" className="font-normal">
                              {version.status}
                            </Badge>
                          </div>
                          
                          {contentType === "devotional" && version.scripture && (
                            <div className="text-sm">
                              <span className="font-medium">Scripture:</span>{" "}
                              {version.scripture}
                            </div>
                          )}
                          
                          {contentType === "announcement" && (
                            <>
                              {version.startDate && (
                                <div className="text-sm">
                                  <span className="font-medium">Date Range:</span>{" "}
                                  {format(new Date(version.startDate), "MMM d, yyyy")}
                                  {version.endDate && ` - ${format(new Date(version.endDate), "MMM d, yyyy")}`}
                                </div>
                              )}
                              <div className="text-sm">
                                <span className="font-medium">Priority:</span>{" "}
                                {version.priority}
                              </div>
                            </>
                          )}
                          
                          <div className="text-sm">
                            <span className="font-medium">Content Preview:</span>
                            <p className="mt-1 text-muted-foreground line-clamp-3">
                              {version.content}
                            </p>
                          </div>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => {
                            setVersionToRestore(version)
                            setRestoreDialogOpen(true)
                          }}
                        >
                          <RotateCwIcon className="h-4 w-4 mr-2" />
                          Restore This Version
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>
          
          <DialogFooter className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground flex items-center">
              <ClockIcon className="h-3 w-3 mr-1" />
              Last updated: {format(new Date(), "MMM d, yyyy")}
            </div>
            
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Restore confirmation dialog */}
      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Version {versionToRestore?.version}</AlertDialogTitle>
            <AlertDialogDescription>
              This will replace the current content with the version from{" "}
              {versionToRestore?.createdAt && 
                format(new Date(versionToRestore.createdAt), "MMM d, yyyy 'at' h:mm a")
              }. 
              This action will create a backup of the current version.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setVersionToRestore(null)}
              disabled={isRestoring}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={restoreVersion}
              disabled={isRestoring}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isRestoring ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Restoring...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Restore Version
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
