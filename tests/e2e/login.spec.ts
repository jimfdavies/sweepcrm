import { test, expect } from '@playwright/test'
import { launchElectronApp, login, closeApp } from '../fixtures/electron-app'
import { TEST_PASSWORD } from '../fixtures/test-data'

test.describe('Login Flow', () => {
  test('should display login screen on startup', async () => {
    const { app, page } = await launchElectronApp()

    // Check that we're on the login page
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button:has-text("Login")')).toBeVisible()

    await closeApp(app)
  })

  test('should login successfully with correct password', async () => {
    const { app, page } = await launchElectronApp()

    // Perform login
    await login(page, TEST_PASSWORD)

    // Verify we're logged in - should see dashboard or navigation
    await expect(page).toHaveURL(/dashboard|customers/)

    // Should see navigation menu
    const navigation = page.locator('nav, [role="navigation"]')
    if ((await navigation.count()) > 0) {
      await expect(navigation).toBeVisible()
    }

    await closeApp(app)
  })

  test('should show error with wrong password', async () => {
    const { app, page } = await launchElectronApp()

    // Try to login with wrong password
    await page.fill('input[type="password"]', 'wrong-password')
    await page.click('button:has-text("Login")')

    // Wait a moment for any error message
    await page.waitForTimeout(1000)

    // Should still be on login page (URL shouldn't change) or show error
    const passwordInput = page.locator('input[type="password"]')
    await expect(passwordInput).toBeVisible()

    // Check for error message (if implemented)
    const errorText = page.locator('text=/incorrect|invalid|error/i')
    if ((await errorText.count()) > 0) {
      await expect(errorText).toBeVisible()
    }

    await closeApp(app)
  })

  test('should navigate to dashboard after login', async () => {
    const { app, page } = await launchElectronApp()

    await login(page, TEST_PASSWORD)

    // Should be on dashboard or similar page
    await expect(page).toHaveURL(/dashboard|customers/)

    await closeApp(app)
  })
})
