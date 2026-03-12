export class AppError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400)
    this.name = 'ValidationError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401)
    this.name = 'UnauthorizedError'
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404)
    this.name = 'NotFoundError'
  }
}

export const toAppError = (error: unknown) => {
  if (error instanceof AppError) {
    return error
  }

  if (error instanceof Error) {
    return new AppError(error.message, 500)
  }

  return new AppError('Unexpected server error', 500)
}
