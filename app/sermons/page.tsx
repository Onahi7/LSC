"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { SermonCard } from "@/components/SermonCard"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { 
  Loader2, 
  Plus, 
  Search,
  Pause,
  Play,
  Download,
  Share2,
  ChevronRight,
  X,
  Filter,
  Volume2,
  VolumeX,
  ExternalLink,
  User,
  Calendar,
  Clock,
  BookOpen
} from "lucide-react"
import Link from "next/link"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import IntuitiveHeader from "../components/IntuitiveHeader"
import Footer from "../components/Footer"
import { motion, AnimatePresence } from "framer-motion"

import { useSermons } from "@/hooks/use-sermons"

// Sample data - this would normally come from the API but is provided for development
const sampleSermons = [
  {
    id: 1,
    title: "Discovering Your Purpose",
    speaker: "Pastor Samuel Adeyemi",
    date: "2023-12-10",
    duration: "45:22",
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
];

// Helper functions for filtering
const getSpeakers = () => [...new Set(sampleSermons.map((sermon) => sermon.speaker))].sort();
const getSeries = () => [...new Set(sampleSermons.map((sermon) => sermon.series))].sort();
const getTags = () => [...new Set(sampleSermons.flatMap((sermon) => sermon.tags))].sort();

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

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
  const session = useSession();
  const { toast } = useToast();
  const playerRef = useRef<HTMLDivElement>(null);
  
  // For pagination
  const page = Number(searchParams.page) || 1;
  
  // Use the hook with sample data instead of fetching
  // In a real application, you would use the actual useSermons hook
  const {
    sermons = sampleSermons,
    total = sampleSermons.length,
    isLoading = false,
    error = null,
    pageCount = 1,
  } = { sermons: sampleSermons }; // Using sample data for now
  
  // State for filters and search
  const [searchQuery, setSearchQuery] = useState(searchParams.search || "");
  const [selectedSpeaker, setSelectedSpeaker] = useState(searchParams.speaker || "");
  const [selectedSeries, setSelectedSeries] = useState(searchParams.series || "");
  const [selectedTag, setSelectedTag] = useState(searchParams.tag || "");
  const [showFeatured, setShowFeatured] = useState(searchParams.featured === "true");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // State for audio player
  const [selectedSermon, setSelectedSermon] = useState<typeof sampleSermons[0] | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Filter sermons based on search and filters
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInputRef.current) {
        setSearchQuery(searchInputRef.current.value);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle sermon playback
  const handlePlaySermon = (sermon: typeof sampleSermons[0]) => {
    setSelectedSermon(sermon);
    setIsPlayerOpen(true);
    setIsPlaying(true);
  };
  
  // Handle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };
  
  // Handle player updates
  useEffect(() => {
    if (isPlaying && isPlayerOpen) {
      // Play audio
    } else {
      // Pause audio
    }
  }, [isPlaying, isPlayerOpen]);
  
  // Cleanup player on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPlayerOpen && selectedSermon) {
        if (e.key === " " && !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName || "")) {
          e.preventDefault();
          togglePlayPause();
        }
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPlayerOpen, selectedSermon, isPlaying]);
  
  // Filter sermons based on selected filters
  const filteredSermons = sermons.filter((sermon) => {
    const matchSpeaker = !selectedSpeaker || sermon.speaker === selectedSpeaker;
    const matchSeries = !selectedSeries || sermon.series === selectedSeries;
    const matchTag = !selectedTag || sermon.tags.includes(selectedTag);
    const matchFeatured = !showFeatured || sermon.featured;
    
    const query = searchQuery.toLowerCase();
    const matchSearch = !query || 
          sermon.title.toLowerCase().includes(query) ||
          sermon.speaker.toLowerCase().includes(query) || 
          sermon.series.toLowerCase().includes(query) ||
          sermon.scripture.toLowerCase().includes(query) ||
          sermon.tags.some(tag => tag.toLowerCase().includes(query));
    
    return matchSpeaker && matchSeries && matchTag && matchFeatured && matchSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <IntuitiveHeader />
      
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Hero section */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-800 to-indigo-900 p-8 text-white">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Sermons Library</h1>
              <p className="text-lg md:text-xl max-w-2xl mb-6">
                Explore our collection of messages that will inspire, challenge, and equip you in your spiritual journey.
              </p>
              
              {/* Search and filter bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
                  <Input
                    ref={searchInputRef}
                    defaultValue={searchParams.search}
                    placeholder="Search by title, speaker, topic..."
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/70 w-full"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                {session.status === "authenticated" && (
                  <Button asChild>
                    <Link href="/sermons/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Sermon
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            
            {/* Background decorative elements */}
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent" />
            <div className="absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          
          {/* Filters */}
          <div className="relative">
            {/* Desktop filters */}
            <div className="hidden md:flex gap-4 items-center">
              <div className="flex-1">
                <Select value={selectedSpeaker} onValueChange={setSelectedSpeaker}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Speaker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Speakers</SelectItem>
                    {getSpeakers().map((speaker) => (
                      <SelectItem key={speaker} value={speaker}>
                        {speaker}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Series" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Series</SelectItem>
                    {getSeries().map((series) => (
                      <SelectItem key={series} value={series}>
                        {series}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Topics</SelectItem>
                    {getTags().map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag.charAt(0).toUpperCase() + tag.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-0">
                <Button
                  variant={showFeatured ? "default" : "outline"}
                  onClick={() => setShowFeatured(!showFeatured)}
                >
                  Featured
                </Button>
              </div>
            </div>
            
            {/* Mobile filters slide down */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden overflow-hidden bg-card border rounded-md p-4 mt-4 space-y-4"
                >
                  <div>
                    <label className="text-sm font-medium mb-1 block">Speaker</label>
                    <Select value={selectedSpeaker} onValueChange={setSelectedSpeaker}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Speaker" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Speakers</SelectItem>
                        {getSpeakers().map((speaker) => (
                          <SelectItem key={speaker} value={speaker}>
                            {speaker}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Series</label>
                    <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Series" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Series</SelectItem>
                        {getSeries().map((series) => (
                          <SelectItem key={series} value={series}>
                            {series}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Topic</label>
                    <Select value={selectedTag} onValueChange={setSelectedTag}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Topics</SelectItem>
                        {getTags().map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag.charAt(0).toUpperCase() + tag.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Button
                      variant={showFeatured ? "default" : "outline"}
                      onClick={() => setShowFeatured(!showFeatured)}
                      className="w-full"
                    >
                      {showFeatured ? "Featured Only" : "All Sermons"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Player */}
            <AnimatePresence>
              {isPlayerOpen && selectedSermon && (
                <motion.div
                  ref={playerRef}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg p-4"
                >
                  <div className="container mx-auto">
                    <div className="flex items-center gap-4">
                      <button onClick={togglePlayPause} className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-1" />}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-2">
                          <h3 className="font-semibold truncate">{selectedSermon.title}</h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span>{selectedSermon.speaker}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(selectedSermon.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{selectedSermon.duration}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              <span>{selectedSermon.scripture}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <Slider value={[currentTime]} max={duration} onValueChange={(values) => setCurrentTime(values[0])} />
                          </div>
                          <div className="text-xs text-muted-foreground whitespace-nowrap">
                            {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, "0")} / 
                            {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, "0")}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)}>
                                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{isMuted ? "Unmute" : "Mute"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={selectedSermon.audioUrl} target="_blank" download>
                                  <Download className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Download</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/sermons/${selectedSermon.id}`}>
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View Details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" onClick={() => setIsPlayerOpen(false)}>
                                <X className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Close Player</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hidden audio element */}
                  <audio
                    ref={audioRef}
                    src={selectedSermon.audioUrl}
                    onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                    onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
                    onEnded={() => setIsPlaying(false)}
                    muted={isMuted}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Loading state */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          
          {/* Error state */}
          {error && (
            <div className="py-12 text-center">
              <p className="text-destructive">Error loading sermons. Please try again later.</p>
            </div>
          )}
          
          {/* No results */}
          {!isLoading && !error && filteredSermons.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-xl font-medium mb-2">No sermons found</p>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          )}
          
          {/* Sermon list */}
          {!isLoading && !error && filteredSermons.length > 0 && (
            <div className="space-y-8">
              {/* List view */}
              <div className="space-y-4">
                {filteredSermons.map((sermon, index) => (
                  <motion.div
                    key={sermon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group relative overflow-hidden rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="md:w-1/4 lg:w-1/5 relative aspect-video md:aspect-square overflow-hidden rounded-md flex-shrink-0">
                        <img src={sermon.thumbnail} alt={sermon.title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => handlePlaySermon(sermon)}
                          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Play className="h-12 w-12 text-white" />
                        </button>
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap justify-between items-start gap-2">
                          <h3 className="text-xl font-semibold">
                            <Link href={`/sermons/${sermon.id}`} className="hover:underline">{sermon.title}</Link>
                          </h3>
                          
                          {sermon.featured && <Badge variant="secondary">Featured</Badge>}
                        </div>
                        
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5" />
                            <span>{sermon.speaker}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(sermon.date)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{sermon.duration}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>{sermon.scripture}</span>
                          </div>
                        </div>
                        
                        <p className="line-clamp-2 text-muted-foreground">{sermon.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {sermon.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => setSelectedTag(tag)}>
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Series group view */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Series</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getSeries().map((series) => {
                    const seriesSermons = sermons.filter((sermon) => sermon.series === series);
                    const latestSermon = seriesSermons.sort(
                      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                    )[0];
                    
                    return (
                      <motion.div
                        key={series}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer"
                        tabIndex={0}
                        onClick={() => setSelectedSeries(series)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedSeries(series);
                          }
                        }}
                      >
                        <div className="relative aspect-video">
                          <img src={latestSermon.thumbnail} alt={series} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end">
                            <div className="p-4 text-white">
                              <h3 className="text-xl font-semibold">{series}</h3>
                              <p className="text-sm text-white/80">{seriesSermons.length} sermons</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-muted-foreground mb-2">
                            Latest: {latestSermon.title}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{formatDate(latestSermon.date)}</span>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
              
              {/* Pagination */}
              {pageCount > 1 && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="py-8"
                >
                  <Pagination>
                    <PaginationContent>
                      {page > 1 && (
                        <PaginationItem>
                          <PaginationPrevious href={`/sermons?page=${page - 1}`} />
                        </PaginationItem>
                      )}
                      
                      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                        <PaginationItem key={p}>
                          <PaginationLink href={`/sermons?page=${p}`} isActive={p === page}>
                            {p}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      
                      {page < pageCount && (
                        <PaginationItem>
                          <PaginationNext href={`/sermons?page=${page + 1}`} />
                        </PaginationItem>
                      )}
                    </PaginationContent>
                  </Pagination>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </main>
      
      {/* Mobile player */}
      <AnimatePresence>
        {isPlayerOpen && selectedSermon && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg p-4"
          >
            <div className="flex items-center gap-3">
              <button onClick={togglePlayPause} className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{selectedSermon.title}</h4>
                <p className="text-xs text-muted-foreground truncate">{selectedSermon.speaker}</p>
              </div>
              
              <Button variant="ghost" size="icon" onClick={() => setIsPlayerOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
}
