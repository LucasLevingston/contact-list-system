// tests/app.test.ts
import request from 'supertest'
import express from 'express'
import setupSwagger from '../../src/swagger'
import cors from 'cors'
import postContact from '../../src/routes/contacts/post-contact'
import patchContact from '../../src/routes/contacts/patch-contact'
import getContact from '../../src/routes/contacts/get-contacts'
import deleteContact from '../../src/routes/contacts/delete-contact'
import postGroup from '../../src/routes/groups/post-group'
import patchGroup from '../../src/routes/groups/patch-group'
import deleteGroup from '../../src/routes/groups/delete-group'
import getContactsByGroup from '../../src/routes/groups/get-contacts-by-group'
import getReports from '../routes/reports/get-contact-group-report'
import { errorHandler } from '../../src/error-handler'
import { beforeAll, describe, expect, it } from 'vitest'
import prisma from '../lib/prisma'

const app = express()
app.use(cors())
app.use(express.json())

app.use('', postContact)
app.use('', patchContact)
app.use('', getContact)
app.use('', deleteContact)
app.use('', postGroup)
app.use('', patchGroup)
app.use('', deleteGroup)
app.use('', getContactsByGroup)
app.use('', getReports)
app.use(errorHandler)
setupSwagger(app)

beforeAll(async () => {
  await prisma.contact.deleteMany({})
  await prisma.group.deleteMany({})
  await prisma.contactGroup.deleteMany({})
})

describe('App Routes', () => {
  it('should respond with 200 on GET /contacts', async () => {
    const response = await request(app).get('/contacts')
    expect(response.status).toBe(200)
  })

  it('should respond with 201 on POST /contacts', async () => {
    const response = await request(app)
      .post('/contacts')
      .send({ name: 'Test', phone: '(83) 9961-6220' })
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })

  it('should respond with 200 on PATCH /contacts/:id', async () => {
    const contact = await prisma.contact.create({
      data: { name: 'Update Me', phone: '(83) 9999-9999' },
    })
    const response = await request(app)
      .patch(`/contacts/${contact.id}`)
      .send({ name: 'Updated Name' })
    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Updated Name')
  })

  it('should respond with 204 on DELETE /contacts/:id', async () => {
    const contact = await prisma.contact.create({
      data: { name: 'Delete Me', phone: '(83) 8888-8888' },
    })
    const response = await request(app).delete(`/contacts/${contact.id}`)
    expect(response.status).toBe(204)
  })

  it('should respond with 201 on POST /groups', async () => {
    const response = await request(app).post('/groups').send({ name: 'Test Group' })
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
  })

  it('should respond with 200 on PATCH /groups/:id', async () => {
    const group = await prisma.group.create({
      data: { name: 'Update Group' },
    })
    const response = await request(app)
      .patch(`/groups/${group.id}`)
      .send({ name: 'Updated Group Name' })
    expect(response.status).toBe(200)
    expect(response.body.name).toBe('Updated Group Name')
  })

  it('should respond with 204 on DELETE /groups/:id', async () => {
    const group = await prisma.group.create({
      data: { name: 'Delete Group' },
    })
    const response = await request(app).delete(`/groups/${group.id}`)
    expect(response.status).toBe(204)
  })

  it('should respond with 200 on GET /report/contacts-groups', async () => {
    const response = await request(app).get('/report/contacts-groups')
    expect(response.status).toBe(200)
  })

  it('should respond with 200 on GET /groups/:id/contacts', async () => {
    const group = await prisma.group.create({
      data: { name: 'Group for Contacts' },
    })
    const contact = await prisma.contact.create({
      data: { name: 'Contact in Group', phone: '(83) 7777-7777' },
    })
    await prisma.contactGroup.create({
      data: {
        contactId: contact.id,
        groupId: group.id,
      },
    })
    const response = await request(app).get(`/groups/${group.id}/contacts`)
    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(1)
  })
})
