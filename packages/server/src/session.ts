import { auth } from './auth'
import { UnauthorizedError } from './errors'

export const getSession = (request: Request) =>
  auth.api.getSession({
    headers: request.headers,
  })

export const requireSession = async (request: Request) => {
  const session = await getSession(request)

  if (!session?.user) {
    throw new UnauthorizedError()
  }

  return session
}
