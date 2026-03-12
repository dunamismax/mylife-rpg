import { AppError } from '@questlog/server'
import { json } from '@tanstack/react-start'

export const toErrorResponse = (error: unknown) => {
  if (error instanceof AppError) {
    return json({ error: error.message }, { status: error.status })
  }

  return json({ error: 'Internal server error' }, { status: 500 })
}
