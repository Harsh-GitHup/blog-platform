"use client"

import { useEffect, useRef } from "react"
import { incrementViewCount } from "@/lib/actions/post.actions"

export default function ViewTracker({ slug }: { slug: string }) {
    const hasTracked = useRef(false)
    
    useEffect(() => {
        if (!hasTracked.current) {
            hasTracked.current = true
            incrementViewCount(slug).catch(console.error)
        }
    }, [slug])
    
    return null
}
