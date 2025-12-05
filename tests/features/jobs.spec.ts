import { test, expect } from '../fixtures/electron-app.fixture'

test.describe('Jobs View', () => {
  test('should display jobs view with customer selector', async ({ window }) => {
    // Navigate to jobs
    await window.click('button:has-text("Jobs")')

    // Verify the heading is visible
    const heading = window.locator('h3:has-text("Select a Customer")')
    await expect(heading).toBeVisible()
  })

  test('should display customer search box', async ({ window }) => {
    // Navigate to jobs
    await window.click('button:has-text("Jobs")')

    // Look for the customer search input
    const searchInput = window.locator('input[placeholder*="Search customers"]')
    await expect(searchInput).toBeVisible()
  })

  test('should display customer list', async ({ window }) => {
    // Navigate to jobs
    await window.click('button:has-text("Jobs")')

    // First add a customer via Customers view
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'JobsListTest')
    await window.fill('input[name="lastName"]', 'User')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1500)

    // Now go back to jobs
    await window.click('button:has-text("Jobs")')
    await window.waitForSelector('h3:has-text("Select a Customer")')
    await window.waitForTimeout(500)

    // Should see the customer in the list
    const customerButton = window.locator('button:has-text("JobsListTest User")')
    await expect(customerButton).toBeVisible()
  })

  test('should select a customer and show properties panel', async ({ window }) => {
    // Navigate to jobs
    await window.click('button:has-text("Jobs")')

    // First add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'JobsPropTest')
    await window.fill('input[name="lastName"]', 'User')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Now go back to jobs
    await window.click('button:has-text("Jobs")')
    await window.waitForTimeout(500)

    // Click on the customer
    const customerButton = window.locator('button:has-text("JobsPropTest User")')
    await customerButton.click()

    // Should see the properties panel header
    const propertiesHeading = window.locator('h3:has-text("Properties for JobsPropTest User")')
    await expect(propertiesHeading).toBeVisible()
  })

  test('should show empty state when customer has no properties', async ({ window }) => {
    // Navigate to jobs
    await window.click('button:has-text("Jobs")')

    // First add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'NoJobProps')
    await window.fill('input[name="lastName"]', 'User')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Now go back to jobs
    await window.click('button:has-text("Jobs")')
    await window.waitForTimeout(500)

    // Click on the customer
    const customerButton = window.locator('button:has-text("NoJobProps User")')
    await customerButton.click()

    // Should see empty state
    const emptyStateText = window.locator('text=No properties found')
    await expect(emptyStateText).toBeVisible()
  })

  test('should select a property and show jobs panel', async ({ window }) => {
    // Navigate to jobs
    await window.click('button:has-text("Jobs")')

    // First add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'JobsSelect')
    await window.fill('input[name="lastName"]', 'Customer')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Add a property via Properties view
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)
    const customerButton = window.locator('button:has-text("JobsSelect Customer")')
    await customerButton.click()
    await window.waitForTimeout(500)
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')
    await window.fill('input[name="addressLine1"]', '100 Jobs Street')
    await window.fill('input[name="town"]', 'JobsCity')
    await window.click('button:has-text("Save Property")')
    await window.waitForTimeout(1500)

    // Now go back to jobs
    await window.click('button:has-text("Jobs")')
    await window.waitForTimeout(500)

    // Select customer
    const jobsCustomerButton = window.locator('button:has-text("JobsSelect Customer")')
    await jobsCustomerButton.click()
    await window.waitForTimeout(500)

    // Select property
    const propertyButton = window.locator('button:has-text("100 Jobs Street")')
    await propertyButton.click()
    await window.waitForTimeout(500)

    // Should see the jobs panel header
    const jobsHeading = window.locator('h3:has-text("Jobs for 100 Jobs Street")')
    await expect(jobsHeading).toBeVisible()
  })

  test('should show empty state when property has no jobs', async ({ window }) => {
    // Navigate to jobs
    await window.click('button:has-text("Jobs")')

    // First add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'NoJobsProperty')
    await window.fill('input[name="lastName"]', 'Test')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Add a property via Properties view
    await window.click('button:has-text("Properties")')
    await window.waitForTimeout(500)
    const customerButton = window.locator('button:has-text("NoJobsProperty Test")')
    await customerButton.click()
    await window.waitForTimeout(500)
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('h3:has-text("Add New Property")')
    await window.fill('input[name="addressLine1"]', '200 Empty Street')
    await window.fill('input[name="town"]', 'EmptyCity')
    await window.click('button:has-text("Save Property")')
    await window.waitForTimeout(1500)

    // Now go back to jobs
    await window.click('button:has-text("Jobs")')
    await window.waitForTimeout(500)

    // Select customer
    const jobsCustomerButton = window.locator('button:has-text("NoJobsProperty Test")')
    await jobsCustomerButton.click()
    await window.waitForTimeout(500)

    // Select property
    const propertyButton = window.locator('button:has-text("200 Empty Street")')
    await propertyButton.click()
    await window.waitForTimeout(500)

    // Should see empty state
    const emptyStateText = window.locator('text=No jobs found')
    await expect(emptyStateText).toBeVisible()
  })

  test('should filter customers by name in selector', async ({ window }) => {
    // Navigate to jobs
    await window.click('button:has-text("Jobs")')

    // First add two customers
    await window.click('button:has-text("Customers")')
    
    // Add first customer
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Alice')
    await window.fill('input[name="lastName"]', 'Jobs')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(500)

    // Add second customer
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Bob')
    await window.fill('input[name="lastName"]', 'Smith')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Now go back to jobs
    await window.click('button:has-text("Jobs")')
    await window.waitForTimeout(500)

    // Search for Alice
    const searchInput = window.locator('input[placeholder*="Search customers"]')
    await searchInput.fill('Alice')

    // Should see Alice
    const aliceBtn = window.locator('button:has-text("Alice Jobs")')
    await expect(aliceBtn).toBeVisible()

    // Should not see Bob
    const bobBtn = window.locator('button:has-text("Bob Smith")')
    await expect(bobBtn).not.toBeVisible()
  })

  test('should highlight selected customer', async ({ window }) => {
    // Navigate to jobs
    await window.click('button:has-text("Jobs")')

    // First add a customer
    await window.click('button:has-text("Customers")')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Select')
    await window.fill('input[name="lastName"]', 'JobsTest')
    await window.click('button:has-text("Save Customer")')
    await window.waitForTimeout(1000)

    // Now go back to jobs
    await window.click('button:has-text("Jobs")')
    await window.waitForTimeout(500)

    // Click on the customer
    const customerButton = window.locator('button:has-text("Select JobsTest")')
    await customerButton.click()

    // The button should have the blue background class
    const selectedClass = await customerButton.getAttribute('class')
    expect(selectedClass).toContain('bg-blue-50')
  })

  test('should take screenshot of jobs view', async ({ window }) => {
    // Navigate to jobs
    await window.click('button:has-text("Jobs")')
    await window.waitForLoadState('networkidle')

    // Take screenshot
    await window.screenshot({ path: 'tests/screenshots/jobs-view.png' })
  })
})
