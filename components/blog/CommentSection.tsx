 "use client"

import { useState, useEffect } from "react"
import { pusherClient } from "@/lib/pusher"
import { addComment, likeComment } from "@/app/actions/post-interactions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import { v4 as uuidv4 } from "uuid"
import { Heart, Reply } from "lucide-react"
import { cn } from "@/lib/utils"

type CommentLikeData = { id: string; sessionId: string; userId: string | null }

export type CommentData = {
    id: string
    content: string
    createdAt: Date
    user: { name: string | null; image: string | null } | null
    likes?: CommentLikeData[]
    replies?: CommentData[]
}

interface CommentSectionProps {
    postId: string
    initialComments: CommentData[]
}

function CommentItem({ 
    comment, 
    postId, 
    sessionId, 
    onReplySubmit 
}: { 
    comment: CommentData, 
    postId: string, 
    sessionId: string,
    onReplySubmit: (parentId: string, content: string) => Promise<boolean>
}) {
    const [isReplying, setIsReplying] = useState(false)
    const [replyContent, setReplyContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [likes, setLikes] = useState<CommentLikeData[]>(comment.likes || [])
    
    // Listen for likes specific to this comment
    useEffect(() => {
        const channel = pusherClient.subscribe(`post-${postId}`)
        const handleLikeUpdate = (data: { action: "like" | "unlike", commentId: string, sessionId: string }) => {
            if (data.commentId === comment.id) {
                if (data.action === "like") {
                    setLikes(prev => [...prev, { id: "temp", sessionId: data.sessionId, userId: null }])
                } else {
                    setLikes(prev => prev.filter(l => l.sessionId !== data.sessionId))
                }
            }
        }
        channel.bind("comment-like-update", handleLikeUpdate)
        return () => {
            channel.unbind("comment-like-update", handleLikeUpdate)
        }
    }, [postId, comment.id])

    const handleReply = async () => {
        if (!replyContent.trim()) return
        setIsSubmitting(true)
        const success = await onReplySubmit(comment.id, replyContent)
        if (success) {
            setReplyContent("")
            setIsReplying(false)
        }
        setIsSubmitting(false)
    }

    const handleLike = async () => {
        if (!sessionId) return
        
        // Optimistic update
        const hasLiked = likes.some(l => l.sessionId === sessionId)
        if (hasLiked) {
            setLikes(prev => prev.filter(l => l.sessionId !== sessionId))
        } else {
            setLikes(prev => [...prev, { id: "temp", sessionId, userId: null }])
        }

        await likeComment(comment.id, postId, sessionId)
    }

    const hasLiked = likes.some(l => l.sessionId === sessionId)
    const displayName = comment.user ? (comment.user.name || "Registered User") : "Anonymous User"

    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-4 p-4 rounded-lg bg-card border shadow-sm">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={comment.user?.image || ""} />
                    <AvatarFallback>
                        {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-foreground">
                            {displayName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </p>
                    </div>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap pt-2">
                        {comment.content}
                    </p>
                    
                    <div className="flex items-center gap-4 pt-3">
                        <button 
                            onClick={handleLike}
                            className={cn(
                                "flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-primary",
                                hasLiked ? "text-primary" : "text-muted-foreground"
                            )}
                        >
                            <Heart className={cn("h-4 w-4", hasLiked && "fill-current")} />
                            {likes.length}
                        </button>
                        <button 
                            onClick={() => setIsReplying(!isReplying)}
                            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            <Reply className="h-4 w-4" />
                            Reply
                        </button>
                    </div>
                </div>
            </div>

            {isReplying && (
                <div className="pl-14 pr-4">
                    <div className="flex gap-3">
                        <Textarea
                            placeholder="Write a reply..."
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            className="min-h-[80px] text-sm"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsReplying(false)}>Cancel</Button>
                        <Button size="sm" onClick={handleReply} disabled={isSubmitting || !replyContent.trim()}>
                            {isSubmitting ? "Replying..." : "Reply"}
                        </Button>
                    </div>
                </div>
            )}

            {/* Render Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="pl-6 md:pl-12 border-l-2 border-muted ml-6 space-y-4 mt-2">
                    {comment.replies.map(reply => (
                        <CommentItem 
                            key={reply.id} 
                            comment={reply} 
                            postId={postId} 
                            sessionId={sessionId} 
                            onReplySubmit={onReplySubmit} 
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default function CommentSection({ postId, initialComments }: CommentSectionProps) {
    const [comments, setComments] = useState<CommentData[]>(initialComments)
    const [newComment, setNewComment] = useState("")
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
        
        const handleNewComment = (comment: CommentData) => {
            setComments((prev) => {
                // If it's a top-level comment
                if (!('parentId' in comment) || !(comment as any).parentId) {
                    if (prev.some(c => c.id === comment.id)) return prev
                    return [comment, ...prev]
                } else {
                    // It's a reply. Find the parent and append it.
                    // For single-level nesting, we only search top-level comments
                    const parentId = (comment as any).parentId
                    return prev.map(c => {
                        if (c.id === parentId) {
                            const replies = c.replies || []
                            if (replies.some(r => r.id === comment.id)) return c
                            return { ...c, replies: [...replies, comment] }
                        }
                        return c
                    })
                }
            })
        }

        channel.bind("new-comment", handleNewComment)

        return () => {
            channel.unbind("new-comment", handleNewComment)
            pusherClient.unsubscribe(`post-${postId}`)
        }
    }, [postId])

    const handleReplySubmit = async (parentId: string, content: string) => {
        if (!sessionId) return false
        const result = await addComment(postId, content, sessionId, parentId)
        return result.success
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!newComment.trim() || !sessionId) return

        setIsLoading(true)

        const result = await addComment(postId, newComment, sessionId)

        if (result.success && result.comment) {
            setNewComment("")
        }

        setIsLoading(false)
    }

    return (
        <div className="mt-12 w-full">
            <h3 className="text-2xl font-bold mb-6">Comments ({comments.reduce((acc, curr) => acc + 1 + (curr.replies?.length || 0), 0)})</h3>
            
            <form onSubmit={handleSubmit} className="mb-8">
                <Textarea
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="mb-4 min-h-[100px]"
                />
                <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading || !newComment.trim()}>
                        {isLoading ? "Posting..." : "Post Comment"}
                    </Button>
                </div>
            </form>

            <div className="space-y-6">
                {comments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                    comments.map((comment) => (
                        <CommentItem 
                            key={comment.id} 
                            comment={comment} 
                            postId={postId}
                            sessionId={sessionId}
                            onReplySubmit={handleReplySubmit}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
