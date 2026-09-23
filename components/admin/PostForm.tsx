"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createPost } from "@/lib/actions/post.actions"
import toast from "react-hot-toast"
import { UploadDropzone } from "@/lib/uploadthing"
import Image from "next/image"
import Editor from "@/components/Editor"

const postSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    slug: z.string().min(3, "Slug must be at least 3 characters."),
    excerpt: z.string().optional(),
    content: z.string().min(10, "Content must be at least 10 characters."),
    image: z.string().optional(),
})

type PostFormValues = z.infer<typeof postSchema>

export function PostForm({ userId }: { userId: string }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<PostFormValues>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            image: "",
        },
    })

    const imageUrl = form.watch("image")

    // Auto-generate slug from title
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value
        form.setValue("title", title)
        form.setValue("slug", title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''))
    }

    async function onSubmit(data: PostFormValues) {
        setIsLoading(true)
        try {
            const res = await createPost({
                ...data,
                authorId: userId,
                tagIds: [], // Empty for now, can implement tag selection later
            })
            
            if (res.success) {
                toast.success("Post created successfully!")
                router.push("/admin")
                router.refresh()
            } else {
                toast.error(res.error || "Failed to create post")
            }
        } catch (error) {
            toast.error("Something went wrong.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="md:col-span-2 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Post Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter a captivating title"
                            {...form.register("title", {
                                onChange: handleTitleChange
                            })}
                            className="text-lg py-6"
                        />
                        {form.formState.errors.title && (
                            <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label>Content</Label>
                        <Editor 
                            initialContent=""
                            onChange={(content) => form.setValue("content", content)}
                        />
                        {form.formState.errors.content && (
                            <p className="text-sm text-red-500">{form.formState.errors.content.message}</p>
                        )}
                    </div>
                </div>

                {/* Sidebar Area */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="slug">URL Slug</Label>
                        <Input
                            id="slug"
                            placeholder="url-friendly-slug"
                            {...form.register("slug")}
                        />
                        {form.formState.errors.slug && (
                            <p className="text-sm text-red-500">{form.formState.errors.slug.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="excerpt">Excerpt</Label>
                        <Textarea
                            id="excerpt"
                            placeholder="A brief summary of the post..."
                            className="resize-none h-24"
                            {...form.register("excerpt")}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Cover Image</Label>
                        <div className="flex flex-col gap-4">
                            {imageUrl && (
                                <div className="relative aspect-video rounded-xl overflow-hidden border">
                                    <Image src={imageUrl} alt="Cover" fill className="object-cover" />
                                </div>
                            )}
                            <UploadDropzone
                                endpoint="imageUploader"
                                className="ut-button:bg-primary ut-button:ut-readying:bg-primary/50"
                                onClientUploadComplete={(res) => {
                                    if (res?.[0]) {
                                        form.setValue("image", res[0].url)
                                        toast.success("Cover image uploaded")
                                    }
                                }}
                                onUploadError={(error: Error) => {
                                    toast.error(`Upload failed: ${error.message}`)
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-border/50">
                <Button type="submit" size="lg" disabled={isLoading} className="w-full sm:w-auto">
                    {isLoading ? "Publishing..." : "Publish Post"}
                </Button>
            </div>
        </form>
    )
}
