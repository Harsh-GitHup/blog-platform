// lib/actions/post.actions.ts
"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export type CreatePostInput = {
    title: string
    slug: string
    content: string
    image?: string;
    excerpt?: string
    authorId: string
    categoryId?: string
    tagIds: string[]
}

export async function createPost(data: CreatePostInput) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id || session.user.id !== data.authorId) {
            return { success: false, error: "Unauthorized" }
        }

        const post = await db.post.create({
            data: {
                title: data.title,
                slug: data.slug,
                content: data.content,
                image: data.image,
                excerpt: data.excerpt,
                authorId: data.authorId,
                categoryId: data.categoryId,
                tagIds: data.tagIds,
                status: "PUBLISHED",
                publishedAt: new Date(),
            },
        })

        revalidatePath("/")
        revalidatePath("/blog")

        return { success: true, post }
    } catch (error) {
        console.error("Failed to create post:", error)
        return { success: false, error: "Database error occurred" }
    }
}

export async function updatePost(id: string, data: Partial<CreatePostInput>) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const existingPost = await db.post.findUnique({ where: { id } })
        if (!existingPost || existingPost.authorId !== session.user.id) {
            return { success: false, error: "Unauthorized or post not found" }
        }

        const post = await db.post.update({
            where: { id },
            data,
        })
        revalidatePath("/")
        revalidatePath("/blog")
        revalidatePath(`/blog/${post.slug}`)
        revalidatePath(`/${session.user.username || 'admin'}/posts`)
        return { success: true, post }
    } catch (error) {
        console.error("Failed to update post:", error)
        return { success: false, error: "Database error occurred" }
    }
}

export async function getPublishedPosts(query?: string, categoryId?: string) {
    try {
        const whereClause: any = { status: "PUBLISHED" }
        
        if (query) {
            whereClause.OR = [
                { title: { contains: query, mode: "insensitive" } },
                { excerpt: { contains: query, mode: "insensitive" } },
                { content: { contains: query, mode: "insensitive" } },
            ]
        }
        
        if (categoryId && categoryId !== 'all') {
            whereClause.categoryId = categoryId
        }

        const posts = await db.post.findMany({
            where: whereClause,
            orderBy: { publishedAt: "desc" },
            include: {
                author: { select: { name: true, image: true, username: true } },
                category: true,
                tags: true,
            },
            take: 20, // increased take slightly for better search results
        })

        return posts.map(post => ({
            ...post,
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
            publishedAt: post.publishedAt?.toISOString() || null,
        }))
    } catch (error) {
        console.error("FETCH_POSTS_ERROR: Database unavailable.")
        return []
    }
}

export async function deletePost(id: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized" }
        }

        const existingPost = await db.post.findUnique({ where: { id } })
        if (!existingPost || existingPost.authorId !== session.user.id) {
            return { success: false, error: "Unauthorized or post not found" }
        }

        const comments = await db.comment.findMany({ where: { postId: id }, select: { id: true } })
        const commentIds = comments.map(c => c.id)

        if (commentIds.length > 0) {
            await db.commentLike.deleteMany({ where: { commentId: { in: commentIds } } })
        }
        await db.comment.deleteMany({ where: { postId: id } })
        await db.like.deleteMany({ where: { postId: id } })
        
        await db.post.delete({ where: { id } })
        revalidatePath(`/${session.user.username || 'admin'}`)
        return { success: true }
    } catch (error: any) {
        console.error("DELETE_POST_ERROR:", error)
        return { success: false, error: error?.message || "Delete failed" }
    }
}

export async function incrementViewCount(slug: string) {
    try {
        await db.post.update({
            where: { slug },
            data: { views: { increment: 1 } }
        })
        return { success: true }
    } catch (error) {
        console.error("Failed to increment views:", error)
        return { success: false }
    }
}

export async function getCategories() {
    try {
        return await db.category.findMany({
            orderBy: { name: 'asc' }
        })
    } catch (error) {
        console.error("Failed to fetch categories:", error)
        return []
    }
}