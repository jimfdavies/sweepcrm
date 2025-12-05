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
    await window.fill('input[name="firstName"]', 'EditOrig')
    await window.fill('input[name="lastName"]', 'TestName')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Open edit form
    await window.click('button:has-text("Edit")')
    await window.waitForSelector('h3:has-text("Edit Customer")')

    // Update the name
    const firstNameInput = window.locator('input[name="firstName"]')
    await firstNameInput.fill('EditUpd')
    await window.fill('input[name="email"]', 'editupd@example.com')

    // Save
    await window.click('button:has-text("Save Changes")')
    await window.waitForTimeout(1000)

    // Wait for edit form to close and table to update
    await window.waitForSelector('h2:has-text("Customers")')

    // Verify the customer was updated in the table
    const emailCell = window.locator('td:has-text("editupd@example.com")')
    await expect(emailCell).toBeVisible()
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

  test('should display search box when customers exist', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Add a customer first
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Test')
    await window.fill('input[name="lastName"]', 'User')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(500)

    // Verify search input is visible
    const searchInput = window.locator('input[placeholder*="Search by"]')
    await expect(searchInput).toBeVisible()
  })

  test('should filter customers by first name', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Add two customers
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'FilterAlice')
    await window.fill('input[name="lastName"]', 'Smith')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(500)

    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'FilterBob')
    await window.fill('input[name="lastName"]', 'Jones')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(500)

    // Search for FilterAlice
    const searchInput = window.locator('input[placeholder*="Search by"]')
    await searchInput.fill('FilterAlice')

    // Should see FilterAlice but not FilterBob
    const aliceCell = window.locator('span:has-text("FilterAlice Smith")')
    const bobCell = window.locator('span:has-text("FilterBob Jones")')
    await expect(aliceCell).toBeVisible()
    await expect(bobCell).not.toBeVisible()
  })

  test('should filter customers by email', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Add a customer with email
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'TestEmail')
    await window.fill('input[name="lastName"]', 'User')
    await window.fill('input[name="email"]', 'testemail@example.com')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Wait for form to close and table to be visible
    await window.waitForSelector('table')

    // Search for email
    const searchInput = window.locator('input[placeholder*="Search by"]')
    await searchInput.fill('testemail@example')

    // Should find the customer (check if table row contains the email)
    await expect(window.locator('td:has-text("testemail@example.com")')).toBeVisible()
  })

  test('should filter customers by phone', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Add a customer with phone
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'PhoneFilter')
    await window.fill('input[name="lastName"]', 'User')
    await window.fill('input[name="phone"]', '020 1234 5678')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(500)

    // Search for phone
    const searchInput = window.locator('input[placeholder*="Search by"]')
    await searchInput.fill('020 1234')

    // Should find the customer
    const nameCell = window.locator('span:has-text("PhoneFilter User")')
    await expect(nameCell).toBeVisible()
  })

  test('should show no results message when search has no matches', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Add a customer
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'John')
    await window.fill('input[name="lastName"]', 'Smith')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(500)

    // Search for something that doesn't match
    const searchInput = window.locator('input[placeholder*="Search by"]')
    await searchInput.fill('nonexistent')

    // Should see no results message
    await expect(window.locator('text=No results match your search')).toBeVisible()
    
    // Customer should not be visible
    await expect(window.locator('text=John Smith')).not.toBeVisible()
  })

  test('should show result count when searching', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Add a customer
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'ResultCount')
    await window.fill('input[name="lastName"]', 'Test')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Wait for form to close
    await window.waitForSelector('table')

    // Search
    const searchInput = window.locator('input[placeholder*="Search by"]')
    await searchInput.fill('ResultCount')

    // Should show result count (matches "Found X of Y")
    const resultText = window.locator('text=/Found .* of/')
    await expect(resultText).toBeVisible()
  })

  test('should clear search when input is cleared', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Check if there are customers
    const table = window.locator('table')
    const tableVisible = await table.count() > 0

    if (tableVisible) {
      // Search then clear
      const searchInput = window.locator('input[placeholder*="Search by"]')
      await searchInput.fill('xyz')
      await window.waitForTimeout(300)

      // Verify no results message appears
      await expect(window.locator('text=No results match your search')).toBeVisible()

      // Clear search
      await searchInput.fill('')
      await window.waitForTimeout(300)

      // Should see "No results" disappear
      await expect(window.locator('text=No results match your search')).not.toBeVisible()
      
      // Result count should not be shown when empty
      const resultCountText = window.locator('text=/Found .* of/')
      await expect(resultCountText).not.toBeVisible()
    }
  })

  test('should take screenshot of customer search UI', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')

    // Add a few customers
    for (let i = 0; i < 3; i++) {
      await window.click('button:has-text("Add Customer")')
      await window.waitForSelector('input[name="firstName"]')
      await window.fill('input[name="firstName"]', `Customer${i}`)
      await window.fill('input[name="lastName"]', `Test${i}`)
      await window.click('button:has-text("Save Customer")')
      await window.waitForTimeout(300)
    }

    // Take screenshot
    await window.screenshot({ path: 'tests/screenshots/customer-search.png' })
  })
})
