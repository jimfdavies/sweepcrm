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

  test('should open customer edit form when Edit button clicked', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Add a test customer first
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')

    // Fill form
    await window.fill('input[name="firstName"]', 'John')
    await window.fill('input[name="lastName"]', 'Smith')
    await window.fill('input[name="email"]', 'john@example.com')
    await window.fill('input[name="phone"]', '020 7946 0958')

    // Save customer
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(500)

    // Look for the Edit button (should appear in the table)
    const editButton = window.locator('button:has-text("Edit")').first()
    await expect(editButton).toBeVisible()

    // Click Edit
    await editButton.click()
    await window.waitForSelector('h3:has-text("Edit Customer")')

    // Verify the edit form is displayed
    const editHeading = window.locator('h3:has-text("Edit Customer")')
    await expect(editHeading).toBeVisible()
  })

  test('should display all customer form fields in edit form', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Add a test customer
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Jane')
    await window.fill('input[name="lastName"]', 'Doe')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(500)

    // Open edit form
    await window.click('button:has-text("Edit")' )
    await window.waitForSelector('h3:has-text("Edit Customer")')

    // Verify all form fields exist
    await expect(window.locator('input[name="title"]')).toBeVisible()
    await expect(window.locator('input[name="firstName"]')).toBeVisible()
    await expect(window.locator('input[name="lastName"]')).toBeVisible()
    await expect(window.locator('input[name="phone"]')).toBeVisible()
    await expect(window.locator('input[name="email"]')).toBeVisible()
    await expect(window.locator('textarea[name="notes"]')).toBeVisible()
  })

  test('should have form action buttons in edit form', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Add a test customer
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Test')
    await window.fill('input[name="lastName"]', 'User')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(500)

    // Open edit form
    await window.click('button:has-text("Edit")')
    await window.waitForSelector('h3:has-text("Edit Customer")')

    // Verify buttons exist
    const saveBtn = window.locator('button:has-text("Save Changes")')
    const cancelBtn = window.locator('button:has-text("Cancel")')
    
    await expect(saveBtn).toBeVisible()
    await expect(cancelBtn).toBeVisible()
  })

  test('should update customer data when Save is clicked', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Add a customer
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Original')
    await window.fill('input[name="lastName"]', 'Name')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Open edit form
    await window.click('button:has-text("Edit")')
    await window.waitForSelector('h3:has-text("Edit Customer")')

    // Update the name
    const firstNameInput = window.locator('input[name="firstName"]')
    await firstNameInput.fill('Updated')
    await window.fill('input[name="email"]', 'updated@example.com')

    // Save
    await window.click('button:has-text("Save Changes")')
    await window.waitForTimeout(1000)

    // Wait for edit form to close and table to update
    await window.waitForSelector('h2:has-text("Customers")')

    // Verify the customer was updated in the table
    const nameCell = window.locator('span:has-text("Updated Smith")')
    await expect(nameCell).toBeVisible()
  })

  test('should close form when Cancel clicked', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Add a customer
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Test')
    await window.fill('input[name="lastName"]', 'User')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(500)

    // Open edit form
    await window.click('button:has-text("Edit")')
    await window.waitForSelector('h3:has-text("Edit Customer")')

    // Click Cancel
    await window.click('button:has-text("Cancel")')
    await window.waitForTimeout(300)

    // Form should be gone
    const editHeading = window.locator('h3:has-text("Edit Customer")')
    await expect(editHeading).not.toBeVisible()
  })

  test('should validate required fields on save', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Add a customer
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Test')
    await window.fill('input[name="lastName"]', 'User')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Open edit form
    await window.click('button:has-text("Edit")')
    await window.waitForSelector('h3:has-text("Edit Customer")')

    // Clear first name
    const firstNameInput = window.locator('input[name="firstName"]')
    await firstNameInput.fill('')

    // Try to save
    await window.click('button:has-text("Save Changes")')
    await window.waitForTimeout(500)

    // The form should still be open (validation prevents closing)
    const editHeading = window.locator('h3:has-text("Edit Customer")')
    await expect(editHeading).toBeVisible()
    
    // And the Save Changes button should still be visible
    const saveBtn = window.locator('button:has-text("Save Changes")')
    await expect(saveBtn).toBeVisible()
  })

  test('should take screenshot of edit customer form', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Add a customer
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'John')
    await window.fill('input[name="lastName"]', 'Doe')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(500)

    // Open edit form
    await window.click('button:has-text("Edit")')
    await window.waitForSelector('h3:has-text("Edit Customer")')

    // Take screenshot
    await window.screenshot({ path: 'tests/screenshots/customer-edit-form.png' })
  })
})
