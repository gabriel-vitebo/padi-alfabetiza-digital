import { defineConfig } from '@playwright/test'
import { getEnvironment } from './server/domain/environment'
if (getEnvironment() !== 'local' || !new URL(process.env.DATABASE_URL!).pathname.endsWith('_test')) throw new Error('E2E exige APP_ENV=local e banco local terminado em _test')
export default defineConfig({
  testDir: './tests/e2e', timeout: 60000, workers: 1,
  use: { baseURL: 'http://127.0.0.1:3107', headless: true, ...(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {}), trace: 'retain-on-failure' },
  webServer: { command: 'node .output/server/index.mjs', url: 'http://127.0.0.1:3107', reuseExistingServer: false, env: { PORT: '3107', HOST: '127.0.0.1' } }
})
