// app/(dashboard)/admin/posts/[id]/edit/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { PostForm } from "@/components/admin/PostForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/db"

interface EditPostPageProps {
    params: Promise<{ id: string }>
}

export default async function EditPostPage({ params }: EditPostPageProps) {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
        redirect("/")
    }

    const { id } = await params
    
    const post = await db.post.findUnique({
        where: { id }
    })

    if (!post) {
        notFound()
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                <Link href="/admin/posts">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold font-heading tracking-tight">Edit Post</h1>
                    <p className="text-muted-foreground mt-1">Update your blog post content.</p>
                </div>
            </div>

            <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 shadow-sm">
                <PostForm userId={session.user.id} initialData={post} />
            </div>
        </div>
    )
}
