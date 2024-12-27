import { Request, Response, Router } from 'express'
import { z } from 'zod'
import prisma from '../../lib/prisma'

const router = Router()

const GroupSchema = z.object({
  name: z.string(),
})

/**
 * @swagger
 * /groups:
 *   post:
 *     tags: [Groups]
 *     summary: Create a new group
 *     description: Creates a new group to link contacts.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Client Group"
 *     responses:
 *       201:
 *         description: Group created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
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

router.post('/groups', async (req: Request, res: Response, next: Function) => {
  try {
    const { name } = GroupSchema.parse(req.body)
    const group = await prisma.group.create({
      data: { name },
    })
    res.status(201).json(group)
  } catch (error) {
    next(error)
  }
})

export default router
