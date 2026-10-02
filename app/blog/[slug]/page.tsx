// app/blog/[slug]/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import LikeButton from "@/components/blog/LikeButton"
import CommentSection from "@/components/blog/CommentSection"
import ViewTracker from "@/components/blog/ViewTracker"
import { Eye } from "lucide-react"

interface PostPageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps) {
    const { slug } = await params
    const post = await db.post.findUnique({ where: { slug } })
    if (!post || post.status !== "PUBLISHED") return { title: "Post Not Found" }
    return { title: post.title, description: post.excerpt }
}

export default async function PostPage({ params }: PostPageProps) {
    const { slug } = await params
    const post = await db.post.findUnique({
        where: { slug },
        include: { 
            author: true, 
            category: true, 
            tags: true,
            comments: {
                orderBy: { createdAt: 'asc' },
                include: {
                    user: { select: { name: true, image: true } },
                    likes: true,
                }
            },
            _count: {
                select: { likes: true }
            }
        }
    })

    if (!post) notFound()
    
    const session = await getServerSession(authOptions)
    if (post.status !== "PUBLISHED") {
        if (!session || session.user.id !== post.authorId) {
            notFound()
        }
    }

    // Build comment tree from flat list
    const commentMap = new Map()
    post.comments.forEach(c => {
        commentMap.set(c.id, { ...c, replies: [] })
    })

    const rootComments: any[] = []
    post.comments.forEach(c => {
        if (c.parentId) {
            const parent = commentMap.get(c.parentId)
            if (parent) {
                parent.replies.push(commentMap.get(c.id))
            } else {
                rootComments.push(commentMap.get(c.id))
            }
        } else {
            rootComments.push(commentMap.get(c.id))
        }
    })

    rootComments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return (
        <article className="max-w-3xl mx-auto py-10">
            <ViewTracker slug={post.slug} />
            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b pb-8 border-border/50">
                <div className="flex-1 md:pr-8">
                    {post.category && (
                        <span className="inline-block font-semibold text-primary uppercase tracking-wider text-sm mb-3 bg-primary/10 px-3 py-1 rounded-full">
                            {post.category.name}
                        </span>
                    )}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground tracking-tight">
                        {post.title}
                    </h1>
                </div>
                
                <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="text-left md:text-right">
                            <p className="text-base font-bold text-foreground">{post.author?.name || "Anonymous"}</p>
                            <p className="text-xs text-muted-foreground">Author & Contributor</p>
                        </div>
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-border shadow-sm bg-muted flex items-center justify-center">
                            {post.author?.image ? (
                                <Image
                                    src={post.author.image}
                                    alt={post.author?.name || "Author"}
                                    fill
                                    sizes="48px"
                                    className="object-cover"
                                />
                            ) : (
                                <span className="text-sm font-bold text-muted-foreground">
                                    {(post.author?.name || "A")[0].toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <span className="hidden md:inline-block w-8 h-[1px] bg-border"></span>
                        {formatDate(post.publishedAt || post.createdAt)}
                        <span className="ml-3 flex items-center gap-1.5">
                            <Eye className="w-4 h-4" />
                            {post.views} views
                        </span>
                    </div>
                </div>
            </header>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-10 shadow-xl bg-muted/30">
                {post.image ? (
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 800px"
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full gradient-placeholder flex items-center justify-center text-muted-foreground">
                        <span className="font-medium text-lg opacity-50">No Cover Image</span>
                    </div>
                )}
            </div>

            <div
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <hr className="my-12" />

            <div className="flex justify-between items-center mb-12">
                <LikeButton 
                    postId={post.id} 
                    initialLikes={post._count.likes} 
                    initialIsLiked={false} 
                />
            </div>

            <section className="mb-12">
                <h4 className="text-lg font-bold mb-4">About the Author</h4>
                <p className="text-muted-foreground italic">
                    {post.author.name} is a writer passionate about technology and sharing knowledge with the community.
                </p>
            </section>
            
            <hr className="my-12" />

            <CommentSection postId={post.id} initialComments={rootComments} />
        </article>
    )
}