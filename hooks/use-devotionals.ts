import { useState, useEffect } from "react"

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

interface UseDevotionals {
  page?: number
  limit?: number
  search?: string
  author?: string
  tag?: string
  featured?: boolean
}

export function useDevotionals({
  page = 1,
  limit = 9,
  search = "",
  author = "",
  tag = "",
  featured = false,
}: UseDevotionals = {}) {
  const [devotionals, setDevotionals] = useState<Devotional[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableAuthors, setAvailableAuthors] = useState<{id: string, name: string, image?: string}[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])

  // Fetch devotionals based on filters
  useEffect(() => {
    const fetchDevotionals = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })
        
        if (search) params.append("search", search)
        if (author) params.append("author", author)
        if (tag) params.append("tag", tag)
        if (featured) params.append("featured", "true")

        const response = await fetch(`/api/devotionals?${params}`)
        if (!response.ok) throw new Error("Failed to fetch devotionals")

        const data = await response.json()
        setDevotionals(data.devotionals)
        setTotal(data.pagination?.total || 0)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDevotionals()
  }, [page, limit, search, author, tag, featured])

  // Fetch available metadata for filters
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch('/api/devotionals/metadata')
        if (!response.ok) throw new Error("Failed to fetch metadata")

        const data = await response.json()
        setAvailableAuthors(data.authors || [])
        setAvailableTags(data.tags || [])
      } catch (error) {
        console.error("Error fetching devotional metadata:", error)
      }
    }

    fetchMetadata()
  }, [])

  return {
    devotionals,
    total,
    isLoading,
    error,
    pageCount: Math.ceil(total / limit),
    availableAuthors,
    availableTags
  }
}
