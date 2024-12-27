import { Request, Response, Router } from 'express'
import prisma from '../../lib/prisma'
import { z } from 'zod'

const router = Router()

const idSchema = z.object({
  id: z.coerce
    .number()
    .int()
    .positive()
    .refine((num) => num > 0, {
      message: 'ID must be a positive integer',
    }),
})

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     tags: [Contacts]
 *     summary: Delete an existing contact
 *     description: Deletes a contact from the database.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the contact to be deleted
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Contact deleted successfully
 *         content: {}
 *       404:
 *         description: Contact not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Contact not found."
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

router.delete('/contacts/:id', async (req: Request, res: Response, next: Function) => {
  try {
    const validatedParams = idSchema.parse(req.params)
    const { id } = validatedParams

    const contact = await prisma.contact.findUnique({ where: { id } })
    if (!contact) {
      res.status(404).json({ error: 'Contact not found.' })
      return
    }

    await prisma.contact.delete({
      where: { id },
    })
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router
