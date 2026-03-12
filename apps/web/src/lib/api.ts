import {
  type CreateHabitInput,
  type CreateQuestInput,
  type DashboardPayload,
  DashboardPayloadSchema,
  type MutationResult,
  MutationResultSchema,
  type SaveCheckInInput,
} from '@questlog/contracts'
import type { ZodType } from 'zod'

type RequestShape = Omit<RequestInit, 'body'> & {
  body?: unknown
}

const decode = <T>(schema: ZodType<T>, input: unknown) => schema.parse(input)

const requestJson = async <T>(
  url: string,
  { body, headers, ...init }: RequestShape,
  schema: ZodType<T>,
) => {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...(body === undefined ? {} : { 'content-type': 'application/json' }),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      typeof payload?.error === 'string' ? payload.error : 'Request failed',
    )
  }

  return decode(schema, payload)
}

export const dashboardQueryKey = ['dashboard'] as const

export const fetchDashboard = () =>
  requestJson('/api/dashboard', { method: 'GET' }, DashboardPayloadSchema)

export const createQuestRequest = (input: CreateQuestInput) =>
  requestJson(
    '/api/quests',
    {
      method: 'POST',
      body: input,
    },
    MutationResultSchema,
  )

export const completeQuestRequest = (questId: string) =>
  requestJson(
    `/api/quests/${questId}/complete`,
    {
      method: 'POST',
    },
    MutationResultSchema,
  )

export const createHabitRequest = (input: CreateHabitInput) =>
  requestJson(
    '/api/habits',
    {
      method: 'POST',
      body: input,
    },
    MutationResultSchema,
  )

export const logHabitRequest = (habitId: string) =>
  requestJson(
    `/api/habits/${habitId}/log`,
    {
      method: 'POST',
    },
    MutationResultSchema,
  )

export const saveCheckInRequest = (input: SaveCheckInInput) =>
  requestJson(
    '/api/check-ins/today',
    {
      method: 'PUT',
      body: input,
    },
    MutationResultSchema,
  )

export const mergeDashboard = (
  current: DashboardPayload | undefined,
  result: MutationResult,
) => result.dashboard ?? current
