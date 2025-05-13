"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Search, Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface SermonSearchFiltersProps {
  availableSeries: string[]
  availableTags: string[]
  availableSpeakers: string[]
  onFilter: (filters: {
    search: string
    speaker: string
    series: string
    tag: string
    featured: boolean
  }) => void
  className?: string
}

export function SermonSearchFilters({
  availableSeries,
  availableTags,
  availableSpeakers,
  onFilter,
  className = "",
}: SermonSearchFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [speaker, setSpeaker] = useState(searchParams.get("speaker") || "")
  const [series, setSeries] = useState(searchParams.get("series") || "")
  const [tag, setTag] = useState(searchParams.get("tag") || "")
  const [featured, setFeatured] = useState(searchParams.get("featured") === "true")

  const handleSearch = () => {
    // Call the onFilter callback
    onFilter({ search, speaker, series, tag, featured })
    
    // Update URL params
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (speaker) params.set("speaker", speaker)
    if (series) params.set("series", series)
    if (tag) params.set("tag", tag)
    if (featured) params.set("featured", "true")
    
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch("")
    setSpeaker("")
    setSeries("")
    setTag("")
    setFeatured(false)
    
    onFilter({ search: "", speaker: "", series: "", tag: "", featured: false })
    router.push(pathname)
  }
  
  // Count active filters
  const activeFilterCount = [
    search, speaker, series, tag, featured
  ].filter(Boolean).length

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search bar */}
      <div className="relative flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search sermons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch()
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setIsOpen(!isOpen)}
          className="sm:w-auto w-full"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
        
        <Button onClick={handleSearch}>
          Search
        </Button>
      </div>
      
      {/* Expanded filter section */}
      {isOpen && (
        <div className="bg-card border rounded-md p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Speakers filter */}
          <div className="space-y-2">
            <Label htmlFor="speaker-select">Speaker</Label>
            <Select value={speaker} onValueChange={setSpeaker}>
              <SelectTrigger id="speaker-select">
                <SelectValue placeholder="All speakers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All speakers</SelectItem>
                {availableSpeakers.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Series filter */}
          <div className="space-y-2">
            <Label htmlFor="series-select">Series</Label>
            <Select value={series} onValueChange={setSeries}>
              <SelectTrigger id="series-select">
                <SelectValue placeholder="All series" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All series</SelectItem>
                {availableSeries.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Tags filter */}
          <div className="space-y-2">
            <Label htmlFor="tag-select">Tag</Label>
            <Select value={tag} onValueChange={setTag}>
              <SelectTrigger id="tag-select">
                <SelectValue placeholder="All tags" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All tags</SelectItem>
                {availableTags.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Featured filter */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={featured}
              onCheckedChange={(checked) => setFeatured(checked as boolean)}
            />
            <Label htmlFor="featured">Featured sermons only</Label>
          </div>
          
          {/* Clear filters button */}
          <div className="md:col-span-2 flex justify-end">
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
