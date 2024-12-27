import express, { Request, Response, Router } from 'express'
import prisma from '../../lib/prisma'

const router = Router()

/**
 * @swagger
 * /groups/{id}/contacts:
 *   get:
 *     tags: [Groups]
 *     summary: List all contacts linked to a specific group
 *     description: Returns a list of contacts belonging to a group.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the group whose contacts will be listed
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: List of contacts belonging to the group
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
 *       404:
 *         description: Group not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Group not found."
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
  '/groups/:id/contacts',
  async (req: Request, res: Response, next: Function) => {
    const { id } = req.params
    try {
      const groupWithContacts = await prisma.group.findUnique({
        where: { id: Number(id) },
        include: {
          contacts: {
            select: {
              contact: {
                select: {
                  name: true,
                  phone: true,
                },
              },
            },
          },
        },
      })
      if (groupWithContacts) {
        const contacts = groupWithContacts.contacts.map((cg) => ({
          name: cg.contact.name,
          phone: cg.contact.phone,
        }))
        res.status(200).json(contacts)
      } else {
        res.status(404).json({ error: 'Group not found' })
      }
    } catch (error) {
      next(error)
    }
  }
)

export default router
