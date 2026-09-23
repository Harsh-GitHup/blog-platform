// app\(auth)\register\page.tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "react-hot-toast"
import { registerUser } from "@/lib/actions/user.actions" // You need to create this action

const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

type RegisterValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterValues>({
        resolver: zodResolver(registerSchema),
    })

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
        <div className="max-w-md mx-auto mt-16 p-8 border rounded-2xl shadow-sm bg-white dark:bg-gray-900 dark:border-gray-800">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold">Create Account</h1>
                <p className="text-gray-500 mt-2">Join our community of writers</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                        {...register("name")}
                        className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 focus:ring-2 ring-blue-500 outline-none"
                        placeholder="John Doe"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <input
                        {...register("email")}
                        type="email"
                        autoComplete="email"
                        className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 focus:ring-2 ring-blue-500 outline-none"
                        placeholder="name@example.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Password</label>
                    <input
                        {...register("password")}
                        type="password"
                        autoComplete="new-password"
                        className="w-full p-3 rounded-lg border dark:bg-gray-800 dark:border-gray-700 focus:ring-2 ring-blue-500 outline-none"
                        placeholder="••••••••"
                    />
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition disabled:opacity-50"
                >
                    {isLoading ? "Creating Account..." : "Register"}
                </button>
            </form>

            <div className="mt-6 text-center text-sm">
                <span className="text-gray-500">Already have an account? </span>
                <Link href="/login" className="text-blue-600 font-semibold hover:underline">
                    Sign In
                </Link>
            </div>
        </div>
    )
}