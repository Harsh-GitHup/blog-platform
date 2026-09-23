// app/layout.tsx
import type { Metadata } from "next"
import { Inter, Outfit } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "@/components/ThemeProvider"
import { AuthProvider } from "@/components/auth-provider"
import { cn } from "@/lib/utils";

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' })

export const metadata: Metadata = {
    title: "Modern Blog Platform",
    description: "A high-performance blog built with Next.js and MongoDB",
}

export default function RootLayout({
    children,
}: {
    readonly children: React.ReactNode
}) {
    return (
        <html lang="en" suppressHydrationWarning className={cn("font-sans", outfit.variable, inter.variable)}>
            <body className={`${inter.className} min-h-screen antialiased selection:bg-primary/30`}>
                <AuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Toaster position="bottom-right" />
                        <Navbar />
                        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12">
                            {children}
                        </main>
                        <Footer />
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    )
}