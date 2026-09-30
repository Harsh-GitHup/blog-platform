"use server"

import { db } from "@/lib/db"
import { UTApi } from "uploadthing/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const utapi = new UTApi()

export async function cleanupOrphanedImages() {
    const session = await getServerSession(authOptions)
    
    // Ensure only admins can trigger this
    if (!session || session.user.role !== "ADMIN") {
        return { success: false, message: "Unauthorized" }
    }

    try {
        // 1. Fetch all files from UploadThing
        let allFiles: any[] = []
        let hasMore = true
        let offset = 0
        const limit = 500

        while (hasMore) {
            const result = await utapi.listFiles({ limit, offset })
            allFiles = [...allFiles, ...result.files]
            hasMore = result.hasMore
            offset += limit
        }
        const uploadThingKeys = allFiles.map(f => f.key)

        // 2. Fetch all referenced images from MongoDB
        
        // Users (profile pictures)
        const users = await db.user.findMany({
            where: { image: { not: null } },
            select: { image: true }
        })
        const userImageUrls = users.map(u => u.image).filter(Boolean) as string[]

        // Posts (cover images and content)
        const posts = await db.post.findMany({
            where: { OR: [{ image: { not: null } }, { content: { contains: "utfs.io/f/" } }] },
            select: { image: true, content: true }
        })
        const postImageUrls = posts.map(p => p.image).filter(Boolean) as string[]
        
        // Extract UploadThing keys embedded in post content (Rich Text Editor)
        const regex = /utfs\.io\/f\/([a-zA-Z0-9-_]+)/g
        const contentKeys = new Set<string>()
        posts.forEach(p => {
            if (p.content) {
                let match
                while ((match = regex.exec(p.content)) !== null) {
                    contentKeys.add(match[1])
                }
            }
        })

        // Helper to extract key from a standard UploadThing URL
        const extractKey = (url: string) => {
            const match = url.match(/utfs\.io\/f\/([a-zA-Z0-9-_]+)/)
            return match ? match[1] : null
        }

        const dbKeys = new Set<string>([
            ...userImageUrls.map(extractKey).filter(Boolean) as string[],
            ...postImageUrls.map(extractKey).filter(Boolean) as string[],
            ...Array.from(contentKeys)
        ])

        // 3. Find orphaned keys
        const orphanedKeys = uploadThingKeys.filter(key => !dbKeys.has(key))

        if (orphanedKeys.length > 0) {
            // Delete orphaned files from UploadThing
            await utapi.deleteFiles(orphanedKeys)
        }

        return { 
            success: true, 
            message: `Cleanup complete. Found and deleted ${orphanedKeys.length} orphaned images.`,
            deletedCount: orphanedKeys.length
        }

    } catch (error: any) {
        console.error("CLEANUP_ERROR:", error)
        return { success: false, message: error.message || "An error occurred during cleanup." }
    }
}
