import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Database Comment Operations', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('fetches posts and explicitly structured nested comments without crashing', async () => {
    const posts = await prisma.post.findMany({
      take: 5,
      where: {
        comments: { some: {} }
      },
      include: {
        comments: {
          where: {
            OR: [
              { parentId: null },
              { parentId: { isSet: false } }
            ]
          },
          include: {
            replies: true
          }
        }
      }
    })

    expect(Array.isArray(posts)).toBe(true)
    
    if (posts.length > 0) {
      expect(posts[0]).toHaveProperty('comments')
      expect(Array.isArray(posts[0].comments)).toBe(true)
    }
  })
})
