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

  test('should have Add Job Details button', async ({ window }) => {
    await expect(window.locator('button:has-text("Add Job Details")')).toBeVisible()
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
    await window.click('button:has-text("Properties")')
    await window.waitForSelector('text=Properties')

    await window.click('button:has-text("Add Property")')
    await window.waitForSelector('input[name="address1"]')

    await window.fill('input[name="address1"]', '42 Main Street')
    await window.fill('input[name="town"]', 'London')
    await window.fill('input[name="postcode"]', 'SW1A 1AA')
    await window.click('button:has-text("Save")')

    await window.waitForSelector('text=42 Main Street')
  })

  test('should create and list job', async ({ window }) => {
    await window.click('button:has-text("Jobs")')
    await window.waitForSelector('text=Jobs')

    await window.click('button:has-text("Add Job")')
    await window.waitForSelector('input[name="serviceDate"]')

    const dateInput = window.locator('input[name="serviceDate"]')
    await dateInput.fill('2024-01-15')
    await window.fill('input[name="certificateNumber"]', 'CERT-001')
    await window.fill('input[name="cost"]', '100')
    await window.click('button:has-text("Save")')

    await window.waitForSelector('text=CERT-001')
  })
})
