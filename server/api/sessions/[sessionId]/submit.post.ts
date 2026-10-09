import { getRouterParam, readBody } from 'h3'
import { sessionToken } from '../../../utils/session-token'
import { api } from '../../../utils/api'
import { getDatabase } from '../../../db/client'
import { answersSchema, sessionIdSchema } from '../../../domain/validation'
import { submitSession } from '../../../domain/sessions'
export default api(async event => {
  const id = sessionIdSchema.parse(getRouterParam(event, 'sessionId'))
  return submitSession(getDatabase(), id, answersSchema.parse(await readBody(event)).answers, sessionToken(event))
})
