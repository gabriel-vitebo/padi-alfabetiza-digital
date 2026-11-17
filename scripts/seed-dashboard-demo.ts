import { createDatabase, assertDatabaseEnvironment } from '../server/db/client'
import { assertDevelopmentSeed } from '../server/domain/environment'
import { startSession, submitSession } from '../server/domain/sessions'
import { contextualOptions, type Profile } from '../shared/config'

assertDevelopmentSeed()
const sql = createDatabase()

try {
  await assertDatabaseEnvironment(sql)

  for (const area of contextualOptions.area) {
    const profile: Profile = { area: area.value }
    const count = await sql.surveySession.count({
      where: { mode: 'research', status: 'COMPLETED', synthetic: true, profile: { is: profile } }
    })

    for (let i = count; i < 5; i++) {
      const session = await startSession(sql, 'research', profile, true)
      const answers = session.questions.map(question => ({
        questionId: question.id,
        optionId: question.options[Math.floor(Math.random() * question.options.length)]!.id
      }))
      await submitSession(sql, session.sessionId, answers, session.accessToken)
    }

    console.info(`${area.value}: pelo menos 5 participações sintéticas concluídas.`)
  }
} finally {
  await sql.$disconnect()
}
