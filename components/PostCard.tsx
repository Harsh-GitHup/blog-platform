// components/PostCard.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { motion } from "framer-motion"
import { Prisma } from "@prisma/client"
import { Clock, Eye } from "lucide-react"

type PostWithRelations = Omit<Prisma.PostGetPayload<{
    include: { author: true; category: true }
}>, "createdAt" | "updatedAt" | "publishedAt"> & {
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
}

interface PostCardProps {
    post: PostWithRelations
    priority?: boolean
}

export default function PostCard({ post, priority = false }: PostCardProps) {
    return (
        <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="h-full">
            <Link href={`/blog/${post.slug}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                <Card className="px-0.5 py-0 overflow-hidden group h-full flex flex-col border-border/50 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30">
                    <div className="relative aspect-video w-full overflow-hidden shrink-0 border-b border-border/10">
                        {post.image ? (
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority={priority}
                            />
                        ) : (
                            <div className="w-full h-full gradient-placeholder transition-transform duration-700 group-hover:scale-105" />
                        )}
                        {post.category && (
                            <div className="absolute top-4 left-4 z-10">
                                <Badge variant="secondary" className="bg-background/90 backdrop-blur-md hover:bg-background shadow-sm text-xs px-2.5 py-0.5">
                                    {post.category.name}
                                </Badge>
                            </div>
                        )}
                    </div>

                    <CardHeader className="p-5 pb-3">
                        <div className="flex items-center text-[13px] text-muted-foreground gap-2 mb-3">
                            <time dateTime={post.publishedAt || post.createdAt} className="font-medium">
                                {formatDate(new Date(post.publishedAt || post.createdAt))}
                            </time>
                            <span className="w-1 h-1 rounded-full bg-border"></span>
                            <div className="flex items-center gap-1.5 font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{post.readingTime || 5} min</span>
                            </div>
                            <span className="w-1 h-1 rounded-full bg-border"></span>
                            <div className="flex items-center gap-1.5 font-medium">
                                <Eye className="w-3.5 h-3.5" />
                                <span>{post.views || 0} views</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold font-heading line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                            {post.title}
                        </h3>
                    </CardHeader>

                    <CardContent className="px-5 pb-5 flex-1">
                        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
                            {post.excerpt || "Dive into this article to explore more about this interesting topic..."}
                        </p>
                    </CardContent>

                    <CardFooter className="px-5 py-4 border-t border-border/50 bg-muted/20 mt-auto flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full bg-muted overflow-hidden ring-2 ring-background shadow-sm">
                                {post.author.image ? (
                                    <Image src={post.author.image} alt={post.author.name || "Author"} fill sizes="32px" className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                        {(post.author.name || "A")[0].toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <span className="text-sm font-semibold text-foreground">{post.author.name || "Anonymous"}</span>
                        </div>
                    </CardFooter>
                </Card>
            </Link>
        </motion.div>
    )
}