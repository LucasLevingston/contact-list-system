import express, { Request, Response, Router } from 'express'
import { z } from 'zod'
import prisma from '../../lib/prisma'

const router = Router()

const GroupSchema = z.object({
  name: z.string(),
})

/**
 * @swagger
 * /groups/{id}:
 *   patch:
 *     tags: [Groups]
 *     summary: Update an existing group
 *     description: Updates an existing group in the database.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the group to be updated
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
 *                 example: "Supplier Group"
 *     responses:
 *       200:
 *         description: Group updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       404:
 *         description: Group not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Group not found."
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

router.patch('/groups/:id', async (req: Request, res: Response, next: Function) => {
  const { id } = req.params
  try {
    const updates = GroupSchema.parse(req.body)
    const updatedGroup = await prisma.group.update({
      where: { id: Number(id) },
      data: updates,
    })
    res.status(200).json(updatedGroup)
  } catch (error) {
    next(error)
  }
})

export default router
