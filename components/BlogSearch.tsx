"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useEffect, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function BlogSearch({ categories }: { categories: any[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const [query, setQuery] = useState(searchParams.get("q") || "")
    const [categoryName, setCategoryName] = useState(searchParams.get("category") || "all")
    const [isPending, startTransition] = useTransition()

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString())
            if (value) {
                params.set(name, value)
            } else {
                params.delete(name)
            }
            return params.toString()
        },
        [searchParams]
    )

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            startTransition(() => {
                router.push(`/blog?${createQueryString("q", query)}`)
            })
        }, 500)
        return () => clearTimeout(timeoutId)
    }, [query, router, createQueryString])

    const handleCategoryChange = (val: string) => {
        setCategoryName(val)
        startTransition(() => {
            router.push(`/blog?${createQueryString("category", val !== 'all' ? val : '')}`)
        })
    }

    return (
        <div className="w-full max-w-2xl mx-auto mb-12 space-y-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search articles..."
                    className="pl-10 h-12 rounded-xl border-border/50 bg-card shadow-sm"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            
            {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                    <button
                        onClick={() => handleCategoryChange('all')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                            categoryName === 'all' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                    >
                        All
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => handleCategoryChange(cat.name)}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                                categoryName === cat.name 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
