"use client"

import { useState, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import { resetPassword } from "@/lib/actions/user.actions"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"

function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    if (!token) {
        return (
            <div className="w-full max-w-md mx-auto p-8 bg-card border rounded-2xl shadow-sm text-center space-y-4">
                <h2 className="text-2xl font-bold tracking-tight text-red-500">Invalid Link</h2>
                <p className="text-muted-foreground">The password reset link is missing or invalid.</p>
                <Link href="/forgot-password">
                    <Button variant="outline" className="mt-4 w-full">Request new link</Button>
                </Link>
            </div>
        )
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        
        if (password !== confirmPassword) {
            return toast.error("Passwords do not match")
        }
        
        if (password.length < 6) {
            return toast.error("Password must be at least 6 characters")
        }

        setIsLoading(true)
        try {
            const res = await resetPassword(token as string, password)
            if (res.success) {
                setIsSuccess(true)
                toast.success("Password reset successfully")
            } else {
                toast.error(res.error || "Failed to reset password")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSuccess) {
        return (
            <div className="w-full max-w-md mx-auto space-y-8 p-8 bg-card border rounded-2xl shadow-sm text-center">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-green-600">Password Reset!</h2>
                    <p className="text-muted-foreground">
                        Your password has been successfully updated.
                    </p>
                </div>
                <Link href="/login">
                    <Button className="w-full mt-4">Go to Login</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md mx-auto space-y-8 p-8 bg-card border rounded-2xl shadow-sm">
            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-heading font-bold tracking-tight">Reset Password</h2>
                <p className="text-muted-foreground">
                    Enter your new password below.
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                
                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update Password
                </Button>
            </form>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}
