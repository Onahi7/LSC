"use client"

import * as React from "react"
import { Session } from "next-auth"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Play, Pause, Volume2, VolumeX, X, Share2, Download, ChevronRight, Calendar, Clock, User, Plus, Loader2 } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { SermonSearchFilters } from "@/components/SermonSearchFilters"
import { useRouter } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface SermonCardProps {
  sermon: Sermon
  onSelect: (sermon: Sermon) => void
  onTagSelect: (tag: string) => void
}

interface SermonsClientProps {
  initialSermons: Sermon[]
  pagination: {
    total: number
    pages: number
    page: number
    limit: number
  }
  availableSeries: string[]
  availableTags: string[]
  availableSpeakers: string[]
  session: Session | null
}

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

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Format duration for screen readers
const formatDurationForScreenReader = (duration: string) => {
  const [minutes, seconds] = duration.split(":").map(Number)
  return `${minutes} minutes and ${seconds} seconds`
}

// Sermon card component
const SermonCard = ({ sermon, onSelect, onTagSelect }: SermonCardProps) => {
  return (
    <div className="group bg-background rounded-lg border border-border overflow-hidden hover:border-primary/50 transition-colors">
      <div
        className="relative aspect-video cursor-pointer"
        onClick={() => onSelect(sermon)}
        role="button"
        tabIndex={0}
        aria-label={`Play ${sermon.title}`}
      >
        <Image
          src={sermon.thumbnail || "/placeholder.svg"}
          alt=""
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <Play className="h-12 w-12 text-white" />
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 line-clamp-2">
          <Link
            href={`/sermons/${sermon.id}`}
            className="hover:text-primary transition-colors"
          >
            {sermon.title}
          </Link>
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <User className="h-4 w-4" aria-hidden="true" />
          <span>{sermon.preacher.name}</span>
          <span className="text-border">•</span>
          <Calendar className="h-4 w-4" aria-hidden="true" />
          <span>{formatDate(sermon.createdAt)}</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-primary"
            onClick={() => onSelect(sermon)}
          >
            Listen Now <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          {sermon.tags.length > 0 && (
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => onTagSelect(sermon.tags[0])}
            >
              {sermon.tags[0]}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}

export function SermonsClient({
  initialSermons,
  pagination,
  availableSeries,
  availableTags,
  availableSpeakers,
  session,
}: SermonsClientProps) {
  const router = useRouter();
  const [filteredSermons, setFilteredSermons] = React.useState(initialSermons)
  const [selectedSermon, setSelectedSermon] = React.useState<Sermon | null>(null)
  const [isPlayerOpen, setIsPlayerOpen] = React.useState(false)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [currentProgress, setCurrentProgress] = React.useState(0)
  const [isMuted, setIsMuted] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const playerRef = React.useRef<HTMLDivElement>(null)
  
  const getTags = () =>
    Array.from(new Set(initialSermons.flatMap(sermon => sermon.tags))).sort()

  // Handle sermon selection
  const handleSermonSelect = (sermon: Sermon) => {
    setSelectedSermon(sermon)
    setIsPlayerOpen(true)
    setIsPlaying(true)
    setCurrentProgress(0)

    // Scroll to player if it's already open
    if (isPlayerOpen && playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Handle filter changes
  const handleFilter = async (filters: {
    search: string
    speaker: string
    series: string
    tag: string
    featured: boolean
  }) => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        ...(filters.search && { search: filters.search }),
        ...(filters.speaker && { speaker: filters.speaker }),
        ...(filters.series && { series: filters.series }),
        ...(filters.tag && { tag: filters.tag }),
        ...(filters.featured && { featured: "true" }),
      })

      const response = await fetch(`/api/sermons?${params}`)
      if (!response.ok) throw new Error("Failed to fetch sermons")

      const data = await response.json()
      setFilteredSermons(data.sermons)
    } catch (error) {
      console.error("Error fetching sermons:", error)
    } finally {
      setIsLoading(false)
    }
  }
  // Rest of your component code (player controls, rendering logic) goes here
  // ...

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Admin actions */}
      {session?.user && (
        <div className="flex justify-end mb-6">
          <Button asChild className="gap-1" variant="default">
            <Link href="/sermons/new">
              <Plus className="h-4 w-4" />
              New Sermon
            </Link>
          </Button>
        </div>
      )}

      {/* Search and filter section */}
      <div className="mb-8">
        <SermonSearchFilters
          availableSeries={availableSeries}
          availableTags={availableTags}
          availableSpeakers={availableSpeakers}
          onFilter={handleFilter}
          className="w-full"
        />
      </div>

      {/* Player */}
      {isPlayerOpen && selectedSermon && (
        <div
          ref={playerRef}
          className="bg-card rounded-lg p-4 shadow-lg mb-8 animate-in fade-in-0 slide-in-from-top-5 duration-300"
        >
          {/* Player content will go here */}
        </div>
      )}

      {/* Sermon grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredSermons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSermons.map((sermon) => (
            <SermonCard
              key={sermon.id}
              sermon={sermon}
              onSelect={handleSermonSelect}
              onTagSelect={(tag) => {
                handleFilter({
                  search: "",
                  speaker: "",
                  series: "",
                  tag: tag,
                  featured: false
                });
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No sermons found. Try adjusting your filters.</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.total > pagination.limit && (
        <div className="mt-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={pagination.page > 1 ? `?page=${pagination.page - 1}` : "#"}
                  className={pagination.page <= 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: pagination.pages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href={`?page=${i + 1}`}
                    isActive={pagination.page === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href={pagination.page < pagination.pages ? `?page=${pagination.page + 1}` : "#"}
                  className={pagination.page >= pagination.pages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}
