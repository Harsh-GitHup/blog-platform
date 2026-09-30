import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AdminPostsLoading() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Button disabled className="gap-2">
                    <Plus className="w-4 h-4" />
                    New Post
                </Button>
            </div>

            <div className="border rounded-lg overflow-hidden bg-card">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-muted/50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-medium text-muted-foreground"><Skeleton className="h-4 w-16" /></th>
                                <th className="px-6 py-4 font-medium text-muted-foreground"><Skeleton className="h-4 w-20" /></th>
                                <th className="px-6 py-4 font-medium text-muted-foreground"><Skeleton className="h-4 w-16" /></th>
                                <th className="px-6 py-4 font-medium text-muted-foreground"><Skeleton className="h-4 w-24" /></th>
                                <th className="px-6 py-4 font-medium text-muted-foreground text-right"><Skeleton className="h-4 w-16 ml-auto" /></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="hover:bg-muted/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-5 w-48" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-32" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <Skeleton className="h-4 w-28" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end gap-2">
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                            <Skeleton className="h-8 w-8 rounded-full" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
