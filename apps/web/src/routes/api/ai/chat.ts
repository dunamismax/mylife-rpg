import { generateCoachInsight } from '@questlog/ai'
import {
  loadDashboard,
  requireSession,
  runServerEffect,
} from '@questlog/server'
import { chat, toServerSentEventsResponse } from '@tanstack/ai'
import { openaiText } from '@tanstack/ai-openai'
import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { toErrorResponse } from '#/lib/server-response'

export const Route = createFileRoute('/api/ai/chat')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const session = await requireSession(request)
          const body = await request.json()
          const messages = Array.isArray(body?.messages) ? body.messages : []

          if (!process.env.OPENAI_API_KEY) {
            return json(
              { error: 'OPENAI_API_KEY is not configured' },
              { status: 503 },
            )
          }

          const dashboard = await runServerEffect(
            loadDashboard(session.user.id),
          )
          const latestPrompt =
            [...messages]
              .reverse()
              .find(
                (message) =>
                  message?.role === 'user' &&
                  typeof message.content === 'string',
              )?.content ?? 'Help me focus the current board.'
          const insight = await generateCoachInsight(dashboard, latestPrompt)
          const systemPrompt = `You are QuestLog's embedded coach.

Use the user's current board state and this internal coaching snapshot:
- Heading: ${insight.heading}
- Summary: ${insight.summary}
- Momentum: ${insight.momentum.join(' | ')}
- Friction: ${insight.friction.join(' | ')}
- Next moves: ${insight.nextMoves.join(' | ')}

Stay concrete. Favor small, immediate moves over big abstractions.`

          const stream = chat({
            adapter: openaiText(
              (process.env.OPENAI_CHAT_MODEL as 'gpt-4o-mini' | undefined) ??
                'gpt-4o-mini',
            ),
            messages,
            systemPrompts: [systemPrompt],
          })

          return toServerSentEventsResponse(stream)
        } catch (error) {
          return toErrorResponse(error)
        }
      },
    },
  },
})
