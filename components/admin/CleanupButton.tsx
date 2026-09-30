"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cleanupOrphanedImages } from "@/app/actions/admin-actions"
import { Trash2, Loader2 } from "lucide-react"
import { ConfirmModal } from "@/components/ui/confirm-modal"

export function CleanupButton() {
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [result, setResult] = useState<{ success: boolean, message: string } | null>(null)

    const handleCleanup = async () => {
        setIsLoading(true)
        setResult(null)

        try {
            const response = await cleanupOrphanedImages()
            setResult(response)
        } catch (error) {
            setResult({ success: false, message: "Failed to run cleanup." })
        } finally {
            setIsLoading(false)
            setIsModalOpen(false)
        }
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Run this utility to scan UploadThing and delete any uploaded files/images that are no longer referenced by any Post or User in the database.
            </p>
            
            <Button 
                onClick={() => setIsModalOpen(true)} 
                disabled={isLoading}
                variant="destructive"
                className="gap-2"
            >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {isLoading ? "Running Cleanup..." : "Run Image Cleanup"}
            </Button>

            {result && (
                <div className={`p-3 rounded-md text-sm font-medium ${result.success ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"}`}>
                    {result.message}
                </div>
            )}

            <ConfirmModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleCleanup}
                title="Run Database Cleanup"
                description="Are you sure you want to run the database cleanup? This will permanently delete any unused images from UploadThing."
                confirmText="Run Cleanup"
                isLoading={isLoading}
            />
        </div>
    )
}
