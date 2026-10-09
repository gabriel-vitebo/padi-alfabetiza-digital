import { getRouterParam } from 'h3'
import { sessionToken } from '../../../utils/session-token'
import { api } from '../../../utils/api'
import { getDatabase } from '../../../db/client'
import { sessionIdSchema } from '../../../domain/validation'
import { getResult } from '../../../domain/sessions'
export default api(event => getResult(getDatabase(), sessionIdSchema.parse(getRouterParam(event, 'sessionId')), sessionToken(event)))
