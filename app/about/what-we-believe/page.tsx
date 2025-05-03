import IntuitiveHeader from "@/app/components/IntuitiveHeader"
import Footer from "@/app/components/Footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, BookOpen, Heart, Users, Star } from "lucide-react"

export default function WhatWeBelievePage() {
  // Core beliefs
  const coreBeliefs = [
    {
      title: "The Bible",
      description:
        "We believe the Bible is the inspired, infallible Word of God and our final authority for faith and practice.",
      icon: BookOpen,
    },
    {
      title: "Salvation",
      description:
        "We believe salvation comes through faith in Jesus Christ alone, by grace through faith, not by works.",
      icon: Heart,
    },
    {
      title: "The Church",
      description:
        "We believe the church is the body of Christ, called to worship, fellowship, discipleship, ministry, and evangelism.",
      icon: Users,
    },
    {
      title: "The Holy Spirit",
      description:
        "We believe in the present ministry of the Holy Spirit who empowers believers to live godly lives and serve effectively.",
      icon: Star,
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <IntuitiveHeader />

      <main className="flex-grow pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/about/what-we-believe" className="text-primary font-medium">
              What We Believe
            </Link>
          </div>

          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-4xl font-bold text-foreground">What We Believe</h1>
            <Link href="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="lead text-xl text-muted-foreground mb-8">
              At Living Seed Church, our beliefs are rooted in the timeless truths of Scripture and the historic
              Christian faith.
            </p>

            {/* Core Beliefs Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
              {coreBeliefs.map((belief) => (
                <div key={belief.title} className="bg-secondary/20 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary/10 p-3 rounded-full mr-4">
                      <belief.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-bold">{belief.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{belief.description}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4">Our Statement of Faith</h2>

            <h3 className="text-xl font-bold mt-8 mb-2">The Trinity</h3>
            <p>
              We believe in one God, eternally existing in three persons: Father, Son, and Holy Spirit, equal in power
              and glory.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-2">Jesus Christ</h3>
            <p>
              We believe in the deity of Jesus Christ, His virgin birth, sinless life, miracles, atoning death, bodily
              resurrection, ascension to the right hand of the Father, and His personal return in power and glory.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-2">The Holy Spirit</h3>
            <p>
              We believe in the present ministry of the Holy Spirit, by whose indwelling the Christian is enabled to
              live a godly life. We believe in the baptism of the Holy Spirit as a distinct experience from salvation,
              empowering believers for ministry and godly living.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-2">Humanity</h3>
            <p>
              We believe that all people are created in the image of God but fell into sin and are therefore lost, and
              only through regeneration by the Holy Spirit can salvation and spiritual life be obtained.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-2">Salvation</h3>
            <p>
              We believe that the shed blood of Jesus Christ and His resurrection provide the only ground for
              justification and salvation for all who believe, and only such as receive Jesus Christ are born of the
              Holy Spirit and thus become children of God.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-2">The Church</h3>
            <p>
              We believe in the spiritual unity of believers in our Lord Jesus Christ and that all true believers are
              members of His body, the Church.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-2">The Future</h3>
            <p>
              We believe in the resurrection of both the saved and the lost; they that are saved unto the resurrection
              of life, and they that are lost unto the resurrection of damnation.
            </p>

            {/* Call to Action */}
            <div className="mt-12 p-6 bg-primary/10 rounded-xl">
              <h3 className="text-xl font-bold mb-4">Have Questions About Our Beliefs?</h3>
              <p className="mb-4">
                We welcome your questions and would love to discuss our beliefs with you in more detail. Feel free to
                reach out to our pastoral team.
              </p>
              <Link href="/contact">
                <Button>Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

