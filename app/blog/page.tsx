import { getPublishedPosts, getCategories } from "@/lib/actions/post.actions"
import PostCard from "@/components/PostCard";
import BlogSearch from "@/components/BlogSearch";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const revalidate = 3600;

export const metadata = {
    title: "Explore",
}

export default async function BlogPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams;
    const query = typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : undefined;
    const categoryId = typeof resolvedSearchParams.category === "string" ? resolvedSearchParams.category : undefined;

    const [posts, categories] = await Promise.all([
        getPublishedPosts(query, categoryId),
        getCategories()
    ]);

    return (
        <div className="container mx-auto py-10">
            <h1
                className="text-4xl md:text-5xl font-heading font-extrabold mb-8 text-center text-gradient"
            >
                Explore All Articles
            </h1>

            <Suspense fallback={
                <div className="w-full max-w-2xl mx-auto mb-12 space-y-4">
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <div className="flex flex-wrap gap-2 justify-center">
                        <Skeleton className="h-8 w-16 rounded-full" />
                        <Skeleton className="h-8 w-20 rounded-full" />
                        <Skeleton className="h-8 w-24 rounded-full" />
                    </div>
                </div>
            }>
                <BlogSearch categories={categories} />
            </Suspense>

            {posts.length > 0 ? (
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {posts.map((post, index) => (
                        <div key={post.id}>
                            <PostCard post={post as any} priority={index < 2} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-gray-500">
                    <p>No published articles found yet.</p>
                </div>
            )}
        </div>
    )
}
