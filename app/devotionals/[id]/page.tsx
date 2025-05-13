"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Calendar, Clock, User, MoreVertical, Edit, Trash2, Share } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import IntuitiveHeader from "@/app/components/IntuitiveHeader"
import Footer from "@/app/components/Footer"

interface DevotionalParams {
  params: {
    id: string
  }
}

interface Devotional {
  id: string
  title: string
  content: string
  scripture: string
  image?: string
  tags: string[]
  featured: boolean
  publishedAt: string
  status: string
  author: {
    id: string
    name: string
    image?: string
  }
  createdAt: string
  updatedAt: string
}

export default function DevotionalDetailPage({ params }: DevotionalParams) {
  const [devotional, setDevotional] = useState<Devotional | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()
  
  useEffect(() => {
    const fetchDevotional = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/devotionals/${params.id}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch devotional")
        }
        
        const data = await response.json()
        setDevotional(data)
      } catch (error) {
        console.error("Error fetching devotional:", error)
        toast({
          title: "Error",
          description: "Failed to load devotional",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    if (params.id) {
      fetchDevotional()
    }
  }, [params.id, toast])
  
  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/devotionals/${params.id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete devotional")
      }
      
      toast({
        title: "Devotional deleted",
        description: "The devotional has been deleted successfully",
      })
      
      router.push("/devotionals")
      router.refresh()
    } catch (error) {
      console.error("Error deleting devotional:", error)
      toast({
        title: "Error",
        description: "Failed to delete devotional",
        variant: "destructive",
      })
    }
  }
  
  const handleShare = async () => {
    try {
      const shareData = {
        title: devotional?.title,
        text: `${devotional?.title} - ${devotional?.scripture}`,
        url: window.location.href,
      }
      
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback for browsers that don't support navigator.share
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied!",
          description: "Devotional link copied to clipboard",
        })
      }
    } catch (error) {
      console.error("Error sharing:", error)
    }
  }
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }
  
  const isAuthor = session?.user?.email === devotional?.author.id
  
  if (isLoading) {
    return (
      <>
        <IntuitiveHeader />
        <main className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <p>Loading devotional...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }
  
  if (!devotional) {
    return (
      <>
        <IntuitiveHeader />
        <main className="container mx-auto px-4 py-16">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Devotional Not Found</h2>
            <p className="mb-6">The devotional you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/devotionals">Back to Devotionals</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }
  
  return (
    <>
      <IntuitiveHeader />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb navigation */}
        <div className="mb-6">
          <nav className="flex text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/devotionals" className="hover:text-primary">Devotionals</Link>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium truncate">{devotional.title}</span>
          </nav>
        </div>
        
        {/* Devotional header */}
        <div className="relative mb-8">
          {devotional.image && (
            <div className="relative h-72 md:h-96 rounded-lg overflow-hidden mb-6">
              <Image
                src={devotional.image}
                alt={devotional.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
            </div>
          )}
          
          {/* Actions menu for author */}
          {(isAuthor || session?.user?.email === "admin@example.com") && (
            <div className="absolute top-4 right-4 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="bg-background/80 backdrop-blur-sm hover:bg-background/90">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/devotionals/edit/${devotional.id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDeleteDialogOpen(true)} className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{devotional.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{devotional.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(devotional.createdAt)}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {devotional.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          
          <blockquote className="border-l-4 border-primary pl-4 italic text-lg mb-8">
            <p className="font-medium">{devotional.scripture}</p>
          </blockquote>
        </div>
        
        {/* Devotional content */}
        <article className="prose prose-lg dark:prose-invert max-w-none mb-12">
          {devotional.content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>
        
        {/* Actions */}
        <div className="flex justify-between items-center border-t pt-6">
          <Button asChild variant="outline">
            <Link href="/devotionals">
              Back to Devotionals
            </Link>
          </Button>
          
          <Button variant="ghost" onClick={handleShare}>
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </main>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the devotional.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <Footer />
    </>
  )
}
