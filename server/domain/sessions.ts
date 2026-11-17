import { assertSessionAccess, createSessionAccess } from './session-access'
import { randomUUID } from 'node:crypto'
import { assertDevelopmentSeed } from './environment'
import type { Database, Transaction } from '../db/client'
import { assertDatabaseEnvironment } from '../db/client'
import { surveyRules, type Profile } from '../../shared/config'
import type { Question, Session, StartedSession, SurveyMode, SurveyResult } from '../../shared/diagnostic'
import type { StoredQuestion } from './types'
import { selectQuestions } from './select-questions'
import { calculateDiagnosticResult } from './result'
import { SurveyError, validateAnswers } from './validation'

export function publicQuestion(q: StoredQuestion): Question {
  return { id: q.id, competency: q.competency, statement: q.statement, options: q.options.map(o => ({ id: o.id, label: o.label })) }
}
export async function loadBank(db: Database | Transaction): Promise<StoredQuestion[]> {
  const rows = await db.question.findMany({ where: { active: true }, orderBy: { id: 'asc' },
    include: { contexts: { orderBy: { context: 'asc' } }, options: { orderBy: { id: 'asc' } } } })
  return rows.map(q => ({ id: q.id, title: q.title, competency: q.competencyId as StoredQuestion['competency'],
    statement: q.statement, contexts: q.contexts.map(c => c.context),
    options: q.options.map(o => ({ id: o.id, label: o.label, score: o.score as 0 | 1 | 2 })) }))
}
export async function startSession(db: Database, mode: SurveyMode, profile?: Profile, synthetic = false): Promise<StartedSession> {
  if (synthetic) assertDevelopmentSeed()
  if (mode === 'research' && !profile) throw new SurveyError(400, 'Selecione sua área de estudo ou atuação.')
  await assertDatabaseEnvironment(db)
  return db.$transaction(async tx => {
    const rule = surveyRules[mode]
    const questions = selectQuestions({ questions: await loadBank(tx), total: rule.questionCount, context: rule.context,
      requiredQuestionIds: mode === 'research' ? ['Q01', 'Q05'] : [] })
    const id = randomUUID()
    const { accessToken, accessTokenHash } = createSessionAccess()
    await tx.surveySession.create({ data: { id, mode, accessTokenHash, questionCount: questions.length, synthetic } })
    if (profile && mode === 'research') await tx.participantProfile.create({ data: { sessionId: id, ...profile } })
    for (const [position, question] of questions.entries()) {
      await tx.sessionQuestion.create({ data: { sessionId: id, questionId: question.id, position,
        competencyId: question.competency, snapshot: question,
        maxScore: Math.max(...question.options.map(o => o.score)) } })
      await tx.sessionOption.createMany({ data: question.options.map(o => ({
        sessionId: id, questionId: question.id, optionId: o.id, label: o.label, score: o.score
      })) })
    }
    return { sessionId: id, accessToken, mode, completed: false, questions: questions.map(publicQuestion), answers: [] }
  })
}
async function sessionRow(db: Database | Transaction, id: string, accessToken: string | undefined) {
  const row = await db.surveySession.findUnique({ where: { id } })
  assertSessionAccess(row?.accessTokenHash, accessToken)
  if (!row) throw new SurveyError(403, 'Acesso à sessão não autorizado.')
  return row
}
async function snapshots(db: Database | Transaction, id: string) {
  const rows = await db.sessionQuestion.findMany({ where: { sessionId: id }, orderBy: { position: 'asc' }, select: { snapshot: true } })
  return rows.map(r => r.snapshot as unknown as StoredQuestion)
}
export async function getSession(db: Database, id: string, accessToken: string | undefined): Promise<Session> {
  await assertDatabaseEnvironment(db)
  const row = await sessionRow(db, id, accessToken)
  const [questions, answers] = await Promise.all([
    snapshots(db, id),
    db.surveyAnswer.findMany({ where: { sessionId: id }, select: { questionId: true, optionId: true } })
  ])
  return { sessionId: id, mode: row.mode, completed: row.status === 'COMPLETED', questions: questions.map(publicQuestion), answers }
}
export async function saveAnswer(db: Database, id: string, input: { questionId: string; optionId: string }, accessToken: string | undefined): Promise<void> {
  await assertDatabaseEnvironment(db)
  await db.$transaction(async tx => {
    const row = await sessionRow(tx, id, accessToken)
    // Lock the session row so saving an answer cannot race with final submission.
    const claim = await tx.surveySession.updateMany({ where: { id, status: 'IN_PROGRESS' }, data: { updatedAt: new Date() } })
    if (!claim.count || row.status !== 'IN_PROGRESS') throw new SurveyError(409, 'Esta sessão já foi concluída.')
    const question = (await snapshots(tx, id)).find(q => q.id === input.questionId)
    if (!question) throw new SurveyError(400, 'Questão não pertence a esta sessão.')
    const option = question.options.find(o => o.id === input.optionId)
    if (!option) throw new SurveyError(400, 'Alternativa inválida para esta questão.')
    await tx.surveyAnswer.upsert({
      where: { sessionId_questionId: { sessionId: id, questionId: question.id } },
      create: { sessionId: id, questionId: question.id, optionId: option.id, score: option.score },
      update: { optionId: option.id, score: option.score }
    })
  })
}
export async function submitSession(db: Database, id: string, input: { questionId: string; optionId: string }[], accessToken: string | undefined): Promise<SurveyResult> {
  await assertDatabaseEnvironment(db)
  return db.$transaction(async tx => {
    const row = await sessionRow(tx, id, accessToken)
    // Conditional UPDATE acquires the row lock. A competing completion waits, then
    // rechecks the predicate and returns zero. Rollback releases the claim on error.
    const claim = await tx.surveySession.updateMany({ where: { id, status: 'IN_PROGRESS' }, data: { updatedAt: new Date() } })
    if (!claim.count) throw new SurveyError(409, 'Sessão já concluída.')
    const questions = await snapshots(tx, id)
    const answers = validateAnswers(questions, input, row.status === 'COMPLETED')
    const result = calculateDiagnosticResult(questions, answers)
    await Promise.all(questions.map(q => {
      const o = q.options.find(o => o.id === answers[q.id])!
      return tx.surveyAnswer.upsert({
        where: { sessionId_questionId: { sessionId: id, questionId: q.id } },
        create: { sessionId: id, questionId: q.id, optionId: o.id, score: o.score },
        update: { optionId: o.id, score: o.score }
      })
    }))
    await tx.competencyResult.createMany({ data: result.competencies.map(c => ({
      sessionId: id, competencyId: c.competency, earnedScore: c.earnedScore, maxScore: c.maxScore
    })) })
    await tx.surveySession.update({ where: { id }, data: {
      status: 'COMPLETED', completedAt: new Date(), earnedScore: result.earnedScore, maxScore: result.maxScore
    } })
    return { ...result, sessionId: id, mode: row.mode, overallPercentage: row.mode === 'research' ? result.overallPercentage : null }
  })
}
export async function getResult(db: Database, id: string, accessToken: string | undefined): Promise<SurveyResult> {
  await assertDatabaseEnvironment(db)
  const row = await sessionRow(db, id, accessToken)
  if (row.status !== 'COMPLETED') throw new SurveyError(409, 'Conclua a sessão para consultar o resultado.')
  const answers = await db.surveyAnswer.findMany({ where: { sessionId: id }, select: { questionId: true, optionId: true } })
  const result = calculateDiagnosticResult(await snapshots(db, id), Object.fromEntries(answers.map(a => [a.questionId,a.optionId])))
  return { ...result, sessionId: id, mode: row.mode, overallPercentage: row.mode === 'research' ? result.overallPercentage : null }
}
