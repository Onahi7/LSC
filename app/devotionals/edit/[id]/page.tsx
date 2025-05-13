"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { DevotionalForm } from "@/components/DevotionalForm"
import { useToast } from "@/hooks/use-toast"
import IntuitiveHeader from "@/app/components/IntuitiveHeader"
import Footer from "@/app/components/Footer"

interface EditDevotionalParams {
  params: {
    id: string
  }
}

export default function EditDevotionalPage({ params }: EditDevotionalParams) {
  const [devotional, setDevotional] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
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
          description: "Failed to load devotional for editing",
          variant: "destructive",
        })
        router.push("/devotionals")
      } finally {
        setIsLoading(false)
      }
    }
    
    if (params.id) {
      fetchDevotional()
    }
  }, [params.id, router, toast])
  
  // Check user permission to edit this devotional
  useEffect(() => {
    if (!isLoading && devotional && session) {
      const isAuthor = session.user?.email === devotional.author.id
      const isAdmin = session.user?.email === "admin@example.com"
      
      if (!isAuthor && !isAdmin) {
        toast({
          title: "Permission denied",
          description: "You don't have permission to edit this devotional",
          variant: "destructive",
        })
        router.push("/devotionals")
      }
    }
  }, [devotional, isLoading, router, session, toast])
  
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
          </div>
        </main>
        <Footer />
      </>
    )
  }
  
  // Format the data for the form
  const formData = {
    ...devotional,
    publishedAt: devotional.publishedAt ? new Date(devotional.publishedAt) : undefined,
  }
  
  return (
    <>
      <IntuitiveHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Edit Devotional</h1>
          <p className="text-muted-foreground">
            Update your devotional content and settings
          </p>
        </div>
        
        <DevotionalForm initialData={formData} isEditing={true} />
      </main>
      <Footer />
    </>
  )
}
