import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import request from 'supertest'
import { setupApp } from '../../../setup'
import { prisma } from '../../../lib/prisma'

vi.mock('../../src/services/eventService')

beforeAll(async () => {
  await prisma.contact.deleteMany({})
})

const app = setupApp()
describe('POST /contacts', () => {
  it('should create a new contact', async () => {
    const response = await request(app).post('/contacts').send({
      name: 'John Doe',
      phone: '(13) 3456-7890',
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.name).toBe('John Doe')
    expect(response.body.phone).toBe('(13) 3456-7890')
  })

  it('should return 400 if name is missing', async () => {
    const response = await request(app).post('/contacts').send({
      phone: '(12) 3456-7890',
    })

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      message: 'Invalid input',
      errors: expect.any(Object),
    })
  })

  it('should return 400 if phone is missing', async () => {
    const response = await request(app).post('/contacts').send({
      name: 'John Doe',
    })

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      message: 'Invalid input',
      errors: expect.any(Object),
    })
  })

  it('should return 400 if name is too short', async () => {
    const response = await request(app).post('/contacts').send({
      name: 'J',
      phone: '(12) 3456-7890',
    })

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      message: 'Invalid input',
      errors: expect.any(Object),
    })
  })

  it('should return 400 if phone format is invalid', async () => {
    const response = await request(app).post('/contacts').send({
      name: 'John Doe',
      phone: '12345-67890',
    })

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      message: 'Invalid input',
      errors: expect.any(Object),
    })
  })

  it('should return 409 if phone number already exists', async () => {
    await request(app).post('/contacts').send({
      name: 'John Doe',
      phone: '(12) 3456-7890',
    })

    const response = await request(app).post('/contacts').send({
      name: 'Jane Doe',
      phone: '(12) 3456-7890',
    })

    expect(response.status).toBe(409)
    expect(response.body).toMatchObject({
      error: 'Already exists.',
      message: 'Error on database',
    })
  })

  it('should return 400 for invalid JSON payload', async () => {
    const response = await request(app)
      .post('/contacts')
      .set('Content-Type', 'application/json')
      .send('{"name": "John Doe", phone: invalid}')

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      message: 'Invalid JSON payload',
    })
  })

  it('should handle empty request body', async () => {
    const response = await request(app).post('/contacts').send({})

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      message: 'Invalid input',
      errors: expect.any(Object),
    })
  })

  it('should handle whitespace-only name', async () => {
    const response = await request(app).post('/contacts').send({
      name: '   ',
      phone: '(12) 3456-7890',
    })

    expect(response.status).toBe(400)
    expect(response.body).toMatchObject({
      message: 'Invalid input',
      errors: expect.any(Object),
    })
  })

  it('should trim name before validation', async () => {
    const response = await request(app).post('/contacts').send({
      name: 'John Doee',
      phone: '(12) 3456-7891',
    })

    expect(response.status).toBe(201)
    expect(response.body.name).toBe('John Doee')
  })
})
