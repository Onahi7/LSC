import Link from "next/link"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lsc-logo-Copy-2-OgyifpSbIOktUopauH8ZjtPzoqG9rw.png"
                alt="RCCG Living Seed Church Logo"
                className="h-20 w-auto mr-3"
              />
              <div>
                <h3 className="text-xl font-bold text-foreground">RCCG LSC Abuja</h3>
                <p className="text-lg mt-1 text-primary">Living Seed Church - The Emerging Generation</p>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground">
              A place of worship, fellowship, and spiritual growth. We are committed to sharing the love of Christ and
              making disciples.
            </p>
            <div className="mt-6 flex items-center text-muted-foreground">
              <MapPin className="h-5 w-5 mr-2" />
              <p>123 Faith Avenue, Abuja, Nigeria</p>
            </div>
            <div className="mt-2 flex items-center text-muted-foreground">
              <Phone className="h-5 w-5 mr-2" />
              <p>+234 123 456 7890</p>
            </div>
            <div className="mt-2 flex items-center text-muted-foreground">
              <Mail className="h-5 w-5 mr-2" />
              <p>info@rccglscabuja.org</p>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="#about" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="#ministries"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Ministries
                </Link>
              </li>
              <li>
                <Link
                  href="#services"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Service Times
                </Link>
              </li>
              <li>
                <Link
                  href="#events"
                  className="text-base text-muted-foreground hover:text-foreground transition-colors"
                >
                  Events
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Sermons
                </Link>
              </li>
              <li>
                <Link href="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Devotionals
                </Link>
              </li>
              <li>
                <Link href="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Prayer Requests
                </Link>
              </li>
              <li>
                <Link href="#" className="text-base text-muted-foreground hover:text-foreground transition-colors">
                  Give Online
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">Facebook</span>
              <Facebook className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">Instagram</span>
              <Instagram className="h-6 w-6" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <span className="sr-only">YouTube</span>
              <Youtube className="h-6 w-6" />
            </Link>
          </div>
          <p className="mt-8 text-base text-muted-foreground md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} RCCG LSC Abuja - The Emerging Generation. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

