import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Plus, Settings } from "lucide-react"

export default function DashboardLoading() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <Skeleton className="h-9 w-64 mb-2" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" disabled className="gap-2">
                        <Settings className="w-4 h-4" />
                        Settings
                    </Button>
                    <Button size="sm" disabled className="gap-2">
                        <Plus className="w-4 h-4" />
                        New Post
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="p-6 rounded-2xl border bg-card">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-8 w-16" />
                            </div>
                            <Skeleton className="w-11 h-11 rounded-xl" />
                        </div>
                        <Skeleton className="h-3 w-28 mt-4" />
                    </div>
                ))}
            </div>

            {/* Recent Activity Table */}
            <div className="rounded-2xl border bg-card overflow-hidden">
                <div className="p-6 border-b border-border/50 flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-16" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground bg-muted/50">
                            <tr>
                                <th className="px-6 py-4"><Skeleton className="h-4 w-12" /></th>
                                <th className="px-6 py-4"><Skeleton className="h-4 w-16" /></th>
                                <th className="px-6 py-4"><Skeleton className="h-4 w-14" /></th>
                                <th className="px-6 py-4"><Skeleton className="h-4 w-10" /></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {[1, 2, 3].map((i) => (
                                <tr key={i}>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-48" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-5 w-16 rounded-full" /></td>
                                    <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
