import { requireSession, runServerEffect, saveCheckIn } from '@questlog/server'
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { toErrorResponse } from '#/lib/server-response'

export const Route = createFileRoute('/api/check-ins/today')({
  server: {
    handlers: {
      PUT: async ({ request }) => {
        try {
          const session = await requireSession(request)
          const body = await request.json()
          const result = await runServerEffect(
            saveCheckIn(session.user.id, body),
          )
          return json(result)
        } catch (error) {
          return toErrorResponse(error)
        }
      },
    },
  },
})
