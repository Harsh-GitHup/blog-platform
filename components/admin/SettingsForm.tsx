"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { updateProfile } from "@/lib/actions/user.actions"
import toast from "react-hot-toast"
import dynamic from "next/dynamic"
const UploadDropzone = dynamic(
    () => import("@/lib/uploadthing").then((mod) => mod.UploadDropzone),
    { ssr: false }
)
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    username: z.string().min(5, "Username must be at least 5 characters").regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores allowed"),
    email: z.string().email("Invalid email address"),
    image: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function SettingsForm({ user }: { user: { id: string; name: string; image: string; username: string; email: string } }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name,
            username: user.username,
            email: user.email,
            image: user.image,
        },
    })

    const imageUrl = form.watch("image")

    async function onSubmit(data: ProfileFormValues) {
        setIsLoading(true)
        try {
            const res = await updateProfile(user.id, data)
            if (res.success) {
                toast.success("Profile updated successfully")
                router.refresh()
            } else {
                toast.error(res.error || "Failed to update profile")
            }
        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <Label htmlFor="image">Profile Picture</Label>
                <div className="flex flex-col gap-4 mt-1.5">
                    {imageUrl && (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border">
                            <Image src={imageUrl} alt="Profile" fill sizes="96px" className="object-cover" />
                        </div>
                    )}
                    <div className="bg-card rounded-lg overflow-hidden border border-border">
                        <UploadDropzone
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                                if (res?.[0]) {
                                    form.setValue("image", res[0].url)
                                    toast.success("Image uploaded")
                                }
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`Upload failed: ${error.message}`)
                            }}
                        />
                    </div>
                </div>
            </div>

            <div>
                <Label htmlFor="username">Username</Label>
                <Input
                    id="username"
                    {...form.register("username")}
                    placeholder="Enter your username"
                />
                {form.formState.errors.username && (
                    <p className="text-[13px] text-destructive mt-1.5">{form.formState.errors.username.message}</p>
                )}
            </div>

            <div>
                <Label htmlFor="name">Display Name</Label>
                <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Enter your name"
                />
                {form.formState.errors.name && (
                    <p className="text-[13px] text-destructive mt-1.5">{form.formState.errors.name.message}</p>
                )}
            </div>

            <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                    id="email"
                    type="email"
                    {...form.register("email")}
                    placeholder="Enter your email"
                />
                {form.formState.errors.email && (
                    <p className="text-[13px] text-destructive mt-1.5">{form.formState.errors.email.message}</p>
                )}
            </div>

            <div className="pt-2">
                <Button 
                    type="submit" 
                    disabled={isLoading} 
                    className="w-full sm:w-auto px-6"
                >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                </Button>
            </div>
        </form>
    )
}
