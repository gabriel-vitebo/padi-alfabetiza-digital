import type { Question, QuestionContext } from '../../shared/diagnostic'
export type StoredQuestion = Omit<Question, 'options'> & { contexts: QuestionContext[]; title?: string; options: (Question['options'][number] & { score: 0 | 1 | 2 })[] }
