import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Header() {
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-primary">RCCG</span>
              <span className="text-foreground"> LSC Abuja</span>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            <Link
              href="#about"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href="#ministries"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Ministries
            </Link>
            <Link
              href="#services"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Services
            </Link>
            <Link
              href="#events"
              className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Events
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" className="hidden sm:inline-flex">
              Sermons
            </Button>
            <Button>Give</Button>
          </div>
        </div>
      </div>
    </header>
  )
}

