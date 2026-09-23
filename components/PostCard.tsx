// components/PostCard.tsx
"use client"

import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import { motion } from "framer-motion"
import { Prisma } from "@prisma/client"
import { Clock } from "lucide-react"

type PostWithRelations = Omit<Prisma.PostGetPayload<{
    include: { author: true; category: true }
}>, "createdAt" | "updatedAt" | "publishedAt"> & {
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
}

interface PostCardProps {
    post: PostWithRelations
}

export default function PostCard({ post }: PostCardProps) {
    return (
        <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="h-full">
            <Link href={`/blog/${post.slug}`} className="block h-full">
                <Card className="overflow-hidden group h-full flex flex-col border-border/50 bg-card/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30">
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                        {post.image ? (
                            <Image
                                src={post.image}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full gradient-placeholder transition-transform duration-700 group-hover:scale-105" />
                        )}
                        {post.category && (
                            <div className="absolute top-3 left-3 z-10">
                                <Badge variant="secondary" className="bg-background/80 backdrop-blur-md hover:bg-background/90 text-xs font-medium">
                                    {post.category.name}
                                </Badge>
                            </div>
                        )}
                    </div>
                <CardHeader className="space-y-2.5 pb-4">
                    <div className="flex items-center text-xs text-muted-foreground gap-2">
                        <time dateTime={post.publishedAt || post.createdAt}>
                            {formatDate(new Date(post.publishedAt || post.createdAt))}
                        </time>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{post.readingTime || 5} min read</span>
                        </div>
                    </div>
                    <h3 className="text-xl font-bold font-heading line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                        {post.title}
                    </h3>
                </CardHeader>
                <CardContent className="pb-6">
                    <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                        {post.excerpt || "Read more about this interesting topic..."}
                    </p>
                </CardContent>
                <CardFooter className="mt-auto border-t border-border/50 pt-4 flex items-center justify-between bg-muted/10">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted overflow-hidden ring-2 ring-background">
                            {post.author.image ? (
                                <Image src={post.author.image} alt={post.author.name || "Author"} width={32} height={32} className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                    {(post.author.name || "A")[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                        <span className="text-sm font-medium">{post.author.name || "Anonymous"}</span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
        </motion.div>
    )
}