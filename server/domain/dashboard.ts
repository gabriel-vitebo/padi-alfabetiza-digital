import { filterAncestors, isSmallRemainder, protectComparison } from './aggregate-privacy'
import { Prisma } from '../generated/prisma/client'
import type { Database, Transaction } from '../db/client'
import { assertDatabaseEnvironment } from '../db/client'
import type { Filters } from './validation'
import { MIN_AGGREGATE_SAMPLE_SIZE as minimum } from '../../shared/config'
import type { Aggregate, DashboardSummary, Distribution } from '../../shared/dashboard'
import type { CompetencyId } from '../../shared/diagnostic'

export function protectDistribution(rows: { value: string; count: number }[]): Distribution[] | null {
  if (rows.some(row => row.count > 0 && row.count < minimum)) return null
  const total = rows.reduce((sum,row) => sum + row.count,0)
  return rows.map(row => ({ ...row, percentage: total ? 100 * row.count / total : 0 }))
}
function where(filters: Filters): Prisma.SurveySessionWhereInput {
  return { mode: 'research', status: 'COMPLETED', profile: { is: filters } }
}
async function sampleCount(db: Transaction, filters: Filters) {
  return db.surveySession.count({ where: where(filters) })
}
async function partialParticipantCount(db: Transaction, filters: Filters) {
  return db.surveySession.count({ where: { mode: 'research', status: 'IN_PROGRESS',
    questions: { some: { options: { some: { answers: { some: {} } } } } }, profile: { is: filters } } })
}
async function questionAggregates(db: Transaction, filters: Filters): Promise<Aggregate['questions']> {
  const rows = await db.$queryRaw<{ id: string; title: string; count: number; average: number }[]>(Prisma.sql`
    select a.question_id as id,min(sq.snapshot->>'title') as title,
      count(*) filter (where (${filters.area ?? null}::text is null or p.area=${filters.area ?? null}))::int as count,
      avg(100.0*a.score/sq.max_score) filter (where (${filters.area ?? null}::text is null or p.area=${filters.area ?? null}))::float8 as average
    from padi.answers a join padi.sessions s on s.id=a.session_id
    join padi.profiles p on p.session_id=s.id
    join padi.session_questions sq on sq.session_id=a.session_id and sq.question_id=a.question_id
    where s.mode='research'
    group by a.question_id
    having count(*) filter (where (${filters.area ?? null}::text is null or p.area=${filters.area ?? null})) >= ${minimum}
      and (${filters.area ?? null}::text is null or count(*) filter (where p.area is distinct from ${filters.area ?? null}) = 0
        or count(*) filter (where p.area is distinct from ${filters.area ?? null}) >= ${minimum})
    order by average,a.question_id`)
  const scores = await db.surveyAnswer.groupBy({ by: ['questionId', 'score'],
    where: { option: { question: { session: { mode: 'research', profile: { is: filters } } } } }, _count: true, orderBy: { score: 'desc' } })
  return rows.map(q => ({ ...q, distribution: protectDistribution(scores.filter(s => s.questionId === q.id).map(s => ({value: String(s.score), count: s._count}))) }))
}
async function aggregate(db: Transaction, filters: Filters, questions: Aggregate['questions']): Promise<Aggregate> {
  const selected = where(filters)
  const metrics = await db.surveySession.groupBy({ by: ['earnedScore', 'maxScore', 'synthetic'], where: selected, _count: true })
  const count = metrics.reduce((n, r) => n + r._count, 0)
  const average = metrics.reduce((n, r) => n + 100 * r.earnedScore! / r.maxScore! * r._count, 0) / (count || 1)
  const syntheticCount = metrics.filter(r => r.synthetic).reduce((n, r) => n + r._count, 0)
  const groups = await db.competencyResult.groupBy({ by: ['competencyId', 'earnedScore', 'maxScore'], where: { session: selected }, _count: true })
  const competencies: Aggregate['competencies'] = []
  for (const competency of [...new Set(groups.map(r => r.competencyId))].sort()) {
    const rows = groups.filter(r => r.competencyId === competency)
    const n = rows.reduce((n, r) => n + r._count, 0)
    if (n < minimum) continue
    const bins = new Map<string, number>()
    for (const row of rows) {
      const pct = 100 * row.earnedScore / row.maxScore
      const bin = pct < 40 ? '0–39%' : pct < 70 ? '40–69%' : '70–100%'
      bins.set(bin, (bins.get(bin) ?? 0) + row._count)
    }
    competencies.push({ competency: competency as CompetencyId, count: n,
      average: rows.reduce((sum, r) => sum + 100 * r.earnedScore / r.maxScore * r._count, 0) / n,
      distribution: protectDistribution([...bins].sort().map(([value,count]) => ({value,count}))) })
  }
  const demographics: Aggregate['demographics'] = {}
  for (const key of ['area'] as const) {
    const rows = await db.participantProfile.groupBy({ by: [key], where: { session: selected }, _count: true })
    demographics[key] = protectDistribution(rows.map(r => ({ value: r[key] ?? '__legacy__', count: r._count })).sort((a,b) => b.count - a.count))
  }
  return { count, average, syntheticCount, competencies,
    questions, demographics }
}
export async function dashboardSummary(sql: Database, filters: Filters): Promise<DashboardSummary> {
  await assertDatabaseEnvironment(sql)
  // Stable snapshot: counts and suppression must describe the same set of participants.
  return sql.$transaction(async tx => {
    const overallCount = await sampleCount(tx,{})
    const segmentCount = await sampleCount(tx,filters)
    const [partialParticipants, questionResponses] = await Promise.all([
      partialParticipantCount(tx, filters), questionAggregates(tx, filters)
    ])
    const ancestors = await Promise.all(filterAncestors(filters).map(parent => sampleCount(tx,parent)))
    const smallComplement = ancestors.some(count => isSmallRemainder(count,segmentCount))
    if (overallCount === 0 && partialParticipants === 0 && questionResponses.length === 0)
      return { status: 'empty', minimum, segment: null, overall: null, hasPartialParticipants: false, questionResponses: [] }
    if (segmentCount < minimum || smallComplement)
      return { status: 'insufficient', minimum, segment: null, overall: null, hasPartialParticipants: partialParticipants > 0, questionResponses }
    const segment = await aggregate(tx,filters,questionResponses)
    const overall = Object.keys(filters).length ? await aggregate(tx,{},await questionAggregates(tx,{})) : segment
    if (overall !== segment) protectComparison(segment,overall)
    return { status: 'ready', minimum, segment, overall, hasPartialParticipants: partialParticipants > 0, questionResponses }
  }, { isolationLevel: 'RepeatableRead' }) as Promise<DashboardSummary>
}
