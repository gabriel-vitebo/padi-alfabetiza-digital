import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { createDatabase, assertDatabaseEnvironment } from '../server/db/client'
import { databaseUrl, getEnvironment, assertLocalReset } from '../server/domain/environment'

const command = process.argv[2]
if (!['dev', 'deploy', 'baseline', 'studio'].includes(command ?? '')) throw new Error('Comando Prisma inválido')
if (command === 'dev' || command === 'studio') assertLocalReset()
const url = databaseUrl(true)
if (getEnvironment() !== 'local' && process.env.CONFIRM_DATABASE_ENV !== getEnvironment()) throw new Error('Confirme o ambiente remoto com CONFIRM_DATABASE_ENV igual a APP_ENV antes de executar migrations')
if (getEnvironment() !== 'local' && !process.env.DATABASE_MIGRATION_URL) throw new Error('Configure DATABASE_MIGRATION_URL direta/session pooler para comandos administrativos remotos')
const db = createDatabase(true)
try {
  try { await assertDatabaseEnvironment(db) }
  catch (error) {
    // Only a missing environment table is valid for first-time provisioning.
    if ((error as { code?: string }).code !== 'P2021') {
      const exists = await db.environment.findUnique({ where: { singleton: true } })
      if (exists || (command !== 'deploy' && command !== 'dev')) throw error
    }
  }
  if (command === 'baseline') {
    await assertDatabaseEnvironment(db)
    // Administrative legacy verification only; never accepts user SQL or connection input.
    const history = await db.$queryRaw<{ name: string; checksum: string }[]>`SELECT name,checksum FROM padi.migrations`
    const source = await readFile('prisma/migrations/20261007000000_legacy_baseline/migration.sql', 'utf8')
    const checksum = createHash('sha256').update(source).digest('hex')
    if (history.length !== 1 || history[0]?.name !== '001_initial.sql' || history[0]?.checksum !== checksum)
      throw new Error('Baseline exige exatamente a migration legada conhecida. Revise o schema antes de continuar.')
  }
} finally { await db.$disconnect() }
const args = command === 'baseline' ? ['migrate', 'resolve', '--applied', '20261007000000_legacy_baseline']
  : command === 'studio' ? ['studio', '--browser', 'none']
  : ['migrate', command!, ...process.argv.slice(3)]
const result = spawnSync(process.execPath, ['node_modules/prisma/build/index.js', ...args], {
  stdio: 'inherit', env: { ...process.env, DATABASE_MIGRATION_URL: url }
})
if (result.error) throw result.error
process.exitCode = result.status ?? 1
if (result.status === 0 && (command === 'deploy' || command === 'dev')) {
  const initialized = createDatabase(true)
  try {
    await initialized.environment.upsert({ where: { singleton: true }, create: { environment: getEnvironment() }, update: {} })
    await assertDatabaseEnvironment(initialized)
  } finally { await initialized.$disconnect() }
}
