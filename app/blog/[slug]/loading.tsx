import { Skeleton } from "@/components/ui/skeleton"

export default function PostLoading() {
    return (
        <article className="container max-w-4xl mx-auto py-10 animate-in fade-in duration-500">
            {/* Back button skeleton */}
            <Skeleton className="h-4 w-24 mb-8" />
            
            {/* Header */}
            <div className="space-y-6 text-center mb-10">
                <div className="flex justify-center items-center gap-2">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                
                <Skeleton className="h-12 md:h-16 w-3/4 mx-auto" />
                <Skeleton className="h-6 w-1/2 mx-auto" />

                <div className="flex items-center justify-center gap-4 pt-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 text-left">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            </div>

            {/* Cover Image */}
            <Skeleton className="w-full aspect-[21/9] rounded-2xl mb-12" />

            {/* Content Body */}
            <div className="space-y-6 max-w-3xl mx-auto">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-11/12" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                
                <Skeleton className="h-8 w-1/2 mt-8 mb-4" />
                
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
            </div>
        </article>
    )
}
