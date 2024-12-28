import { Request, Response, Router } from 'express'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'

const router = Router()

const ContactSchema = z.object({
  name: z
    .string()
    .refine((name) => name.trim().split('').length >= 2, {
      message: 'Name must contain at least two words',
    })
    .optional(),
  phone: z
    .string()
    .regex(/^\([0-9]{2}\) [0-9]{4}-[0-9]{4}$/, {
      message: 'Phone must be in format (xx) xxxx-xxxx',
    })
    .optional(),
})

/**
 * @swagger
 * /contacts/{id}:
 *   patch:
 *     tags: [Contacts]
 *     summary: Update an existing contact
 *     description: Updates an existing contact in the database.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the contact to be updated
 *         schema:
 *           type: integer
 *           example: 1
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
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: Contact updated successfully
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
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Contact not found."
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

router.patch('/contacts/:id', async (req: Request, res: Response, next: Function) => {
  const { id } = req.params
  if (isNaN(Number(id))) {
    res.status(400).json({ message: 'Invalid ID format' })
    return
  }

  try {
    const updates = ContactSchema.parse(req.body)

    const contact = await prisma.contact.findUnique({ where: { id: Number(id) } })
    if (!contact) {
      res.status(404).json({ error: 'Contact not found.' })
      return
    }

    const updatedContact = await prisma.contact.update({
      where: { id: Number(id) },
      data: updates,
    })

    res.status(200).json(updatedContact)
  } catch (error) {
    next(error)
  }
})

export default router
