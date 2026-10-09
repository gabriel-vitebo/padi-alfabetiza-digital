import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient, type Prisma } from '../generated/prisma/client'
import { databaseUrl, getEnvironment } from '../domain/environment'
export type Database = PrismaClient
export type Transaction = Prisma.TransactionClient

export function createDatabase(migration = false) {
  const adapter = new PrismaPg({
    connectionString: databaseUrl(migration), max: 2,
    idleTimeoutMillis: 20_000, connectionTimeoutMillis: 10_000,
    maxLifetimeSeconds: 300,
    ssl: getEnvironment() === 'local' ? false : { rejectUnauthorized: true },
    application_name: `padi-${getEnvironment()}`, statement_timeout: 15_000
  }, { schema: 'padi' })
  return new PrismaClient({ adapter, transactionOptions: { maxWait: 10_000, timeout: 30_000 } })
}
// Survives Nitro development reloads and reuses the pool in warm serverless instances.
const globalPrisma = globalThis as unknown as { padiPrisma?: Database }
export function getDatabase() { return globalPrisma.padiPrisma ??= createDatabase() }
export async function assertDatabaseEnvironment(db: Database | Transaction) {
  const row = await db.environment.findFirst({ where: { singleton: true } })
  if (row?.environment !== getEnvironment()) throw new Error('Banco pertence a outro ambiente')
}
