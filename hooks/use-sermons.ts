import { useEffect, useState } from "react"

interface Sermon {
  id: string
  title: string
  content: string
  video_url: string[]
  audio_url: string[]
  thumbnail: string
  duration: string
  series: string
  scripture: string
  tags: string[]
  featured: boolean
  preacher: {
    id: string
    name: string
    image: string
  }
  createdAt: string
}

interface UseSermons {
  page?: number
  limit?: number
  search?: string
  speaker?: string
  series?: string
  tag?: string
  featured?: boolean
}

export function useSermons({
  page = 1,
  limit = 10,
  search = "",
  speaker = "",
  series = "",
  tag = "",
  featured = false,
}: UseSermons = {}) {
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [availableSeries, setAvailableSeries] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [availableSpeakers, setAvailableSpeakers] = useState<string[]>([])

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        })
        
        if (search) params.append("search", search)
        if (speaker) params.append("speaker", speaker)
        if (series) params.append("series", series)
        if (tag) params.append("tag", tag)
        if (featured) params.append("featured", "true")

        const response = await fetch(`/api/sermons?${params}`)
        if (!response.ok) throw new Error("Failed to fetch sermons")

        const data = await response.json()
        setSermons(data.sermons)
        setTotal(data.total || data.pagination?.total || 0)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Something went wrong")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSermons()
  }, [page, limit, search, speaker, series, tag, featured])

  // Fetch available metadata for filters
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        // Fetch available series
        const seriesResponse = await fetch('/api/sermons/series')
        if (seriesResponse.ok) {
          const seriesData = await seriesResponse.json()
          setAvailableSeries(seriesData.map((s: any) => s.name))
        }

        // Fetch available tags
        const tagsResponse = await fetch('/api/sermons/tags')
        if (tagsResponse.ok) {
          const tagsData = await tagsResponse.json()
          setAvailableTags(tagsData)
        }

        // Fetch available speakers (preachers)
        const speakersResponse = await fetch('/api/sermons/speakers')
        if (speakersResponse.ok) {
          const speakersData = await speakersResponse.json()
          setAvailableSpeakers(speakersData.map((s: any) => s.name))
        }
      } catch (error) {
        console.error('Error fetching metadata:', error)
      }
    }

    fetchMetadata()
  }, [])

  return {
    sermons,
    total,
    isLoading,
    error,
    pageCount: Math.ceil(total / limit),
    availableSeries,
    availableTags,
    availableSpeakers,
  }
}
