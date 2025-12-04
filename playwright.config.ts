import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
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
  ],
  connectOptions: {
    wsEndpoint: 'ws://127.0.0.1:9223/ws',
    headers: {
      'x-mcp-token': 'your-mcp-token'
    },
    timeout: 10000
  }
})
