import express, { Request, Response, Router } from 'express'
import prisma from '../../lib/prisma'

const router = Router()

/**
 * @swagger
 * /groups/{id}:
 *   delete:
 *     tags: [Groups]
 *     summary: Delete an existing group
 *     description: Deletes a group from the database.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the group to be deleted
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Group deleted successfully
 *         content: {}
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

router.delete('/groups/:id', async (req: Request, res: Response, next: Function) => {
  const { id } = req.params
  try {
    await prisma.group.delete({
      where: { id: Number(id) },
    })
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default router
