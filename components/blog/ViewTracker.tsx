"use client"

import { useEffect, useRef } from "react"
import { incrementViewCount } from "@/lib/actions/post.actions"

export default function ViewTracker({ slug }: { slug: string }) {
    const hasTracked = useRef(false)
    
    useEffect(() => {
        if (hasTracked.current) return
        hasTracked.current = true
        
        try {
            const viewedPosts = JSON.parse(sessionStorage.getItem("viewedPosts") || "[]")
            if (!viewedPosts.includes(slug)) {
                incrementViewCount(slug).catch(console.error)
                viewedPosts.push(slug)
                sessionStorage.setItem("viewedPosts", JSON.stringify(viewedPosts))
            }
        } catch (e) {
            // Fallback if sessionStorage is unavailable
            incrementViewCount(slug).catch(console.error)
        }
    }, [slug])
    
    return null
}
