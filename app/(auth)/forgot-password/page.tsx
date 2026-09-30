"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "react-hot-toast"
import { requestPasswordReset } from "@/lib/actions/user.actions"
import Link from "next/link"
import { Loader2, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!email) return toast.error("Please enter your email")

        setIsLoading(true)
        try {
            const res = await requestPasswordReset(email)
            if (res.success) {
                setIsSubmitted(true)
                toast.success("Check your email for the reset link")
            } else {
                toast.error(res.error || "Failed to request password reset")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    if (isSubmitted) {
        return (
            <div className="w-full max-w-md mx-auto space-y-8 p-8 bg-card border rounded-2xl shadow-sm text-center">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight">Check your email</h2>
                    <p className="text-muted-foreground">
                        If an account exists for {email}, we've sent a password reset link.
                    </p>
                </div>
                <div className="pt-4 text-sm text-muted-foreground">
                    Check your development server console for the link if email sending isn't configured.
                </div>
                <Button variant="outline" className="w-full mt-4" onClick={() => setIsSubmitted(false)}>
                    Try another email
                </Button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-md mx-auto space-y-8 p-8 bg-card border rounded-2xl shadow-sm">
            <div className="space-y-2 text-center">
                <h2 className="text-3xl font-heading font-bold tracking-tight">Forgot password?</h2>
                <p className="text-muted-foreground">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                
                <Button type="submit" className="w-full h-11" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Reset Link
                </Button>
            </form>

            <div className="text-center">
                <Link href="/login" className="text-sm font-medium text-primary hover:underline inline-flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                </Link>
            </div>
        </div>
    )
}
