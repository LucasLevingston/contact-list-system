import { Response, Request, NextFunction } from 'express'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof ZodError) {
    res
      .status(400)
      .json({ message: 'Invalid input', errors: error.flatten().fieldErrors })
    return
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        res.status(409).json({
          message: 'Error on database',
          error: 'Already exists.',
        })
        return
      case 'P2003':
        res.status(400).json({
          message: 'Error on database',
          error: 'Foreign key constraint failed.',
        })
        return
      case 'P2025':
        res.status(404).json({ message: 'Error on database', error: 'Not found' })
        return
      default:
        res.status(500).json({
          message: 'Internal server error',
          error: 'Database error',
        })
        return
    }
  }

  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ message: 'Invalid JSON payload' })
    return
  }

  res.status(500).json({ message: 'Internal server error' })
  return
}
