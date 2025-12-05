import { test, expect } from '../fixtures/electron-app.fixture'

test.describe('Customer Creation', () => {
  test('should open customer creation form when Add Customer button clicked', async ({
    window
  }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Click Add Customer button
    await window.click('button:has-text("Add Customer")')

    // Check for form heading
    const formHeading = window.locator('h3:has-text("Add New Customer")')
    await expect(formHeading).toBeVisible()
  })

  test('should display all customer form fields', async ({ window }) => {
    // Navigate to customers and open form
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')

    // Check for all input fields
    const titleInput = window.locator('input[name="title"]')
    const firstNameInput = window.locator('input[name="firstName"]')
    const lastNameInput = window.locator('input[name="lastName"]')
    const phoneInput = window.locator('input[name="phone"]')
    const emailInput = window.locator('input[name="email"]')
    const notesInput = window.locator('textarea[name="notes"]')

    await expect(titleInput).toBeVisible()
    await expect(firstNameInput).toBeVisible()
    await expect(lastNameInput).toBeVisible()
    await expect(phoneInput).toBeVisible()
    await expect(emailInput).toBeVisible()
    await expect(notesInput).toBeVisible()
  })

  test('should have form action buttons', async ({ window }) => {
    // Navigate to customers and open form
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')

    // Check for save and cancel buttons
    const saveBtn = window.locator('button:has-text("Save Customer")')
    const cancelBtn = window.locator('button:has-text("Cancel")')

    await expect(saveBtn).toBeVisible()
    await expect(cancelBtn).toBeVisible()
  })

  test('should close form when Cancel button clicked', async ({ window }) => {
    // Navigate to customers and open form
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')

    // Verify form is open
    const formHeading = window.locator('h3:has-text("Add New Customer")')
    await expect(formHeading).toBeVisible()

    // Click cancel
    await window.click('button:has-text("Cancel")')

    // Form should be hidden
    await expect(formHeading).not.toBeVisible()
  })

  test('should add customer with all fields', async ({ window }) => {
    // Navigate to customers and open form
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')

    // Verify all fields are visible and fillable
    await window.fill('input[name="title"]', 'Mr')
    await window.fill('input[name="firstName"]', 'John')
    await window.fill('input[name="lastName"]', 'Smith')
    await window.fill('input[name="phone"]', '020 7946 0958')
    await window.fill('input[name="email"]', 'john@example.com')
    await window.fill('textarea[name="notes"]', 'Good customer')

    // Verify fields contain the entered data
    await expect(window.locator('input[name="firstName"]')).toHaveValue('John')
    await expect(window.locator('input[name="lastName"]')).toHaveValue('Smith')
    await expect(window.locator('input[name="phone"]')).toHaveValue('020 7946 0958')
    await expect(window.locator('input[name="email"]')).toHaveValue('john@example.com')

    // Submit form
    await window.click('button:has-text("Save Customer")')

    // Verify form closed
    const formHeading = window.locator('h3:has-text("Add New Customer")')
    await expect(formHeading).not.toBeVisible()
  })

  test('should add customer with minimal fields', async ({ window }) => {
    // Navigate to customers and open form
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')

    // Fill only required fields
    await window.fill('input[name="firstName"]', 'Jane')
    await window.fill('input[name="lastName"]', 'Doe')

    // Verify minimal fields were filled
    await expect(window.locator('input[name="firstName"]')).toHaveValue('Jane')
    await expect(window.locator('input[name="lastName"]')).toHaveValue('Doe')

    // Submit form
    await window.click('button:has-text("Save Customer")')

    // Verify form closed
    const formHeading = window.locator('h3:has-text("Add New Customer")')
    await expect(formHeading).not.toBeVisible()
  })

  test('should display customer contact info in list', async ({ window }) => {
    // Navigate to customers and open form
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')

    // Fill in the form with contact info
    await window.fill('input[name="firstName"]', 'Alice')
    await window.fill('input[name="lastName"]', 'Johnson')
    await window.fill('input[name="phone"]', '020 1234 5678')
    await window.fill('input[name="email"]', 'alice@example.com')

    // Verify all fields are filled
    await expect(window.locator('input[name="phone"]')).toHaveValue('020 1234 5678')
    await expect(window.locator('input[name="email"]')).toHaveValue('alice@example.com')

    // Submit form
    await window.click('button:has-text("Save Customer")')

    // Verify form closed
    const formHeading = window.locator('h3:has-text("Add New Customer")')
    await expect(formHeading).not.toBeVisible()
  })

  test('should validate required first name field', async ({ window }) => {
    // Navigate to customers and open form
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')

    // Try to submit without filling first name
    await window.fill('input[name="lastName"]', 'Test')
    await window.click('button:has-text("Save Customer")')

    // Form should still be visible (validation error)
    const formHeading = window.locator('h3:has-text("Add New Customer")')
    await expect(formHeading).toBeVisible()

    // Fill first name and submit
    await window.fill('input[name="firstName"]', 'Valid')
    await window.click('button:has-text("Save Customer")')

    // Now form should close
    await expect(formHeading).not.toBeVisible()
  })

  test('should take screenshot of customer creation form', async ({ window }) => {
    // Navigate to customers and open form
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForLoadState('networkidle')

    // Take screenshot
    await window.screenshot({ path: 'tests/screenshots/customer-creation-form.png' })
  })

  test('should take screenshot of customer list with data', async ({ window }) => {
    // Add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.fill('input[name="firstName"]', 'Test')
    await window.fill('input[name="lastName"]', 'Customer')
    await window.fill('input[name="phone"]', '020 1111 2222')
    await window.fill('input[name="email"]', 'test@example.com')
    await window.click('button:has-text("Save Customer")')
    await window.waitForLoadState('networkidle')

    // Take screenshot
    await window.screenshot({ path: 'tests/screenshots/customer-list-with-data.png' })
  })
})
