// components/Footer.tsx
import Link from "next/link"
import { Github, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
    return (
        <footer className="border-t bg-card text-card-foreground">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        <Link href="/" className="text-2xl font-heading font-extrabold tracking-tighter text-gradient">
                            Blogify
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            A high-performance blog platform built with Next.js 16, Tailwind CSS, and MongoDB. Empowering creators to share their stories with the world.
                        </p>
                        <div className="flex space-x-4 pt-2">
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Explore Articles</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                            <li><Link href="/admin" className="hover:text-primary transition-colors">Dashboard</Link></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>
                
                <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Blogify Platform. All rights reserved.</p>
                    <p className="mt-2 md:mt-0 flex items-center gap-1">
                        Built with <span className="text-red-500">♥</span> using Next.js
                    </p>
                </div>
            </div>
        </footer>
    )
}