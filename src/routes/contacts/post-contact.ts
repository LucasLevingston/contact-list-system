import { Request, Response, Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

const router = Router()

const ContactSchema = z.object({
  name: z.string().refine((name) => name.trim().split('').length >= 2, {
    message: 'Name must contain at least two words',
  }),
  phone: z.string().regex(/^\([0-9]{2}\) [0-9]{4}-[0-9]{4}$/, {
    message: 'Phone must be in format (xx) xxxx-xxxx',
  }),
})

/**
 * @swagger
 * /contacts:
 *   post:
 *     tags: [Contacts]
 *     summary: Add a new contact
 *     description: Adds a new contact to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               phone:
 *                 type: string
 *                 example: "1234567890"
 *     responses:
 *       201:
 *         description: Contact created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 phone:
 *                   type: string
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid input"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 */

router.post('/contacts', async (req: Request, res: Response, next: Function) => {
  try {
    const { name, phone } = ContactSchema.parse(req.body)

    const contact = await prisma.contact.create({
      data: {
        name,
        phone,
      },
    })

    res.status(201).json({
      id: contact.id,
      name: contact.name,
      phone: contact.phone,
    })
  } catch (error) {
    next(error)
  }
})

export default router
