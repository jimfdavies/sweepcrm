import { test, expect } from '../fixtures/electron-app.fixture'

test.describe('Properties View', () => {
  test('should display properties view with customer selector', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // Verify the heading is visible
    const heading = window.locator('h3:has-text("Select a Customer")')
    await expect(heading).toBeVisible()
  })

  test('should display customer search box', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // Look for the customer search input
    const searchInput = window.locator('input[placeholder*="Search customers"]')
    await expect(searchInput).toBeVisible()
  })

  test('should display customer list', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // First add a customer via Customers view
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'ListTest')
    await window.fill('input[name="lastName"]', 'User')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1500)

    // Now go back to properties
    await window.click('button:has-text("Properties")')
    await window.waitForSelector('h3:has-text("Select a Customer")')
    await window.waitForTimeout(500)

    // Should see the customer in the list
    const customerButton = window.locator('button:has-text("ListTest User")')
    await expect(customerButton).toBeVisible()
  })

  test('should select a customer and show properties panel', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // First add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'PropTest')
    await window.fill('input[name="lastName"]', 'User')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Now go back to properties
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)

    // Click on the customer
    const customerButton = window.locator('button:has-text("PropTest User")')
    await customerButton.click()

    // Should see the properties panel header
    const propertiesHeading = window.locator('h3:has-text("Properties for PropTest User")')
    await expect(propertiesHeading).toBeVisible()
  })

  test('should show empty state when customer has no properties', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // First add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'NoProps')
    await window.fill('input[name="lastName"]', 'User')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Now go back to properties
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)

    // Click on the customer
    const customerButton = window.locator('button:has-text("NoProps User")')
    await customerButton.click()

    // Should see empty state
    const emptyStateText = window.locator('text=No properties found')
    await expect(emptyStateText).toBeVisible()
  })

  test('should filter customers by name in selector', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // First add two customers
    await window.click('button:has-text("Customers")')
    
    // Add first customer
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Alice')
    await window.fill('input[name="lastName"]', 'Properties')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(500)

    // Add second customer
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Bob')
    await window.fill('input[name="lastName"]', 'Jones')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Now go back to properties
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)

    // Search for Alice
    const searchInput = window.locator('input[placeholder*="Search customers"]')
    await searchInput.fill('Alice')

    // Should see Alice
    const aliceBtn = window.locator('button:has-text("Alice Properties")')
    await expect(aliceBtn).toBeVisible()

    // Should not see Bob
    const bobBtn = window.locator('button:has-text("Bob Jones")')
    await expect(bobBtn).not.toBeVisible()
  })

  test('should highlight selected customer', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // First add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Select')
    await window.fill('input[name="lastName"]', 'Test')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Now go back to properties
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)

    // Click on the customer
    const customerButton = window.locator('button:has-text("Select Test")')
    await customerButton.click()

    // The button should have the blue background class
    const selectedClass = await customerButton.getAttribute('class')
    expect(selectedClass).toContain('bg-blue-50')
  })

  test('should take screenshot of properties list view', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')
    await window.waitForLoadState('networkidle')

    // Take screenshot
    await window.screenshot({ path: 'tests/screenshots/properties-view.png' })
  })
})
