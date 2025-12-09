import { test, expect } from './fixtures/electron-app.fixture'

test.describe('SweepCRM App', () => {
  test('should launch and show Reminders by default', async ({ window }) => {
    await expect(window.locator('text=SweepCRM')).toBeVisible()
    await expect(window.locator('text=Reminders').nth(0)).toBeVisible()
  })

  test('should navigate to Home', async ({ window }) => {
    await window.click('button:has-text("Home")')
    await window.waitForSelector('text=System Summary')
  })

  test('should navigate to Customers', async ({ window }) => {
    await window.click('button:has-text("Customers")')
    await window.waitForSelector('text=Customers')
  })

  test('should navigate to Properties', async ({ window }) => {
    await window.click('button:has-text("Properties")')
    await window.waitForSelector('text=Properties')
  })

  test('should navigate to Jobs', async ({ window }) => {
    await window.click('button:has-text("Jobs")')
    await window.waitForSelector('text=Jobs')
  })

  test('should create and list customer', async ({ window }) => {
    await window.click('button:has-text("Customers")')
    await window.waitForSelector('text=Customers')

    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')

    await window.fill('input[name="firstName"]', 'John')
    await window.fill('input[name="lastName"]', 'Smith')
    await window.fill('input[name="email"]', 'john@test.com')
    await window.click('button:has-text("Save")')

    await window.waitForSelector('text=John')
    await window.waitForSelector('text=john@test.com')
  })

  test('should create and list property', async ({ window }) => {
    // First create a customer
    await window.click('button:has-text("Customers")')
    await window.waitForSelector('text=Customers')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Jane')
    await window.fill('input[name="lastName"]', 'Doe')
    await window.fill('input[name="email"]', 'jane@test.com')
    await window.click('button:has-text("Save")')
    await window.waitForSelector('text=Jane')

    // Now go to Properties and add a property
    await window.click('button:has-text("Properties")')
    await window.waitForSelector('text=Properties')
    
    // Select the customer we just created
    await window.click('button:has-text("Jane Doe")')
    await window.waitForSelector('button:has-text("Add Property")')

    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('input[name="addressLine1"]')

    await window.fill('input[name="addressLine1"]', '42 Main Street')
    await window.fill('input[name="town"]', 'London')
    await window.fill('input[name="postcode"]', 'SW1A 1AA')
    await window.click('button:has-text("Save")')

    await window.waitForSelector('text=42 Main Street')
  })

  test('should create and list job', async ({ window }) => {
    // First create a customer
    await window.click('button:has-text("Customers")')
    await window.waitForSelector('text=Customers')
    await window.click('button:has-text("Add Customer")')
    await window.waitForSelector('input[name="firstName"]')
    await window.fill('input[name="firstName"]', 'Jack')
    await window.fill('input[name="lastName"]', 'Smith')
    await window.fill('input[name="email"]', 'jack@test.com')
    await window.click('button:has-text("Save")')
    await window.waitForSelector('text=Jack')

    // Create a property for that customer
    await window.click('button:has-text("Properties")')
    await window.waitForSelector('text=Properties')
    await window.click('button:has-text("Jack Smith")')
    await window.waitForSelector('button:has-text("Add Property")')
    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('input[name="addressLine1"]')
    await window.fill('input[name="addressLine1"]', '123 Oak Lane')
    await window.fill('input[name="town"]', 'Manchester')
    await window.click('button:has-text("Save")')
    await window.waitForSelector('text=123 Oak Lane')

    // Now go to Jobs and add a job
    await window.click('button:has-text("Jobs")')
    await window.waitForSelector('text=Jobs')
    
    // Select the customer
    await window.click('button:has-text("Jack Smith")')
    await window.waitForSelector('button:has-text("123 Oak Lane")')
    
    // Select the property
    await window.click('button:has-text("123 Oak Lane")')
    
    // Wait for Jobs panel title to ensure we're ready
    await expect(window.locator('h3:has-text("Jobs for")')).toBeVisible({ timeout: 5000 })
    
    // Find the Add Job button within the Jobs panel (not the home page button)
    const addJobButton = window.locator('h3:has-text("Jobs for") ~ button:has-text("Add Job")')
    await expect(addJobButton).toBeVisible({ timeout: 5000 })

    await addJobButton.click()
    
    // Wait for the form modal to appear
    await expect(window.locator('text=Add New Job')).toBeVisible({ timeout: 10000 })
    
    const dateInput = window.locator('input[name="serviceDate"]')
    await dateInput.fill('2024-01-15')
    await window.fill('input[name="cost"]', '100')
    await window.click('button:has-text("Save Job")')

    await window.waitForSelector('text=Chimney Sweep')
  })
})
