import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full px-3 py-2.5 rounded-lg border border-input bg-card text-[14px] text-foreground focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
