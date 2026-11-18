import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, type Prisma } from '../generated/prisma/client'
import { databaseUrl, getEnvironment } from '../domain/environment'
import { readFileSync } from 'node:fs'
export type Database = PrismaClient
export type Transaction = Prisma.TransactionClient

export function createDatabase(migration = false) {
  const environment = getEnvironment()
  const connection = new URL(databaseUrl(migration))
  const caPath = connection.searchParams.get('sslrootcert')
  let ca = process.env.DATABASE_SSL_CA_B64
    ? Buffer.from(process.env.DATABASE_SSL_CA_B64, 'base64').toString('utf8')
    : caPath ? readFileSync(caPath, 'utf8') : undefined
  if (ca && !ca.includes('-----BEGIN CERTIFICATE-----')) {
    throw new Error('DATABASE_SSL_CA_B64 não contém um certificado PEM válido')
  }
  connection.searchParams.delete('sslmode')
  connection.searchParams.delete('sslrootcert')
  const adapter = new PrismaPg({
    connectionString: connection.toString(), max: 2,
    idleTimeoutMillis: 20_000, connectionTimeoutMillis: 10_000,
    maxLifetimeSeconds: 300,
    // Enforce verified TLS through pg itself; do not rely on sslmode surviving
    // deployment environment-variable handling in the connection URL.
    ssl: environment === 'local' ? false : { rejectUnauthorized: true, ...(ca ? { ca } : {}) },
    application_name: `padi-${environment}`, statement_timeout: 15_000
  }, { schema: 'padi' })
  return new PrismaClient({ adapter, transactionOptions: { maxWait: 10_000, timeout: 30_000 } })
}
// Survives Nitro development reloads and reuses the pool in warm serverless instances.
const globalPrisma = globalThis as unknown as { padiPrisma?: Database }
export function getDatabase() { return globalPrisma.padiPrisma ??= createDatabase() }
export async function assertDatabaseEnvironment(db: Database | Transaction) {
  const environment = getEnvironment()
  const row = await db.environment.findFirst({ where: { singleton: true } })
  if (row?.environment !== environment) {
    const target = new URL(databaseUrl())
    console.error('[db] Environment marker mismatch', {
      expected: environment,
      actual: row?.environment ?? 'missing',
      databaseHost: target.hostname,
      databaseProjectRef: target.username.split('.')[1] ?? 'unscoped'
    })
    throw new Error('Banco pertence a outro ambiente')
  }
  if (environment === 'production') {
    const syntheticCount = await db.surveySession.count({ where: { synthetic: true } })
    if (syntheticCount > 0) throw new Error('Banco de produção contém participações sintéticas')
  }
}
