import request from 'supertest'
import { setupApp } from '../../../setup'
import { describe, expect, it, beforeEach, afterAll } from 'vitest'
import prisma from '../../../lib/prisma'

const app = setupApp()

async function cleanDatabase() {
  await prisma.contactGroup.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.group.deleteMany()
}

describe('GET /groups/:id/contacts', () => {
  beforeEach(async () => {
    await cleanDatabase()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should return a list of contacts for a specific group', async () => {
    const group = await prisma.group.create({
      data: { name: 'Grupo de Teste' },
    })

    const contact1 = await prisma.contact.create({
      data: {
        name: 'Contato 1',
        phone: '1234567890',
      },
    })

    const contact2 = await prisma.contact.create({
      data: {
        name: 'Contato 2',
        phone: '0987654321',
      },
    })

    await prisma.contactGroup.createMany({
      data: [
        { contactId: contact1.id, groupId: group.id },
        { contactId: contact2.id, groupId: group.id },
      ],
    })

    const response = await request(app).get(`/groups/${group.id}/contacts`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBe(2)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Contato 1', phone: '1234567890' }),
        expect.objectContaining({ name: 'Contato 2', phone: '0987654321' }),
      ])
    )
  })

  it('should return an empty list if the group has no contacts', async () => {
    const group = await prisma.group.create({
      data: { name: 'Grupo Vazio' },
    })

    const response = await request(app).get(`/groups/${group.id}/contacts`)

    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })

  it('should return 404 for a non-existent group', async () => {
    const response = await request(app).get(`/groups/9999999/contacts`)

    expect(response.status).toBe(404)
    expect(response.body).toMatchObject({ error: 'Group not found' })
  })

  it('should handle large volumes of data efficiently', async () => {
    const group = await prisma.group.create({
      data: { name: 'Grupo Grande' },
    })

    const contacts = Array.from({ length: 1000 }).map((_, index) => ({
      name: `Contato ${index + 1}`,
      phone: `1234567${index}`,
      id: index + 1,
    }))

    await prisma.contact.createMany({ data: contacts })

    await prisma.contactGroup.createMany({
      data: contacts.map((contact) => ({
        contactId: contact.id,
        groupId: group.id,
      })),
    })

    const response = await request(app).get(`/groups/${group.id}/contacts`)

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBe(1000)
  })
})
