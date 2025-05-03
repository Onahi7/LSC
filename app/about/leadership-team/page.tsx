"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, Phone, ChevronDown, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import IntuitiveHeader from "../../components/IntuitiveHeader"
import Footer from "../../components/Footer"

// Define leadership team categories and members
const leadershipData = {
  pastors: [
    {
      id: 1,
      name: "Pastor Samuel Adeyemi",
      role: "Senior Pastor",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Pastor Samuel has been leading our congregation for over 15 years with wisdom and compassion. His vision for The Emerging Generation is to raise disciples who will impact their generation for Christ.",
      contact: {
        email: "pastor.samuel@livingseedchurch.org",
        phone: "+234 123 456 7890",
      },
      departments: ["Administration", "Vision"],
      featured: true,
    },
    {
      id: 2,
      name: "Pastor Ruth Adeyemi",
      role: "Associate Pastor",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Pastor Ruth oversees our women's ministry and children's church. Her passion is to see families grow together in faith and love.",
      contact: {
        email: "pastor.ruth@livingseedchurch.org",
        phone: "+234 123 456 7891",
      },
      departments: ["Women's Ministry", "Children's Ministry"],
      featured: true,
    },
    {
      id: 3,
      name: "Pastor Daniel Okafor",
      role: "Youth Pastor",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Pastor Daniel leads our vibrant youth ministry. He is dedicated to mentoring young people and helping them discover their purpose in Christ.",
      contact: {
        email: "pastor.daniel@livingseedchurch.org",
        phone: "+234 123 456 7892",
      },
      departments: ["Youth Ministry", "Evangelism"],
      featured: true,
    },
    {
      id: 4,
      name: "Pastor Michael Oluwatobi",
      role: "Worship Pastor",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Pastor Michael leads our worship ministry with a passion for creating an atmosphere where people can encounter God's presence through music and praise.",
      contact: {
        email: "pastor.michael@livingseedchurch.org",
        phone: "+234 123 456 7893",
      },
      departments: ["Worship Ministry", "Music"],
      featured: false,
    },
  ],
  deaconesses: [
    {
      id: 5,
      name: "Deaconess Grace Okonkwo",
      role: "Head of Women's Fellowship",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Deaconess Grace has been serving in the women's ministry for over 10 years. She is passionate about mentoring women and helping them grow in their faith and purpose.",
      contact: {
        email: "deaconess.grace@livingseedchurch.org",
        phone: "+234 123 456 7894",
      },
      departments: ["Women's Fellowship", "Prayer"],
      featured: true,
    },
    {
      id: 6,
      name: "Deaconess Blessing Nnamdi",
      role: "Children's Ministry Coordinator",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Deaconess Blessing has a heart for children and has been leading our children's ministry for 8 years. She believes in laying a strong spiritual foundation for the next generation.",
      contact: {
        email: "deaconess.blessing@livingseedchurch.org",
        phone: "+234 123 456 7895",
      },
      departments: ["Children's Ministry", "Education"],
      featured: true,
    },
    {
      id: 7,
      name: "Deaconess Sarah Adebayo",
      role: "Hospitality Team Lead",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Deaconess Sarah oversees our hospitality ministry, ensuring that everyone who visits our church feels welcomed and valued. She has a gift for creating warm, inviting environments.",
      contact: {
        email: "deaconess.sarah@livingseedchurch.org",
        phone: "+234 123 456 7896",
      },
      departments: ["Hospitality", "Events"],
      featured: false,
    },
  ],
  deacons: [
    {
      id: 8,
      name: "Deacon James Nwosu",
      role: "Head of Men's Ministry",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Deacon James leads our men's ministry with a focus on discipleship and mentoring. He is passionate about helping men become godly leaders in their homes and communities.",
      contact: {
        email: "deacon.james@livingseedchurch.org",
        phone: "+234 123 456 7897",
      },
      departments: ["Men's Ministry", "Discipleship"],
      featured: true,
    },
    {
      id: 9,
      name: "Deacon Emmanuel Adeyemi",
      role: "Church Administrator",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Deacon Emmanuel oversees the administrative functions of the church, ensuring that all operations run smoothly to support our various ministries and outreach efforts.",
      contact: {
        email: "deacon.emmanuel@livingseedchurch.org",
        phone: "+234 123 456 7898",
      },
      departments: ["Administration", "Finance"],
      featured: true,
    },
    {
      id: 10,
      name: "Deacon Peter Okafor",
      role: "Outreach Coordinator",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Deacon Peter coordinates our community outreach programs, organizing events and initiatives that share God's love with those in need in our community.",
      contact: {
        email: "deacon.peter@livingseedchurch.org",
        phone: "+234 123 456 7899",
      },
      departments: ["Outreach", "Evangelism"],
      featured: false,
    },
  ],
  ministers: [
    {
      id: 11,
      name: "Minister Joshua Adebayo",
      role: "Youth Worship Leader",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Minister Joshua leads our youth worship team, mentoring young musicians and creating dynamic worship experiences for our youth services.",
      contact: {
        email: "minister.joshua@livingseedchurch.org",
        phone: "+234 123 456 7900",
      },
      departments: ["Youth Ministry", "Worship"],
      featured: false,
    },
    {
      id: 12,
      name: "Minister Faith Okonkwo",
      role: "Prayer Ministry Coordinator",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Minister Faith coordinates our prayer ministry, organizing prayer meetings, intercession groups, and teaching on the importance of prayer in the Christian life.",
      contact: {
        email: "minister.faith@livingseedchurch.org",
        phone: "+234 123 456 7901",
      },
      departments: ["Prayer", "Intercession"],
      featured: true,
    },
    {
      id: 13,
      name: "Minister David Nnamdi",
      role: "Media Ministry Lead",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Minister David oversees our media ministry, ensuring that our services are recorded and streamed, and managing our social media presence to extend our reach beyond our physical location.",
      contact: {
        email: "minister.david@livingseedchurch.org",
        phone: "+234 123 456 7902",
      },
      departments: ["Media", "Technology"],
      featured: false,
    },
    {
      id: 14,
      name: "Minister Rebecca Oluwatobi",
      role: "Sunday School Coordinator",
      image: "/placeholder.svg?height=400&width=400",
      bio: "Minister Rebecca coordinates our Sunday School program, developing curriculum and training teachers to provide solid biblical education for all age groups.",
      contact: {
        email: "minister.rebecca@livingseedchurch.org",
        phone: "+234 123 456 7903",
      },
      departments: ["Education", "Children's Ministry"],
      featured: false,
    },
  ],
}

// Get all departments for filtering
const getAllDepartments = () => {
  const departments = new Set<string>()
  Object.values(leadershipData).forEach((category) => {
    category.forEach((leader) => {
      leader.departments.forEach((dept) => departments.add(dept))
    })
  })
  return Array.from(departments).sort()
}

export default function LeadershipTeamPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Get all departments
  const allDepartments = getAllDepartments()

  // Filter leaders based on search query and department
  const filterLeaders = (leaders: typeof leadershipData.pastors) => {
    return leaders.filter((leader) => {
      const matchesSearch =
        searchQuery === "" ||
        leader.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leader.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        leader.bio.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesDepartment = selectedDepartment === null || leader.departments.includes(selectedDepartment)

      return matchesSearch && matchesDepartment
    })
  }

  // Get filtered leaders based on active tab
  const getFilteredLeaders = () => {
    if (activeTab === "all") {
      const allLeaders = [
        ...leadershipData.pastors,
        ...leadershipData.deaconesses,
        ...leadershipData.deacons,
        ...leadershipData.ministers,
      ]
      return filterLeaders(allLeaders)
    } else {
      return filterLeaders(leadershipData[activeTab as keyof typeof leadershipData])
    }
  }

  const filteredLeaders = getFilteredLeaders()

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("")
    setSelectedDepartment(null)
  }

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
            <Link href="/about" className="hover:text-primary">
              About
            </Link>
            <span className="mx-2">/</span>
            <Link href="/about/leadership-team" className="text-primary font-medium">
              Leadership Team
            </Link>
          </div>

          {/* Page Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Our Leadership Team</h1>
            <p className="text-xl text-muted-foreground max-w-3xl">
              Meet the dedicated leaders who guide our church with wisdom, compassion, and a commitment to God's Word.
              Our leadership team works together to shepherd our congregation and advance our mission.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                <Input
                  type="text"
                  placeholder="Search by name or role..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {selectedDepartment && (
                    <Badge variant="secondary" className="ml-1">
                      1
                    </Badge>
                  )}
                </Button>

                <div className="hidden md:flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDepartment(null)}
                    className={selectedDepartment === null ? "bg-primary text-primary-foreground" : ""}
                  >
                    All Departments
                  </Button>

                  <div className="relative group">
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      {selectedDepartment || "Select Department"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>

                    <div className="absolute right-0 mt-1 w-56 bg-background border border-border rounded-md shadow-lg hidden group-hover:block z-10">
                      <div className="py-1 max-h-60 overflow-y-auto">
                        {allDepartments.map((dept) => (
                          <button
                            key={dept}
                            className={`block w-full text-left px-4 py-2 text-sm ${
                              selectedDepartment === dept
                                ? "bg-primary/10 text-primary"
                                : "text-foreground hover:bg-muted"
                            }`}
                            onClick={() => setSelectedDepartment(dept)}
                          >
                            {dept}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {(searchQuery || selectedDepartment) && (
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile filters */}
            {showFilters && (
              <div className="md:hidden bg-muted/30 p-4 rounded-lg mb-4">
                <h3 className="font-medium mb-2">Filter by Department</h3>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedDepartment(null)}
                    className={selectedDepartment === null ? "bg-primary text-primary-foreground" : ""}
                  >
                    All Departments
                  </Button>

                  {allDepartments.map((dept) => (
                    <Button
                      key={dept}
                      variant="outline"
                      size="sm"
                      className={selectedDepartment === dept ? "bg-primary/10 border-primary text-primary" : ""}
                      onClick={() => setSelectedDepartment(dept)}
                    >
                      {dept}
                    </Button>
                  ))}
                </div>

                <div className="flex justify-end">
                  {(searchQuery || selectedDepartment) && (
                    <Button variant="ghost" size="sm" onClick={resetFilters}>
                      Reset Filters
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Category tabs */}
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="w-full justify-start mb-2 overflow-x-auto flex-nowrap">
                <TabsTrigger value="all" className="flex-shrink-0">
                  All Leaders
                </TabsTrigger>
                <TabsTrigger value="pastors" className="flex-shrink-0">
                  Pastors
                </TabsTrigger>
                <TabsTrigger value="deaconesses" className="flex-shrink-0">
                  Deaconesses
                </TabsTrigger>
                <TabsTrigger value="deacons" className="flex-shrink-0">
                  Deacons
                </TabsTrigger>
                <TabsTrigger value="ministers" className="flex-shrink-0">
                  Ministers
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Results count */}
            <div className="text-sm text-muted-foreground mt-2">
              Showing {filteredLeaders.length} {filteredLeaders.length === 1 ? "leader" : "leaders"}
              {selectedDepartment && <span> in {selectedDepartment}</span>}
              {searchQuery && <span> matching "{searchQuery}"</span>}
            </div>
          </div>

          {/* Leadership Grid */}
          {filteredLeaders.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLeaders.map((leader, index) => (
                <motion.div
                  key={leader.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
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
                    <p className="text-primary font-medium mb-3">{leader.role}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {leader.departments.map((dept) => (
                        <Badge
                          key={dept}
                          variant="outline"
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => setSelectedDepartment(dept)}
                        >
                          {dept}
                        </Badge>
                      ))}
                    </div>

                    <p className="text-muted-foreground mb-4 line-clamp-3">{leader.bio}</p>

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
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-muted/20 rounded-xl">
              <h3 className="text-xl font-bold mb-2">No leaders found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria.</p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 bg-primary/10 rounded-xl p-8 text-center">
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

