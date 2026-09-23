// components/Navbar.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, ChevronRight, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()
    const { data: session } = useSession()

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
    const closeMobileMenu = () => setIsMobileMenuOpen(false)

    const navLinks = [
        { name: "Explore", href: "/blog" },
        ...(session ? [{ name: "Dashboard", href: "/admin" }] : []),
    ]

    return (
        <nav 
            className={cn(
                "sticky top-0 z-50 transition-all duration-300 border-b",
                scrolled 
                    ? "bg-background/70 backdrop-blur-xl border-border/50 shadow-sm py-3" 
                    : "bg-transparent border-transparent py-5"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
                <Link 
                    href="/" 
                    className="text-2xl font-heading font-extrabold tracking-tighter text-gradient hover:opacity-80 transition-opacity"
                    onClick={closeMobileMenu}
                >
                    Blogify
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <div className="flex items-center gap-8">
                        {navLinks.map((link) => {
                            const isActive = pathname.startsWith(link.href)
                            return (
                                <Link 
                                    key={link.href} 
                                    href={link.href} 
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary relative group",
                                        isActive ? "text-foreground" : "text-muted-foreground"
                                    )}
                                >
                                    {link.name}
                                    <span 
                                        className={cn(
                                            "absolute -bottom-1 left-0 w-full h-[2px] bg-primary scale-x-0 transition-transform origin-left",
                                            isActive ? "scale-x-100" : "group-hover:scale-x-100"
                                        )}
                                    />
                                </Link>
                            )
                        })}
                    </div>

                    <div className="flex items-center gap-4 border-l border-border/50 pl-6 ml-2">
                        {!session ? (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost" size="sm" className="hidden lg:flex">Log in</Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm" className="shadow-sm">Get Started</Button>
                                </Link>
                            </>
                        ) : (
                            <Button variant="ghost" size="sm" onClick={() => signOut()} className="hidden lg:flex gap-2">
                                <LogOut className="w-4 h-4" />
                                Log out
                            </Button>
                        )}
                        <ModeToggle />
                    </div>
                </div>

                {/* Mobile Nav Toggle */}
                <div className="md:hidden flex items-center gap-3">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={toggleMobileMenu} 
                        aria-label="Toggle menu"
                        className="rounded-full"
                    >
                        {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                    <ModeToggle />
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl absolute w-full left-0 top-full overflow-hidden shadow-xl"
                    >
                        <div className="flex flex-col px-4 py-6 space-y-6">
                            <div className="flex flex-col space-y-3">
                                {navLinks.map((link) => {
                                    const isActive = pathname.startsWith(link.href)
                                    return (
                                        <Link 
                                            key={link.href}
                                            href={link.href} 
                                            className={cn(
                                                "flex items-center justify-between text-base font-medium p-3 rounded-lg transition-colors",
                                                isActive ? "bg-primary/10 text-primary" : "hover:bg-muted text-muted-foreground hover:text-foreground"
                                            )}
                                            onClick={closeMobileMenu}
                                        >
                                            {link.name}
                                            <ChevronRight className="h-4 w-4 opacity-50" />
                                        </Link>
                                    )
                                })}
                            </div>
                            <div className="h-px bg-border/50 w-full" />
                            <div className="flex flex-col gap-3">
                                {!session ? (
                                    <>
                                        <Link href="/login" onClick={closeMobileMenu}>
                                            <Button variant="outline" className="w-full justify-center h-12">Log in</Button>
                                        </Link>
                                        <Link href="/register" onClick={closeMobileMenu}>
                                            <Button className="w-full justify-center h-12 shadow-md">Get Started</Button>
                                        </Link>
                                    </>
                                ) : (
                                    <Button variant="outline" className="w-full justify-center h-12 gap-2" onClick={() => { closeMobileMenu(); signOut(); }}>
                                        <LogOut className="w-4 h-4" />
                                        Log out
                                    </Button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}