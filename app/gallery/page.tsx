"use client"

import { useState, useEffect } from "react"
import { Calendar, ImageIcon, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import IntuitiveHeader from "../components/IntuitiveHeader"
import Footer from "../components/Footer"
import CollageGallery from "../components/CollageGallery"

// Gallery data with categories
const galleryItems = [
  {
    id: 1,
    image: "/placeholder.svg?height=300&width=300",
    date: "2023-12-10",
    category: "events",
  },
  {
    id: 2,
    image: "/placeholder.svg?height=300&width=600",
    date: "2023-11-15",
    category: "youth",
  },
  {
    id: 3,
    image: "/placeholder.svg?height=300&width=600",
    date: "2023-10-22",
    category: "outreach",
  },
  {
    id: 4,
    image: "/placeholder.svg?height=300&width=300",
    date: "2023-12-18",
    category: "children",
  },
  {
    id: 5,
    image: "/placeholder.svg?height=200&width=300",
    date: "2023-09-05",
    category: "celebration",
  },
  {
    id: 6,
    image: "/placeholder.svg?height=200&width=300",
    date: "2023-11-08",
    category: "study",
  },
  {
    id: 7,
    image: "/placeholder.svg?height=200&width=300",
    date: "2023-12-05",
    category: "worship",
  },
  {
    id: 8,
    image: "/placeholder.svg?height=200&width=300",
    date: "2023-10-15",
    category: "fellowship",
  },
  {
    id: 9,
    image: "/placeholder.svg?height=200&width=300",
    date: "2023-11-25",
    category: "fellowship",
  },
]

// Function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Function to get available months for filtering
const getAvailableMonths = () => {
  const months = galleryItems.map((item) => {
    const date = new Date(item.date)
    return `${date.getFullYear()}-${date.getMonth() + 1}`
  })
  return [...new Set(months)].sort().reverse()
}

// Function to get month name
const getMonthName = (monthKey: string) => {
  const [year, month] = monthKey.split("-")
  const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1)
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long" })
}

// Group images by category
const getImagesByCategory = () => {
  const categories: Record<string, typeof galleryItems> = {}

  galleryItems.forEach((item) => {
    if (!categories[item.category]) {
      categories[item.category] = []
    }
    categories[item.category].push(item)
  })

  return categories
}

export default function GalleryPage() {
  const [selectedMonth, setSelectedMonth] = useState<string>("all")
  const [categorizedImages, setCategorizedImages] = useState<Record<string, typeof galleryItems>>({})
  const availableMonths = getAvailableMonths()

  // Initialize categorized images
  useEffect(() => {
    setCategorizedImages(getImagesByCategory())
  }, [])

  // Filter items based on month selection
  const filteredCategories = { ...categorizedImages }

  if (selectedMonth !== "all") {
    Object.keys(filteredCategories).forEach((category) => {
      filteredCategories[category] = filteredCategories[category].filter((item) => {
        const [filterYear, filterMonth] = selectedMonth.split("-")
        const date = new Date(item.date)
        return (
          date.getFullYear() === Number.parseInt(filterYear) && date.getMonth() + 1 === Number.parseInt(filterMonth)
        )
      })

      // Remove empty categories
      if (filteredCategories[category].length === 0) {
        delete filteredCategories[category]
      }
    })
  }

  // Check if any images match the current filter
  const hasImages = Object.values(filteredCategories).some((items) => items.length > 0)

  return (
    <div className="flex flex-col min-h-screen">
      <IntuitiveHeader />

      <main className="flex-grow pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
            <div>
              <div className="flex items-center mb-4">
                <ImageIcon className="h-6 w-6 text-primary mr-2" />
                <h1 className="text-3xl font-bold text-foreground">Church Gallery</h1>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                Browse through our collection of photos from various church events, services, and activities.
              </p>
            </div>

            <Link href="/#gallery">
              <Button variant="outline" className="mt-4 md:mt-0">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="bg-secondary/30 rounded-lg p-6 mb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-lg font-medium">Gallery Categories</h2>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 text-primary mr-2" />
                <span className="text-sm font-medium">Filter by date:</span>
              </div>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  {availableMonths.map((month) => (
                    <SelectItem key={month} value={month}>
                      {getMonthName(month)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Categorized Gallery */}
          {hasImages ? (
            <div className="space-y-16">
              {Object.entries(filteredCategories).map(
                ([category, images]) =>
                  images.length > 0 && (
                    <div key={category} className="mb-12">
                      <h2 className="text-2xl font-bold mb-6 flex items-center">
                        <span className="inline-block w-8 h-1 bg-primary mr-3"></span>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </h2>

                      {/* Photo Collage using the CollageGallery component */}
                      <CollageGallery items={images} category={category} />
                    </div>
                  ),
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No images match your current filter.</p>
              <Button variant="outline" className="mt-4" onClick={() => setSelectedMonth("all")}>
                Reset Filter
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

