"use server"

import { db } from "@/lib/db"
import { pusherServer } from "@/lib/pusher"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

import { revalidatePath } from "next/cache"

export async function likePost(postId: string, sessionId: string) {
    try {
        const session = await getServerSession(authOptions)
        const userId = session?.user?.id

        const existingLike = await db.like.findFirst({
            where: { postId, sessionId },
        })

        if (existingLike) {
            await db.like.delete({ where: { id: existingLike.id } })
            await pusherServer.trigger(`post-${postId}`, "like-update", { action: "unlike", sessionId })
            revalidatePath('/blog/[slug]', 'page')
            return { success: true, action: "unlike" }
        }

        await db.like.create({
            data: { postId, sessionId, userId: userId || null },
        })
        await pusherServer.trigger(`post-${postId}`, "like-update", { action: "like", sessionId })
        revalidatePath('/blog/[slug]', 'page')
        return { success: true, action: "like" }
    } catch (error) {
        console.error("Error toggling like:", error)
        return { success: false, error: "Failed to toggle like" }
    }
}

export async function addComment(postId: string, content: string, sessionId: string, parentId?: string) {
    try {
        if (!content || content.trim().length === 0) {
            return { success: false, error: "Comment cannot be empty" }
        }

        const session = await getServerSession(authOptions)
        const userId = session?.user?.id

        const comment = await db.comment.create({
            data: {
                content,
                postId,
                sessionId,
                userId: userId || null,
                ...(parentId && { parentId }),
            },
            include: {
                user: { select: { name: true, image: true } },
                likes: true,
                replies: { include: { user: { select: { name: true, image: true } }, likes: true } }
            },
        })

        await pusherServer.trigger(`post-${postId}`, "new-comment", comment)
        revalidatePath('/blog/[slug]', 'page')
        return { success: true, comment }
    } catch (error) {
        console.error("Error adding comment:", error)
        return { success: false, error: "Failed to add comment" }
    }
}

export async function likeComment(commentId: string, postId: string, sessionId: string) {
    try {
        const session = await getServerSession(authOptions)
        const userId = session?.user?.id

        const existingLike = await db.commentLike.findFirst({
            where: { commentId, sessionId },
        })

        if (existingLike) {
            await db.commentLike.delete({ where: { id: existingLike.id } })
            await pusherServer.trigger(`post-${postId}`, "comment-like-update", { action: "unlike", commentId, sessionId })
            revalidatePath('/blog/[slug]', 'page')
            return { success: true, action: "unlike" }
        }

        await db.commentLike.create({
            data: { commentId, sessionId, userId: userId || null },
        })
        await pusherServer.trigger(`post-${postId}`, "comment-like-update", { action: "like", commentId, sessionId })
        revalidatePath('/blog/[slug]', 'page')
        return { success: true, action: "like" }
    } catch (error) {
        console.error("Error toggling comment like:", error)
        return { success: false, error: "Failed to toggle comment like" }
    }
}
