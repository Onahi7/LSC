"use client"

import { Clock, Calendar, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

const services = [
  {
    name: "Sunday Service",
    time: "9:00 AM - 11:30 AM",
    description: "Join us for praise and worship, followed by an inspiring message from God's Word.",
    icon: Calendar,
  },
  {
    name: "Wednesday Bible Study",
    time: "6:00 PM - 7:30 PM",
    description: "Midweek spiritual nourishment through in-depth Bible study and prayer.",
    icon: Clock,
  },
  {
    name: "Friday Prayer Meeting",
    time: "7:00 PM - 9:00 PM",
    description: "A powerful time of corporate prayer and intercession for our church, community, and nation.",
    icon: Clock,
  },
]

export default function ServiceTimes() {
  return (
    <div className="bg-background py-16 sm:py-24 relative overflow-hidden" id="services">
      {/* Add background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary-light rounded-full"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-secondary-light rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -45, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">Worship With Us</h2>
          <p className="mt-4 text-xl text-muted-foreground">Join our community for prayer and fellowship</p>
        </motion.div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.name}
              className="border border-border rounded-lg shadow-sm divide-y divide-border"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
            >
              <div className="p-6">
                <h3 className="text-lg font-medium text-foreground">{service.name}</h3>
                <div className="flex items-center mt-2 text-primary">
                  <service.icon className="h-5 w-5 mr-2" />
                  <p className="font-bold">{service.time}</p>
                </div>
                <p className="mt-4 text-muted-foreground">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center text-primary mb-4">
            <MapPin className="h-5 w-5 mr-2" />
            <p className="font-medium">123 Faith Avenue, Abuja, Nigeria</p>
          </div>
          <Button className="mt-2">Get Directions</Button>
        </motion.div>
      </div>
    </div>
  )
}

