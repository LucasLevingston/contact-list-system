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

describe('DELETE /contacts/:id', () => {
  it('should delete existing contact', async () => {
    const response = await request(app).delete(`/contacts/${testContactId}`)

    expect(response.status).toBe(204)

    const deletedContact = await prisma.contact.findUnique({
      where: { id: testContactId },
    })
    expect(deletedContact).toBeNull()
  })

  it('should return 404 for non-existent contact', async () => {
    const response = await request(app).delete('/contacts/99999')

    expect(response.status).toBe(404)
    expect(response.body).toMatchObject({
      error: 'Contact not found.',
    })
  })

  it('should handle invalid id format', async () => {
    const response = await request(app).delete('/contacts/invalid-id')

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      message: 'Invalid input',
    })
  })
})
