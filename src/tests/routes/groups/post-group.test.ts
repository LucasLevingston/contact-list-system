import request from 'supertest'
import { describe, it, expect, afterAll, beforeAll } from 'vitest'
import { setupApp } from '../../../setup'
import prisma from '../../../lib/prisma'

const app = setupApp()

describe('POST /groups', () => {
  beforeAll(async () => {
    await prisma.group.deleteMany({})
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  it('should create a group', async () => {
    const response = await request(app).post('/groups').send({ name: 'Test Group' })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('name', 'Test Group')
  })

  it('should return a 400 error when name is missing', async () => {
    const response = await request(app).post('/groups').send({})

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      message: 'Invalid input',
    })
  })

  it('should not create a group with a duplicate name', async () => {
    await request(app).post('/groups').send({ name: 'Duplicate Group' })

    const response = await request(app).post('/groups').send({ name: 'Duplicate Group' })

    expect(response.status).toBe(409)
    expect(response.body).toMatchObject({
      message: 'Error on database',
      error: 'Already exists.',
    })
  })

  it('should create a group with valid characters', async () => {
    const response = await request(app)
      .post('/groups')
      .send({ name: 'Valid Group Name 123' })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('name', 'Valid Group Name 123')
  })
})
