"use client"

import { useState, Suspense } from "react"
import { toast } from "react-hot-toast"
import { resetPassword } from "@/lib/actions/user.actions"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

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
            <Card className="w-full max-w-[400px] mx-auto mt-16 sm:mt-20 p-6 sm:p-8 bg-background text-center">
                <h2 className="text-[26px] font-bold tracking-tight text-destructive mb-1">Invalid Link</h2>
                <p className="text-[13px] text-muted-foreground mb-6">The password reset link is missing or invalid.</p>
                <Link href="/forgot-password" className="block">
                    <Button variant="outline" className="w-full">
                        Request new link
                    </Button>
                </Link>
            </Card>
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
            <Card className="w-full max-w-[400px] mx-auto mt-16 sm:mt-20 p-6 sm:p-8 bg-background text-center">
                <div className="mb-6">
                    <h2 className="text-[26px] font-bold tracking-tight text-green-600 dark:text-green-500 mb-1">Password Reset!</h2>
                    <p className="text-[13px] text-muted-foreground">
                        Your password has been successfully updated.
                    </p>
                </div>
                <Link href="/login" className="block">
                    <Button className="w-full">
                        Go to Login
                    </Button>
                </Link>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-[400px] mx-auto mt-16 sm:mt-20 p-6 sm:p-8 bg-background">
            <div className="text-center mb-6">
                <h2 className="text-[26px] font-bold text-foreground tracking-tight mb-1">Reset Password</h2>
                <p className="text-[13px] text-muted-foreground">
                    Enter your new password below.
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
                    <Label htmlFor="password">New Password</Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoading}
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
                </div>
                
                <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="tracking-wider"
                    />
                </div>
                
                <div className="pt-2">
                    <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Password
                    </Button>
                </div>
            </form>
        </Card>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}
