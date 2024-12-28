import { Request, Response, Router } from 'express'
import { prisma } from '../../lib/prisma'

const router = Router()

/**
 * @swagger
 * /report/contacts-groups:
 *   get:
 *     tags: [Reports]
 *     summary: Returns a report with the number of contacts in each group
 *     description: Returns an array with groups and the corresponding number of contacts, ordered by the highest number of contacts.
 *     responses:
 *       200:
 *         description: Report of groups and contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   group:
 *                     type: string
 *                     example: "Client X"
 *                   contact_count:
 *                     type: integer
 *                     example: 35
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

router.get(
  '/report/contacts-groups',
  async (req: Request, res: Response, next: Function) => {
    try {
      const groups = await prisma.group.findMany({
        include: { contacts: true },
      })

      const report = groups
        .map((group) => ({
          grupo: group.name,
          quantidade_contacts: group.contacts.length,
        }))
        .sort((a, b) => b.quantidade_contacts - a.quantidade_contacts)

      res.status(200).json(report)
    } catch (error) {
      next(error)
    }
  }
)

export default router
