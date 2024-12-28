import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { prisma } from '../../../lib/prisma'
import { setupApp } from '../../../setup'

const app = setupApp()

let groupId: number

describe('DELETE /groups/:id', () => {
  beforeAll(async () => {
    await prisma.group.deleteMany({})
    const group = await prisma.group.create({ data: { name: 'Test Group' } })
    groupId = group.id
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should delete an existing group', async () => {
    const response = await request(app).delete(`/groups/${groupId}`)

    expect(response.status).toBe(204)
    expect(response.text).toBe('')

    const checkResponse = await request(app).get(`/groups/${groupId}`)
    expect(checkResponse.status).toBe(404)
  })

  it('should return 404 for an invalid group ID', async () => {
    const response = await request(app).delete(`/groups/999999`)

    expect(response.status).toBe(404)
  })
})
