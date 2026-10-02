/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: {
            allowedOrigins: ["https://blog-platform-roan-three.vercel.app", "localhost:3000"]
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
    serverExternalPackages: ["uploadthing", "@uploadthing/react"],
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=31536000; includeSubDomains; preload",
                    }
                ],
            },
        ];
    }
};

export default nextConfig;