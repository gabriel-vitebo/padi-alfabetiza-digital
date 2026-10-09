import { createDatabase, assertDatabaseEnvironment } from '../server/db/client'
import { assertDevelopmentSeed } from '../server/domain/environment'
import { startSession, submitSession } from '../server/domain/sessions'
import { contextualOptions, type Profile } from '../shared/config'
assertDevelopmentSeed()
const sql = createDatabase(true)
try {
  await assertDatabaseEnvironment(sql)
  const count = await sql.surveySession.count({ where: { synthetic: true } })
  if (count > 0) {
    console.info('Dados fictícios já presentes; nenhuma duplicação criada.')
  } else {
    // Four profiles of access/autonomy, with varied courses and semesters.
    for (let i = 0; i < 160; i++) {
      const group = i % 4
      const profile: Profile = {
        course: contextualOptions.course[Math.floor(i / 4) % 5]!.value,
        semester: String(Math.floor(i / 20) + 1),
        device: ['celular','computador','tablet','outro'][group]!,
        internet: ['irregular','limitada','regular','regular'][group]!,
        help: ['frequentemente','as-vezes','raramente','nunca'][group]!
      }
      const session = await startSession(sql, 'research', profile, true)
      await submitSession(sql, session.sessionId, session.questions.map((q,j) => ({
        questionId: q.id, optionId: ((i * 13 + j * 7) % 10 < 3 + group) ? 'A' : ((i+j)%3 === 0 ? 'C' : 'B')
      })), session.accessToken)
    }
    console.info('160 participações fictícias criadas. Não interpretar como evidência científica.')
  }
} finally { await sql.$disconnect() }
