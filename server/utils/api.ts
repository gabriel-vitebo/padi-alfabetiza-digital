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
      throw createError({ statusCode: 503, message: 'Serviço temporariamente indisponível. Tente novamente em instantes.' })
    }
  })
}
