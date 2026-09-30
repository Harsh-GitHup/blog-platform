"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { updatePassword } from "@/lib/actions/user.actions"
import toast from "react-hot-toast"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

type PasswordFormValues = z.infer<typeof passwordSchema>

export function PasswordForm({ userId }: { userId: string }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(data: PasswordFormValues) {
        setIsLoading(true)
        try {
            const res = await updatePassword(userId, data.currentPassword, data.newPassword)
            if (res.success) {
                toast.success("Password updated successfully")
                form.reset()
                router.refresh()
            } else {
                toast.error(res.error || "Failed to update password")
            }
        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                    <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        {...form.register("currentPassword")}
                        placeholder="Enter current password"
                        className="pr-10 tracking-wider"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                {form.formState.errors.currentPassword?.message && (
                    <p className="text-[13px] text-destructive mt-1.5">{String(form.formState.errors.currentPassword.message)}</p>
                )}
            </div>

            <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    {...form.register("newPassword")}
                    placeholder="Enter new password"
                    className="tracking-wider"
                />
                {form.formState.errors.newPassword?.message && (
                    <p className="text-[13px] text-destructive mt-1.5">{String(form.formState.errors.newPassword.message)}</p>
                )}
            </div>

            <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    {...form.register("confirmPassword")}
                    placeholder="Confirm new password"
                    className="tracking-wider"
                />
                {form.formState.errors.confirmPassword?.message && (
                    <p className="text-[13px] text-destructive mt-1.5">{String(form.formState.errors.confirmPassword.message)}</p>
                )}
            </div>

            <div className="pt-2">
                <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full sm:w-auto px-6"
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                </Button>
            </div>
        </form>
    )
}
