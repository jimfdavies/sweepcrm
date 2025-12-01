import { _electron as electron, test, expect, ElectronApplication, Page } from '@playwright/test'
import path from 'path'
import fs from 'fs'
import { exec } from 'child_process'

let electronApp: ElectronApplication
let page: Page
let devProcess

test.beforeAll(async () => {
  // Start the dev server in the background
  devProcess = exec('npm run dev', (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    console.log(`stdout: ${stdout}`)
    console.error(`stderr: ${stderr}`)
  })

  // Wait for the dev server to be ready
  await new Promise((resolve) => setTimeout(resolve, 15000)) // 15-second wait for server to start

  electronApp = await electron.launch({
    args: ['.'],
    env: { ...process.env, NODE_ENV: 'development' }
  })

  page = await electronApp.firstWindow()
  await page.goto('http://localhost:5173') // Navigate to the Vite dev server URL
  await page.waitForLoadState('domcontentloaded')

  // Create screenshots directory if it doesn't exist
  const screenshotDir = path.join(__dirname, 'screenshots')
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir)
  }
  await page.screenshot({ path: path.join(screenshotDir, 'initial-load-after-dev.png') })
}, 60000)

test.afterAll(async () => {
  await electronApp.close()
  if (devProcess) {
    devProcess.kill()
  }
})

test.describe('Customer Management', () => {
  test.setTimeout(30000)
  test('should navigate to Add Customer page and create a new customer', async () => {
    await page.click('button:has-text("Add Customer")')
    await expect(page.locator('h2')).toHaveText('Add New Customer')

    await page.fill('input[name="name"]', 'Test Customer 1')
    await page.fill('input[name="email"]', 'test1@example.com')
    await page.fill('input[name="phone"]', '1112223333')
    await page.fill('textarea[name="address"]', '123 Test St')

    await page.click('button:has-text("Create Customer")')

    // Debugging: take a screenshot and log content before the expect
    const screenshotDir = path.join(__dirname, 'screenshots')
    await page.screenshot({
      path: path.join(screenshotDir, 'after-create-customer-click.png')
    })
    console.log(
      'Page content after create customer click:',
      await page.content()
    )

    await expect(page.locator('.status-message')).toHaveText('Customer created successfully!')
    // After successful creation, it should navigate back to home due to onSuccess in AddCustomerPage
    await expect(page.locator('img.logo')).toBeVisible()
  })

  test('should navigate to Edit Customer page and pre-fill the form', async () => {
    // Navigate to edit customer with ID 1 (seeded data or the one just created)
    await page.click('button:has-text("Edit Customer (ID 1)")')
    await expect(page.locator('h2')).toHaveText('Edit Customer')

    // Expect form fields to be pre-filled
    // This relies on the seeded data or a previously created customer having ID 1
    await expect(page.locator('input[name="name"]')).toHaveValue('John Doe')
    await expect(page.locator('input[name="email"]')).toHaveValue('john.doe@example.com')
    await expect(page.locator('input[name="phone"]')).toHaveValue('07700900123')
    // Address is mapped from 'notes' in DB
    await expect(page.locator('textarea[name="address"]')).toHaveValue('Prefer morning appointments')
  })

  test('should edit an existing customer and persist changes', async () => {
    // Ensure we are on the edit page for customer 1
    // (This assumes the previous test leaves us there or we navigate again)
    await page.click('button:has-text("Edit Customer (ID 1)")') // Re-navigate to ensure clean state
    await expect(page.locator('h2')).toHaveText('Edit Customer')

    await page.fill('input[name="name"]', 'John Doe Updated')
    await page.fill('input[name="email"]', 'john.doe.updated@example.com')
    await page.fill('textarea[name="address"]', 'New updated address notes.')

    await page.click('button:has-text("Save Changes")')

    await expect(page.locator('.status-message')).toHaveText('Customer updated successfully!')
    // Should navigate back to home
    await expect(page.locator('img.logo')).toBeVisible()

    // Verify changes are persisted by navigating back to edit page
    await page.click('button:has-text("Edit Customer (ID 1)")')
    await expect(page.locator('h2')).toHaveText('Edit Customer')

    await expect(page.locator('input[name="name"]')).toHaveValue('John Doe Updated')
    await expect(page.locator('input[name="email"]')).toHaveValue('john.doe.updated@example.com')
    await expect(page.locator('textarea[name="address"]')).toHaveValue('New updated address notes.')
  })
})
