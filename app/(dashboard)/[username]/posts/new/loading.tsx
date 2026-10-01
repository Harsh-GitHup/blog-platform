import { Skeleton } from "@/components/ui/skeleton"

export default function NewPostLoading() {
    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center gap-4 border-b border-border/50 pb-6">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div>
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                </div>
            </div>

            <div className="bg-card rounded-2xl border border-border/50 p-6 md:p-8 shadow-sm space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-32 w-full" />
                </div>

                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-[400px] w-full rounded-xl" />
                </div>

                <div className="pt-4 flex justify-end">
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>
        </div>
    )
}
