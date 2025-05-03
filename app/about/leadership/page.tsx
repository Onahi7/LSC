import IntuitiveHeader from "@/app/components/IntuitiveHeader"
import Footer from "@/app/components/Footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Mail, Phone } from "lucide-react"

export default function LeadershipPage() {
  // Leadership team data
  const leadershipTeam = [
    {
      name: "Pastor Samuel Adeyemi",
      role: "Senior Pastor",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Pastor Samuel has been leading our congregation for over 15 years with wisdom and compassion. His vision for The Emerging Generation is to raise disciples who will impact their generation for Christ.",
      contact: {
        email: "pastor.samuel@livingseedchurch.org",
        phone: "+234 123 456 7890",
      },
    },
    {
      name: "Pastor Ruth Adeyemi",
      role: "Associate Pastor",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Pastor Ruth oversees our women's ministry and children's church. Her passion is to see families grow together in faith and love.",
      contact: {
        email: "pastor.ruth@livingseedchurch.org",
        phone: "+234 123 456 7891",
      },
    },
    {
      name: "Pastor Daniel Okafor",
      role: "Youth Pastor",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Pastor Daniel leads our vibrant youth ministry. He is dedicated to mentoring young people and helping them discover their purpose in Christ.",
      contact: {
        email: "pastor.daniel@livingseedchurch.org",
        phone: "+234 123 456 7892",
      },
    },
    {
      name: "Deacon James Nwosu",
      role: "Head of Men's Ministry",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Deacon James leads our men's ministry with a focus on discipleship and mentoring. He is passionate about helping men become godly leaders in their homes and communities.",
      contact: {
        email: "deacon.james@livingseedchurch.org",
        phone: "+234 123 456 7893",
      },
    },
    {
      name: "Deaconess Grace Okonkwo",
      role: "Worship Director",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Deaconess Grace leads our worship ministry with a heart for creating an atmosphere where people can encounter God's presence through music and praise.",
      contact: {
        email: "deaconess.grace@livingseedchurch.org",
        phone: "+234 123 456 7894",
      },
    },
    {
      name: "Elder Emmanuel Adeyemi",
      role: "Church Administrator",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Elder Emmanuel oversees the administrative functions of the church, ensuring that all operations run smoothly to support our various ministries and outreach efforts.",
      contact: {
        email: "elder.emmanuel@livingseedchurch.org",
        phone: "+234 123 456 7895",
      },
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <IntuitiveHeader />

      <main className="flex-grow pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/about/leadership" className="text-primary font-medium">
              Leadership
            </Link>
          </div>

          <div className="mb-12 flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-4">Our Leadership Team</h1>
              <p className="text-xl text-muted-foreground max-w-2xl">
                Meet the dedicated leaders who guide our church with wisdom, compassion, and a commitment to God's Word.
              </p>
            </div>
            <Link href="/" className="mt-4 md:mt-0">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Leadership Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadershipTeam.map((leader) => (
              <div
                key={leader.name}
                className="bg-background border border-border rounded-xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="aspect-square">
                  <img
                    src={leader.image || "/placeholder.svg"}
                    alt={leader.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-foreground">{leader.name}</h2>
                  <p className="text-primary font-medium mb-4">{leader.role}</p>
                  <p className="text-muted-foreground mb-6">{leader.bio}</p>

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2 text-primary" />
                      <a href={`mailto:${leader.contact.email}`} className="hover:text-primary">
                        {leader.contact.email}
                      </a>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2 text-primary" />
                      <a href={`tel:${leader.contact.phone}`} className="hover:text-primary">
                        {leader.contact.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="mt-16 bg-secondary/30 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Interested in Serving?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              We believe every member has gifts and talents that can contribute to the life of our church. If you're
              interested in serving in any capacity, we'd love to hear from you.
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

