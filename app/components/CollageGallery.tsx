"use client"

import { motion } from "framer-motion"
import Link from "next/link"

interface GalleryItem {
  id: number
  image: string
  category: string
  date: string
}

interface CollageGalleryProps {
  items: GalleryItem[]
  category: string
}

export default function CollageGallery({ items, category }: CollageGalleryProps) {
  return (
    <motion.div
      className="overflow-hidden rounded-lg shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-6 bg-background" style={{ display: "grid", gap: "2px" }}>
        {/* Row 1 */}
        <div className="col-span-2" style={{ aspectRatio: "1/1", overflow: "hidden" }}>
          <Link href={`/gallery/${items[0]?.id || 1}`}>
            <img
              src={items[0]?.image || "/placeholder.svg?height=300&width=300"}
              alt={`Church ${category} image`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Link>
        </div>
        <div className="col-span-4" style={{ aspectRatio: "2/1", overflow: "hidden" }}>
          <Link href={`/gallery/${items[1]?.id || 2}`}>
            <img
              src={items[1]?.image || "/placeholder.svg?height=300&width=600"}
              alt={`Church ${category} image`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Link>
        </div>

        {/* Row 2 */}
        <div className="col-span-4" style={{ aspectRatio: "2/1", overflow: "hidden" }}>
          <Link href={`/gallery/${items[2]?.id || 3}`}>
            <img
              src={items[2]?.image || "/placeholder.svg?height=300&width=600"}
              alt={`Church ${category} image`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Link>
        </div>
        <div className="col-span-2" style={{ aspectRatio: "1/1", overflow: "hidden" }}>
          <Link href={`/gallery/${items[3]?.id || 4}`}>
            <img
              src={items[3]?.image || "/placeholder.svg?height=300&width=300"}
              alt={`Church ${category} image`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Link>
        </div>

        {/* Row 3 */}
        <div className="col-span-2" style={{ aspectRatio: "1/1", overflow: "hidden" }}>
          <Link href={`/gallery/${items[4]?.id || 5}`}>
            <img
              src={items[4]?.image || "/placeholder.svg?height=200&width=300"}
              alt={`Church ${category} image`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Link>
        </div>
        <div className="col-span-2" style={{ aspectRatio: "1/1", overflow: "hidden" }}>
          <Link href={`/gallery/${items[5]?.id || 6}`}>
            <img
              src={items[5]?.image || "/placeholder.svg?height=200&width=300"}
              alt={`Church ${category} image`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Link>
        </div>
        <div className="col-span-2" style={{ aspectRatio: "1/1", overflow: "hidden" }}>
          <Link href={`/gallery/${items[6]?.id || 7}`}>
            <img
              src={items[6]?.image || "/placeholder.svg?height=200&width=300"}
              alt={`Church ${category} image`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

