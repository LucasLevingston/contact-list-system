import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import prisma from '../../../lib/prisma'
import { setupApp } from '../../../setup'

const app = setupApp()

describe('GET /report/contacts-groups', () => {
  beforeAll(async () => {
    await prisma.group.deleteMany({})
    await prisma.contact.deleteMany({})
    await prisma.contactGroup.deleteMany({})

    const grupoClientes = await prisma.group.create({ data: { name: 'Cliente X' } })
    const grupoFornecedores = await prisma.group.create({
      data: { name: 'Fornecedores' },
    })

    await prisma.contact
      .createMany({
        data: [
          { name: 'Contact 1', phone: '1234567890' },
          { name: 'Contact 2', phone: '0987654321' },
          { name: 'Contact 3', phone: '1122334455' },
        ],
      })
      .then(async () => {
        const contacts = await prisma.contact.findMany()
        for (const contact of contacts) {
          await prisma.contactGroup.create({
            data: {
              contactId: contact.id,
              groupId: grupoClientes.id,
            },
          })
        }
      })

    await prisma.contact
      .createMany({
        data: [
          { name: 'Supplier Contact 1', phone: '2233445566' },
          { name: 'Supplier Contact 2', phone: '3344556677' },
        ],
      })
      .then(async () => {
        const contacts = await prisma.contact.findMany({
          where: {
            phone: {
              in: ['2233445566', '3344556677'],
            },
          },
        })
        for (const contact of contacts) {
          await prisma.contactGroup.create({
            data: {
              contactId: contact.id,
              groupId: grupoFornecedores.id,
            },
          })
        }
      })
  })

  afterAll(async () => {
    await prisma.contactGroup.deleteMany({})
    await prisma.contact.deleteMany({})
    await prisma.group.deleteMany({})
    await prisma.$disconnect()
  })

  it('should return a report with the number of contacts in each group', async () => {
    const response = await request(app).get('/report/contacts-groups')

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ grupo: 'Cliente X', quantidade_contacts: 3 }),
        expect.objectContaining({ grupo: 'Fornecedores', quantidade_contacts: 2 }),
      ])
    )

    expect(response.body[0].grupo).toBe('Cliente X')
    expect(response.body[1].grupo).toBe('Fornecedores')
  })

  it('should return an empty array if no groups exist', async () => {
    await prisma.group.deleteMany({})
    await prisma.contact.deleteMany({})
    await prisma.contactGroup.deleteMany({})

    const response = await request(app).get('/report/contacts-groups')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([])
  })

  it('should return groups with zero contacts if no contacts are associated', async () => {
    await prisma.group.deleteMany({})
    await prisma.contact.deleteMany({})
    await prisma.contactGroup.deleteMany({})

    const groupWithoutContacts = await prisma.group.create({
      data: { name: 'Empty Group' },
    })

    const response = await request(app).get('/report/contacts-groups')

    expect(response.status).toBe(200)
    expect(response.body).toEqual([{ grupo: 'Empty Group', quantidade_contacts: 0 }])
  })

  it('should return correct contact counts for multiple groups', async () => {
    await prisma.group.deleteMany({})
    await prisma.contact.deleteMany({})
    await prisma.contactGroup.deleteMany({})

    const groupA = await prisma.group.create({ data: { name: 'Group A' } })
    const groupB = await prisma.group.create({ data: { name: 'Group B' } })

    await prisma.contact.createMany({
      data: [
        { name: 'Contact A1', phone: '1111111111' },
        { name: 'Contact A2', phone: '2222222222' },
        { name: 'Contact B1', phone: '3333333333' },
      ],
    })

    const contactsA = await prisma.contact.findMany()
    await Promise.all(
      contactsA.slice(0, 2).map((contact) =>
        prisma.contactGroup.create({
          data: { contactId: contact.id, groupId: groupA.id },
        })
      )
    )

    const contactB = await prisma.contact.findFirst({
      where: { phone: '3333333333' },
    })
    if (contactB) {
      await prisma.contactGroup.create({
        data: { contactId: contactB.id, groupId: groupB.id },
      })
    }

    const response = await request(app).get('/report/contacts-groups')

    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ grupo: 'Group A', quantidade_contacts: 2 }),
        expect.objectContaining({ grupo: 'Group B', quantidade_contacts: 1 }),
      ])
    )
  })

  it('should return 500 if there is a database error', async () => {
    const originalFindMany = prisma.group.findMany
    vi.spyOn(prisma.group, 'findMany').mockRejectedValue(new Error('Database error'))

    const response = await request(app).get('/report/contacts-groups')

    expect(response.status).toBe(500)
    expect(response.body).toEqual({
      message: 'Internal server error',
    })

    prisma.group.findMany = originalFindMany
  })
})
