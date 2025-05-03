"use client"

import { Heart, Music, BookOpen, Users } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import MinistryCard from "./MinistryCard"

const ministries = [
  {
    name: "Worship Ministry",
    description: "Experience the presence of God through anointed praise and worship led by our dedicated team.",
    icon: Music,
    image: "/images/keyboard-worship.jpeg",
    additionalImage: "/images/worship-team.jpeg",
    color: "from-purple-500/20 to-indigo-500/20",
  },
  {
    name: "Bible Study",
    description: "Deepen your understanding of God's word through our engaging and transformative Bible studies.",
    icon: BookOpen,
    image: "/images/preacher-podium.jpeg",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    name: "Outreach & Missions",
    description: "Join us as we share God's love with our community and beyond through various outreach programs.",
    icon: Heart,
    image: "/images/community-service.jpeg",
    color: "from-rose-500/20 to-orange-500/20",
  },
  {
    name: "Youth Fellowship",
    description: "A vibrant community where young people grow in faith and build lasting relationships.",
    icon: Users,
    image: "/images/purple-preacher.jpeg",
    color: "from-emerald-500/20 to-teal-500/20",
  },
]

export default function EnhancedMinistries2() {
  return (
    <div className="py-24 bg-background relative overflow-hidden" id="ministries">
      {/* Background elements */}
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
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <motion.h2
            className="text-base text-primary font-semibold tracking-wide uppercase"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Our Ministries
          </motion.h2>
          <motion.p
            className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-foreground sm:text-4xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Growing Together in Faith
          </motion.p>
          <motion.p
            className="mt-4 max-w-2xl text-xl text-muted-foreground mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            At RCCG Living Seed Church, we offer various ministries designed to help you grow spiritually and connect
            with others in meaningful ways.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {ministries.map((ministry, index) => (
            <MinistryCard
              key={ministry.name}
              name={ministry.name}
              description={ministry.description}
              icon={ministry.icon}
              image={ministry.image}
              additionalImage={ministry.additionalImage}
              color={ministry.color}
              index={index}
            />
          ))}
        </div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <Button size="lg" className="mt-4">
            View All Ministries
          </Button>
        </motion.div>
      </div>
    </div>
  )
}

