import { logHabit, requireSession, runServerEffect } from '@questlog/server'
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { toErrorResponse } from '#/lib/server-response'

export const Route = createFileRoute('/api/habits/$habitId/log')({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        try {
          const session = await requireSession(request)
          const result = await runServerEffect(
            logHabit(session.user.id, params.habitId),
          )
          return json(result)
        } catch (error) {
          return toErrorResponse(error)
        }
      },
    },
  },
})
