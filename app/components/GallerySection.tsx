"use client"
import { motion, useReducedMotion } from "framer-motion"
import { ImageIcon, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function GallerySection() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <section className="py-24 bg-background relative overflow-hidden" id="gallery">
      {/* Background elements */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-1/2 -right-1/4 w-1/2 h-1/2 bg-primary-light rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 45, 0],
            }}
            transition={{
              duration: 15,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            aria-hidden="true"
          />
          <motion.div
            className="absolute -bottom-1/2 -left-1/4 w-1/2 h-1/2 bg-secondary-light rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, -45, 0],
            }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            aria-hidden="true"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="lg:text-center mb-12">
          <motion.div
            className="flex items-center justify-center mb-4"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <ImageIcon className="h-8 w-8 text-primary mr-2" aria-hidden="true" />
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Church Gallery</h2>
          </motion.div>

          <motion.h3
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Moments from Our Community
          </motion.h3>

          <motion.p
            className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto"
            initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Browse through memories of our church events, services, and community activities.
          </motion.p>
        </div>

        {/* Photo Gallery - Professional alignment */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="overflow-hidden rounded-xl shadow-md">
            <div className="grid grid-cols-6 bg-background" style={{ display: "grid", gap: "2px" }}>
              {/* Row 1 */}
              <div className="col-span-2" style={{ aspectRatio: "1/1", overflow: "hidden" }}>
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="col-span-4" style={{ aspectRatio: "2/1", overflow: "hidden" }}>
                <img
                  src="/placeholder.svg?height=300&width=600"
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Row 2 */}
              <div className="col-span-4" style={{ aspectRatio: "2/1", overflow: "hidden" }}>
                <img
                  src="/placeholder.svg?height=300&width=600"
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="col-span-2" style={{ aspectRatio: "1/1", overflow: "hidden" }}>
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Row 3 */}
              <div className="col-span-2" style={{ aspectRatio: "1/1", overflow: "hidden" }}>
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="col-span-2" style={{ aspectRatio: "1/1", overflow: "hidden" }}>
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="col-span-2" style={{ aspectRatio: "1/1", overflow: "hidden" }}>
                <img
                  src="/placeholder.svg?height=300&width=300"
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* View All Button */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Link href="/gallery">
            <Button variant="outline" size="lg" className="group">
              <span>View Full Gallery</span>
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

