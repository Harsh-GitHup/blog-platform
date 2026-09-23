// app/(dashboard)/admin/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { FileText, Users, Eye, MessageSquare, Plus, Settings } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"

export default async function AdminDashboard() {
    const session = await getServerSession(authOptions)

    // Check if logged in AND if they are an ADMIN
    if (!session || session.user.role !== "ADMIN") {
        redirect("/") // Send non-admins back to home
    }

    // Fetch aggregate statistics
    let totalPosts = 0
    let publishedPosts = 0
    let totalUsers = 0
    let totalComments = 0
    let totalViews = 0
    let recentPosts: any[] = []

    try {
        const [postsCount, usersCount, commentsCount, viewsAgg, latest] = await Promise.all([
            db.post.groupBy({
                by: ['status'],
                _count: true,
            }),
            db.user.count(),
            db.comment.count(),
            db.post.aggregate({
                _sum: { views: true }
            }),
            db.post.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { author: true }
            })
        ])

        totalPosts = postsCount.reduce((acc, curr) => acc + curr._count, 0)
        publishedPosts = postsCount.find(p => p.status === 'PUBLISHED')?._count || 0
        totalUsers = usersCount
        totalComments = commentsCount
        totalViews = viewsAgg._sum.views || 0
        recentPosts = latest
    } catch (error) {
        console.error("DASHBOARD_STATS_ERROR: Database error occurred:", error)
    }

    const statCards = [
        { title: "Total Posts", value: totalPosts, subtext: `${publishedPosts} published`, icon: FileText, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
        { title: "Total Users", value: totalUsers, subtext: "Registered accounts", icon: Users, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
        { title: "Total Views", value: totalViews, subtext: "Across all posts", icon: Eye, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-900/20" },
        { title: "Comments", value: totalComments, subtext: "User interactions", icon: MessageSquare, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold font-heading">Dashboard Overview</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Welcome back, {session.user.name || "Admin"}</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/admin/settings">
                        <Button variant="outline" size="sm" className="gap-2">
                            <Settings className="w-4 h-4" />
                            Settings
                        </Button>
                    </Link>
                    <Link href="/admin/posts/new">
                        <Button size="sm" className="gap-2">
                            <Plus className="w-4 h-4" />
                            New Post
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon
                    return (
                        <div key={index} className="p-6 rounded-2xl border bg-card hover:shadow-md transition-all">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                                    <h3 className="text-3xl font-bold tracking-tight">{stat.value.toLocaleString()}</h3>
                                </div>
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-4">{stat.subtext}</p>
                        </div>
                    )
                })}
            </div>

            {/* Recent Activity Table */}
            <div className="rounded-2xl border bg-card overflow-hidden">
                <div className="p-6 border-b border-border/50 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Recent Posts</h2>
                    <Link href="/admin/posts" className="text-sm text-primary hover:underline font-medium">
                        View all
                    </Link>
                </div>
                {recentPosts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground bg-muted/50">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Title</th>
                                    <th className="px-6 py-4 font-medium">Author</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {recentPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-muted/30 transition-colors">
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center text-muted-foreground text-sm">
                        No recent posts found. Get started by creating your first article!
                    </div>
                )}
            </div>
        </div>
    )
}