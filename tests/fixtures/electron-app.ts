import { _electron as electron, ElectronApplication, Page } from '@playwright/test'
import path from 'path'
import fs from 'fs'
import os from 'os'

/**
 * Launch the Electron application for testing
 */
export async function launchElectronApp(): Promise<{ app: ElectronApplication; page: Page }> {
  // Launch Electron app
  const app = await electron.launch({
    args: [path.join(__dirname, '../../out/main/index.js')],
    // Use a temporary user data directory for tests
    env: {
      ...process.env,
      NODE_ENV: 'test'
    }
  })

  // Get the first window
  const page = await app.firstWindow()

  // Wait for the app to be ready
  await page.waitForLoadState('domcontentloaded')

  return { app, page }
}

/**
 * Login to the application
 * @param page Playwright page
 * @param password Password to use (default: test password)
 */
export async function login(page: Page, password = 'test123'): Promise<void> {
  // Wait for password input to be visible
  await page.waitForSelector('input[type="password"]', { timeout: 10000 })

  // Enter password
  await page.fill('input[type="password"]', password)

  // Click login button
  await page.click('button:has-text("Login")')

  // Wait for navigation to dashboard or main app
  await page.waitForURL(/dashboard|customers/, { timeout: 15000 })
}

/**
 * Navigate to a specific page in the app
 */
export async function navigateTo(
  page: Page,
  route: 'dashboard' | 'customers' | 'reminders' | 'settings'
): Promise<void> {
  // Use hash navigation directly as sidebar might not be visible on all pages
  await page.evaluate((r) => {
    window.location.hash = `#/${r}`
  }, route)
  await page.waitForURL(`**/${route}`, { timeout: 5000 })
}

/**
 * Close the Electron app
 */
export async function closeApp(app: ElectronApplication): Promise<void> {
  await app.close()
}

/**
 * Get a clean test database path
 * This creates a temporary database file for testing
 */
export function getTestDBPath(): string {
  const testDir = path.join(os.tmpdir(), 'sweepcrm-test')

  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true })
  }

  return path.join(testDir, 'test-sweepcrm.db')
}

/**
 * Clean up test database
 */
export function cleanupTestDB(): void {
  const testDBPath = getTestDBPath()

  if (fs.existsSync(testDBPath)) {
    fs.unlinkSync(testDBPath)
  }
}
