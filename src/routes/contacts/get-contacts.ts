import { Request, Response, Router } from 'express'
import prisma from '../../lib/prisma'

const router = Router()

/**
 * @swagger
 * /contacts:
 *   get:
 *     tags: [Contacts]
 *     summary: Get a paginated list of contacts
 *     description: Returns a paginated list of contacts, ordered alphabetically by name.
 *     parameters:
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of contacts to return
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: offset
 *         required: false
 *         description: Number of contacts to skip
 *         schema:
 *           type: integer
 *           example: 0
 *     responses:
 *       200:
 *         description: A list of contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   phone:
 *                     type: string
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

router.get('/contacts', async (req: Request, res: Response, next: Function) => {
  const { limit = 10, offset = 0 } = req.query
  try {
    const contacts = await prisma.contact.findMany({
      skip: Number(offset),
      take: Number(limit),
      orderBy: { name: 'asc' },
    })
    res.status(200).json(contacts)
  } catch (error) {
    next(error)
  }
})

export default router
