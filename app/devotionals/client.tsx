"use client"

import * as React from "react"
import { Session } from "next-auth"
import Link from "next/link"
import Image from "next/image"
import { Plus, Search, Filter, ChevronRight, Calendar, User, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface DevotionalCardProps {
  devotional: Devotional
  onTagSelect: (tag: string) => void
}

interface DevotionalsClientProps {
  initialDevotionals: Devotional[]
  pagination: {
    total: number
    pages: number
    page: number
    limit: number
  }
  availableAuthors: { id: string; name: string; image?: string }[]
  availableTags: string[]
  session: Session | null
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

// Devotional card component
const DevotionalCard = ({ devotional, onTagSelect }: DevotionalCardProps) => {
  return (
    <Card className="group overflow-hidden">
      {devotional.image && (
        <div className="relative aspect-video">
          <Image
            src={devotional.image || "/placeholder.svg"}
            alt=""
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <CardHeader className="p-4">
        <CardTitle className="text-xl">
          <Link
            href={`/devotionals/${devotional.id}`}
            className="hover:text-primary transition-colors"
          >
            {devotional.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Calendar className="h-3 w-3" />
          {formatDate(devotional.createdAt)}
          <span className="text-border">•</span>
          <User className="h-3 w-3" />
          {devotional.author.name}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-muted-foreground line-clamp-3">
          {devotional.content}
        </p>
        <p className="mt-2 text-sm italic">
          <strong>Scripture:</strong> {devotional.scripture}
        </p>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center border-t">
        <div className="space-x-1">
          {devotional.tags.slice(0, 2).map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="cursor-pointer hover:bg-secondary/80"
              onClick={() => onTagSelect(tag)}
            >
              {tag}
            </Badge>
          ))}
          {devotional.tags.length > 2 && (
            <Badge variant="outline">+{devotional.tags.length - 2}</Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="text-primary"
          asChild
        >
          <Link href={`/devotionals/${devotional.id}`}>
            Read More <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export function DevotionalsClient({
  initialDevotionals,
  pagination,
  availableAuthors,
  availableTags,
  session,
}: DevotionalsClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = React.useState(searchParams.get("search") || "")
  const [selectedAuthor, setSelectedAuthor] = React.useState(searchParams.get("author") || "")
  const [selectedTag, setSelectedTag] = React.useState(searchParams.get("tag") || "")
  const [isFeatured, setIsFeatured] = React.useState(searchParams.get("featured") === "true")
  const [devotionals, setDevotionals] = React.useState(initialDevotionals)
  const [isLoading, setIsLoading] = React.useState(false)
  
  // Handle filter changes
  const applyFilters = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(selectedAuthor && { author: selectedAuthor }),
        ...(selectedTag && { tag: selectedTag }),
        ...(isFeatured && { featured: "true" }),
      })
      
      // Update URL with filters
      router.push(`${pathname}?${params.toString()}`)
      
      const response = await fetch(`/api/devotionals?${params}`)
      if (!response.ok) throw new Error("Failed to fetch devotionals")
      
      const data = await response.json()
      setDevotionals(data.devotionals)
    } catch (error) {
      console.error("Error filtering devotionals:", error)
    } finally {
      setIsLoading(false)
    }
  }
  
  // Handle search input
  const handleSearch = () => {
    applyFilters()
  }
  
  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag)
    applyFilters()
  }
  
  // Reset filters
  const resetFilters = () => {
    setSearch("")
    setSelectedAuthor("")
    setSelectedTag("")
    setIsFeatured(false)
    router.push(pathname)
  }
  
  // Apply filters when component loads and there are URL params
  React.useEffect(() => {
    if (
      searchParams.get("search") ||
      searchParams.get("author") ||
      searchParams.get("tag") ||
      searchParams.get("featured")
    ) {
      applyFilters()
    }
  }, [searchParams])
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Admin actions */}
      {session?.user && (
        <div className="flex justify-end mb-6">
          <Button asChild className="gap-1" variant="default">
            <Link href="/devotionals/new">
              <Plus className="h-4 w-4" />
              New Devotional
            </Link>
          </Button>
        </div>
      )}
      
      {/* Search and filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search devotionals..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
              {(selectedAuthor || selectedTag || isFeatured) && (
                <Badge variant="secondary" className="ml-2">
                  {[
                    selectedAuthor && "Author",
                    selectedTag && "Tag",
                    isFeatured && "Featured"
                  ].filter(Boolean).length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Devotionals</SheetTitle>
              <SheetDescription>
                Apply filters to find specific devotionals
              </SheetDescription>
            </SheetHeader>
            
            <div className="py-6 space-y-6">
              {availableAuthors.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Select
                    value={selectedAuthor}
                    onValueChange={setSelectedAuthor}
                  >
                    <SelectTrigger id="author">
                      <SelectValue placeholder="All authors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All authors</SelectItem>
                      {availableAuthors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {availableTags.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="tag">Tag</Label>
                  <Select
                    value={selectedTag}
                    onValueChange={setSelectedTag}
                  >
                    <SelectTrigger id="tag">
                      <SelectValue placeholder="All tags" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All tags</SelectItem>
                      {availableTags.map((tag) => (
                        <SelectItem key={tag} value={tag}>
                          {tag}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={isFeatured}
                  onCheckedChange={(value) => setIsFeatured(!!value)}
                />
                <Label htmlFor="featured">Featured devotionals only</Label>
              </div>
            </div>
            
            <SheetFooter className="flex-row justify-between sm:justify-between">
              <Button
                variant="outline"
                onClick={resetFilters}
              >
                Reset Filters
              </Button>
              <SheetClose asChild>
                <Button onClick={applyFilters}>
                  Apply Filters
                </Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
        
        {/* Active filters */}
        {(selectedAuthor || selectedTag || isFeatured) && (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedAuthor && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Author: {availableAuthors.find(a => a.id === selectedAuthor)?.name}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setSelectedAuthor("")
                    applyFilters()
                  }}
                />
              </Badge>
            )}
            
            {selectedTag && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Tag: {selectedTag}
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setSelectedTag("")
                    applyFilters()
                  }}
                />
              </Badge>
            )}
            
            {isFeatured && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Featured
                <X
                  className="h-3 w-3 ml-1 cursor-pointer"
                  onClick={() => {
                    setIsFeatured(false)
                    applyFilters()
                  }}
                />
              </Badge>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground text-xs h-7"
              onClick={resetFilters}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
      
      {/* Devotionals grid */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading devotionals...</p>
        </div>
      ) : devotionals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devotionals.map((devotional) => (
            <DevotionalCard
              key={devotional.id}
              devotional={devotional}
              onTagSelect={handleTagSelect}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No devotionals found. Try adjusting your filters.</p>
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
