import { defineConfig, devices } from '@playwright/test'
import { resolve } from 'path'

/**
 * Playwright configuration for Electron app testing.
 * Uses Playwright's experimental Electron support via Chrome DevTools Protocol.
 *
 * Key features:
 * - Launches app from built output (./out/main/index.js)
 * - Records videos and traces for debugging
 * - Screenshots on failure for visual regression detection
 * - Single worker in CI to avoid race conditions
 */
export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  
  // Parallel execution in dev, serial in CI
  fullyParallel: !process.env['CI'],
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,

  // Reporting
  reporter: [
    ['html'],
    ['list']
  ],

  // Timeouts
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },

  // Global settings
  use: {
    // Screenshot/video settings for visual debugging
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry'
  },

  // Project configurations
  projects: [
    {
      name: 'Electron',
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ],

  // Global setup/teardown
  globalSetup: undefined,
  globalTeardown: undefined,

  // Output directories
  outputDir: 'test-results',
  snapshotDir: 'tests/snapshots',
  snapshotPathTemplate: '{snapshotDir}/{testFileDir}/{testFileName}-{platform}{ext}'
})
