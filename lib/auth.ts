import { NextAuthOptions, DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            role?: string
        } & DefaultSession["user"]
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db) as any,
    session: { strategy: "jwt" },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials")
                }
                const user = await db.user.findUnique({
                    where: { email: credentials.email },
                })
                if (!user || !user.password) {
                    throw new Error("Invalid credentials")
                }
                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.password
                )
                if (!isCorrectPassword) {
                    throw new Error("Invalid credentials")
                }
                return user as any
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = (user as any).role
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
            }
            return session
        },
    },
}
