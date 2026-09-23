// app/blog/[slug]/page.tsx
import { db } from "@/lib/db"
import { notFound } from "next/navigation"
import { formatDate } from "@/lib/utils"
import Image from "next/image"
import LikeButton from "@/components/blog/LikeButton"
import CommentSection from "@/components/blog/CommentSection"

interface PostPageProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PostPageProps) {
    const { slug } = await params
    const post = await db.post.findUnique({ where: { slug } })
    if (!post) return { title: "Post Not Found" }
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
                where: { 
                    OR: [
                        { parentId: null },
                        { parentId: { isSet: false } }
                    ]
                },
                orderBy: { createdAt: 'desc' },
                include: {
                    user: { select: { name: true, image: true } },
                    likes: true,
                    replies: {
                        orderBy: { createdAt: 'asc' },
                        include: {
                            user: { select: { name: true, image: true } },
                            likes: true
                        }
                    }
                }
            },
            _count: {
                select: { likes: true }
            }
        }
    })

    if (!post) notFound()

    return (
        <article className="max-w-3xl mx-auto py-10">
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
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-border shadow-sm">
                            <Image
                                src={post.author?.image || "/avatar-placeholder.png"}
                                alt={post.author?.name || "Author"}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <span className="hidden md:inline-block w-8 h-[1px] bg-border"></span>
                        {formatDate(post.publishedAt || post.createdAt)}
                    </div>
                </div>
            </header>

            <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-10 shadow-xl">
                <Image
                    src={post.image || "/blog-placeholder.jpg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                />
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

            <CommentSection postId={post.id} initialComments={post.comments} />
        </article>
    )
}