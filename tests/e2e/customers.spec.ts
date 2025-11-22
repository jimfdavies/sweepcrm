import { test, expect } from '@playwright/test'
import { launchElectronApp, login, navigateTo, closeApp } from '../fixtures/electron-app'
import { TEST_PASSWORD, getUniqueCustomer } from '../fixtures/test-data'

test.describe('Customer Management', () => {
  test('should display customers page', async () => {
    const { app, page } = await launchElectronApp()
    await login(page, TEST_PASSWORD)

    // Navigate to customers page
    await navigateTo(page, 'customers')

    // Should see customers list or empty state
    await expect(page).toHaveURL(/customers/)

    // Look for "add customer" link
    const addButton = page.getByRole('link', { name: 'Add Customer' })
    await expect(addButton).toBeVisible({ timeout: 10000 })

    await closeApp(app)
  })

  test('should create a new customer', async () => {
    const { app, page } = await launchElectronApp()
    await login(page, TEST_PASSWORD)
    await navigateTo(page, 'customers')

    const customer = getUniqueCustomer()

    // Click add customer link
    await page.getByRole('link', { name: 'Add Customer' }).click()

    // Wait for form to appear
    await page.waitForSelector('text=New Customer', { timeout: 5000 })

    // Fill in customer details
    // Inputs don't have name attributes, so we use labels
    await page.locator('#title').fill(customer.title)
    await page.locator('#first_name').fill(customer.first_name)
    await page.locator('#last_name').fill(customer.last_name)
    await page.locator('#phone').fill(customer.phone)
    await page.locator('#email').fill(customer.email)

    // Submit form
    await page.getByRole('button', { name: 'Save Customer' }).click()

    // Wait for navigation to detail page (NOT list)
    await page.waitForURL(/customers\/\d+/, { timeout: 10000 })

    // Go back to customers list to verify
    await navigateTo(page, 'customers')
    await page.waitForURL(/customers$/, { timeout: 5000 })

    // Verify customer appears in the list
    await expect(page.getByText(customer.last_name)).toBeVisible({ timeout: 10000 })

    await closeApp(app)
  })

  test('should search for customers', async () => {
    const { app, page } = await launchElectronApp()
    await login(page, TEST_PASSWORD)
    await navigateTo(page, 'customers')

    // Look for search input
    const searchInput = page.getByPlaceholder('Search customers...')

    if ((await searchInput.count()) > 0) {
      // Type a search term
      await searchInput.fill('Smith')

      // Wait for search results (debounce)
      await page.waitForTimeout(500)

      await expect(searchInput).toHaveValue('Smith')
    }

    await closeApp(app)
  })

  test('should navigate to customer detail', async () => {
    const { app, page } = await launchElectronApp()
    await login(page, TEST_PASSWORD)
    await navigateTo(page, 'customers')

    // Wait for customers to load
    await page.waitForTimeout(1000)

    // Look for "Edit" link in the first row
    const editLink = page.getByRole('link', { name: 'Edit' }).first()

    if ((await editLink.count()) > 0) {
      await editLink.click()

      // Should navigate to customer detail page
      await expect(page).toHaveURL(/customers\/\d+/, { timeout: 5000 })

      // Should see customer form
      await expect(page.getByText('Edit Customer')).toBeVisible()
    }

    await closeApp(app)
  })

  test('should edit customer details', async () => {
    const { app, page } = await launchElectronApp()
    await login(page, TEST_PASSWORD)
    await navigateTo(page, 'customers')

    // Create a customer first
    const customer = getUniqueCustomer()
    await page.getByRole('link', { name: 'Add Customer' }).click()

    await page.locator('#title').fill(customer.title)
    await page.locator('#first_name').fill(customer.first_name)
    await page.locator('#last_name').fill(customer.last_name)
    await page.locator('#phone').fill(customer.phone)
    await page.locator('#email').fill(customer.email)

    await page.getByRole('button', { name: 'Save Customer' }).click()

    // Wait for detail page
    await page.waitForURL(/customers\/\d+/, { timeout: 10000 })

    // Go back to list
    await navigateTo(page, 'customers')
    await page.waitForURL(/customers$/, { timeout: 5000 })

    // Find the customer we just created and click Edit
    // We find the row that contains the last name, then find the Edit link within it
    // Since Playwright selectors can be tricky for parents, we'll just click the first Edit link
    // or try to find the specific one if possible.
    await page.reload()

    // Search for the customer to isolate them
    await page.getByPlaceholder('Search customers...').fill(customer.last_name)
    await page.waitForTimeout(500)

    // Click Edit on the first result
    await page.getByRole('link', { name: 'Edit' }).first().click()

    // Update phone number
    await page.locator('#phone').fill('555-9999')

    // Save changes
    await page.getByRole('button', { name: 'Save Customer' }).click()
    await page.waitForURL(/customers$/, { timeout: 10000 })

    // Verify change
    // We need to go back to edit page to verify, or check list if phone is shown
    // Phone IS shown in list
    await page.getByPlaceholder('Search customers...').fill(customer.last_name)
    await page.waitForTimeout(500)

    await expect(page.getByText('555-9999')).toBeVisible({ timeout: 5000 })

    await closeApp(app)
  })
})
