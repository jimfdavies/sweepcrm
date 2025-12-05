import { test, expect } from '../fixtures/electron-app.fixture'

test.describe('App UI', () => {
  test('should display navigation sidebar', async ({ window }) => {
    // Check for sidebar navigation buttons
    const remindersBtn = window.locator('button:has-text("Reminders")')
    const customersBtn = window.locator('button:has-text("Customers")')
    const propertiesBtn = window.locator('button:has-text("Properties")')

    await expect(remindersBtn).toBeVisible()
    await expect(customersBtn).toBeVisible()
    await expect(propertiesBtn).toBeVisible()
  })

  test('should load reminders view by default', async ({ window }) => {
    // Check that the reminders view content is visible
    const remindersHeading = window.locator('h2:has-text("Reminders")')
    await expect(remindersHeading).toBeVisible()

    const descriptionText = window.locator('text=Properties due for cleaning')
    await expect(descriptionText).toBeVisible()
  })

  test('should navigate between views', async ({ window }) => {
    // Click on Customers tab
    await window.click('button:has-text("Customers")')

    // Verify customers view is shown
    const customersHeading = window.locator('h2:has-text("Customers")')
    await expect(customersHeading).toBeVisible()

    // Click on Properties tab
    await window.click('button:has-text("Properties")')

    // Verify properties view is shown
    const propertiesHeading = window.locator('h2:has-text("Properties")')
    await expect(propertiesHeading).toBeVisible()

    // Click back to Reminders
    await window.click('button:has-text("Reminders")')
    const remindersHeading = window.locator('h2:has-text("Reminders")')
    await expect(remindersHeading).toBeVisible()
  })

  test('should have proper styling with Tailwind classes', async ({ window }) => {
    // Check header styling
    const header = window.locator('header')
    const headerClass = await header.getAttribute('class')
    expect(headerClass).toContain('bg-white')
    expect(headerClass).toContain('shadow')

    // Check main content area
    const main = window.locator('main')
    const mainClass = await main.getAttribute('class')
    expect(mainClass).toContain('flex-1')
  })

  test('should take screenshot of reminders view', async ({ window }) => {
    // Ensure we're on the reminders view
    await window.click('button:has-text("Reminders")')
    await window.waitForLoadState('networkidle')

    // Take screenshot
    await window.screenshot({ path: 'tests/screenshots/reminders-view.png' })
  })

  test('should take screenshot of customers view', async ({ window }) => {
    // Navigate to customers view
    await window.click('button:has-text("Customers")')
    await window.waitForLoadState('networkidle')

    // Take screenshot
    await window.screenshot({ path: 'tests/screenshots/customers-view.png' })
  })

  test('should take screenshot of properties view', async ({ window }) => {
    // Navigate to properties view
    await window.click('button:has-text("Properties")')
    await window.waitForLoadState('networkidle')

    // Take screenshot
    await window.screenshot({ path: 'tests/screenshots/properties-view.png' })
  })

  test('should display responsive layout', async ({ window }) => {
    // Verify layout is visible
    const sidebar = window.locator('aside')
    await expect(sidebar).toBeVisible()

    const main = window.locator('main')
    await expect(main).toBeVisible()

    // Verify flex layout is working
    const flexContainer = window.locator('div.flex')
    const count = await flexContainer.count()
    expect(count).toBeGreaterThan(0)
  })
})
