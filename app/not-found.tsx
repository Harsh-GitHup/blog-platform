import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
            <div className="bg-card border rounded-2xl shadow-sm p-8 max-w-md w-full text-center space-y-6">
                <div className="flex justify-center">
                    <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center mb-2">
                        <FileQuestion className="h-8 w-8" />
                    </div>
                </div>
                
                <div>
                    <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
                    <p className="text-muted-foreground text-sm">
                        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
                    </p>
                </div>

                <div className="pt-4">
                    <Link href="/">
                        <Button variant="default" className="w-full">
                            Return to Home
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
