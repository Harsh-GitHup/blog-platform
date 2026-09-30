"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updatePassword } from "@/lib/actions/user.actions"
import toast from "react-hot-toast"

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                    id="currentPassword"
                    type="password"
                    {...form.register("currentPassword")}
                    placeholder="Enter current password"
                />
                {form.formState.errors.currentPassword?.message && (
                    <p className="text-sm text-red-500">{String(form.formState.errors.currentPassword.message)}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                    id="newPassword"
                    type="password"
                    {...form.register("newPassword")}
                    placeholder="Enter new password"
                />
                {form.formState.errors.newPassword?.message && (
                    <p className="text-sm text-red-500">{String(form.formState.errors.newPassword.message)}</p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    {...form.register("confirmPassword")}
                    placeholder="Confirm new password"
                />
                {form.formState.errors.confirmPassword?.message && (
                    <p className="text-sm text-red-500">{String(form.formState.errors.confirmPassword.message)}</p>
                )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? "Updating..." : "Update Password"}
            </Button>
        </form>
    )
}
