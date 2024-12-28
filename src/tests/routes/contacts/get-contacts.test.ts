import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { setupApp } from '../../../setup'
import { prisma } from '../../../lib/prisma'

const app = setupApp()

beforeAll(async () => {
  await prisma.contact.deleteMany({})
  await prisma.contact.createMany({
    data: [
      { name: 'Alice', phone: '(12) 3456-7890' },
      { name: 'Bob', phone: '(12) 3456-7891' },
      { name: 'Charlie', phone: '(12) 3456-7892' },
    ],
  })
})

afterAll(async () => {
  await prisma.$disconnect()
  await prisma.contact.deleteMany({})
})

describe('GET /contacts', () => {
  it('should return a paginated list of contacts with default limit', async () => {
    const response = await request(app).get('/contacts')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(3)
    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0]).toHaveProperty('name')
    expect(response.body[0]).toHaveProperty('phone')
  })

  it('should return a paginated list of contacts with specified limit', async () => {
    const response = await request(app).get('/contacts?limit=2')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(2)
  })

  it('should return a paginated list of contacts with offset', async () => {
    const response = await request(app).get('/contacts?limit=2&offset=1')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(2)
    expect(response.body[0].name).toBe('Bob')
  })

  it('should return an empty list if offset is greater than the number of contacts', async () => {
    const response = await request(app).get('/contacts?offset=10')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(0)
  })
})
