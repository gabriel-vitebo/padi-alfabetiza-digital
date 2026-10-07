import type { Question, QuestionContext } from '~/types/diagnostic'

export const questionDefaults: Record<QuestionContext, number> = {
  diagnostico: 14,
  feira: 5
}

export const questionContexts: QuestionContext[] = ['diagnostico', 'feira']

type QueryValue = string | string[] | undefined

type QuestionQuery = {
  total?: QueryValue
  contexto?: QueryValue
}

export const resolveQuestionConfig = (query: QuestionQuery, questions: Question[]) => {
  const requestedContext = typeof query.contexto === 'string' ? query.contexto : undefined
  const context: QuestionContext = questionContexts.includes(requestedContext as QuestionContext)
    ? requestedContext as QuestionContext
    : 'diagnostico'
  const available = questions.filter(question => question.contexts.includes(context)).length
  const fallbackTotal = Math.min(questionDefaults[context], available)
  const requestedTotal = typeof query.total === 'string' ? query.total : undefined
  const isValidTotal = requestedTotal !== undefined && /^\d+$/.test(requestedTotal) && Number(requestedTotal) > 0 && Number(requestedTotal) <= available

  return {
    context,
    total: isValidTotal ? Number(requestedTotal) : fallbackTotal,
    available
  }
}