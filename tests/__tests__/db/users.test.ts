import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Database User Operations', () => {
  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('can query users without usernames safely', async () => {
    const users = await prisma.user.findMany({
      where: { 
        OR: [
          { username: null },
          { username: { isSet: false } }
        ]
      },
      take: 5
    })
    
    expect(Array.isArray(users)).toBe(true)
    
    if (users.length > 0) {
      const user = users[0]
      expect(user).toHaveProperty('email')
    }
  })
})
