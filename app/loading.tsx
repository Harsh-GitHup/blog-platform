
export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] w-full animate-in fade-in zoom-in-95 duration-700">
            <div className="flex flex-col items-center gap-6">
                {/* Premium Animated Logo Icon */}
                <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl shadow-inner overflow-hidden">
                    {/* Ping effect behind */}
                    <div className="absolute inset-0 border-2 border-primary/30 rounded-3xl animate-ping opacity-20 duration-1000"></div>
                    
                    {/* The Logo Letter */}
                    <span className="text-5xl font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-primary to-primary/50 tracking-tighter z-10 animate-pulse">
                        B
                    </span>
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                </div>

                <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-heading font-bold tracking-tight text-foreground animate-pulse">
                        Blogify
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Preparing your experience...
                    </p>
                </div>
            </div>
        </div>
    )
}
