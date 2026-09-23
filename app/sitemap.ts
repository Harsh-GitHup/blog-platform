// app/sitemap.ts
import { MetadataRoute } from 'next'
import { db } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    let posts: { slug: string, updatedAt: Date }[] = [];
    try {
        posts = await db.post.findMany({ select: { slug: true, updatedAt: true } })
    } catch (error) {
        console.error("Sitemap generation error: failed to fetch posts")
    }
    
    const postEntries = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt,
    }))

    return [
        { url: `${baseUrl}/`, lastModified: new Date() },
        ...postEntries,
    ]
}
