"use client"

import { useSession } from "next-auth/react"
import IntuitiveHeader from "../components/IntuitiveHeader"
import Footer from "../components/Footer"
import { DevotionalsClient } from "./client"
import { useDevotionals } from "@/hooks/use-devotionals"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function DevotionalsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  // Client-side search params
  const searchParams = useSearchParams()
  
  // For pagination
  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('search') || ""
  const author = searchParams.get('author') || ""
  const tag = searchParams.get('tag') || ""
  const featured = searchParams.get('featured') === "true"
  
  // Use the devotionals hook for fetching data
  const {
    devotionals,
    total,
    isLoading,
    error,
    availableAuthors,
    availableTags
  } = useDevotionals({
    page,
    limit: 9,
    search,
    author,
    tag,
    featured
  })

  if (error) {
    toast({
      title: "Error",
      description: error,
      variant: "destructive"
    })
  }
  
  // Calculate total pages
  const totalPages = Math.ceil(total / 9)
  
  return (
    <>
      <IntuitiveHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Daily Devotionals</h1>
          <p className="text-muted-foreground">
            Start your day with spiritual insights and encouragement.
          </p>
        </div>

        <DevotionalsClient 
          initialDevotionals={devotionals || []} 
          pagination={{
            total: total,
            pages: totalPages,
            page: page,
            limit: 9
          }}
          availableAuthors={availableAuthors || []}
          availableTags={availableTags || []}
          session={session}
        />
      </main>
      <Footer />
    </>
  )
}
