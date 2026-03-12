import {
  loadDashboard,
  requireSession,
  runServerEffect,
} from '@questlog/server'
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { toErrorResponse } from '#/lib/server-response'

export const Route = createFileRoute('/api/dashboard')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const session = await requireSession(request)
          const dashboard = await runServerEffect(
            loadDashboard(session.user.id),
          )
          return json(dashboard)
        } catch (error) {
          return toErrorResponse(error)
        }
      },
    },
  },
})
