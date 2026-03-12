import { completeQuest, requireSession } from '@questlog/server'
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { toErrorResponse } from '#/lib/server-response'

export const Route = createFileRoute('/api/quests/$questId/complete')({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        try {
          const session = await requireSession(request)
          const result = await completeQuest(session.user.id, params.questId)
          return json(result)
        } catch (error) {
          return toErrorResponse(error)
        }
      },
    },
  },
})
