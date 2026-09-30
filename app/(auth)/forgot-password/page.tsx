"use client"

import { useState } from "react"
import { toast } from "react-hot-toast"
import { requestPasswordReset } from "@/lib/actions/user.actions"
import Link from "next/link"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

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
            <Card className="w-full max-w-[400px] mx-auto mt-16 sm:mt-20 p-6 sm:p-8 bg-background text-center">
                <div className="mb-6">
                    <h2 className="text-[26px] font-bold text-foreground tracking-tight mb-1">Check your email</h2>
                    <p className="text-[13px] text-muted-foreground">
                        If an account exists for {email}, we've sent a password reset link.
                    </p>
                </div>
                <div className="py-4 text-[13px] text-muted-foreground">
                    Check your development server console for the link if email sending isn't configured.
                </div>
                <Button 
                    type="button" 
                    variant="outline"
                    className="w-full mt-4" 
                    onClick={() => setIsSubmitted(false)}
                >
                    Try another email
                </Button>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-[400px] mx-auto mt-16 sm:mt-20 p-6 sm:p-8 bg-background">
            <div className="text-center mb-6">
                <h2 className="text-[26px] font-bold text-foreground tracking-tight mb-1">Forgot password?</h2>
                <p className="text-[13px] text-muted-foreground">
                    Enter your email address and we'll send you a link to reset your password.
                </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
                <div>
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
                
                <div className="pt-2">
                    <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Send Reset Link
                    </Button>
                </div>
            </form>

            <div className="mt-6 text-center text-[13px]">
                <Link href="/login" className="font-bold text-primary hover:underline inline-flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to login
                </Link>
            </div>
        </Card>
    )
}
