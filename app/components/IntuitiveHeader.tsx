"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Moon, Sun, Menu, X, ChevronDown, ChevronRight } from "lucide-react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function IntuitiveHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  // State for dropdown menus
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
    setOpenDropdown(null)
  }, [pathname])

  // Handle dropdown toggle
  const handleDropdownToggle = (dropdown: string) => {
    if (openDropdown === dropdown) {
      setOpenDropdown(null)
    } else {
      setOpenDropdown(dropdown)
    }
  }

  // Define menu structure with dropdowns
  const menuItems = [
    {
      label: "About Us",
      key: "about",
      hasDropdown: true,
      items: [
        { href: "/about/our-story", label: "Our Story" },
        { href: "/about/leadership", label: "Leadership" },
        { href: "/about/what-we-believe", label: "What We Believe" },
      ],
    },
    {
      label: "Ministries",
      key: "ministries",
      hasDropdown: true,
      items: [
        { href: "/ministries/children", label: "Children" },
        { href: "/ministries/youth", label: "Youth" },
        { href: "/ministries/men", label: "Men" },
        { href: "/ministries/women", label: "Women" },
      ],
    },
    { href: "/sermons", label: "Sermons", key: "sermons" },
    { href: "/gallery", label: "Gallery", key: "gallery" },
    { href: "/contact", label: "Contact", key: "contact" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-transparent"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link href="/" className="flex items-center justify-center">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lsc-logo-Copy-2-OgyifpSbIOktUopauH8ZjtPzoqG9rw.png"
                alt="RCCG Living Seed Church Logo"
                className="h-32 md:h-36 w-auto"
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {menuItems.map((item, index) => (
              <div key={item.key} className="relative group">
                {item.hasDropdown ? (
                  <button
                    onClick={() => handleDropdownToggle(item.key)}
                    className={`relative text-base font-semibold px-5 py-3 rounded-md hover:bg-secondary/50 flex items-center ${
                      openDropdown === item.key ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                    <ChevronDown
                      className={`ml-1 h-4 w-4 transition-transform ${openDropdown === item.key ? "rotate-180" : ""}`}
                    />
                  </button>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className="relative text-base font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200 ease-in-out px-5 py-3 rounded-md hover:bg-secondary/50"
                  >
                    {item.label}
                  </Link>
                )}

                {/* Desktop Dropdown */}
                {item.hasDropdown && (
                  <AnimatePresence>
                    {openDropdown === item.key && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-1 w-56 rounded-md shadow-lg bg-background border border-border overflow-hidden z-50"
                      >
                        <div className="py-1">
                          {item.items?.map((subItem) => (
                            <Link
                              key={subItem.href}
                              href={subItem.href}
                              className="block px-5 py-3 text-base text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-4"
          >
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-3 rounded-full bg-accent hover:bg-accent/80 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
            </button>

            <Link href="/give">
              <Button className="hidden sm:inline-flex items-center text-base font-semibold bg-primary/90 hover:bg-primary text-primary-foreground px-5 py-6 h-auto rounded-md transition-colors duration-200">
                Give <ChevronRight size={18} className="ml-2" />
              </Button>
            </Link>

            {/* Add WATCH LIVE button here */}
            <a href="https://www.youtube.com/@RCCGLSCAbuja/live" target="_blank" rel="noopener noreferrer">
              <Button className="hidden sm:inline-flex items-center text-base font-semibold bg-red-600 hover:bg-red-700 text-white px-5 py-6 h-auto rounded-md transition-colors duration-200">
                WATCH LIVE <span className="ml-2 relative top-[1px] h-3 w-3 rounded-full bg-white animate-pulse"></span>
              </Button>
            </a>

            <button
              className="md:hidden p-3 rounded-full bg-accent hover:bg-accent/80 transition-colors duration-200"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/95 backdrop-blur-md border-b border-border"
          >
            <div className="w-full px-4 py-6 space-y-2">
              {menuItems.map((item) => (
                <div key={item.key} className="py-2">
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => handleDropdownToggle(item.key)}
                        className={`flex justify-between items-center w-full text-lg font-semibold px-5 py-3 rounded-md ${
                          openDropdown === item.key
                            ? "bg-secondary/50 text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-5 w-5 transition-transform ${openDropdown === item.key ? "rotate-180" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {openDropdown === item.key && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="mt-2 ml-4 border-l-2 border-primary/30 pl-4 space-y-2"
                          >
                            {item.items?.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className="block text-base text-muted-foreground hover:text-foreground py-3"
                                onClick={() => setIsMenuOpen(false)}
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className="block text-lg font-semibold text-muted-foreground hover:text-foreground transition-colors duration-200 ease-in-out px-5 py-3 rounded-md hover:bg-secondary/30"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              <div className="pt-6">
                <Link href="/give" onClick={() => setIsMenuOpen(false)}>
                  <Button className="flex items-center justify-center w-full text-lg font-semibold bg-primary/90 hover:bg-primary text-primary-foreground px-5 py-6 h-auto rounded-md transition-colors duration-200">
                    Give <ChevronRight size={18} className="ml-2" />
                  </Button>
                </Link>

                {/* Add WATCH LIVE button for mobile */}
                <a
                  href="https://www.youtube.com/@RCCGLSCAbuja/live"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="flex items-center justify-center w-full text-lg font-semibold bg-red-600 hover:bg-red-700 text-white px-5 py-6 h-auto rounded-md transition-colors duration-200">
                    WATCH LIVE{" "}
                    <span className="ml-2 relative top-[1px] h-3 w-3 rounded-full bg-white animate-pulse"></span>
                  </Button>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

