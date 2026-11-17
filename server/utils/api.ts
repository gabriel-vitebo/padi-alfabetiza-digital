import { createError, defineEventHandler, setHeader, type H3Event } from 'h3'
import { ZodError } from 'zod'
import { SurveyError } from '../domain/validation'
export function api<T>(handler: (event: H3Event) => Promise<T>) {
  return defineEventHandler(async event => {
    setHeader(event, 'Cache-Control', 'no-store')
    setHeader(event, 'Referrer-Policy', 'no-referrer')
    try { return await handler(event) }
    catch (error) {
      if (import.meta.dev) {
        const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error)
        console.error(`[api] ${event.method} ${event.path} failed: ${detail}`)
      }
      if (error instanceof ZodError) throw createError({ statusCode: 400, message: 'Confira os dados enviados.' })
      if (error instanceof SurveyError) throw createError({ statusCode: error.statusCode, message: error.message })
      const failure = error && typeof error === 'object' ? error as { name?: unknown; code?: unknown } : undefined
      const message = error instanceof Error ? error.message : ''
      const failureCategory = message === 'Banco pertence a outro ambiente' ? 'database-environment-mismatch'
        : message === 'Banco de produção contém participações sintéticas' ? 'synthetic-data-in-production'
        : message.startsWith('Vercel Production exige') ? 'vercel-environment-mismatch'
        : message.startsWith('Configure APP_ENV') ? 'app-environment-missing'
        : message.startsWith('Conexões remotas exigem') ? 'database-ssl-mode-invalid'
        : message.startsWith('DATABASE_SSL_CA_B64') ? 'database-ca-invalid'
        : message.startsWith('Configure DATABASE_URL') ? 'database-url-missing'
        : 'unclassified'
      console.error('[api] Unhandled request failure', {
        method: event.method,
        name: typeof failure?.name === 'string' ? failure.name : 'UnknownError',
        code: typeof failure?.code === 'string' ? failure.code : undefined,
        category: failureCategory,
        appEnvironment: process.env.APP_ENV || 'missing',
        vercelEnvironment: process.env.VERCEL_ENV || 'missing',
        databaseUrlConfigured: Boolean(process.env.DATABASE_URL),
        databaseCaConfigured: Boolean(process.env.DATABASE_SSL_CA_B64)
      })
      throw createError({ statusCode: 503, message: 'Serviço temporariamente indisponível. Tente novamente em instantes.' })
    }
  })
}
