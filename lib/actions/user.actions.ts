// lib/actions/user.actions.ts
"use server"

import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

// Define the expected shape of the data
type RegisterInput = {
    name?: string;
    email: string;
    password: string;
}

export async function registerUser(data: RegisterInput) {
    try {
        const { email, password, name } = data

        // Fail-safe
        if (!email || !password) {
            return { success: false, error: "Missing required fields" }
        }

        const existingUser = await db.user.findUnique({ where: { email } })
        if (existingUser) return { success: false, error: "Email already exists" }

        const hashedPassword = await bcrypt.hash(password, 12)

        await db.user.create({
            data: {
                email,
                name,
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

export async function updateProfile(userId: string, data: { name?: string; image?: string }) {
    try {
        await db.user.update({
            where: { id: userId },
            data: {
                ...(data.name && { name: data.name }),
                ...(data.image && { image: data.image }),
            }
        })
        
        revalidatePath("/admin/settings")
        return { success: true }
    } catch (error) {
        console.error("UPDATE_PROFILE_ERROR", error)
        return { success: false, error: "Failed to update profile" }
    }
}

export async function updatePassword(userId: string, currentPassword?: string, newPassword?: string) {
    try {
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