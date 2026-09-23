// app/page.tsx
import { getPublishedPosts } from "@/lib/actions/post.actions"
import PostCard from "@/components/PostCard";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const revalidate = 3600; 

export default async function Home() {
    const posts = await getPublishedPosts()

    return (
        <div className="flex flex-col gap-16 pb-16">
            {/* Hero Section */}
            <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
                <div className="container mx-auto px-4 text-center">
                    <div
                        className="max-w-3xl mx-auto space-y-6"
                    >
                        <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight">
                            Discover the latest in <span className="text-gradient">Technology</span> & <span className="text-gradient">Design</span>
                        </h1>
                        <p className="text-xl text-muted-foreground md:leading-relaxed">
                            Insights, tutorials, and stories from the cutting edge of web development. Join our community of creators.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                            <Link href="/blog">
                                <Button size="lg" className="h-12 px-8 text-base group">
                                    Start Reading
                                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                                    Join the Community
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Articles Section */}
            <section className="container mx-auto px-4">
                <h2 
                    className="text-3xl font-heading font-bold mb-10 flex items-center gap-4"
                >
                    Latest Articles
                    <div className="h-px bg-border flex-1"></div>
                </h2>

                {posts.length > 0 ? (
                    <div 
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
                    >
                        {posts.map((post) => (
                            <div key={post.id} className="h-full">
                                <PostCard post={post as any} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-muted/30 rounded-2xl border border-border/50">
                        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                            <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5L18.5 7H20z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No Articles Yet</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">We're cooking up some great content. Check back soon for the latest updates!</p>
                    </div>
                )}
            </section>
        </div>
    )
}