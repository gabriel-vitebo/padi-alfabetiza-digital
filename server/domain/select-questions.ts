import type { StoredQuestion as Question } from './types'
import { competencyIds, type CompetencyId, type QuestionContext } from '../../shared/diagnostic'

type Random = () => number

type SelectQuestionsInput = {
  questions: Question[]
  total: number
  context: QuestionContext
  requiredQuestionIds?: string[]
  random?: Random
}

const itemAt = <T>(items: T[], index: number): T => {
  const item = items[index]
  if (item === undefined) throw new Error('Expected an item at the requested index')
  return item
}

const shuffle = <T>(items: T[], random: Random): T[] => {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const current = itemAt(shuffled, index)
    const swap = itemAt(shuffled, swapIndex)
    shuffled.splice(index, 1, swap)
    shuffled.splice(swapIndex, 1, current)
  }
  return shuffled
}

export const selectQuestions = ({ questions, total, context, requiredQuestionIds = [], random = Math.random }: SelectQuestionsInput): Question[] => {
  const eligible = questions.filter(question => question.contexts.includes(context))
  if (!Number.isInteger(total) || total < 1 || total > eligible.length) throw new Error('Quantidade de questões indisponível')
  if (new Set(eligible.map(q => q.id)).size !== eligible.length) throw new Error('Questões duplicadas')
  if (new Set(requiredQuestionIds).size !== requiredQuestionIds.length || requiredQuestionIds.length > total
    || requiredQuestionIds.some(id => !eligible.some(q => q.id === id))) throw new Error('Questões obrigatórias indisponíveis')
  if (total >= competencyIds.length && competencyIds.some(id => !eligible.some(q => q.competency === id))) throw new Error('Banco sem todos os eixos')
  const target = total

  const byCompetency = new Map<CompetencyId, Question[]>()
  for (const competency of competencyIds) {
    byCompetency.set(competency, shuffle(eligible.filter(question => question.competency === competency), random))
  }

  const selected: Question[] = []
  const counts = new Map<CompetencyId, number>()
  const availableCompetencies = competencyIds.filter(competency => (byCompetency.get(competency)?.length ?? 0) > 0)

  const addFrom = (competency: CompetencyId) => {
    const question = byCompetency.get(competency)?.shift()
    if (!question) return false
    selected.push(question)
    counts.set(competency, (counts.get(competency) ?? 0) + 1)
    return true
  }

  for (const id of requiredQuestionIds) {
    const question = eligible.find(q => q.id === id)!
    selected.push(question)
    const pool = byCompetency.get(question.competency)!
    pool.splice(pool.findIndex(q => q.id === id), 1)
    counts.set(question.competency, (counts.get(question.competency) ?? 0) + 1)
  }

  const represented = new Set(selected.map(q => q.competency))
  if (target >= availableCompetencies.length) {
    for (const competency of shuffle(availableCompetencies.filter(id => !represented.has(id)), random)) addFrom(competency)
  } else {
    for (const competency of shuffle(availableCompetencies.filter(id => !represented.has(id)), random).slice(0, target - selected.length)) addFrom(competency)
  }

  while (selected.length < target) {
    const candidates: CompetencyId[] = availableCompetencies.filter(competency => (byCompetency.get(competency)?.length ?? 0) > 0)
    if (candidates.length === 0) break
    const minimum = Math.min(...candidates.map(competency => counts.get(competency) ?? 0))
    const leastRepresented = candidates.filter(competency => (counts.get(competency) ?? 0) === minimum)
    const competency = itemAt(shuffle(leastRepresented, random), 0)
    addFrom(competency)
  }

  return shuffle(selected, random)
}
