import { getPublishedPosts } from "@/lib/actions/post.actions"
import PostCard from "@/components/PostCard";

export const revalidate = 3600; 

export default async function BlogPage() {
    // For now, we will reuse the getPublishedPosts action.
    // You can later add pagination or search filtering here!
    const posts = await getPublishedPosts()

    return (
        <div className="container mx-auto py-10">
            <h1 
                className="text-4xl md:text-5xl font-heading font-extrabold mb-12 text-center text-gradient"
            >
                Explore All Articles
            </h1>

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
