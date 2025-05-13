"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// This function will be used to publish scheduled content
export async function publishScheduledContent() {
  const now = new Date()
  try {
    // First, handle announcements
    const scheduledAnnouncements = await prisma.announcement.findMany({
      where: {
        status: "SCHEDULED",
        publishedAt: {
          lte: now
        }
      }
    })
    if (scheduledAnnouncements.length > 0) {
      await prisma.$transaction(
        scheduledAnnouncements.map((announcement: any) =>
          prisma.announcement.update({
            where: { id: announcement.id },
            data: { status: "PUBLISHED" }
          })
        )
      )
      console.log(`Published ${scheduledAnnouncements.length} scheduled announcements`)
    }
    // Next, handle devotionals
    const scheduledDevotionals = await prisma.devotional.findMany({
      where: {
        status: "SCHEDULED",
        publishedAt: {
          lte: now
        }
      }
    })
    if (scheduledDevotionals.length > 0) {
      await prisma.$transaction(
        scheduledDevotionals.map((devotional: any) =>
          prisma.devotional.update({
            where: { id: devotional.id },
            data: { status: "PUBLISHED" }
          })
        )
      )
      console.log(`Published ${scheduledDevotionals.length} scheduled devotionals`)
    }
    // Revalidate pages that display this content
    revalidatePath("/announcements")
    revalidatePath("/devotionals")
    return {
      success: true,
      publishedAnnouncements: scheduledAnnouncements.length,
      publishedDevotionals: scheduledDevotionals.length,
    }
  } catch (error) {
    console.error("Error publishing scheduled content:", error)
    return {
      success: false,
      error: "Failed to publish scheduled content"
    }
  }
}

// This function will archive expired announcements
export async function archiveExpiredAnnouncements() {
  const now = new Date()
  try {
    // Find published announcements with an end date in the past
    const expiredAnnouncements = await prisma.announcement.findMany({
      where: {
        status: "PUBLISHED",
        endDate: {
          lt: now
        }
      }
    })
    if (expiredAnnouncements.length > 0) {
      await prisma.$transaction(
        expiredAnnouncements.map((announcement: any) =>
          prisma.announcement.update({
            where: { id: announcement.id },
            data: { status: "ARCHIVED" }
          })
        )
      )
      console.log(`Archived ${expiredAnnouncements.length} expired announcements`)
    }
    // Revalidate the announcements page
    revalidatePath("/announcements")
    return {
      success: true,
      archivedAnnouncements: expiredAnnouncements.length,
    }
  } catch (error) {
    console.error("Error archiving expired announcements:", error)
    return {
      success: false,
      error: "Failed to archive expired announcements"
    }
  }
}
