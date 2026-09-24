// force HMR
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, ArrowLeft, Eye, Pencil } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { DeletePostButton } from "@/components/admin/DeletePostButton"

export default async function AdminPostsPage() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        redirect("/")
    }

    // Fetch all posts ordered by creation date
    const posts = await db.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: { author: true }
    })

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold font-heading">All Posts</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Manage, view, and delete your blog posts.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/posts/new">
                        <Button size="sm" className="gap-2">
                            <Plus className="w-4 h-4" />
                            New Post
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
                {posts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground bg-muted/50 border-b border-border/50">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Title</th>
                                    <th className="px-6 py-4 font-medium">Author</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Date Created</th>
                                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {posts.map((post) => (
                                    <tr key={post.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4 font-medium text-foreground">
                                            {post.title}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {post.author?.name || "Unknown"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                ${post.status === "PUBLISHED" 
                                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" 
                                                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                                                }`}
                                            >
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                            {formatDate(post.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/admin/posts/${post.id}/edit`}>
                                                    <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-blue-500">
                                                        <Pencil className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/blog/${post.slug}`}>
                                                    <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-primary">
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <DeletePostButton id={post.id} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                            <Plus className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-lg font-medium text-foreground mb-1">No posts yet</p>
                        <p className="text-sm">Get started by creating your first article!</p>
                        <Link href="/admin/posts/new" className="mt-6">
                            <Button className="shadow-sm">Create New Post</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}
