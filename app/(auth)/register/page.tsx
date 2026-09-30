// app\(auth)\register\page.tsx
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import * as z from "zod"
import { toast } from "react-hot-toast"
import { registerUser } from "@/lib/actions/user.actions" 
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

const registerSchema = z.object({
    name: z.string().min(5, "Name must be at least 5 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters").max(32, "Password must be at most 32 characters"),
    username: z.string().min(5, "Username must be at least 5 characters").regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
})

type RegisterValues = z.infer<typeof registerSchema>

import { Eye, EyeOff, CheckCircle2 } from "lucide-react"

export default function RegisterPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [passwordStrength, setPasswordStrength] = useState(0)

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
    })

    const watchPassword = useWatch({ control, name: "password", defaultValue: "" })

    useEffect(() => {
        let score = 0
        if (watchPassword.length >= 8) score += 1
        if (/[A-Z]/.test(watchPassword)) score += 1
        if (/[0-9]/.test(watchPassword)) score += 1
        if (/[^A-Za-z0-9]/.test(watchPassword)) score += 1
        setPasswordStrength(score)
    }, [watchPassword])

    const getStrengthColor = () => {
        if (passwordStrength === 0) return "bg-border"
        if (passwordStrength === 1) return "bg-red-500"
        if (passwordStrength === 2) return "bg-orange-500"
        if (passwordStrength === 3) return "bg-yellow-500"
        return "bg-green-500"
    }

    const onSubmit = async (data: RegisterValues) => {
        setIsLoading(true)
        try {
            const result = await registerUser(data)
            if (result.success) {
                toast.success("Account created! Please login.")
                router.push("/login")
            } else {
                toast.error(result.error || "Registration failed")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-[400px] mx-auto mt-16 sm:mt-20 p-6 sm:p-8 bg-background">
            <div className="text-center mb-6">
                <h1 className="text-[26px] font-bold text-foreground tracking-tight mb-1">Create Account</h1>
                <p className="text-[13px] text-muted-foreground">Join our community of writers</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label>Full Name</Label>
                    <Input
                        {...register("name")}
                        placeholder="John Doe"
                    />
                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <Label>Email Address</Label>
                    <Input
                        {...register("email")}
                        type="email"
                        autoComplete="email"
                        placeholder="name@example.com"
                    />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <Label>Password</Label>
                    <div className="relative">
                        <Input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            className="pr-10 tracking-wider"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    
                    {/* Password Strength Checker */}
                    {watchPassword.length > 0 && (
                        <div className="mt-2 flex gap-1.5 h-1">
                            {[1, 2, 3, 4].map((level) => (
                                <div 
                                    key={level} 
                                    className={`h-full flex-1 rounded-full transition-colors ${passwordStrength >= level ? getStrengthColor() : 'bg-muted'}`} 
                                />
                            ))}
                        </div>
                    )}
                    {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
                </div>

                <div>
                    <Label>Username</Label>
                    <Input
                        {...register("username")}
                        placeholder="johndoe123"
                    />
                    {errors.username && <p className="text-destructive text-xs mt-1">{errors.username.message}</p>}
                </div>

                <div className="pt-2">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? "Creating Account..." : "Sign up"}
                    </Button>
                </div>
            </form>

            <div className="mt-6 text-center text-[13px]">
                <span className="text-muted-foreground">Already have an account? </span>
                <Link href="/login" className="text-primary font-bold hover:underline">
                    Sign In
                </Link>
            </div>
        </Card>
    )
}