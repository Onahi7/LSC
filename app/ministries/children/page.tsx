import IntuitiveHeader from "@/app/components/IntuitiveHeader"
import Footer from "@/app/components/Footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Clock, Calendar, MapPin } from "lucide-react"

export default function ChildrenMinistryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <IntuitiveHeader />

      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <div className="relative bg-primary/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl font-bold text-foreground mb-4">Children's Ministry</h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Nurturing young hearts and minds to know God, love others, and grow in faith through engaging,
                  age-appropriate activities.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Button>Register Your Child</Button>
                  <Button variant="outline">Volunteer</Button>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="rounded-xl overflow-hidden shadow-lg">
                  <img
                    src="/placeholder.svg?height=400&width=600&text=Children's+Ministry"
                    alt="Children's Ministry"
                    className="w-full h-full object-cover"
                  />
                </div>
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
            <Link href="/ministries" className="hover:text-primary">
              Ministries
            </Link>
            <span className="mx-2">/</span>
            <Link href="/ministries/children" className="text-primary font-medium">
              Children
            </Link>
          </div>

          {/* About Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6">About Our Children's Ministry</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-lg text-muted-foreground mb-4">
                  At Living Seed Church, we believe that children are not just the church of tomorrow, but an important
                  part of the church today. Our children's ministry is designed to create a fun, safe environment where
                  children can learn about God's love and grow in their faith.
                </p>
                <p className="text-lg text-muted-foreground mb-4">
                  Our dedicated team of trained volunteers is passionate about nurturing the spiritual development of
                  each child through age-appropriate Bible lessons, worship, games, and creative activities.
                </p>
                <p className="text-lg text-muted-foreground">
                  We work in partnership with parents, providing resources and support to help families continue faith
                  conversations at home.
                </p>
              </div>
              <div className="bg-secondary/20 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4">Children's Service Times</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Sunday Services</h4>
                      <p className="text-muted-foreground">9:00 AM - 11:30 AM (during main service)</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Wednesday Bible Club</h4>
                      <p className="text-muted-foreground">6:00 PM - 7:30 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-3 mt-1" />
                    <div>
                      <h4 className="font-medium">Location</h4>
                      <p className="text-muted-foreground">Children's Wing, Main Church Building</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Age Groups Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Our Age Groups</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-background border border-border rounded-xl overflow-hidden shadow-md">
                <div className="h-48 bg-primary/10">
                  <img
                    src="/placeholder.svg?height=200&width=400&text=Toddlers"
                    alt="Toddlers"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Toddlers (Ages 2-4)</h3>
                  <p className="text-muted-foreground mb-4">
                    Our toddler class introduces young children to basic Bible stories and concepts through play, songs,
                    and simple crafts.
                  </p>
                </div>
              </div>

              <div className="bg-background border border-border rounded-xl overflow-hidden shadow-md">
                <div className="h-48 bg-primary/10">
                  <img
                    src="/placeholder.svg?height=200&width=400&text=Elementary"
                    alt="Elementary"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Elementary (Ages 5-8)</h3>
                  <p className="text-muted-foreground mb-4">
                    Elementary-aged children engage with Bible stories through interactive lessons, games, and
                    age-appropriate worship.
                  </p>
                </div>
              </div>

              <div className="bg-background border border-border rounded-xl overflow-hidden shadow-md">
                <div className="h-48 bg-primary/10">
                  <img
                    src="/placeholder.svg?height=200&width=400&text=Pre-Teens"
                    alt="Pre-Teens"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Pre-Teens (Ages 9-12)</h3>
                  <p className="text-muted-foreground mb-4">
                    Our pre-teen program helps older children deepen their understanding of faith through discussions,
                    Bible study, and service projects.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Get Involved Section */}
          <div className="bg-secondary/30 rounded-xl p-8 mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Get Involved</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">For Parents</h3>
                <p className="text-muted-foreground mb-4">
                  We encourage parents to be actively involved in their child's spiritual journey. Here's how you can
                  participate:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                  <li>Register your child for our programs</li>
                  <li>Attend parent orientation sessions</li>
                  <li>Use our take-home resources to continue discussions</li>
                  <li>Join our parent prayer team</li>
                </ul>
                <Button>Register Your Child</Button>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">For Volunteers</h3>
                <p className="text-muted-foreground mb-4">
                  Our children's ministry is always looking for passionate volunteers to serve in various capacities:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                  <li>Teachers and assistant teachers</li>
                  <li>Worship leaders</li>
                  <li>Check-in assistants</li>
                  <li>Special events coordinators</li>
                </ul>
                <p className="text-sm text-muted-foreground mb-4">
                  All volunteers undergo background checks and training to ensure a safe environment for our children.
                </p>
                <Button variant="outline">Apply to Volunteer</Button>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-background border border-border rounded-xl overflow-hidden shadow-md">
                <div className="h-48 bg-primary/10">
                  <img
                    src="/placeholder.svg?height=200&width=400&text=VBS"
                    alt="Vacation Bible School"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Vacation Bible School</h3>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>July 15-19, 2024</span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    A week of fun, games, crafts, and Bible learning for children ages 4-12.
                  </p>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              </div>

              <div className="bg-background border border-border rounded-xl overflow-hidden shadow-md">
                <div className="h-48 bg-primary/10">
                  <img
                    src="/placeholder.svg?height=200&width=400&text=Family+Day"
                    alt="Family Fun Day"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Family Fun Day</h3>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>August 12, 2024</span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    A day of outdoor activities, games, and fellowship for the whole family.
                  </p>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              </div>

              <div className="bg-background border border-border rounded-xl overflow-hidden shadow-md">
                <div className="h-48 bg-primary/10">
                  <img
                    src="/placeholder.svg?height=200&width=400&text=Christmas+Program"
                    alt="Christmas Program"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">Children's Christmas Program</h3>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4 mr-2 text-primary" />
                    <span>December 18, 2024</span>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Our annual Christmas program featuring performances by children of all ages.
                  </p>
                  <Button variant="outline" size="sm">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-primary/10 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              We'd love to hear from you! Contact our Children's Ministry Director for more information about our
              programs.
            </p>
            <Link href="/contact">
              <Button size="lg">Contact Us</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

