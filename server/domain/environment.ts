export type AppEnvironment = 'local' | 'homolog' | 'production'
export function getEnvironment(env: NodeJS.ProcessEnv = process.env): AppEnvironment {
  const value = env.APP_ENV
  if (value !== 'local' && value !== 'homolog' && value !== 'production') throw new Error('Configure APP_ENV: local, homolog ou production')
  if (env.VERCEL_ENV === 'production' && value !== 'production') throw new Error('Vercel Production exige APP_ENV=production')
  if (env.VERCEL_ENV === 'preview' && value !== 'homolog') throw new Error('Vercel Preview exige APP_ENV=homolog')
  return value
}
export function assertDevelopmentSeed(env = getEnvironment()) {
  if (env !== 'local' && env !== 'homolog') throw new Error('Seed fictício proibido neste ambiente')
}
export function assertLocalReset(env = getEnvironment()) {
  if (env !== 'local') throw new Error('Reset permitido somente em local')
}
export function databaseUrl(migration = false) {
  const env = getEnvironment()
  const value = (migration && process.env.DATABASE_MIGRATION_URL) || process.env.DATABASE_URL
  if (!value) throw new Error('Configure DATABASE_URL')
  const url = new URL(value)
  if (!['postgres:', 'postgresql:'].includes(url.protocol)) throw new Error('Conexão PostgreSQL inválida')
  if (env === 'local' && !['localhost', '127.0.0.1', '[::1]', 'postgres'].includes(url.hostname)) throw new Error('Ambiente local exige banco local')
  return value
}
