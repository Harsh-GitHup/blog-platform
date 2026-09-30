// lib/actions/user.actions.ts
"use server"

import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Define the expected shape of the data
type RegisterInput = {
    name?: string;
    email: string;
    password: string;
    username: string;
}

export async function registerUser(data: RegisterInput) {
    try {
        const { email, password, name, username } = data

        // Fail-safe
        if (!email || !password || !username) {
            return { success: false, error: "Missing required fields" }
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username) || username.length < 5) {
            return { success: false, error: "Invalid username format. Must be at least 5 characters and alphanumeric." }
        }

        const existingEmail = await db.user.findUnique({ where: { email } })
        if (existingEmail) return { success: false, error: "Email already exists" }
        
        const existingUsername = await db.user.findUnique({ where: { username } })
        if (existingUsername) return { success: false, error: "Username already taken" }

        const hashedPassword = await bcrypt.hash(password, 12)

        await db.user.create({
            data: {
                email,
                name,
                username,
                password: hashedPassword,
                role: "ADMIN"
            }
        })

        return { success: true }
    } catch (error) {
        console.error("REGISTRATION_ERROR", error)
        return { success: false, error: "Internal Server Error" }
    }
}

export async function updateProfile(userId: string, data: { name?: string; image?: string; username?: string; email?: string }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id || session.user.id !== userId) {
            return { success: false, error: "Unauthorized" }
        }

        if (data.username) {
            if (!/^[a-zA-Z0-9_]+$/.test(data.username) || data.username.length < 5) {
                return { success: false, error: "Invalid username format. Must be at least 5 characters and alphanumeric." }
            }
            
            // Check if username is already taken by another user
            const existingUsername = await db.user.findUnique({ where: { username: data.username } })
            if (existingUsername && existingUsername.id !== userId) {
                return { success: false, error: "Username already taken" }
            }
        }
        
        if (data.email) {
            const existingEmail = await db.user.findUnique({ where: { email: data.email } })
            if (existingEmail && existingEmail.id !== userId) {
                return { success: false, error: "Email already exists" }
            }
        }

        await db.user.update({
            where: { id: userId },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.image && { image: data.image }),
                ...(data.username && { username: data.username }),
                ...(data.email && { email: data.email }),
            }
        })
        
        revalidatePath(`/${session.user.username || 'admin'}/settings`)
        return { success: true }
    } catch (error) {
        console.error("UPDATE_PROFILE_ERROR", error)
        return { success: false, error: "Failed to update profile" }
    }
}

export async function updatePassword(userId: string, currentPassword?: string, newPassword?: string) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id || session.user.id !== userId) {
            return { success: false, error: "Unauthorized" }
        }

        if (!newPassword || newPassword.length < 6) {
            return { success: false, error: "New password must be at least 6 characters" }
        }

        const user = await db.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return { success: false, error: "User not found" }
        }

        // If user has a password set, they must provide the current password
        if (user.password) {
            if (!currentPassword) {
                return { success: false, error: "Current password is required" }
            }
            const isValid = await bcrypt.compare(currentPassword, user.password)
            if (!isValid) {
                return { success: false, error: "Incorrect current password" }
            }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12)

        await db.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        })

        return { success: true }
    } catch (error) {
        console.error("UPDATE_PASSWORD_ERROR", error)
        return { success: false, error: "Failed to update password" }
    }
}

export async function requestPasswordReset(email: string) {
    try {
        const user = await db.user.findUnique({ where: { email } })
        if (!user) {
            // We still return success to prevent email enumeration
            return { success: true }
        }

        const token = crypto.randomUUID()
        const expires = new Date(Date.now() + 1000 * 60 * 60) // 1 hour

        // First remove any existing tokens for this email
        await db.passwordResetToken.deleteMany({
            where: { email }
        })

        await db.passwordResetToken.create({
            data: {
                email,
                token,
                expires
            }
        })

        // In a real app, you would send an email here using Resend, Nodemailer, etc.
        // For development, we'll log it to the server console.
        console.log(`\n=========================================`)
        console.log(`PASSWORD RESET LINK FOR ${email}:`)
        console.log(`http://localhost:3000/reset-password?token=${token}`)
        console.log(`=========================================\n`)

        return { success: true }
    } catch (error) {
        console.error("PASSWORD_RESET_REQUEST_ERROR", error)
        return { success: false, error: "Failed to process request" }
    }
}

export async function resetPassword(token: string, password: string) {
    try {
        const resetToken = await db.passwordResetToken.findUnique({
            where: { token }
        })

        if (!resetToken) {
            return { success: false, error: "Invalid token" }
        }

        if (new Date() > resetToken.expires) {
            return { success: false, error: "Token has expired" }
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        // Update user's password
        await db.user.update({
            where: { email: resetToken.email },
            data: { password: hashedPassword }
        })

        // Delete the token
        await db.passwordResetToken.delete({
            where: { id: resetToken.id }
        })

        return { success: true }
    } catch (error) {
        console.error("RESET_PASSWORD_ERROR", error)
        return { success: false, error: "Failed to reset password" }
    }
}