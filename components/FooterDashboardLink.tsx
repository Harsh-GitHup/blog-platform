"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"

export function FooterDashboardLink() {
    const { data: session } = useSession()

    if (!session) return null

    return (
        <li>
            <Link href="/admin" className="hover:text-primary transition-colors">
                Dashboard
            </Link>
        </li>
    )
}
