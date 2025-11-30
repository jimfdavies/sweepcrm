import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  workers: 1, // Electron tests must run sequentially
  use: {
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'electron',
      use: {
        // We will launch the app manually in the test
      }
    }
  ]
})
