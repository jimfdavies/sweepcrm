import { test, expect } from '../fixtures/electron-app.fixture'

test.describe('Reminders Page', () => {
  test('should navigate to reminders page', async ({ window }) => {
    await window.click('button:has-text("Reminders")')
    await new Promise(r => setTimeout(r, 1000))

    // Verify page title is visible
    const title = window.locator('h2:has-text("Reminders")')
    await expect(title).toBeVisible()

    // Verify subtitle is visible
    const subtitle = window.locator('text="Properties due for cleaning in the next 12 months"')
    await expect(subtitle).toBeVisible()

    // Take screenshot for visual verification
    await window.screenshot({ path: 'tests/screenshots/reminders-page.png' })
  })
})
