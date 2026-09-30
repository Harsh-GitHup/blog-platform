"use client"

import { useState } from "react"
import { createPortal } from "react-dom"
import { Button } from "@/components/ui/button"
import { Trash2, AlertCircle } from "lucide-react"
import { deletePost } from "@/lib/actions/post.actions"
import toast from "react-hot-toast"

export function DeletePostButton({ id }: { id: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleDelete = async () => {
        setIsLoading(true)
        const res = await deletePost(id)
        if (res.success) {
            toast.success("Post deleted successfully")
            setIsModalOpen(false)
        } else {
            toast.error(res.error || "Failed to delete post")
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsModalOpen(true)} 
                disabled={isLoading}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                aria-label="Delete post"
            >
                <Trash2 className="w-4 h-4" />
            </Button>

            {isModalOpen && typeof document !== "undefined" && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="bg-card border shadow-xl rounded-xl max-w-sm w-full p-6 space-y-6 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full">
                                <AlertCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold">Delete Post</h3>
                            <p className="text-muted-foreground text-sm">
                                Are you sure you want to delete this post? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3 justify-center w-full pt-2">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsModalOpen(false)}
                                disabled={isLoading}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="destructive" 
                                onClick={handleDelete}
                                disabled={isLoading}
                                className="flex-1"
                            >
                                {isLoading ? "Deleting..." : "Delete"}
                            </Button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}
