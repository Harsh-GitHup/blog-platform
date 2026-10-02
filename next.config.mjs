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
            { protocol: "https", hostname: "images.unsplash.com" }, // Unsplash Images
            { protocol: "https", hostname: "i.pravatar.cc" } // Pravatar Images
        ]
    },
    serverExternalPackages: ["uploadthing", "@uploadthing/react"]
};

export default nextConfig;