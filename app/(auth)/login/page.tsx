// app\(auth)\login\page.tsx
"use client"

import { signIn } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const loginWithGoogle = async () => {
        setIsLoading(true)
        try {
            await signIn("google", { callbackUrl: "/admin" })
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        })

        if (res?.error) {
            toast.error("Invalid email or password")
            setIsLoading(false)
        } else {
            toast.success("Welcome back!")
            router.push("/admin")
            router.refresh()
        }
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-8 border rounded-2xl shadow-lg bg-card">
            <h1 className="text-3xl font-bold text-center mb-6">Login</h1>

            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <input
                    type="email"
                    placeholder="Email"
                    autoComplete="username"
                    className="w-full p-3 rounded-lg border bg-background"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    className="w-full p-3 rounded-lg border bg-background"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button className="w-full" disabled={isLoading}>
                    {isLoading ? "Checking..." : "Login"}
                </Button>
            </form>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
            </div>

            {/* <Button
                variant="outline"
                className="w-full"
                onClick={() => signIn("google", { callbackUrl: "/admin" })}
            >
                Google
            </Button> */}

            <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-sm">
                <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
                <button
                    onClick={loginWithGoogle}
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    {isLoading ? "Signing in..." : "Continue with Google"}
                </button>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account? <Link href="/register" className="text-primary hover:underline">Register</Link>
            </p>
        </div>
    )
}
