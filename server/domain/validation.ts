import { z } from 'zod'
import { contextualOptions } from '../../shared/config'
import type { StoredQuestion } from './types'
export const modeSchema = z.enum(['research', 'fair'])
export const sessionIdSchema = z.uuid()
const option = (key: keyof typeof contextualOptions) => z.string().refine(value => contextualOptions[key].some(o => o.value === value))
export const profileSchema = z.object({ area: option('area') }).strict()
export const startSchema = z.object({ profile: profileSchema.optional() }).strict()
export const answersSchema = z.object({ answers: z.array(z.object({ questionId: z.string().min(1).max(80), optionId: z.string().min(1).max(80) }).strict()).min(1).max(200) }).strict()
export const answerSchema = z.object({ questionId: z.string().min(1).max(80), optionId: z.string().min(1).max(80) }).strict()
export const filtersSchema = z.object({ area: option('area').optional() }).strict()
export type Filters = z.infer<typeof filtersSchema>
export class SurveyError extends Error {
  constructor(public statusCode: number, message: string) { super(message) }
}
export function validateAnswers(questions: StoredQuestion[], input: z.infer<typeof answersSchema>['answers'], completed: boolean) {
  if (completed) throw new SurveyError(409, 'Esta sessão já foi concluída.')
  if (input.length !== questions.length || new Set(input.map(a => a.questionId)).size !== input.length) throw new SurveyError(400, 'Responda todas as questões, sem repetições.')
  const answers: Record<string, string> = {}
  for (const answer of input) {
    const question = questions.find(q => q.id === answer.questionId)
    if (!question) throw new SurveyError(400, 'Questão não pertence a esta sessão.')
    if (!question.options.some(o => o.id === answer.optionId)) throw new SurveyError(400, 'Alternativa inválida para esta questão.')
    answers[answer.questionId] = answer.optionId
  }
  return answers
}
