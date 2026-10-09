import 'dotenv/config'
import { readFile } from 'node:fs/promises'
import { createDatabase, assertDatabaseEnvironment } from '../server/db/client'
import { getEnvironment } from '../server/domain/environment'
import { diagnosticQuestions } from '../server/db/questions'
import { competencyIds, competencyLabels } from '../shared/diagnostic'
import { contextualOptions } from '../shared/config'
const source = await readFile('banco-questoes-padi.md', 'utf8')
const db = createDatabase(true)
try {
  await db.$transaction(async tx => {
    await tx.environment.upsert({ where: { singleton: true }, create: { environment: getEnvironment() }, update: {} })
    await assertDatabaseEnvironment(tx)
    for (const [i, id] of competencyIds.entries()) {
      const description = source.split(`# Eixo ${i + 1} — `)[1]?.match(/Competência do artigo: (.+)/)?.[1]
      if (!description) throw new Error(`Eixo ausente: ${id}`)
      const data = { label: competencyLabels[id], description }
      await tx.competency.upsert({ where: { id }, create: { id, ...data }, update: data })
    }
    for (const q of diagnosticQuestions) {
      const section = source.split(`## ${q.id} — `)[1]?.split('\n## ')[0]
      const title = section?.split('\n')[0]
      const justification = section?.match(/\*\*Justificativa:\*\* (.+)/)?.[1]
      if (!title || !justification) throw new Error(`Documentação ausente: ${q.id}`)
      const data = { competencyId: q.competency, title, statement: q.statement, justification }
      await tx.question.upsert({ where: { id: q.id }, create: { id: q.id, ...data }, update: data })
      await tx.questionContext.deleteMany({ where: { questionId: q.id } })
      await tx.questionContext.createMany({ data: q.contexts.map(context => ({ questionId: q.id, context })) })
      for (const o of q.options) await tx.questionOption.upsert({
        where: { questionId_id: { questionId: q.id, id: o.id } },
        create: { questionId: q.id, ...o }, update: { label: o.label, score: o.score }
      })
    }
    for (const [kind, options] of Object.entries(contextualOptions)) for (const o of options)
      await tx.profileOption.upsert({ where: { kind_value: { kind, value: o.value } },
        create: { kind, ...o }, update: { label: o.label } })
  })
  console.info('Seed estrutural: 7 competências, 28 questões e 112 alternativas.')
} finally { await db.$disconnect() }
