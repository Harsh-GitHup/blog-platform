import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('Starting seed...')

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

    // 4. Create sample posts
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

        await prisma.post.upsert({
            where: { slug: postData.slug },
            update: postPayload,
            create: postPayload as any
        })
    }
    console.log('Created sample posts.')

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
