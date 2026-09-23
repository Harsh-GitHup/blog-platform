// app/(dashboard)/admin/settings/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SettingsForm } from "@/components/admin/SettingsForm"
import { db } from "@/lib/db"

export default async function SettingsPage() {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
        redirect("/")
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id }
    })

    if (!user) {
        redirect("/login")
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-heading">Profile Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
            </div>
            
            <div className="bg-card border rounded-2xl p-6 shadow-sm">
                <SettingsForm user={{
                    id: user.id,
                    name: user.name || "",
                    image: user.image || ""
                }} />
            </div>
        </div>
    )
}
