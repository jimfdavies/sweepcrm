import { test, expect } from './fixtures/electron-app.fixture'

test.describe('Electron App', () => {
  test('should launch the app and display the welcome screen', async ({ electronApp, window }) => {
    // Verify the app process is running
    const isPackaged = await electronApp.evaluate(async ({ app }) => {
      return app.isPackaged
    })
    expect(isPackaged).toBe(false) // In development mode

    // Verify the window is open
    expect(window).toBeDefined()

    // Verify the title contains "SweepCRM"
    const title = await window.title()
    expect(title).toBe('SweepCRM')
  })

  test('should display the welcome message', async ({ window }) => {
    // Look for the main heading
    const heading = window.locator('h1')
    await expect(heading).toContainText('SweepCRM')

    // Look for the subheading in the header
    const subheading = window.locator('header p.text-gray-600')
    await expect(subheading).toContainText('Chimney Sweep')
  })

  test('should take a screenshot of the app', async ({ window }) => {
    // Take a screenshot for visual verification
    await window.screenshot({ path: 'tests/screenshots/app-launch.png' })
  })
})
