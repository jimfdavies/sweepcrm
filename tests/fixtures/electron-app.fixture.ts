import { test as base, _electron as electron } from '@playwright/test'
import { ElectronApplication, Page } from 'playwright'
import { resolve } from 'path'

type ElectronAppFixtures = {
  electronApp: ElectronApplication
  window: Page
}

/**
 * Fixture for launching and managing the Electron app in tests.
 * Automatically handles cleanup and provides console/error logging.
 *
 * Usage:
 * ```ts
 * import { test, expect } from './fixtures/electron-app.fixture'
 *
 * test('example', async ({ electronApp, window }) => {
 *   const title = await window.title()
 *   expect(title).toBe('SweepCRM')
 * })
 * ```
 */
export const test = base.extend<ElectronAppFixtures>({
  electronApp: async ({}, use) => {
    const appMainPath = resolve('./out/main/index.js')

    // Launch the app pointing to the main.js entry point
    let electronApp: ElectronApplication | null = null
    try {
      electronApp = await electron.launch({
        args: [appMainPath],
        timeout: 30000,
        env: {
          ...process.env,
          PLAYWRIGHT_TEST: 'true'
        }
      })

      // Setup console logging from main process
      electronApp.on('console', async (msg) => {
        const args = msg.args()
        const values = []
        for (const arg of args) {
          try {
            values.push(await arg.jsonValue())
          } catch {
            values.push('[Unserializable]')
          }
        }
        console.log('[Electron Main]', ...values)
      })

      // Log uncaught exceptions in main process
      electronApp.on('close', () => {
        console.log('[Test] Electron app closed')
      })

      await use(electronApp)
    } finally {
      // Cleanup: close the app after test
      if (electronApp) {
        try {
          await electronApp.close()
        } catch (error) {
          // App may already be closed or had issues during shutdown
          console.warn('[Test] Error closing app:', error instanceof Error ? error.message : String(error))
        }
      }
    }
  },

  window: async ({ electronApp }, use) => {
    if (!electronApp) {
      throw new Error('electronApp fixture is required')
    }

    // Wait for the first window to open and return it as a Page
    let window: Page | null = null
    try {
      window = await electronApp.firstWindow({
        timeout: 10000
      })

      // Setup console logging from renderer process
      window.on('console', (msg) => {
        console.log('[Renderer]', msg.text())
      })

      // Log renderer errors
      window.on('pageerror', (error) => {
        console.error('[Renderer Error]', error)
      })

      await use(window)
    } finally {
      // Note: window is automatically closed when electronApp is closed
      if (window && !window.isClosed()) {
        try {
          await window.close()
        } catch (error) {
          console.warn('[Test] Error closing window:', error instanceof Error ? error.message : String(error))
        }
      }
    }
  }
})

export { expect } from '@playwright/test'
