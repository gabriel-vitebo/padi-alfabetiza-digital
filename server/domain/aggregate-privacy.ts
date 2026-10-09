import { MIN_AGGREGATE_SAMPLE_SIZE as minimum } from '../../shared/config'
import type { Aggregate, Distribution } from '../../shared/dashboard'
import type { Filters } from './validation'

export function filterAncestors(filters: Filters): Filters[] {
  const entries = Object.entries(filters)
  return Array.from({ length: (1 << entries.length) - 1 }, (_, mask) =>
    Object.fromEntries(entries.filter((_, bit) => mask & (1 << bit))))
}
export const isSmallRemainder = (whole: number, part: number) => whole > part && whole - part < minimum

function safePair(segment: Distribution[] | null, overall: Distribution[] | null) {
  if (!segment || !overall) return false
  return !overall.some(row => isSmallRemainder(row.count, segment.find(s => s.value === row.value)?.count ?? 0))
}
// Exact means/counts must not expose a small complement within an individual
// question, axis or distribution even when the whole segment is large enough.
export function protectComparison(segment: Aggregate, overall: Aggregate) {
  const hiddenQuestions = new Set(overall.questions.filter(q => {
    const part = segment.questions.find(s => s.id === q.id)
    return part && isSmallRemainder(q.count, part.count)
  }).map(q => q.id))
  segment.questions = segment.questions.filter(q => !hiddenQuestions.has(q.id))
  overall.questions = overall.questions.filter(q => !hiddenQuestions.has(q.id))
  const hiddenCompetencies = new Set(overall.competencies.filter(c => {
    const part = segment.competencies.find(s => s.competency === c.competency)
    return part && isSmallRemainder(c.count, part.count)
  }).map(c => c.competency))
  segment.competencies = segment.competencies.filter(c => !hiddenCompetencies.has(c.competency))
  overall.competencies = overall.competencies.filter(c => !hiddenCompetencies.has(c.competency))
  for (const q of segment.questions) {
    const whole = overall.questions.find(s => s.id === q.id)
    if (whole && !safePair(q.distribution, whole.distribution)) { q.distribution = null; whole.distribution = null }
  }
  for (const c of segment.competencies) {
    const whole = overall.competencies.find(s => s.competency === c.competency)
    if (whole && !safePair(c.distribution, whole.distribution)) { c.distribution = null; whole.distribution = null }
  }
  for (const key of Object.keys(segment.demographics)) {
    if (!safePair(segment.demographics[key] ?? null, overall.demographics[key] ?? null)) {
      segment.demographics[key] = null; overall.demographics[key] = null
    }
  }
}
