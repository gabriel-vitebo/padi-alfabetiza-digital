import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { SurveyError } from './validation'

export function createSessionAccess() {
  const accessToken = randomBytes(32).toString('base64url')
  return { accessToken, accessTokenHash: hashSessionToken(accessToken) }
}
export function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}
export function assertSessionAccess(storedHash: string | null | undefined, token: string | undefined) {
  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token) || !storedHash || !/^[a-f0-9]{64}$/.test(storedHash)
    || !timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(hashSessionToken(token), 'hex'))) {
    throw new SurveyError(403, 'Acesso à sessão não autorizado. Use o dispositivo em que iniciou a participação.')
  }
}
