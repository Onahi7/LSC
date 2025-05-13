"use server"

import prisma from "@/lib/prisma"

interface ContentVersionOptions {
  userId: string
  contentId: string
  contentType: "devotional" | "announcement"
}

// Create a new version of content
export async function createContentVersion({ 
  userId, 
  contentId, 
  contentType 
}: ContentVersionOptions) {
  try {
    if (contentType === "devotional") {
      // Get the devotional
      const devotional = await prisma.devotional.findUnique({
        where: { id: contentId }
      })
      
      if (!devotional) {
        throw new Error("Devotional not found")
      }
      
      // Create a history record
      await prisma.devotionalHistory.create({
        data: {
          devotionalId: devotional.id,
          version: devotional.version,
          title: devotional.title,
          content: devotional.content,
          scripture: devotional.scripture,
          tags: devotional.tags,
          image: devotional.image,
          featured: devotional.featured,
          status: devotional.status,
          createdBy: {
            connect: { id: userId }
          }
        }
      })
      
      // Increment the version number
      await prisma.devotional.update({
        where: { id: contentId },
        data: { version: { increment: 1 } }
      })
      
      return {
        success: true,
        message: "Devotional version created successfully",
        newVersion: devotional.version + 1
      }
    } else if (contentType === "announcement") {
      // Get the announcement
      const announcement = await prisma.announcement.findUnique({
        where: { id: contentId }
      })
      
      if (!announcement) {
        throw new Error("Announcement not found")
      }
      
      // Create a history record
      await prisma.announcementHistory.create({
        data: {
          announcementId: announcement.id,
          version: announcement.version,
          title: announcement.title,
          content: announcement.content,
          image: announcement.image,
          startDate: announcement.startDate,
          endDate: announcement.endDate,
          status: announcement.status,
          priority: announcement.priority,
          targetGroups: announcement.targetGroups,
          createdBy: {
            connect: { id: userId }
          }
        }
      })
      
      // Increment the version number
      await prisma.announcement.update({
        where: { id: contentId },
        data: { version: { increment: 1 } }
      })
      
      return {
        success: true,
        message: "Announcement version created successfully",
        newVersion: announcement.version + 1
      }
    } else {
      throw new Error("Invalid content type")
    }
  } catch (error) {
    console.error("Error creating content version:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create content version"
    }
  }
}

// Get content version history
export async function getContentVersionHistory({
  contentId,
  contentType
}: Pick<ContentVersionOptions, "contentId" | "contentType">) {
  try {
    if (contentType === "devotional") {
      const versionHistory = await prisma.devotionalHistory.findMany({
        where: { devotionalId: contentId },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          }
        },
        orderBy: { version: "desc" }
      })
      
      return {
        success: true,
        history: versionHistory
      }
    } else if (contentType === "announcement") {
      const versionHistory = await prisma.announcementHistory.findMany({
        where: { announcementId: contentId },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
            }
          }
        },
        orderBy: { version: "desc" }
      })
      
      return {
        success: true,
        history: versionHistory
      }
    } else {
      throw new Error("Invalid content type")
    }
  } catch (error) {
    console.error("Error fetching content version history:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch content version history"
    }
  }
}

// Restore a specific version of content
export async function restoreContentVersion({
  userId,
  contentId,
  contentType,
  versionId
}: ContentVersionOptions & { versionId: string }) {
  try {
    if (contentType === "devotional") {
      // Get the historical version
      const historicalVersion = await prisma.devotionalHistory.findUnique({
        where: { id: versionId }
      })
      
      if (!historicalVersion || historicalVersion.devotionalId !== contentId) {
        throw new Error("Invalid version or version does not belong to this devotional")
      }
      
      // Get current devotional for creating a backup
      const currentDevotional = await prisma.devotional.findUnique({
        where: { id: contentId }
      })
      
      if (!currentDevotional) {
        throw new Error("Devotional not found")
      }
      
      // First, create a backup of the current version
      await prisma.devotionalHistory.create({
        data: {
          devotionalId: currentDevotional.id,
          version: currentDevotional.version,
          title: currentDevotional.title,
          content: currentDevotional.content,
          scripture: currentDevotional.scripture,
          tags: currentDevotional.tags,
          image: currentDevotional.image,
          featured: currentDevotional.featured,
          status: currentDevotional.status,
          createdBy: {
            connect: { id: userId }
          }
        }
      })
      
      // Update the devotional with the historical data
      await prisma.devotional.update({
        where: { id: contentId },
        data: {
          title: historicalVersion.title,
          content: historicalVersion.content,
          scripture: historicalVersion.scripture,
          tags: historicalVersion.tags,
          image: historicalVersion.image,
          featured: historicalVersion.featured,
          // Don't restore status - keep current status
          version: { increment: 1 },
        }
      })
      
      return {
        success: true,
        message: "Devotional restored to previous version successfully"
      }
    } else if (contentType === "announcement") {
      // Get the historical version
      const historicalVersion = await prisma.announcementHistory.findUnique({
        where: { id: versionId }
      })
      
      if (!historicalVersion || historicalVersion.announcementId !== contentId) {
        throw new Error("Invalid version or version does not belong to this announcement")
      }
      
      // Get current announcement for creating a backup
      const currentAnnouncement = await prisma.announcement.findUnique({
        where: { id: contentId }
      })
      
      if (!currentAnnouncement) {
        throw new Error("Announcement not found")
      }
      
      // First, create a backup of the current version
      await prisma.announcementHistory.create({
        data: {
          announcementId: currentAnnouncement.id,
          version: currentAnnouncement.version,
          title: currentAnnouncement.title,
          content: currentAnnouncement.content,
          image: currentAnnouncement.image,
          startDate: currentAnnouncement.startDate,
          endDate: currentAnnouncement.endDate,
          status: currentAnnouncement.status,
          priority: currentAnnouncement.priority,
          targetGroups: currentAnnouncement.targetGroups,
          createdBy: {
            connect: { id: userId }
          }
        }
      })
      
      // Update the announcement with the historical data
      await prisma.announcement.update({
        where: { id: contentId },
        data: {
          title: historicalVersion.title,
          content: historicalVersion.content,
          image: historicalVersion.image,
          startDate: historicalVersion.startDate,
          endDate: historicalVersion.endDate,
          // Don't restore status - keep current status
          priority: historicalVersion.priority,
          targetGroups: historicalVersion.targetGroups,
          version: { increment: 1 },
        }
      })
      
      return {
        success: true,
        message: "Announcement restored to previous version successfully"
      }
    } else {
      throw new Error("Invalid content type")
    }
  } catch (error) {
    console.error("Error restoring content version:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to restore content version"
    }
  }
}
