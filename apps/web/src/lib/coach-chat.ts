import {
  createChatClientOptions,
  fetchServerSentEvents,
  type InferChatMessages,
  useChat,
} from '@tanstack/ai-react'

const chatOptions = createChatClientOptions({
  connection: fetchServerSentEvents('/api/ai/chat'),
})

export type CoachMessages = InferChatMessages<typeof chatOptions>

export const useCoachChat = () => useChat(chatOptions)
