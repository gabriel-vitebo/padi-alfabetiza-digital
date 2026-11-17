import { getRouterParam, readBody } from 'h3'
import { sessionToken } from '../../../utils/session-token'
import { api } from '../../../utils/api'
import { getDatabase } from '../../../db/client'
import { answerSchema, sessionIdSchema } from '../../../domain/validation'
import { saveAnswer } from '../../../domain/sessions'

export default api(async event => {
  const id = sessionIdSchema.parse(getRouterParam(event, 'sessionId'))
  await saveAnswer(getDatabase(), id, answerSchema.parse(await readBody(event)), sessionToken(event))
  return { saved: true }
})
