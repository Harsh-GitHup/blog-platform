/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: ["localhost:3000"]
        }
    },
    images: {
        remotePatterns: [
            { protocol: "https", hostname: "utfs.io" }, // Upload thing
            { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google Auth Avatars
            { protocol: "https", hostname: "avatars.githubusercontent.com" }, // GitHub Auth
            { protocol: "https", hostname: "images.unsplash.com" }, // Seeded post images
            { protocol: "https", hostname: "i.pravatar.cc" } // Seeded user avatars
        ]
    },
    serverExternalPackages: ["uploadthing", "@uploadthing/react"]
};

export default nextConfig;