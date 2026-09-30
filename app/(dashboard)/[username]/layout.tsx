import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode
    params: Promise<{ username: string }>
}) {
    const session = await getServerSession(authOptions)
    const { username } = await params

    // Check if user is logged in
    if (!session || session.user.role !== "ADMIN") {
        redirect("/")
    }

    // Smart redirect: If the URL username doesn't match the logged-in user's username, redirect them!
    // This perfectly handles old /admin bookmarks or callbacks.
    const userUsername = session.user.username
    if (username !== userUsername) {
        redirect(`/${userUsername}`)
    }

    return <>{children}</>
}
