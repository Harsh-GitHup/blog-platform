// lib/actions/post.actions.ts
"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

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
        const post = await db.post.update({
            where: { id },
            data,
        })
        revalidatePath("/")
        revalidatePath("/blog")
        revalidatePath(`/blog/${post.slug}`)
        revalidatePath("/admin/posts")
        return { success: true, post }
    } catch (error) {
        console.error("Failed to update post:", error)
        return { success: false, error: "Database error occurred" }
    }
}

export async function getPublishedPosts() {
    try {
        const posts = await db.post.findMany({
            where: { status: "PUBLISHED" },
            orderBy: { publishedAt: "desc" },
            include: {
                author: { select: { name: true, image: true } },
                category: true,
                tags: true,
            },
            take: 10,
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
        const comments = await db.comment.findMany({ where: { postId: id }, select: { id: true } })
        const commentIds = comments.map(c => c.id)

        if (commentIds.length > 0) {
            await db.commentLike.deleteMany({ where: { commentId: { in: commentIds } } })
        }
        await db.comment.deleteMany({ where: { postId: id } })
        await db.like.deleteMany({ where: { postId: id } })
        
        await db.post.delete({ where: { id } })
        revalidatePath("/admin")
        return { success: true }
    } catch (error: any) {
        console.error("DELETE_POST_ERROR:", error)
        return { success: false, error: error?.message || "Delete failed" }
    }
}