"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { deletePost } from "@/lib/actions/post.actions"
import toast from "react-hot-toast"

export function DeletePostButton({ id }: { id: string }) {
    const [isLoading, setIsLoading] = useState(false)

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;
        
        setIsLoading(true)
        const res = await deletePost(id)
        if (res.success) {
            toast.success("Post deleted successfully")
        } else {
            toast.error(res.error || "Failed to delete post")
            setIsLoading(false)
        }
    }

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDelete} 
            disabled={isLoading}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
            aria-label="Delete post"
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    )
}
