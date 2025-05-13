"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckIcon, XIcon, FileTextIcon, SendIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type ContentType = "announcement" | "devotional"

interface ContentApprovalProps {
  id: string
  type: ContentType
  status: string
  reviewComment?: string | null
  reviewedBy?: {
    id: string
    name: string | null
  } | null
  reviewedAt?: Date | null
  isAuthor: boolean
  canApprove: boolean
}

export function ContentApproval({
  id,
  type,
  status,
  reviewComment,
  reviewedBy,
  reviewedAt,
  isAuthor,
  canApprove
}: ContentApprovalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmittingForReview, setIsSubmittingForReview] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isRejecting, setIsRejecting] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectComment, setRejectComment] = useState("")
  const [approveComment, setApproveComment] = useState("")
  
  // Submit content for review
  const submitForReview = async () => {
    try {
      setIsSubmittingForReview(true)
      
      const response = await fetch(`/api/content/review/${type}/${id}`, {
        method: "POST"
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to submit for review")
      }
      
      toast({
        title: "Submitted for review",
        description: `Your ${type} has been submitted for review.`,
      })
      
      router.refresh()
    } catch (error) {
      console.error("Error submitting for review:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit for review",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingForReview(false)
    }
  }
  
  // Approve content
  const approveContent = async () => {
    try {
      setIsApproving(true)
      
      const response = await fetch(`/api/content/approve/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "APPROVED",
          comment: approveComment.trim() || undefined,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to approve content")
      }
      
      toast({
        title: "Content approved",
        description: `The ${type} has been approved and scheduled for publication.`,
      })
      
      setApproveDialogOpen(false)
      setApproveComment("")
      router.refresh()
    } catch (error) {
      console.error("Error approving content:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to approve content",
        variant: "destructive",
      })
    } finally {
      setIsApproving(false)
    }
  }
  
  // Reject content
  const rejectContent = async () => {
    try {
      setIsRejecting(true)
      
      // Reject comment is required
      if (!rejectComment.trim()) {
        toast({
          title: "Comment required",
          description: "Please provide a reason for rejection",
          variant: "destructive",
        })
        setIsRejecting(false)
        return
      }
      
      const response = await fetch(`/api/content/approve/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "REJECTED",
          comment: rejectComment,
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to reject content")
      }
      
      toast({
        title: "Content rejected",
        description: `The ${type} has been rejected and returned to the author.`,
      })
      
      setRejectDialogOpen(false)
      setRejectComment("")
      router.refresh()
    } catch (error) {
      console.error("Error rejecting content:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reject content",
        variant: "destructive",
      })
    } finally {
      setIsRejecting(false)
    }
  }
  
  // Generate the appropriate approval UI based on status
  const renderApprovalUI = () => {
    // Show review status
    if (status === "REVIEW") {
      return (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-blue-700">
            <FileTextIcon className="h-5 w-5" />
            <h3 className="font-medium">Under Review</h3>
          </div>
          <p className="text-sm text-blue-600">
            This content is currently being reviewed by our content team.
          </p>
          
          {canApprove && (
            <div className="flex gap-3 mt-4">
              <Button
                variant="default"
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setApproveDialogOpen(true)}
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50"
                onClick={() => setRejectDialogOpen(true)}
              >
                <XIcon className="h-4 w-4 mr-2" />
                Reject
              </Button>
            </div>
          )}
        </div>
      )
    }
    
    // Show rejected status
    if (status === "REJECTED") {
      return (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-red-700">
            <XIcon className="h-5 w-5" />
            <h3 className="font-medium">Changes Requested</h3>
          </div>
          
          {reviewComment && (
            <div className="text-sm">
              <p className="font-medium text-red-700">Reviewer's comments:</p>
              <p className="mt-1 text-red-600 whitespace-pre-line">{reviewComment}</p>
            </div>
          )}
          
          {reviewedBy && reviewedAt && (
            <p className="text-xs text-red-500">
              Reviewed by {reviewedBy.name} on {new Date(reviewedAt).toLocaleDateString()}
            </p>
          )}
          
          {isAuthor && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="border-red-200 hover:bg-red-100"
                onClick={submitForReview}
                disabled={isSubmittingForReview}
              >
                {isSubmittingForReview && (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                )}
                <SendIcon className={cn("h-4 w-4 mr-2", isSubmittingForReview && "hidden")} />
                Resubmit for Review
              </Button>
            </div>
          )}
        </div>
      )
    }
    
    // Show draft status with submit for review button
    if (status === "DRAFT" && isAuthor) {
      return (
        <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-slate-700">
            <FileTextIcon className="h-5 w-5" />
            <h3 className="font-medium">Draft</h3>
          </div>
          <p className="text-sm text-slate-600">
            This content is currently in draft mode and is not visible to the public.
          </p>
          
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={submitForReview}
              disabled={isSubmittingForReview}
            >
              {isSubmittingForReview && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              <SendIcon className={cn("h-4 w-4 mr-2", isSubmittingForReview && "hidden")} />
              Submit for Review
            </Button>
          </div>
        </div>
      )
    }
    
    // For scheduled or published content that has been approved
    if (["SCHEDULED", "PUBLISHED"].includes(status) && reviewedBy) {
      return (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg space-y-3">
          <div className="flex items-center gap-2 text-green-700">
            <CheckIcon className="h-5 w-5" />
            <h3 className="font-medium">
              {status === "SCHEDULED" ? "Approved (Scheduled)" : "Published"}
            </h3>
          </div>
          
          {reviewComment && (
            <div className="text-sm">
              <p className="font-medium text-green-700">Reviewer's comments:</p>
              <p className="mt-1 text-green-600 whitespace-pre-line">{reviewComment}</p>
            </div>
          )}
          
          {reviewedBy && reviewedAt && (
            <p className="text-xs text-green-500">
              Approved by {reviewedBy.name} on {new Date(reviewedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      )
    }
    
    return null
  }
  
  return (
    <>
      {renderApprovalUI()}
      
      {/* Rejection dialog */}
      <AlertDialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject {type.charAt(0).toUpperCase() + type.slice(1)}</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide feedback to the author on why this content is being rejected 
              and what changes are needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Label htmlFor="reject-comment" className="text-sm font-medium">
              Feedback for the author <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reject-comment"
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="Provide specific feedback on what needs to be changed..."
              className="mt-1.5 min-h-24"
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setRejectComment("")}
              disabled={isRejecting}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={rejectContent}
              disabled={isRejecting || !rejectComment.trim()}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {isRejecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XIcon className="h-4 w-4 mr-2" />
                  Reject Content
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Approval dialog */}
      <AlertDialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve {type.charAt(0).toUpperCase() + type.slice(1)}</AlertDialogTitle>
            <AlertDialogDescription>
              This content will be approved and scheduled for publication.
              You can optionally provide feedback to the author.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Label htmlFor="approve-comment" className="text-sm font-medium">
              Feedback for the author (optional)
            </Label>
            <Textarea
              id="approve-comment"
              value={approveComment}
              onChange={(e) => setApproveComment(e.target.value)}
              placeholder="Any comments or feedback for the author..."
              className="mt-1.5 min-h-16"
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setApproveComment("")}
              disabled={isApproving}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={approveContent}
              disabled={isApproving}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {isApproving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4 mr-2" />
                  Approve Content
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
