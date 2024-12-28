import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { setupApp } from '../../../setup'
import { prisma } from '../../../lib/prisma'

const app = setupApp()
let testContactId: number

beforeAll(async () => {
  await prisma.contact.deleteMany({})

  const contact = await prisma.contact.create({
    data: {
      name: 'Test User',
      phone: '(12) 3456-7890',
    },
  })
  testContactId = contact.id
})

afterAll(async () => {
  await prisma.contact.deleteMany({})
  await prisma.$disconnect()
})

describe('PATCH /contacts/:id', () => {
  it('should update contact name', async () => {
    const response = await request(app).patch(`/contacts/${testContactId}`).send({
      name: 'Updated Name',
    })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      id: testContactId,
      name: 'Updated Name',
      phone: '(12) 3456-7890',
    })
  })

  it('should update contact phone', async () => {
    const response = await request(app).patch(`/contacts/${testContactId}`).send({
      phone: '(12) 9876-5432',
    })

    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      id: testContactId,
      name: 'Updated Name',
      phone: '(12) 9876-5432',
    })
  })

  it('should return 404 for non-existent contact', async () => {
    const response = await request(app).patch('/contacts/99999').send({
      name: 'New Name',
    })

    expect(response.status).toBe(404)
    expect(response.body).toMatchObject({
      error: 'Contact not found.',
    })
  })

  it('should validate phone format', async () => {
    const response = await request(app).patch(`/contacts/${testContactId}`).send({
      phone: 'invalid-format',
    })

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      message: 'Invalid input',
    })
  })

  it('should handle duplicate phone numbers', async () => {
    await prisma.contact.create({
      data: {
        name: 'Other User',
        phone: '(12) 1111-2222',
      },
    })

    const response = await request(app).patch(`/contacts/${testContactId}`).send({
      phone: '(12) 1111-2222',
    })

    expect(response.status).toBe(409)
    expect(response.body).toMatchObject({
      message: 'Error on database',
    })
  })
})
