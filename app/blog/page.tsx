import { getPublishedPosts, getCategories } from "@/lib/actions/post.actions"
import PostCard from "@/components/PostCard";
import BlogSearch from "@/components/BlogSearch";

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

            <Suspense fallback={null}>
                <BlogSearch categories={categories} />
            </Suspense>

            {posts.length > 0 ? (
                <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {posts.map((post) => (
                        <div key={post.id}>
                            <PostCard post={post as any} />
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
