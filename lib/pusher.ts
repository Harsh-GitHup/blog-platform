import PusherServer from "pusher"
import PusherClient from "pusher-js"

// Server-side Pusher instance
export const pusherServer = (process.env.PUSHER_APP_ID && process.env.NEXT_PUBLIC_PUSHER_KEY && process.env.PUSHER_SECRET)
    ? new PusherServer({
        appId: process.env.PUSHER_APP_ID,
        key: process.env.NEXT_PUBLIC_PUSHER_KEY,
        secret: process.env.PUSHER_SECRET,
        cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2",
        useTLS: true,
    }) 
    : (null as unknown as PusherServer);

// Client-side Pusher instance
export const pusherClient = (typeof window !== "undefined" && process.env.NEXT_PUBLIC_PUSHER_KEY)
    ? new PusherClient(
        process.env.NEXT_PUBLIC_PUSHER_KEY,
        {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "us2",
        }
    )
    : (null as unknown as PusherClient);
