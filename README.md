# Blogify: Advanced Multi-Author Platform

A high-performance, production-ready blogging platform engineered with the **Next.js 15 App Router**, **MongoDB Atlas**, **Prisma ORM**, and **Tailwind CSS**. 

Blogify is designed to be fully serverless-ready, offering dynamic multi-author dashboards, real-time interactivity, and enterprise-grade media management.

---

## 🚀 Key Features

- **Multi-Author Architecture**: Dynamic `/[username]` routing provides dedicated dashboards for individual authors, backed by strict data isolation ensuring users can only manage their own content.
- **Advanced Real-Time Commenting**: Supports infinite recursive nested replies. Powered by WebSockets to instantly broadcast new comments and likes to active readers.
- **Robust Media Management**: Secure image uploads via UploadThing, wrapped in NextAuth middleware. Includes an automated Orphaned Image Cleanup system to permanently delete unlinked media.
- **Server-Side Data Mutations**: Relies entirely on Next.js 15 Server Actions for secure, API-less database operations.
- **Rich Text Editing**: Integrated **Tiptap** editor delivering an elegant, block-style writing experience.
- **Beautiful UI/UX**: Custom HSL-based color palette, seamless dark mode, reusable confirmation modals, and synchronized dynamic page titles.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Database** | MongoDB Atlas |
| **ORM** | Prisma Client (v5) |
| **Authentication** | NextAuth.js (v4) |
| **Styling & UI** | Tailwind CSS, shadcn/ui, Radix UI, Framer Motion |
| **Real-Time WebSockets**| Pusher |
| **Rich Text Editor** | Tiptap |
| **File Storage** | UploadThing |
| **Validation** | Zod, React Hook Form |

---

## 🏗️ System Architecture

Blogify follows a modern hybrid rendering architecture, strictly separating server-side logic from client-side interactivity to maximize performance and security.

### 1. Data Flow & Rendering
- **React Server Components (RSC)**: All primary page structures (Blog Index, Dashboards, Post reading views) are rendered on the server. Data is fetched directly from MongoDB via Prisma, bypassing traditional REST APIs entirely.
- **Next.js Server Actions**: Form submissions (creating posts, updating settings, deleting images) trigger Server Actions. These actions validate inputs using Zod, verify session tokens via NextAuth, and execute database mutations in a single secure environment.

### 2. Real-Time Architecture (Pusher)
To prevent heavy polling, Blogify uses **Pusher** for real-time synchronization:
1. **Mutation**: A user submits a comment via a Server Action.
2. **Database Execution**: The server saves the comment to MongoDB.
3. **Event Broadcast**: The server triggers a Pusher event (`post-<id>`, event: `new-comment`).
4. **Client Subscription**: Client-side components (`CommentSection.tsx`) listening to the channel instantly receive the payload and surgically update their local React state using a recursive tree-building algorithm, rendering the comment immediately.

### 3. Media Management Lifecycle
1. Upload requests are intercepted by the `/api/uploadthing` route.
2. UploadThing validates the NextAuth session. If unauthenticated, the upload is instantly rejected.
3. Once a post is deleted or updated, an **Orphaned Image Cleanup** utility cross-references MongoDB with the UploadThing API, securely deleting cloud artifacts that are no longer attached to a post.

### 4. Authentication Flow
- Handled by **NextAuth.js** utilizing the Prisma Adapter.
- Sessions are stored via secure JWTs.
- Middleware intercepts requests to `/[username]/posts/*` to guarantee users cannot edit content owned by a different `authorId`.

---

## 🗄️ Database Schema Overview

The MongoDB database is managed by **Prisma** using native `ObjectId` relations. 

- **User**: Stores authentication details, role (`ADMIN`, `USER`), and a unique dynamic `username`.
- **Post**: Contains the Tiptap HTML content, slug, view counts, and relation to an `Author`.
- **Comment**: Uses a self-referential relation (`parentId`) to achieve infinite nesting.
- **Like**: Tracks unique user-to-post and user-to-comment interactions to prevent duplicate likes.
- **Category**: Normalizes post tagging.

---

## 📂 Project Structure

```bash
├── app/
│   ├── (auth)/             # Login, Register, Forgot Password routes
│   ├── (dashboard)/        # Multi-author management dashboards (/[username])
│   ├── actions/            # Core Next.js Server Actions (Database mutations)
│   ├── api/                # NextAuth and UploadThing webhooks
│   └── blog/               # Public-facing article reading interfaces
├── components/
│   ├── admin/              # Dashboard UI (Post forms, settings forms)
│   ├── blog/               # Interactive article UI (CommentSection, LikeButton)
│   ├── layout/             # Global Navbars, Footers, Theme Providers
│   └── ui/                 # Reusable atomic shadcn components (Buttons, Modals)
├── lib/
│   ├── prisma.ts           # Global Prisma Client instance
│   ├── auth.ts             # NextAuth configuration
│   └── pusher.ts           # Real-time WebSocket clients
└── prisma/
    └── schema.prisma       # Database architecture definition
```

---

## 💻 Local Development Setup

### 1. Prerequisites
- Node.js 18.x or higher
- A MongoDB cluster (Atlas recommended)
- A Pusher account
- An UploadThing account

### 2. Installation
```bash
git clone https://github.com/Harsh-GitHup/Blog-Platform.git
cd Blog-Platform
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="mongodb+srv://<user>:<password>@cluster.mongodb.net/blog"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="super-secret-jwt-key"

# Media Storage
UPLOADTHING_SECRET="sk_live_..."
UPLOADTHING_APP_ID="..."

# Real-Time (Pusher)
PUSHER_APP_ID="..."
NEXT_PUBLIC_PUSHER_KEY="..."
PUSHER_SECRET="..."
NEXT_PUBLIC_PUSHER_CLUSTER="..."
```

### 4. Initialize Database
```bash
npx prisma generate
npx prisma db push
```

### 5. Start Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the application.

---

## 👨‍💻 Author

Built with ♥ by **[Harsh Kesharwani](https://github.com/Harsh-GitHup)**

- **GitHub:** [@Harsh-GitHup](https://github.com/Harsh-GitHup)
- **LinkedIn:** [Harsh Kesharwani](https://www.linkedin.com/in/harshkesharwani/)
- **X (Twitter):** [@HarshKesha91325](https://x.com/HarshKesha91325/)
