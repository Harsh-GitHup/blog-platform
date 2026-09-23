// app/(dashboard)/admin/posts/new/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PostForm } from "@/components/admin/PostForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function NewPostPage() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        redirect("/")
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/admin">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold font-heading">Create New Post</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Write and publish a new article to your blog.</p>
                </div>
            </div>
            
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <PostForm userId={session.user.id} />
            </div>
        </div>
    )
}
