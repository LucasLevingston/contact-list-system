import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import { Express } from 'express'

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contact list API',
      version: '1.0.0',
      description: 'API documentation for Contact List',
    },
    servers: [
      {
        url: `http://${process.env.HOST}:${process.env.PORT}`,
      },
    ],
  },
  apis: ['./src/routes/*/*.ts'],
}

const swaggerSpec = swaggerJSDoc(options)

const setupSwagger = (app: Express) => {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
}

export default setupSwagger
