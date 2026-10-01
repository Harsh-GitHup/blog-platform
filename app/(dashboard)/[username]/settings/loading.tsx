import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"

export default function SettingsLoading() {
    return (
        <Card className="w-full max-w-[600px] mx-auto mt-8 mb-20 p-6 sm:p-8 bg-background animate-in fade-in duration-500">
            <div className="mb-8">
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-64" />
            </div>
            
            <div className="space-y-10">
                <section>
                    <Skeleton className="h-6 w-24 mb-6" />
                    <div className="space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Skeleton className="h-20 w-20 rounded-full" />
                            <div className="space-y-2 flex-1">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-32 mt-4" />
                    </div>
                </section>

                <hr className="border-border" />

                <section>
                    <Skeleton className="h-6 w-40 mb-6" />
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-36" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                        <Skeleton className="h-10 w-32 mt-4" />
                    </div>
                </section>
                
                <hr className="border-border" />

                <section>
                    <Skeleton className="h-6 w-48 mb-6" />
                    <Skeleton className="h-10 w-40" />
                </section>
            </div>
        </Card>
    )
}
