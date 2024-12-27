import express from 'express'
import cors from 'cors'
import setupSwagger from './swagger'
import postContact from './routes/contacts/post-contact'
import patchContact from './routes/contacts/patch-contact'
import getContact from './routes/contacts/get-contacts'
import deleteContact from './routes/contacts/delete-contact'
import postGroup from './routes/groups/post-group'
import patchGroup from './routes/groups/patch-group'
import deleteGroup from './routes/groups/delete-group'
import getContactsByGroup from './routes/groups/get-contacts-by-group'
import getReports from './routes/reports/get-contact-group-report'
import { errorHandler } from './error-handler'

export const setupApp = () => {
  const app = express()

  app.use(cors())
  app.use(express.json())

  app.use(postContact)
  app.use(patchContact)
  app.use(getContact)
  app.use(deleteContact)
  app.use(postGroup)
  app.use(patchGroup)
  app.use(deleteGroup)
  app.use(getContactsByGroup)
  app.use(getReports)

  app.use(errorHandler)

  setupSwagger(app)

  return app
}
