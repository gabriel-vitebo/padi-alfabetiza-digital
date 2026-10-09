import type { CompetencyId } from './diagnostic'
export type Distribution = { value: string; count: number; percentage: number }
export type Aggregate = {
  count: number; average: number; syntheticCount: number
  competencies: { competency: CompetencyId; count: number; average: number; distribution: Distribution[] | null }[]
  questions: { id: string; title: string; count: number; average: number; distribution: Distribution[] | null }[]
  demographics: Record<string, Distribution[] | null>
}
export type DashboardSummary = {
  status: 'empty' | 'insufficient' | 'ready'; minimum: number
  segment: Aggregate | null; overall: Aggregate | null
}
