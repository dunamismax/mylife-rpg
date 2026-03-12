import { createHabit, requireSession, runServerEffect } from '@questlog/server'
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { toErrorResponse } from '#/lib/server-response'

export const Route = createFileRoute('/api/habits')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const session = await requireSession(request)
          const body = await request.json()
          const result = await runServerEffect(
            createHabit(session.user.id, body),
          )
          return json(result)
        } catch (error) {
          return toErrorResponse(error)
        }
      },
    },
  },
})
