"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { SermonCard } from "@/components/SermonCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Search } from "lucide-react"
import Link from "next/link"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
  Pause,
  Download,
  Share2,
  ChevronRight,
  X,
  Filter,
  Volume2,
  VolumeX,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import IntuitiveHeader from "../components/IntuitiveHeader"
import Footer from "../components/Footer"

import { useSermons } from "@/hooks/use-sermons"

interface SermonsPageProps {
  searchParams: {
    page?: string
    search?: string
    speaker?: string
    series?: string
    tag?: string
    featured?: string
  }
}

export default function SermonsPage({ searchParams }: SermonsPageProps) {
  const page = Number(searchParams.page) || 1
  const {
    sermons,
    total,
    isLoading,
    error,
    pageCount,
  } = useSermons({
    page,
    search: searchParams.search,
    speaker: searchParams.speaker,
    series: searchParams.series,
    tag: searchParams.tag,
    featured: searchParams.featured === "true",
  })
    series: "Purpose Driven Life",
    scripture: "Jeremiah 29:11-13",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Sermon+1",
    audioUrl: "#",
    videoUrl: "#",
    description:
      "In this powerful message, Pastor Samuel explores how we can discover and fulfill God's unique purpose for our lives. Drawing from Jeremiah 29:11-13, he shares practical insights on recognizing God's voice and following His direction.",
    tags: ["purpose", "faith", "guidance"],
    featured: true,
  },
  {
    id: 2,
    title: "The Power of Prayer",
    speaker: "Pastor Ruth Adeyemi",
    date: "2023-12-03",
    duration: "38:42",
    series: "Prayer Warriors",
    scripture: "Matthew 6:5-13",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Sermon+2",
    audioUrl: "#",
    videoUrl: "#",
    description:
      "Pastor Ruth teaches on the transformative power of prayer in the believer's life. Learn how to develop a consistent prayer life and experience breakthrough in your spiritual journey.",
    tags: ["prayer", "spiritual growth", "discipline"],
    featured: true,
  },
  {
    id: 3,
    title: "Walking in Faith",
    speaker: "Pastor Daniel Okafor",
    date: "2023-11-26",
    duration: "42:15",
    series: "Faith Foundations",
    scripture: "Hebrews 11:1-6",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Sermon+3",
    audioUrl: "#",
    videoUrl: "#",
    description:
      "What does it mean to truly walk by faith? Pastor Daniel unpacks Hebrews 11 and shares inspiring stories of faith heroes, both biblical and contemporary.",
    tags: ["faith", "trust", "perseverance"],
    featured: false,
  },
  {
    id: 4,
    title: "Building Strong Families",
    speaker: "Pastor Samuel Adeyemi",
    date: "2023-11-19",
    duration: "47:30",
    series: "Family Matters",
    scripture: "Ephesians 5:21-6:4",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Sermon+4",
    audioUrl: "#",
    videoUrl: "#",
    description:
      "Pastor Samuel shares biblical principles for building healthy, God-centered families. This message covers marriage, parenting, and creating a home environment where faith can flourish.",
    tags: ["family", "relationships", "parenting"],
    featured: false,
  },
  {
    id: 5,
    title: "Overcoming Life's Challenges",
    speaker: "Pastor Ruth Adeyemi",
    date: "2023-11-12",
    duration: "40:55",
    series: "Victory in Christ",
    scripture: "Romans 8:28-39",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Sermon+5",
    audioUrl: "#",
    videoUrl: "#",
    description:
      "Life is full of challenges, but in Christ, we are more than conquerors. Pastor Ruth shares powerful testimonies and biblical strategies for overcoming adversity.",
    tags: ["challenges", "victory", "faith"],
    featured: false,
  },
  {
    id: 6,
    title: "The Heart of Worship",
    speaker: "Deaconess Grace Okonkwo",
    date: "2023-11-05",
    duration: "36:20",
    series: "Worship Experience",
    scripture: "John 4:23-24",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Sermon+6",
    audioUrl: "#",
    videoUrl: "#",
    description:
      "Deaconess Grace, our worship director, shares insights on what it means to worship God in spirit and truth. Discover how to deepen your worship experience both corporately and personally.",
    tags: ["worship", "praise", "spiritual growth"],
    featured: false,
  },
  {
    id: 7,
    title: "Living with Integrity",
    speaker: "Pastor Samuel Adeyemi",
    date: "2023-10-29",
    duration: "43:12",
    series: "Character Formation",
    scripture: "Psalm 15:1-5",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Sermon+7",
    audioUrl: "#",
    videoUrl: "#",
    description:
      "What does it mean to live a life of integrity? Pastor Samuel examines Psalm 15 and challenges believers to align their private and public lives with God's standards.",
    tags: ["integrity", "character", "holiness"],
    featured: false,
  },
  {
    id: 8,
    title: "The Great Commission",
    speaker: "Pastor Daniel Okafor",
    date: "2023-10-22",
    duration: "39:45",
    series: "Mission Possible",
    scripture: "Matthew 28:16-20",
    thumbnail: "/placeholder.svg?height=400&width=600&text=Sermon+8",
    audioUrl: "#",
    videoUrl: "#",
    description:
      "Jesus called us to make disciples of all nations. Pastor Daniel unpacks the Great Commission and shares practical ways we can fulfill this calling in our everyday lives.",
    tags: ["evangelism", "missions", "discipleship"],
    featured: false,
  },
]

// Get unique values for filters
const getSpeakers = () => [...new Set(sermons.map((sermon) => sermon.speaker))].sort()
const getSeries = () => [...new Set(sermons.map((sermon) => sermon.series))].sort()
const getTags = () => [...new Set(sermons.flatMap((sermon) => sermon.tags))].sort()

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

// Format duration for screen readers
const formatDurationForScreenReader = (duration: string) => {
  const [minutes, seconds] = duration.split(":").map(Number)
  return `${minutes} minutes and ${seconds} seconds`
}

export default function SermonsPage() {
  // State for filters and search
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSpeaker, setSelectedSpeaker] = useState("all")
  const [selectedSeries, setSelectedSeries] = useState("all")
  const [selectedTag, setSelectedTag] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [filteredSermons, setFilteredSermons] = useState(sermons)
  const [selectedSermon, setSelectedSermon] = useState<(typeof sermons)[0] | null>(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const playerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  // Filter sermons based on search and filters
  useEffect(() => {
    let results = sermons

    // Filter by tab
    if (activeTab === "featured") {
      results = results.filter((sermon) => sermon.featured)
    }

    // Filter by speaker
    if (selectedSpeaker !== "all") {
      results = results.filter((sermon) => sermon.speaker === selectedSpeaker)
    }

    // Filter by series
    if (selectedSeries !== "all") {
      results = results.filter((sermon) => sermon.series === selectedSeries)
    }

    // Filter by tag
    if (selectedTag !== "all") {
      results = results.filter((sermon) => sermon.tags.includes(selectedTag))
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (sermon) =>
          sermon.title.toLowerCase().includes(query) ||
          sermon.speaker.toLowerCase().includes(query) ||
          sermon.description.toLowerCase().includes(query) ||
          sermon.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          sermon.scripture.toLowerCase().includes(query) ||
          sermon.series.toLowerCase().includes(query),
      )
    }

    setFilteredSermons(results)
  }, [searchQuery, selectedSpeaker, selectedSeries, selectedTag, activeTab])

  // Handle sermon selection
  const handleSermonSelect = (sermon: (typeof sermons)[0]) => {
    setSelectedSermon(sermon)
    setIsPlayerOpen(true)
    setIsPlaying(true)
    setCurrentProgress(0)

    // Scroll to player if it's already open
    if (isPlayerOpen && playerRef.current) {
      playerRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Close player
  const closePlayer = () => {
    setIsPlayerOpen(false)
    setIsPlaying(false)
    setCurrentProgress(0)
  }

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedSpeaker("all")
    setSelectedSeries("all")
    setSelectedTag("all")
    setActiveTab("all")

    // Focus on search input after reset
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  // Simulate sermon playback
  useEffect(() => {
    if (isPlaying && isPlayerOpen) {
      const interval = setInterval(() => {
        setCurrentProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsPlaying(false)
            return 100
          }
          return prev + 0.5
        })
      }, 500)

      return () => clearInterval(interval)
    }
  }, [isPlaying, isPlayerOpen])

  // Handle keyboard shortcuts for player
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlayerOpen || !selectedSermon) return

      // Space bar to play/pause
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault()
        togglePlayPause()
      }

      // Escape to close player
      if (e.code === "Escape") {
        closePlayer()
      }

      // M to toggle mute
      if (e.code === "KeyM") {
        toggleMute()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isPlayerOpen, selectedSermon, isPlaying])

  // Format current time for player
  const formatCurrentTime = () => {
    if (!selectedSermon) return "00:00"

    const [totalMinutes, totalSeconds] = selectedSermon.duration.split(":").map(Number)
    const totalDurationInSeconds = totalMinutes * 60 + totalSeconds
    const currentTimeInSeconds = Math.floor((currentProgress / 100) * totalDurationInSeconds)

    const minutes = Math.floor(currentTimeInSeconds / 60)
    const seconds = currentTimeInSeconds % 60

    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col min-h-screen">
      <IntuitiveHeader />

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <div className="relative bg-primary/10 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto relative z-20"
            >
              <h1 className="text-4xl font-bold text-foreground mb-4">Sermons</h1>
              <p className="text-xl text-muted-foreground">
                Explore our collection of messages that inspire, challenge, and encourage spiritual growth.
              </p>

              {/* Search Bar */}
              <div className="mt-8 max-w-md mx-auto">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5"
                    aria-hidden="true"
                  />
                  <Input
                    type="text"
                    placeholder="Search sermons by title, speaker, or topic..."
                    className="pl-10 pr-4 py-2"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    ref={searchInputRef}
                    aria-label="Search sermons"
                  />
                  {searchQuery && (
                    <button
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Decorative wave divider - adjusted to prevent overlap */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
              <path
                fill="currentColor"
                fillOpacity="1"
                className="text-background"
                d="M0,160L48,144C96,128,192,96,288,90.7C384,85,480,107,576,128C672,149,768,171,864,165.3C960,160,1056,128,1152,117.3C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Add padding to the top of this container to prevent overlap with the wave */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/sermons" className="text-primary font-medium">
              Sermons
            </Link>
          </div>

          {/* Filters Section */}
          <div className="mb-8">
            <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All Sermons</TabsTrigger>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="md:hidden flex items-center gap-2"
                  aria-expanded={isFilterOpen}
                  aria-controls="filter-panel"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {(selectedSpeaker !== "all" || selectedSeries !== "all" || selectedTag !== "all") && (
                    <Badge variant="secondary" className="ml-1">
                      {[
                        selectedSpeaker !== "all" ? 1 : 0,
                        selectedSeries !== "all" ? 1 : 0,
                        selectedTag !== "all" ? 1 : 0,
                      ].reduce((a, b) => a + b, 0)}
                    </Badge>
                  )}
                </Button>

                <div className="hidden md:flex md:flex-row gap-4">
                  <div className="w-full sm:w-auto">
                    <Select value={selectedSpeaker} onValueChange={setSelectedSpeaker}>
                      <SelectTrigger className="w-full sm:w-[200px]" aria-label="Filter by speaker">
                        <SelectValue placeholder="Filter by Speaker" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Speakers</SelectItem>
                        {getSpeakers().map((speaker) => (
                          <SelectItem key={speaker} value={speaker}>
                            {speaker}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full sm:w-auto">
                    <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                      <SelectTrigger className="w-full sm:w-[200px]" aria-label="Filter by series">
                        <SelectValue placeholder="Filter by Series" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Series</SelectItem>
                        {getSeries().map((series) => (
                          <SelectItem key={series} value={series}>
                            {series}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-full sm:w-auto">
                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                      <SelectTrigger className="w-full sm:w-[200px]" aria-label="Filter by topic">
                        <SelectValue placeholder="Filter by Topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Topics</SelectItem>
                        {getTags().map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(selectedSpeaker !== "all" || selectedSeries !== "all" || selectedTag !== "all" || searchQuery) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Reset all filters"
                  >
                    Reset
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Filters Panel */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  id="filter-panel"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden bg-muted/30 rounded-lg p-4 mb-4 space-y-4"
                >
                  <div>
                    <label htmlFor="mobile-speaker-filter" className="text-sm font-medium block mb-2">
                      Speaker
                    </label>
                    <Select id="mobile-speaker-filter" value={selectedSpeaker} onValueChange={setSelectedSpeaker}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by Speaker" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Speakers</SelectItem>
                        {getSpeakers().map((speaker) => (
                          <SelectItem key={speaker} value={speaker}>
                            {speaker}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="mobile-series-filter" className="text-sm font-medium block mb-2">
                      Series
                    </label>
                    <Select id="mobile-series-filter" value={selectedSeries} onValueChange={setSelectedSeries}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by Series" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Series</SelectItem>
                        {getSeries().map((series) => (
                          <SelectItem key={series} value={series}>
                            {series}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="mobile-tag-filter" className="text-sm font-medium block mb-2">
                      Topic
                    </label>
                    <Select id="mobile-tag-filter" value={selectedTag} onValueChange={setSelectedTag}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by Topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Topics</SelectItem>
                        {getTags().map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => setIsFilterOpen(false)} className="mr-2">
                      Close
                    </Button>
                    <Button variant="default" size="sm" onClick={resetFilters}>
                      Reset All
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-muted-foreground">
              Showing {filteredSermons.length} {filteredSermons.length === 1 ? "sermon" : "sermons"}
            </p>

            {/* Active filters summary */}
            <div className="flex flex-wrap gap-2">
              {selectedSpeaker !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Speaker: {selectedSpeaker}
                  <button
                    onClick={() => setSelectedSpeaker("all")}
                    className="ml-1 hover:text-foreground"
                    aria-label={`Remove speaker filter: ${selectedSpeaker}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {selectedSeries !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Series: {selectedSeries}
                  <button
                    onClick={() => setSelectedSeries("all")}
                    className="ml-1 hover:text-foreground"
                    aria-label={`Remove series filter: ${selectedSeries}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}

              {selectedTag !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Topic: {selectedTag}
                  <button
                    onClick={() => setSelectedTag("all")}
                    className="ml-1 hover:text-foreground"
                    aria-label={`Remove topic filter: ${selectedTag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          </div>

          {/* Sermon Player (if open) */}
          <AnimatePresence>
            {isPlayerOpen && selectedSermon && (
              <motion.div
                ref={playerRef}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", damping: 25 }}
                className="bg-background border border-border rounded-xl shadow-md mb-8 overflow-hidden"
                aria-live="polite"
                role="region"
                aria-label="Sermon player"
              >
                <div className="md:flex">
                  {/* Sermon Thumbnail */}
                  <div className="md:w-1/3 aspect-video md:aspect-auto relative">
                    <img
                      src={selectedSermon.thumbnail || "/placeholder.svg"}
                      alt=""
                      className="w-full h-full object-cover"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button
                        onClick={togglePlayPause}
                        className="bg-primary text-primary-foreground rounded-full p-4 transform hover:scale-110 transition-transform duration-300"
                        aria-label={isPlaying ? "Pause sermon" : "Play sermon"}
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </button>
                    </div>
                  </div>

                  {/* Sermon Info */}
                  <div className="p-6 md:w-2/3">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold">{selectedSermon.title}</h2>
                        <div className="flex flex-wrap gap-4 mt-2">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <User className="h-4 w-4 mr-1" aria-hidden="true" />
                            <span>{selectedSermon.speaker}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />
                            <span>{formatDate(selectedSermon.date)}</span>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                            <span>{selectedSermon.duration}</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-primary font-medium mt-2">
                          <BookOpen className="h-4 w-4 mr-1" aria-hidden="true" />
                          <span>{selectedSermon.scripture}</span>
                        </div>
                      </div>
                      <button
                        onClick={closePlayer}
                        className="p-1 rounded-full hover:bg-muted transition-colors"
                        aria-label="Close player"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <p className="text-muted-foreground mb-6">{selectedSermon.description}</p>

                    {/* Audio Controls */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={togglePlayPause}
                          className="bg-primary text-primary-foreground rounded-full p-2"
                          aria-label={isPlaying ? "Pause sermon" : "Play sermon"}
                        >
                          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </button>

                        <div className="flex-grow">
                          <Slider
                            value={[currentProgress]}
                            max={100}
                            step={0.1}
                            className="w-full"
                            onValueChange={(value) => setCurrentProgress(value[0])}
                            aria-label="Playback progress"
                            aria-valuetext={`${formatCurrentTime()} of ${selectedSermon.duration}`}
                          />
                        </div>

                        <button
                          onClick={toggleMute}
                          className="p-2 rounded-full hover:bg-muted transition-colors"
                          aria-label={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                        </button>
                      </div>

                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{formatCurrentTime()}</span>
                        <span>{selectedSermon.duration}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-6">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <Download className="h-4 w-4" />
                              <span className="hidden sm:inline">Download</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download sermon audio</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <Share2 className="h-4 w-4" />
                              <span className="hidden sm:inline">Share</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Share this sermon</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <Link href={`/sermons/${selectedSermon.id}`} className="ml-auto">
                        <Button variant="default" size="sm" className="flex items-center gap-2">
                          <span>View Details</span>
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {selectedSermon.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-secondary"
                          onClick={() => setSelectedTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Keyboard shortcuts info */}
                <div className="px-6 py-3 bg-muted/30 text-xs text-muted-foreground border-t border-border">
                  <p>Keyboard shortcuts: Space = Play/Pause, M = Mute/Unmute, Esc = Close</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Sermons Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-background border border-border rounded-xl overflow-hidden shadow-md animate-pulse"
                >
                  <div className="aspect-video bg-muted"></div>
                  <div className="p-6">
                    <div className="h-6 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-full mb-4"></div>
                    <div className="h-4 bg-muted rounded w-full mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                      <div className="h-4 bg-muted rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredSermons.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredSermons.map((sermon, index) => (
                <motion.div
                  key={sermon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-background border border-border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group focus-within:ring-2 focus-within:ring-primary"
                >
                  <div className="relative aspect-video bg-muted">
                    <img
                      src={sermon.thumbnail || "/placeholder.svg"}
                      alt=""
                      className="w-full h-full object-cover"
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button
                        onClick={() => handleSermonSelect(sermon)}
                        className="bg-primary text-primary-foreground rounded-full p-4 transform scale-90 group-hover:scale-100 transition-transform duration-300"
                        aria-label={`Play sermon: ${sermon.title}`}
                      >
                        <Play className="h-6 w-6" />
                      </button>
                    </div>
                    {sermon.featured && (
                      <div className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      <Link
                        href={`/sermons/${sermon.id}`}
                        className="focus:outline-none"
                        aria-label={`${sermon.title} by ${sermon.speaker}, ${formatDurationForScreenReader(sermon.duration)}`}
                      >
                        {sermon.title}
                      </Link>
                    </h2>

                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <User className="h-4 w-4 mr-1" aria-hidden="true" />
                      <span>{sermon.speaker}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="h-4 w-4 mr-1" aria-hidden="true" />
                      <span>{formatDate(sermon.date)}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <Clock className="h-4 w-4 mr-1" aria-hidden="true" />
                      <span>{sermon.duration}</span>
                    </div>

                    <div className="flex items-center text-sm text-primary font-medium mb-4">
                      <BookOpen className="h-4 w-4 mr-1" aria-hidden="true" />
                      <span>{sermon.scripture}</span>
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-3">{sermon.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{sermon.series}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSermonSelect(sermon)}
                          className="text-primary font-medium flex items-center hover:underline"
                          aria-label={`Listen to ${sermon.title}`}
                        >
                          Listen <ChevronRight className="h-4 w-4 ml-1" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-muted/30 rounded-lg p-8 max-w-md mx-auto">
                <h3 className="text-xl font-bold mb-2">No sermons found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            </div>
          )}

          {/* Series Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8">Sermon Series</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...new Set(sermons.map((sermon) => sermon.series))].map((series, index) => {
                const seriesSermons = sermons.filter((sermon) => sermon.series === series)
                const latestSermon = seriesSermons.sort(
                  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
                )[0]

                return (
                  <motion.div
                    key={series}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-background border border-border rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer focus-within:ring-2 focus-within:ring-primary"
                    onClick={() => setSelectedSeries(series)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View ${series} series with ${seriesSermons.length} sermons`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setSelectedSeries(series)
                      }
                    }}
                  >
                    <div className="aspect-video bg-muted">
                      <img
                        src={latestSermon.thumbnail || "/placeholder.svg"}
                        alt=""
                        className="w-full h-full object-cover"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-1">{series}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {seriesSermons.length} {seriesSermons.length === 1 ? "sermon" : "sermons"}
                      </p>
                      <div className="flex items-center text-primary text-sm font-medium">
                        View Series <ChevronRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Subscribe Section */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="bg-primary/10 rounded-xl p-8 text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Never Miss a Sermon</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Subscribe to our podcast to receive the latest sermons directly on your favorite podcast platform.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Subscribe on Spotify
              </Button>
              <Button size="lg" variant="outline">
                Subscribe on Apple Podcasts
              </Button>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Sermon Player (fixed at bottom) */}
      <AnimatePresence>
        {isPlayerOpen && selectedSermon && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50"
            aria-live="polite"
            role="region"
            aria-label="Sermon mini player"
          >
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={selectedSermon.thumbnail || "/placeholder.svg"}
                    alt=""
                    className="w-full h-full object-cover"
                    aria-hidden="true"
                  />
                </div>

                <div className="flex-grow min-w-0">
                  <h3 className="font-bold text-lg truncate">{selectedSermon.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {selectedSermon.speaker} • {selectedSermon.series}
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <button
                      onClick={togglePlayPause}
                      className="bg-primary text-primary-foreground rounded-full p-2"
                      aria-label={isPlaying ? "Pause sermon" : "Play sermon"}
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </button>

                    <div className="flex-grow">
                      <Slider
                        value={[currentProgress]}
                        max={100}
                        step={0.1}
                        className="w-full"
                        onValueChange={(value) => setCurrentProgress(value[0])}
                        aria-label="Playback progress"
                        aria-valuetext={`${formatCurrentTime()} of ${selectedSermon.duration}`}
                      />
                    </div>

                    <button
                      onClick={toggleMute}
                      className="p-2 rounded-full hover:bg-muted transition-colors"
                      aria-label={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </button>

                    <button
                      onClick={closePlayer}
                      className="p-2 rounded-full hover:bg-muted transition-colors"
                      aria-label="Close mini player"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

