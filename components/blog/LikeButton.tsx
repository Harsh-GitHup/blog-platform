"use client"

import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { pusherClient } from "@/lib/pusher"
import { likePost } from "@/app/actions/post-interactions"
import { v4 as uuidv4 } from "uuid"

interface LikeButtonProps {
    postId: string
    initialLikes: number
    initialIsLiked: boolean
}

export default function LikeButton({ postId, initialLikes, initialIsLiked }: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes)
    const [isLiked, setIsLiked] = useState(initialIsLiked)
    const [isLoading, setIsLoading] = useState(false)
    const [sessionId, setSessionId] = useState<string>("")

    useEffect(() => {
        // Initialize or retrieve anonymous session ID
        let id = localStorage.getItem("anon_session_id")
        if (!id) {
            id = uuidv4()
            localStorage.setItem("anon_session_id", id)
        }
        setSessionId(id)

        // Subscribe to Pusher
        const channel = pusherClient.subscribe(`post-${postId}`)
        
        channel.bind("like-update", (data: { action: "like" | "unlike", sessionId: string }) => {
            // Only update counts for events triggered by other users
            // Our own local state is already updated optimistically
            if (data.sessionId !== id) {
                if (data.action === "like") {
                    setLikes((prev) => prev + 1)
                } else if (data.action === "unlike") {
                    setLikes((prev) => Math.max(0, prev - 1))
                }
            }
        })

        return () => {
            pusherClient.unsubscribe(`post-${postId}`)
        }
    }, [postId])

    const handleLike = async () => {
        if (!sessionId) return
        
        setIsLoading(true)
        
        // Optimistic update
        const action = isLiked ? "unlike" : "like"
        setIsLiked(!isLiked)
        setLikes((prev) => (action === "like" ? prev + 1 : Math.max(0, prev - 1)))

        const result = await likePost(postId, sessionId)
        
        if (!result.success) {
            // Revert on error
            setIsLiked(isLiked)
            setLikes((prev) => (action === "like" ? Math.max(0, prev - 1) : prev + 1))
        }

        setIsLoading(false)
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
                disabled={isLoading}
                className={`flex items-center gap-2 transition-colors ${
                    isLiked ? "bg-red-500 hover:bg-red-600 text-white border-transparent" : ""
                }`}
            >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                <span>{isLiked ? "Liked" : "Like"}</span>
            </Button>
            <span className="text-sm text-muted-foreground font-medium">
                {likes} {likes === 1 ? "like" : "likes"}
            </span>
        </div>
    )
}
