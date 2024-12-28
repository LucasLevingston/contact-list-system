import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url:
        process.env.NODE === 'test'
          ? process.env.SHADOW_DATABASE_URL
          : process.env.DATABASE_URL,
    },
  },
})
