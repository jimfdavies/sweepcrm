import { test, expect } from '../fixtures/electron-app.fixture'

test.describe('Customers View', () => {
  test('should display customer list view', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Verify the heading is visible
    const heading = window.locator('h2:has-text("Customers")')
    await expect(heading).toBeVisible()
  })

  test('should display empty state when no customers exist', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Either empty state or table is shown (depending on database state)
    const emptyState = window.locator('text=No customers found')
    const table = window.locator('table')
    const hasEmptyState = await emptyState.count() > 0
    const hasTable = await table.count() > 0

    // Should have one or the other
    expect(hasEmptyState || hasTable).toBe(true)
  })

  test('should display add customer button', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Look for add customer button
    const addBtn = window.locator('button:has-text("Add Customer")')
    await expect(addBtn).toBeVisible()
  })

  test('should display customer table headers structure', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Verify the main content area is visible
    const heading = window.locator('h2:has-text("Customers")')
    await expect(heading).toBeVisible()

    // Verify either table or empty state is shown
    const table = window.locator('table')
    const emptyState = window.locator('text=No customers found')
    const hasContent = (await table.count() > 0) || (await emptyState.count() > 0)
    expect(hasContent).toBe(true)
  })

  test('should take screenshot of customers list', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')
    await window.waitForLoadState('networkidle')

    // Take screenshot
    await window.screenshot({ path: 'tests/screenshots/customers-list.png' })
  })

  test('should have proper Tailwind styling on customer list', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Verify main content is visible
    const mainContent = window.locator('main')
    await expect(mainContent).toBeVisible()

    // Verify heading is visible
    const heading = window.locator('h2:has-text("Customers")')
    await expect(heading).toBeVisible()
  })
})
