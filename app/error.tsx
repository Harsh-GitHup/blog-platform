"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, RefreshCw } from "lucide-react"

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service in production
        console.error(error)
    }, [error])

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
            <div className="bg-card border rounded-2xl shadow-sm p-8 max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mb-2">
                        <AlertCircle className="h-8 w-8" />
                    </div>
                </div>
                
                <div>
                    <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
                    <p className="text-muted-foreground text-sm">
                        An unexpected error occurred while loading this page. 
                        Our team has been notified.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                    <Button 
                        onClick={() => reset()} 
                        variant="default"
                        className="gap-2"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Try again
                    </Button>
                    <Link href="/">
                        <Button variant="outline" className="w-full">
                            Go back home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
