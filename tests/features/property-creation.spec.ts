import { test, expect } from '../fixtures/electron-app.fixture'

test.describe('Property Creation', () => {
  test('should open property creation form when Add Property button clicked', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // First add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'PropertyForm')
    await window.fill('input[name="lastName"]', 'Test')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Go back to properties
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)

    // Select the customer
    const customerButton = window.locator('button:has-text("PropertyForm Test")')
    await customerButton.click()
    await window.waitForTimeout(500)

    // Click Add Property button
    await window.click('button:has-text("Add Property")')

    // Verify the form is visible
    const formTitle = window.locator('h3:has-text("Add New Property")')
    await expect(formTitle).toBeVisible()
  })

  test('should display all property form fields', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // Add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'FormFields')
    await window.fill('input[name="lastName"]', 'Test')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Go to properties
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)

    // Select customer
    const customerButton = window.locator('button:has-text("FormFields Test")')
    await customerButton.click()
    await window.waitForTimeout(500)

    // Open form
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')

    // Verify all input fields are present
    const addressLine1 = window.locator('input[name="addressLine1"]')
    const addressLine2 = window.locator('input[name="addressLine2"]')
    const town = window.locator('input[name="town"]')
    const postcode = window.locator('input[name="postcode"]')
    const notes = window.locator('textarea[name="notes"]')

    await expect(addressLine1).toBeVisible()
    await expect(addressLine2).toBeVisible()
    await expect(town).toBeVisible()
    await expect(postcode).toBeVisible()
    await expect(notes).toBeVisible()
  })

  test('should have form action buttons', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // Add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Buttons')
    await window.fill('input[name="lastName"]', 'Test')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Go to properties
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)

    // Select customer
    const customerButton = window.locator('button:has-text("Buttons Test")')
    await customerButton.click()
    await window.waitForTimeout(500)

    // Open form
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')

    // Verify buttons are present
    const cancelBtn = window.locator('button:has-text("Cancel")')
    const saveBtn = window.locator('button:has-text("Save Property")')

    await expect(cancelBtn).toBeVisible()
    await expect(saveBtn).toBeVisible()
  })

  test('should close form when Cancel button clicked', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // Add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Cancel')
    await window.fill('input[name="lastName"]', 'Test')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Go to properties
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)

    // Select customer
    const customerButton = window.locator('button:has-text("Cancel Test")')
    await customerButton.click()
    await window.waitForTimeout(500)

    // Open and close form
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')
    await window.click('button:has-text("Cancel")')

    // Form should be gone
    const formTitle = window.locator('h3:has-text("Add New Property")')
    await expect(formTitle).not.toBeVisible()
  })

  test('should add property with all fields', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // Add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Full')
    await window.fill('input[name="lastName"]', 'Property')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Go to properties
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)

    // Select customer
    const customerButton = window.locator('button:has-text("Full Property")')
    await customerButton.click()
    await window.waitForTimeout(500)

    // Open form
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')

    // Fill in the form with all fields
    await window.fill('input[name="addressLine1"]', '123 Main Street')
    await window.fill('input[name="addressLine2"]', 'Apartment 4B')
    await window.fill('input[name="town"]', 'London')
    await window.fill('input[name="postcode"]', 'SW1A1AA')
    await window.fill('textarea[name="notes"]', 'Victorian property with original features')

    // Wait for postcode validation
    await window.waitForTimeout(500)

    // Submit form
    await window.click('button:has-text("Save Property")')
    await window.waitForTimeout(1500)

    // Verify form is closed
    const formTitle = window.locator('h3:has-text("Add New Property")')
    await expect(formTitle).not.toBeVisible()

    // Verify property appears in the list
    const addressInTable = window.locator('text=123 Main Street')
    await expect(addressInTable).toBeVisible()
  })

  test('should add property with minimal fields', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // Add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Minimal')
    await window.fill('input[name="lastName"]', 'Property')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Go to properties
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)

    // Select customer
    const customerButton = window.locator('button:has-text("Minimal Property")')
    await customerButton.click()
    await window.waitForTimeout(500)

    // Open form
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')

    // Fill in only required fields
    await window.fill('input[name="addressLine1"]', '456 Oak Road')
    await window.fill('input[name="town"]', 'Manchester')

    // Submit form
    await window.click('button:has-text("Save Property")')
    await window.waitForTimeout(1500)

    // Verify form is closed
    const formTitle = window.locator('h3:has-text("Add New Property")')
    await expect(formTitle).not.toBeVisible()

    // Verify property appears in the list
    const addressInTable = window.locator('text=456 Oak Road')
    await expect(addressInTable).toBeVisible()
  })

  test('should validate required address line 1 field', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // Add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Validate')
    await window.fill('input[name="lastName"]', 'Address')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Go to properties
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)

    // Select customer
    const customerButton = window.locator('button:has-text("Validate Address")')
    await customerButton.click()
    await window.waitForTimeout(500)

    // Open form
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')

    // Skip address line 1, fill town only
    await window.fill('input[name="town"]', 'Liverpool')

    // Try to submit
    await window.click('button:has-text("Save Property")')
    await window.waitForTimeout(500)

    // Error message should appear
    const errorMessage = window.locator('text=Address line 1 is required')
    await expect(errorMessage).toBeVisible()
  })

  test('should validate required town field', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // Add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Validate')
    await window.fill('input[name="lastName"]', 'Town')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Go to properties
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)

    // Select customer
    const customerButton = window.locator('button:has-text("Validate Town")')
    await customerButton.click()
    await window.waitForTimeout(500)

    // Open form
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')

    // Fill address line 1 only
    await window.fill('input[name="addressLine1"]', '789 Elm Street')

    // Try to submit
    await window.click('button:has-text("Save Property")')
    await window.waitForTimeout(500)

    // Error message should appear
    const errorMessage = window.locator('text=Town is required')
    await expect(errorMessage).toBeVisible()
  })

  test('should validate UK postcode format', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // Add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Postcode')
    await window.fill('input[name="lastName"]', 'Validate')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Go to properties
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)

    // Select customer
    const customerButton = window.locator('button:has-text("Postcode Validate")')
    await customerButton.click()
    await window.waitForTimeout(500)

    // Open form
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')

    // Fill required fields and invalid postcode
    await window.fill('input[name="addressLine1"]', '999 Test Lane')
    await window.fill('input[name="town"]', 'Bristol')
    await window.fill('input[name="postcode"]', 'INVALID123')

    // Trigger validation
    await window.locator('input[name="postcode"]').blur()
    await window.waitForTimeout(500)

    // Error message should appear
    const errorMessage = window.locator('text=Invalid UK postcode format')
    await expect(errorMessage).toBeVisible()
  })

  test('should format postcode correctly', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // Add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Format')
    await window.fill('input[name="lastName"]', 'Test')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Go to properties
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)

    // Select customer
    const customerButton = window.locator('button:has-text("Format Test")')
    await customerButton.click()
    await window.waitForTimeout(500)

    // Open form
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')

    // Fill postcode without space
    const postcodeInput = window.locator('input[name="postcode"]')
    await postcodeInput.fill('SW1A1AA')
    await postcodeInput.blur()
    await window.waitForTimeout(500)

    // Postcode should be formatted with space
    const postcodeValue = await postcodeInput.inputValue()
    expect(postcodeValue).toBe('SW1A 1AA')
  })

  test('should take screenshot of property creation form', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // Add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Screenshot')
    await window.fill('input[name="lastName"]', 'Form')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Go to properties
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)

    // Select customer
    const customerButton = window.locator('button:has-text("Screenshot Form")')
    await customerButton.click()
    await window.waitForTimeout(500)

    // Open form
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')

    // Take screenshot
    await window.screenshot({ path: 'tests/screenshots/property-creation-form.png' })
  })

  test('should take screenshot of property list after adding property', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')

    // Add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'List')
    await window.fill('input[name="lastName"]', 'Screenshot')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Go to properties
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)

    // Select customer
    const customerButton = window.locator('button:has-text("List Screenshot")')
    await customerButton.click()
    await window.waitForTimeout(500)

    // Add property
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')

    await window.fill('input[name="addressLine1"]', '321 Pine Avenue')
    await window.fill('input[name="town"]', 'Leeds')
    await window.click('button:has-text("Save Property")')
    await window.waitForTimeout(1500)

    // Take screenshot of list
    await window.screenshot({ path: 'tests/screenshots/property-list-with-data.png' })
  })
})
