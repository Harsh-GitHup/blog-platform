# Next.js 15 + MongoDB Advanced Blog Platform

A production-ready, high-performance blog platform built with Next.js 15 App Router, MongoDB Atlas, Prisma ORM, and Tailwind CSS.

## 🚀 Features

- **Serverless Optimized**: Built from the ground up to run on edge networks like Vercel with MongoDB Atlas.
- **Next.js 15 Server Actions**: Seamless data mutations without traditional API routes.
- **Advanced Auth**: NextAuth.js integration with robust role-based access control (RBAC). Configuration strictly decoupled for App Router build compliance.
- **MongoDB Native**: Optimized Prisma schema using `ObjectId` and native array relations.
- **Advanced Comment System**:
  - Full support for nested, recursive comment replies.
  - Interactive "Like" functionality for comments.
  - Distinguishes between registered users (shows name/avatar) and Anonymous users.
- **Rich Text Editor**: Integrated Tiptap editor for an elegant, block-style writing experience.
- **Secure File Uploads**: UploadThing integration protected by server-side NextAuth middleware, ensuring only authorized admins can upload media.
- **Real-Time Ready**: Pre-configured Pusher integration for real-time notifications and updates.
- **Refined UI/UX**: Splendid header layout with title on the left and author/avatar/date perfectly aligned on the right. Beautiful dark mode with a custom HSL color palette.
- **Admin Dashboard**: Comprehensive management dashboard to view statistics, manage posts, and update settings.
- **Robust Forms**: Type-safe form validation using React Hook Form and Zod.

## 💻 Local Development

1. **Clone the repository.**
2. **Install dependencies**: 
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your details:
   - `DATABASE_URL`: Your MongoDB connection string.
   - `NEXTAUTH_SECRET`: A secure random string for session encryption.
   - `UPLOADTHING_TOKEN`: Your V7+ token from the UploadThing dashboard.
   - `PUSHER_*`: Your pusher credentials (optional for initial setup).

4. **Push the Schema**:
   Sync your Prisma schema with your MongoDB instance:
   ```bash
   npx prisma db push
   ```

5. **Run the Development Server**:
   ```bash
   npm run dev
   ```

## 📂 Project Structure

- `app/`: Next.js 15 App Router pages, layouts, and API routes.
- `app/actions/`: Next.js Server Actions for secure database operations and post interactions.
- `components/`: Reusable UI components, including the modular `components/admin/` and `components/blog/` folders.
- `lib/`: Utility functions, Prisma database client, NextAuth configuration (`auth.ts`), and Pusher setup.
- `prisma/`: Database schema and migrations.
