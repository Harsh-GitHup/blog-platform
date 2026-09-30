"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export default function ExploreAllCard() {
    return (
        <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="h-full">
            <Link href="/blog" className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                <div className="h-full flex flex-col justify-center items-center bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-8 shadow-sm hover:shadow-md transition-all duration-300 hover:border-primary/30 group">
                    <div className="p-5 bg-primary/10 rounded-full mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                        <ArrowRight className="h-8 w-8 text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                    <h3 className="text-xl font-heading font-bold mb-3 text-center group-hover:text-primary transition-colors">Explore All Articles</h3>
                    <p className="text-muted-foreground text-center text-sm max-w-[200px] leading-relaxed">
                        Dive into our full archive of content, tutorials, and insights.
                    </p>
                </div>
            </Link>
        </motion.div>
    )
}
