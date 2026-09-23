"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/lib/actions/user.actions"
import toast from "react-hot-toast"
import { UploadDropzone } from "@/lib/uploadthing"
import Image from "next/image"

const profileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    image: z.string().optional(),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function SettingsForm({ user }: { user: { id: string; name: string; image: string } }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user.name,
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="image">Profile Picture</Label>
                <div className="flex flex-col gap-4">
                    {imageUrl && (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border">
                            <Image src={imageUrl} alt="Profile" fill className="object-cover" />
                        </div>
                    )}
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

            <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Enter your name"
                />
                {form.formState.errors.name && (
                    <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
                )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading ? "Saving..." : "Save Changes"}
            </Button>
        </form>
    )
}
