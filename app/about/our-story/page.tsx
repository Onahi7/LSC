"use client"

import IntuitiveHeader from "@/app/components/IntuitiveHeader"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Target } from "lucide-react"
import Footer from "@/app/components/Footer"

export default function OurStoryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <IntuitiveHeader />

      <main className="flex-grow pt-24">
        {/* Hero Section with Pastor E.A. Adeboye - Full Width */}
        <div className="relative w-full overflow-hidden">
          {/* Full width image */}
          <div className="relative w-full h-[50vh] md:h-[60vh] lg:h-[70vh]">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-05%20155357-L2igmMUKDaQsnx1hXRAFltKw5sIfO0.png"
              alt="Pastor E.A. Adeboye, General Overseer of RCCG Worldwide"
              className="w-full h-full object-cover"
            />
            {/* Gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
          </div>

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">Our Story</h1>
                  <p className="text-xl md:text-2xl mb-2 text-white/90">Following the vision of RCCG Worldwide</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <div className="bg-background/30 backdrop-blur-sm p-4 rounded-lg inline-block">
                    <h2 className="text-xl font-bold">Pastor E.A. Adeboye</h2>
                    <p className="text-white/90">General Overseer, RCCG Worldwide</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Link href="/">
                  <Button variant="outline" size="sm" className="bg-white/20 border-white text-white hover:bg-white/30">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/about/our-story" className="text-primary font-medium">
              Our Story
            </Link>
          </div>

          {/* Mission & Vision Section */}
          <div className="pt-8 mb-12">
            <div className="bg-background border border-border rounded-xl shadow-md overflow-hidden">
              <div className="md:flex items-stretch">
                <div className="md:w-1/2 p-8">
                  <div className="flex items-center mb-6">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <Target className="h-7 w-7 text-primary" />
                    </div>
                    <h2 className="text-3xl font-bold">Our Mission & Vision</h2>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-xl mb-2">RCCG Vision & Mission</h3>
                      <ul className="space-y-3 text-muted-foreground text-lg">
                        <li className="flex items-start">
                          <span className="font-medium mr-2">1.</span>
                          <span>To Make Heaven</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">2.</span>
                          <span>To take as many people with us</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">3.</span>
                          <span>To have a member of RCCG in every family of all nations</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">4.</span>
                          <span>To accomplish No. 1 above, holiness will be our lifestyle</span>
                        </li>
                        <li className="flex items-start">
                          <span className="font-medium mr-2">5.</span>
                          <span>
                            To accomplish No. 2 and 3 above, we will plant churches within five minutes walking distance
                            in every city and town of developing countries and within five minutes driving distance in
                            every city and town of developed countries.
                          </span>
                        </li>
                      </ul>
                      <p className="mt-4 text-muted-foreground text-lg font-medium">
                        We will pursue these objectives until every Nation in the world is reached for the Lord Jesus
                        Christ.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <img
                    src="/placeholder.svg?height=500&width=600&text=Mission+and+Vision"
                    alt="Our Mission and Vision"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* LSC Story and Sunday Confession */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* LSC Story */}
            <div className="bg-background border border-border rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">The LSC Story</h2>
              <p className="text-muted-foreground mb-4">
                Living Seed Church (LSC) Abuja was established as a parish of the Redeemed Christian Church of God in
                2010. What began as a small gathering of believers has grown into a vibrant community of faith dedicated
                to fulfilling the vision and mission of RCCG worldwide.
              </p>
              <p className="text-muted-foreground mb-4">
                Under the leadership of our pastors and with the guidance of the Holy Spirit, LSC has become a spiritual
                home for many, offering a place of worship, fellowship, and spiritual growth. Our church continues to
                expand its reach and impact in Abuja and beyond.
              </p>
              <p className="text-muted-foreground">
                As we look to the future, we remain committed to raising disciples who will emerge as leaders in various
                spheres of influence, bringing the light of Christ to their communities and making a lasting impact for
                the Kingdom of God.
              </p>
            </div>

            {/* Our Sunday Confession */}
            <div className="bg-background border border-border rounded-xl shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-4">Our Sunday Confession</h2>
              <div className="bg-primary/5 p-6 rounded-lg border-l-4 border-primary">
                <p className="text-xl italic font-medium text-foreground mb-4">
                  "We are living seeds, we emerge in all spheres, they might not see us coming, but they will see us
                  glowing, because we make impact."
                </p>
                <p className="text-right text-muted-foreground">— The Emerging Generation</p>
              </div>
              <div className="mt-6">
                <p className="text-muted-foreground">
                  This confession is a declaration of our identity and purpose as members of Living Seed Church. Each
                  Sunday, we affirm who we are in Christ and our commitment to shine His light in every area of our
                  lives.
                </p>
                <p className="text-muted-foreground mt-4">
                  As living seeds, we are planted in various spheres of influence—business, education, government, arts,
                  family, and more—where we grow and produce fruit that glorifies God and benefits humanity.
                </p>
              </div>
            </div>
          </div>

          {/* Church History Timeline */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">Our Journey</h2>
            <div className="bg-background border border-border rounded-xl shadow-sm p-6">
              <div className="space-y-8">
                <div className="relative pl-8 border-l-2 border-primary/30">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                  <h3 className="text-xl font-bold">2010: Foundation</h3>
                  <p className="text-muted-foreground mt-2">
                    Living Seed Church was established as a parish of RCCG in Abuja, starting with a small group of
                    dedicated believers.
                  </p>
                </div>

                <div className="relative pl-8 border-l-2 border-primary/30">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                  <h3 className="text-xl font-bold">2015: Growth and Expansion</h3>
                  <p className="text-muted-foreground mt-2">
                    The church experienced significant growth, leading to the establishment of multiple services and
                    expanded ministries.
                  </p>
                </div>

                <div className="relative pl-8 border-l-2 border-primary/30">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                  <h3 className="text-xl font-bold">2018: The Emerging Generation</h3>
                  <p className="text-muted-foreground mt-2">
                    Adoption of "The Emerging Generation" as our identity, focusing on raising disciples who would
                    emerge as leaders in various spheres.
                  </p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                  <h3 className="text-xl font-bold">Present: Making Impact</h3>
                  <p className="text-muted-foreground mt-2">
                    Today, LSC continues to grow and make impact in Abuja and beyond, with various ministries and
                    outreach programs touching lives and communities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-primary/10 rounded-xl p-8 text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Join Us on This Journey</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              We invite you to be part of The Emerging Generation at Living Seed Church. Together, we can grow in faith,
              serve our community, and make a lasting impact for the Kingdom of God.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg">Visit Us This Sunday</Button>
              <Link href="/contact">
                <Button variant="outline" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

