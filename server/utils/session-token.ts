import { getHeader, type H3Event } from 'h3'
import { SurveyError } from '../domain/validation'
export function sessionToken(event: H3Event) {
  const header = getHeader(event, 'authorization')
  const match = header?.match(/^Bearer ([A-Za-z0-9_-]{43})$/)
  if (!match) throw new SurveyError(403, 'Acesso à sessão não autorizado. Use o dispositivo em que iniciou a participação.')
  return match[1]!
}
