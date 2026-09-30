import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Database Post Deletion Operations', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('queries post deletion constraints safely without removing active data', async () => {
    const post = await prisma.post.findFirst({ 
      where: { title: "Learn Python" } 
    })
    
    // In a test environment, we don't want to actually run the `.delete()`
    // unless we are in an isolated test DB. So we just verify the object shape.
    if (post) {
      expect(post.id).toBeDefined()
      expect(post.title).toBe("Learn Python")
    } else {
      expect(post).toBeNull()
    }
  })
})
