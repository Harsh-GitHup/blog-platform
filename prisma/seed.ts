import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('Starting seed...')

    // Clean up existing data to prevent unique constraint violations on re-seed
    console.log('Cleaning up existing database...')
    await prisma.commentLike.deleteMany({})
    await prisma.like.deleteMany({})
    await prisma.comment.deleteMany({ where: { parentId: { not: null } } })
    await prisma.comment.deleteMany({})
    await prisma.post.deleteMany({})
    await prisma.tag.deleteMany({})
    await prisma.category.deleteMany({})
    await prisma.account.deleteMany({})
    await prisma.user.deleteMany({})
    console.log('Database cleaned.')

    // Read data from external JSON file
    const fs = require('fs')
    const path = require('path')
    const seedDataPath = path.join(__dirname, 'seed-data.json')
    const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'))

    // 1. Create users
    const users: Record<string, string> = {}
    for (const userData of seedData.users) {
        const createdUser = await prisma.user.upsert({
            where: { username: userData.username },
            update: userData,
            create: userData
        })
        if (createdUser.username) {
            users[createdUser.username] = createdUser.id
        }
    }
    console.log('Created users.')

    // 1.5 Create accounts
    if (seedData.accounts) {
        for (const accountData of seedData.accounts) {
            const userId = users[accountData.userUsername]
            if (!userId) continue;

            await prisma.account.upsert({
                where: {
                    provider_providerAccountId: {
                        provider: accountData.provider,
                        providerAccountId: accountData.providerAccountId
                    }
                },
                update: {},
                create: {
                    userId,
                    type: accountData.type,
                    provider: accountData.provider,
                    providerAccountId: accountData.providerAccountId,
                    access_token: accountData.access_token
                }
            })
        }
        console.log('Created accounts.')
    }

    // 2. Create sample categories
    const categories = []
    for (const cat of seedData.categories) {
        const createdCat = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        })
        categories.push(createdCat)
    }
    console.log('Created categories.')

    // 3. Create some tags
    const tags = []
    for (const t of seedData.tags) {
        const createdTag = await prisma.tag.upsert({
            where: { slug: t.slug },
            update: {},
            create: t,
        })
        tags.push(createdTag)
    }
    console.log('Created tags.')

    // 4. Create sample posts & track their DB IDs
    const postDbIds: Record<string, string> = {}
    for (const postData of seedData.posts) {
        const publishedAt = postData.publishedDaysAgo !== null
            ? new Date(Date.now() - 86400000 * postData.publishedDaysAgo)
            : null;

        const categoryId = categories.find(c => c.slug === postData.categorySlug)?.id;
        const tagIds = tags.filter(t => postData.tagSlugs.includes(t.slug)).map(t => t.id);
        const authorId = users[postData.authorUsername] || users['janedoe'];

        const postPayload = {
            title: postData.title,
            slug: postData.slug,
            excerpt: postData.excerpt,
            content: postData.content,
            status: postData.status,
            publishedAt,
            readingTime: postData.readingTime,
            image: postData.image,
            categoryId,
            tagIds,
            authorId
        };

        const createdPost = await prisma.post.upsert({
            where: { slug: postData.slug },
            update: postPayload,
            create: postPayload as any
        })
        
        postDbIds[createdPost.slug] = createdPost.id
    }
    console.log('Created sample posts.')

    // 5. Create Comments and Nested Replies
    const commentDbIds: Record<string, string> = {}
    
    // Separate top-level comments from replies to maintain relational integrity
    const topLevelComments = seedData.comments.filter((c: any) => c.parentId === null)
    const replies = seedData.comments.filter((c: any) => c.parentId !== null)

    // A. Insert top-level comments first
    for (const comment of topLevelComments) {
        const authorId = users[comment.authorUsername]
        const postId = postDbIds[comment.postSlug]
        
        if (!authorId || !postId) continue

        const createdAt = new Date(Date.now() - 86400000 * (comment.createdAtDaysAgo || 0))

        const createdComment = await prisma.comment.create({
            data: {
                content: comment.content,
                userId: authorId,
                sessionId: "seed-session",
                postId,
                createdAt
            }
        })
        
        // Map the temporary JSON id to the real database ID
        commentDbIds[comment.id] = createdComment.id
    }

    // B. Insert nested replies using the newly generated parent IDs
    for (const reply of replies) {
        const authorId = users[reply.authorUsername]
        const postId = postDbIds[reply.postSlug]
        const parentId = commentDbIds[reply.parentId] // Retrieve real DB parent ID
        
        if (!authorId || !postId || !parentId) continue

        const createdAt = new Date(Date.now() - 86400000 * (reply.createdAtDaysAgo || 0))

        const createdReply = await prisma.comment.create({
            data: {
                content: reply.content,
                userId: authorId,
                sessionId: "seed-session",
                postId,
                parentId,
                createdAt
            }
        })
        
        commentDbIds[reply.id] = createdReply.id
    }
    console.log('Created comments and replies.')

    console.log('Seed completed successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
