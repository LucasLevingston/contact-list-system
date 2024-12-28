import request from 'supertest'
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { prisma } from '../../../lib/prisma'
import { setupApp } from '../../../setup'

const app = setupApp()
let groupId: number
describe('PATCH /groups/:id', () => {
  beforeAll(async () => {
    await prisma.group.deleteMany({})
    const group = await prisma.group.create({ data: { name: 'Test Group' } })
    groupId = group.id
  })

  afterAll(async () => {
    await prisma.group.delete({ where: { id: groupId } })
    await prisma.$disconnect()
  })

  it('should update an existing group', async () => {
    const response = await request(app)
      .patch(`/groups/${groupId}`)
      .send({ name: 'Updated Test Group' })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', groupId)
    expect(response.body).toHaveProperty('name', 'Updated Test Group')
  })

  it('should return 404 for an invalid group ID', async () => {
    const response = await request(app)
      .patch(`/groups/999999`)
      .send({ name: 'Non-existent Group' })

    expect(response.status).toBe(404)
  })

  it('should return 400 when name is missing', async () => {
    const response = await request(app).patch(`/groups/${groupId}`).send({})

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      message: 'Invalid input',
    })
  })

  it('should not update with a duplicate name', async () => {
    await request(app).post('/groups').send({ name: 'Another Group' })

    const anotherGroup = await prisma.group.findFirst({
      where: { name: 'Another Group' },
    })

    const response = await request(app)
      .patch(`/groups/${groupId}`)
      .send({ name: 'Another Group' })

    expect(response.status).toBe(409)
    expect(response.body).toMatchObject({
      message: 'Error on database',
      error: 'Already exists.',
    })
  })
})
