import { getRouterParam, readBody } from 'h3'
import { api } from '../../../utils/api'
import { getDatabase } from '../../../db/client'
import { modeSchema, startSchema } from '../../../domain/validation'
import { startSession } from '../../../domain/sessions'
export default api(async event => {
  const mode = modeSchema.parse(getRouterParam(event, 'mode'))
  const body = startSchema.parse(await readBody(event))
  return startSession(getDatabase(), mode, body.profile)
})
