import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ZodError, z } from 'zod'
import { Prisma } from '@prisma/client'
import { errorHandler } from '../error-handler'

describe('errorHandler', () => {
  const mockResponse = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  }
  const mockRequest = {}
  const mockNext = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('handles ZodError', () => {
    const schema = z.object({ name: z.string() })
    const zodResult = schema.safeParse({})
    if (!zodResult.success) {
      const error = zodResult.error

      errorHandler(error, mockRequest as any, mockResponse as any, mockNext)

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Invalid input',
        errors: expect.any(Object),
      })
    }
  })

  it('handles Prisma P2002 error (unique constraint)', () => {
    const error = new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
      code: 'P2002',
      clientVersion: '1.0.0',
    })

    errorHandler(error, mockRequest as any, mockResponse as any, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(409)
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Error on database',
      error: 'Already exists.',
    })
  })

  it('handles Prisma P2003 error (foreign key constraint)', () => {
    const error = new Prisma.PrismaClientKnownRequestError('Foreign key failed', {
      code: 'P2003',
      clientVersion: '1.0.0',
    })

    errorHandler(error, mockRequest as any, mockResponse as any, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Error on database',
      error: 'Foreign key constraint failed.',
    })
  })

  it('handles Prisma P2025 error (not found)', () => {
    const error = new Prisma.PrismaClientKnownRequestError('Record not found', {
      code: 'P2025',
      clientVersion: '1.0.0',
    })

    errorHandler(error, mockRequest as any, mockResponse as any, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(404)
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Error on database',
      error: 'Not found',
    })
  })

  it('handles unknown Prisma errors', () => {
    const error = new Prisma.PrismaClientKnownRequestError('Unknown error', {
      code: 'P2999',
      clientVersion: '1.0.0',
    })

    errorHandler(error, mockRequest as any, mockResponse as any, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal server error',
      error: 'Database error',
    })
  })

  it('handles SyntaxError for invalid JSON', () => {
    const error = Object.assign(new SyntaxError('Invalid JSON'), { body: {} })

    errorHandler(error, mockRequest as any, mockResponse as any, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Invalid JSON payload',
    })
  })

  it('handles generic errors', () => {
    const error = new Error('Generic error')

    errorHandler(error, mockRequest as any, mockResponse as any, mockNext)

    expect(mockResponse.status).toHaveBeenCalledWith(500)
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Internal server error',
    })
  })
})
