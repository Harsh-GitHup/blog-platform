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
            { protocol: "https", hostname: "avatars.githubusercontent.com" } // GitHub Auth
        ]
    },
    serverExternalPackages: ["uploadthing", "@uploadthing/react"]
};

export default nextConfig;