import { test, expect } from '../fixtures/electron-app.fixture'

test.describe('Job Creation', () => {
  test('should open job creation form when Add Job button clicked', async ({ window }) => {
    // Setup: Create customer and property
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'JobFormTest')
    await window.fill('input[name="lastName"]', 'User')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Add property
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)
    const customerButton = window.locator('button:has-text("JobFormTest User")')
    await customerButton.click()
    await window.waitForTimeout(500)
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')
    await window.fill('input[name="addressLine1"]', '100 Test Lane')
    await window.fill('input[name="town"]', 'TestCity')
    await window.click('button:has-text("Save Property")')
    await window.waitForTimeout(1500)

    // Navigate to Jobs and open form
    await window.click('button:has-text("Jobs")')
    await window.waitForTimeout(500)
    await customerButton.click()
    await window.waitForTimeout(500)
    const propertyButton = window.locator('button:has-text("100 Test Lane")')
    await propertyButton.click()
    await window.waitForTimeout(500)

    // Click Add Job button
    await window.click('button:has-text("Add Job")')

    // Verify the form is visible
    const formTitle = window.locator('h3:has-text("Add New Job")')
    await expect(formTitle).toBeVisible()
  })

  test('should display all job form fields', async ({ window }) => {
    // Setup: Create customer and property
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'JobFields')
    await window.fill('input[name="lastName"]', 'Test')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)
    const customerButton = window.locator('button:has-text("JobFields Test")')
    await customerButton.click()
    await window.waitForTimeout(500)
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')
    await window.fill('input[name="addressLine1"]', '200 Test Road')
    await window.fill('input[name="town"]', 'FieldsCity')
    await window.click('button:has-text("Save Property")')
    await window.waitForTimeout(1500)

    // Go to Jobs and open form
    await window.click('button:has-text("Jobs")')
    await window.waitForTimeout(500)
    await customerButton.click()
    await window.waitForTimeout(500)
    const propertyButton = window.locator('button:has-text("200 Test Road")')
    await propertyButton.click()
    await window.waitForTimeout(500)
    await window.click('button:has-text("Add Job")')
    await window.waitForSelector('h3:has-text("Add New Job")')

    // Verify all fields are present
    const serviceDate = window.locator('input[name="serviceDate"]')
    const serviceType = window.locator('select[name="serviceType"]')
    const certificateNumber = window.locator('input[name="certificateNumber"]')
    const cost = window.locator('input[name="cost"]')
    const notes = window.locator('textarea[name="notes"]')

    await expect(serviceDate).toBeVisible()
    await expect(serviceType).toBeVisible()
    await expect(certificateNumber).toBeVisible()
    await expect(cost).toBeVisible()
    await expect(notes).toBeVisible()
  })

  test('should have form action buttons', async ({ window }) => {
    // Setup: Create customer and property
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'JobButtons')
    await window.fill('input[name="lastName"]', 'Test')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)
    const customerButton = window.locator('button:has-text("JobButtons Test")')
    await customerButton.click()
    await window.waitForTimeout(500)
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')
    await window.fill('input[name="addressLine1"]', '300 Buttons Lane')
    await window.fill('input[name="town"]', 'ButtonsCity')
    await window.click('button:has-text("Save Property")')
    await window.waitForTimeout(1500)

    await window.click('button:has-text("Jobs")')
    await window.waitForTimeout(500)
    await customerButton.click()
    await window.waitForTimeout(500)
    const propertyButton = window.locator('button:has-text("300 Buttons Lane")')
    await propertyButton.click()
    await window.waitForTimeout(500)
    await window.click('button:has-text("Add Job")')
    await window.waitForSelector('h3:has-text("Add New Job")')

    // Verify buttons are present
    const cancelBtn = window.locator('button:has-text("Cancel")')
    const saveBtn = window.locator('button:has-text("Save Job")')

    await expect(cancelBtn).toBeVisible()
    await expect(saveBtn).toBeVisible()
  })

  test('should close form when Cancel button clicked', async ({ window }) => {
    // Setup: Create customer and property
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'JobCancel')
    await window.fill('input[name="lastName"]', 'Test')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)
    const customerButton = window.locator('button:has-text("JobCancel Test")')
    await customerButton.click()
    await window.waitForTimeout(500)
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')
    await window.fill('input[name="addressLine1"]', '400 Cancel Lane')
    await window.fill('input[name="town"]', 'CancelCity')
    await window.click('button:has-text("Save Property")')
    await window.waitForTimeout(1500)

    await window.click('button:has-text("Jobs")')
    await window.waitForTimeout(500)
    await customerButton.click()
    await window.waitForTimeout(500)
    const propertyButton = window.locator('button:has-text("400 Cancel Lane")')
    await propertyButton.click()
    await window.waitForTimeout(500)
    await window.click('button:has-text("Add Job")')
    await window.waitForSelector('h3:has-text("Add New Job")')
    await window.click('button:has-text("Cancel")')

    // Form should be gone
    const formTitle = window.locator('h3:has-text("Add New Job")')
    await expect(formTitle).not.toBeVisible()
  })

  test('should add job with minimal fields', async ({ window }) => {
    // Setup: Create customer and property
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'JobMinimal')
    await window.fill('input[name="lastName"]', 'Test')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)
    const customerButton = window.locator('button:has-text("JobMinimal Test")')
    await customerButton.click()
    await window.waitForTimeout(500)
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')
    await window.fill('input[name="addressLine1"]', '500 Minimal Lane')
    await window.fill('input[name="town"]', 'MinimalCity')
    await window.click('button:has-text("Save Property")')
    await window.waitForTimeout(1500)

    await window.click('button:has-text("Jobs")')
    await window.waitForTimeout(500)
    await customerButton.click()
    await window.waitForTimeout(500)
    const propertyButton = window.locator('button:has-text("500 Minimal Lane")')
    await propertyButton.click()
    await window.waitForTimeout(500)

    // Open form and fill minimal fields
    await window.click('button:has-text("Add Job")')
    await window.waitForSelector('h3:has-text("Add New Job")')

    // Service date should be pre-filled with today
    await window.locator('select[name="serviceType"]').selectOption('Chimney Sweep')

    // Submit form
    await window.click('button:has-text("Save Job")')
    await window.waitForTimeout(1500)

    // Verify form is closed
    const formTitle = window.locator('h3:has-text("Add New Job")')
    await expect(formTitle).not.toBeVisible()

    // Verify job appears in the list
    const jobText = window.locator('text=Chimney Sweep')
    await expect(jobText).toBeVisible()
  })

  test('should add job with all fields', async ({ window }) => {
    // Setup: Create customer and property
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'JobFull')
    await window.fill('input[name="lastName"]', 'Test')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)
    const customerButton = window.locator('button:has-text("JobFull Test")')
    await customerButton.click()
    await window.waitForTimeout(500)
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')
    await window.fill('input[name="addressLine1"]', '600 Full Lane')
    await window.fill('input[name="town"]', 'FullCity')
    await window.click('button:has-text("Save Property")')
    await window.waitForTimeout(1500)

    await window.click('button:has-text("Jobs")')
    await window.waitForTimeout(500)
    await customerButton.click()
    await window.waitForTimeout(500)
    const propertyButton = window.locator('button:has-text("600 Full Lane")')
    await propertyButton.click()
    await window.waitForTimeout(500)

    // Open form and fill all fields
    await window.click('button:has-text("Add Job")')
    await window.waitForSelector('h3:has-text("Add New Job")')

    // Get today's date for verification
    const today = new Date().toISOString().split('T')[0]

    await window.locator('select[name="serviceType"]').selectOption('Chimney Repair')
    await window.fill('input[name="certificateNumber"]', 'CERT-2025-500')
    await window.fill('input[name="cost"]', '85.50')
    await window.fill('textarea[name="notes"]', 'Repaired chimney cracks and sealed joints')

    // Submit form
    await window.click('button:has-text("Save Job")')
    await window.waitForTimeout(1500)

    // Verify form is closed
    const formTitle = window.locator('h3:has-text("Add New Job")')
    await expect(formTitle).not.toBeVisible()

    // Verify job appears in the list with correct details
    const serviceTypeText = window.locator('text=Chimney Repair')
    const costText = window.locator('text=£85.50')
    await expect(serviceTypeText).toBeVisible()
    await expect(costText).toBeVisible()
  })

  test('should validate required service type field', async ({ window }) => {
    // Setup: Create customer and property
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'JobValidate')
    await window.fill('input[name="lastName"]', 'Test')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)
    const customerButton = window.locator('button:has-text("JobValidate Test")')
    await customerButton.click()
    await window.waitForTimeout(500)
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')
    await window.fill('input[name="addressLine1"]', '700 Validate Lane')
    await window.fill('input[name="town"]', 'ValidateCity')
    await window.click('button:has-text("Save Property")')
    await window.waitForTimeout(1500)

    await window.click('button:has-text("Jobs")')
    await window.waitForTimeout(500)
    await customerButton.click()
    await window.waitForTimeout(500)
    const propertyButton = window.locator('button:has-text("700 Validate Lane")')
    await propertyButton.click()
    await window.waitForTimeout(500)

    // Open form but don't select service type
    await window.click('button:has-text("Add Job")')
    await window.waitForSelector('h3:has-text("Add New Job")')

    // Try to submit without service type
    await window.click('button:has-text("Save Job")')
    await window.waitForTimeout(500)

    // Error message should appear
    const errorMessage = window.locator('text=Service type is required')
    await expect(errorMessage).toBeVisible()
  })

  test('should accept numeric cost values', async ({ window }) => {
    // Setup: Create customer and property
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'JobCost')
    await window.fill('input[name="lastName"]', 'Test')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)
    const customerButton = window.locator('button:has-text("JobCost Test")')
    await customerButton.click()
    await window.waitForTimeout(500)
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')
    await window.fill('input[name="addressLine1"]', '800 Cost Lane')
    await window.fill('input[name="town"]', 'CostCity')
    await window.click('button:has-text("Save Property")')
    await window.waitForTimeout(1500)

    await window.click('button:has-text("Jobs")')
    await window.waitForTimeout(500)
    await customerButton.click()
    await window.waitForTimeout(500)
    const propertyButton = window.locator('button:has-text("800 Cost Lane")')
    await propertyButton.click()
    await window.waitForTimeout(500)

    // Open form and test decimal cost
    await window.click('button:has-text("Add Job")')
    await window.waitForSelector('h3:has-text("Add New Job")')

    await window.locator('select[name="serviceType"]').selectOption('Chimney Sweep')
    await window.fill('input[name="cost"]', '125.99')

    // Submit form
    await window.click('button:has-text("Save Job")')
    await window.waitForTimeout(1500)

    // Verify cost is displayed correctly
    const costText = window.locator('text=£125.99')
    await expect(costText).toBeVisible()
  })

  test('should take screenshot of job creation form', async ({ window }) => {
    // Setup: Create customer and property
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'JobScreenshot')
    await window.fill('input[name="lastName"]', 'Form')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)
    const customerButton = window.locator('button:has-text("JobScreenshot Form")')
    await customerButton.click()
    await window.waitForTimeout(500)
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')
    await window.fill('input[name="addressLine1"]', '900 Screenshot Lane')
    await window.fill('input[name="town"]', 'ScreenshotCity')
    await window.click('button:has-text("Save Property")')
    await window.waitForTimeout(1500)

    await window.click('button:has-text("Jobs")')
    await window.waitForTimeout(500)
    await customerButton.click()
    await window.waitForTimeout(500)
    const propertyButton = window.locator('button:has-text("900 Screenshot Lane")')
    await propertyButton.click()
    await window.waitForTimeout(500)

    // Open form and take screenshot
    await window.click('button:has-text("Add Job")')
    await window.waitForSelector('h3:has-text("Add New Job")')

    // Take screenshot
    await window.screenshot({ path: 'tests/screenshots/job-creation-form.png' })
  })

  test('should take screenshot of job list after adding job', async ({ window }) => {
    // Setup: Create customer and property
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'JobList')
    await window.fill('input[name="lastName"]', 'Screenshot')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)
    const customerButton = window.locator('button:has-text("JobList Screenshot")')
    await customerButton.click()
    await window.waitForTimeout(500)
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')
    await window.fill('input[name="addressLine1"]', '1000 List Lane')
    await window.fill('input[name="town"]', 'ListCity')
    await window.click('button:has-text("Save Property")')
    await window.waitForTimeout(1500)

    await window.click('button:has-text("Jobs")')
    await window.waitForTimeout(500)
    await customerButton.click()
    await window.waitForTimeout(500)
    const propertyButton = window.locator('button:has-text("1000 List Lane")')
    await propertyButton.click()
    await window.waitForTimeout(500)

    // Add job
    await window.click('button:has-text("Add Job")')
    await window.waitForSelector('h3:has-text("Add New Job")')

    await window.locator('select[name="serviceType"]').selectOption('Bird Guard Installation')
    await window.fill('input[name="cost"]', '50.00')
    await window.fill('textarea[name="notes"]', 'Installed bird guard on chimney')

    await window.click('button:has-text("Save Job")')
    await window.waitForTimeout(1500)

    // Take screenshot of list
    await window.screenshot({ path: 'tests/screenshots/job-list-with-data.png' })
  })
})
