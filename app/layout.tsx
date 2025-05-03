import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import GiveModal from "./components/GiveModal"
import EmergingAI from "./components/EmergingAI"
import { SessionProvider } from "@/providers/session-provider"
import { SessionRefreshProvider } from "@/components/session-refresh-provider"
import type React from "react"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })

export const metadata: Metadata = {
  title: "RCCG LSC Abuja - The Emerging Generation",
  description:
    "Welcome to The Redeemed Christian Church of God, Living Seed Church Abuja - The Emerging Generation. Join us as we worship, grow, and serve together.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          <SessionRefreshProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <GiveModal />
              <div className="w-full overflow-x-hidden">{children}</div>
              <EmergingAI />
            </ThemeProvider>
          </SessionRefreshProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

