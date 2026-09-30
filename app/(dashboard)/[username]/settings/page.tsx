// app/(dashboard)/admin/settings/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SettingsForm } from "@/components/admin/SettingsForm"
import { PasswordForm } from "@/components/admin/PasswordForm"
import { CleanupButton } from "@/components/admin/CleanupButton"
import { db } from "@/lib/db"
import { Card } from "@/components/ui/card"

export const metadata = {
    title: "Settings",
}

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
        <Card className="w-full max-w-[600px] mx-auto mt-8 mb-20 p-6 sm:p-8 bg-background">
            <div className="mb-8">
                <h1 className="text-[26px] font-bold text-foreground tracking-tight mb-1">Settings</h1>
                <p className="text-[13px] text-muted-foreground">Manage your account settings and preferences.</p>
            </div>
            
            <div className="space-y-10">
                <section>
                    <h2 className="text-[18px] font-bold text-foreground mb-6">Profile</h2>
                    <SettingsForm user={{
                        id: user.id,
                        name: user.name || "",
                        image: user.image || "",
                        username: user.username || "",
                        email: user.email || ""
                    }} />
                </section>

                <hr className="border-border" />

                <section>
                    <h2 className="text-[18px] font-bold text-foreground mb-6">Change Password</h2>
                    <PasswordForm userId={user.id} />
                </section>

                <hr className="border-border" />

                <section>
                    <h2 className="text-[18px] font-bold text-foreground mb-6">Database & Storage</h2>
                    <CleanupButton />
                </section>
            </div>
        </Card>
    )
}
