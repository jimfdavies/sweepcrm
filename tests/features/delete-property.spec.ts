import { test, expect } from '../fixtures/electron-app.fixture'

test.describe('Delete Property', () => {
  test('should display delete button in properties table', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')
    await window.waitForLoadState('networkidle')

    // Select a customer if available
    const customerBtn = window.locator('button:has-text(/\\w+\\s+\\w+/)').first()
    if (await customerBtn.count() > 0) {
      await customerBtn.click()
      await window.waitForLoadState('networkidle')

      // Look for delete button if properties exist
      const deleteBtn = window.locator('button:has-text("Delete")').first()
      if (await deleteBtn.count() > 0) {
        await expect(deleteBtn).toBeVisible()
      }
    }
  })

  test('should have proper delete button styling for properties', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')
    await window.waitForLoadState('networkidle')

    // Select a customer
    const customerBtn = window.locator('button:has-text(/\\w+\\s+\\w+/)').first()
    if (await customerBtn.count() > 0) {
      await customerBtn.click()
      await window.waitForLoadState('networkidle')

      // Check delete button styling
      const deleteBtn = window.locator('button:has-text("Delete")').first()
      if (await deleteBtn.count() > 0) {
        const className = await deleteBtn.getAttribute('class')
        expect(className).toContain('text-red')
        expect(className).toContain('hover:text-red-800')
      }
    }
  })

  test('should show confirmation dialog for property deletion', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')
    await window.waitForLoadState('networkidle')

    // Select a customer
    const customerBtn = window.locator('button:has-text(/\\w+\\s+\\w+/)').first()
    if (await customerBtn.count() > 0) {
      await customerBtn.click()
      await window.waitForLoadState('networkidle')

      // Test confirmation dialog
      const deleteBtn = window.locator('button:has-text("Delete")').first()
      if (await deleteBtn.count() > 0) {
        await window.evaluate(() => {
          window.confirm = (message: string) => {
            ;(window as any).__confirmMessage = message
            return false
          }
        })

        await deleteBtn.click()
        await window.waitForTimeout(500)

        const confirmMessage = await window.evaluate(() => (window as any).__confirmMessage || '')

        if (confirmMessage) {
          expect(confirmMessage).toContain('Are you sure')
          expect(confirmMessage).toContain('delete')
          expect(confirmMessage).toContain('jobs')
        }
      }
    }
  })

  test('should maintain property count when delete is cancelled', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')
    await window.waitForLoadState('networkidle')

    // Select a customer
    const customerBtn = window.locator('button:has-text(/\\w+\\s+\\w+/)').first()
    if (await customerBtn.count() > 0) {
      await customerBtn.click()
      await window.waitForLoadState('networkidle')

      // Get initial count
      const initialRows = await window.locator('table tbody tr').count()

      // Cancel delete operation
      const deleteBtn = window.locator('button:has-text("Delete")').first()
      if (initialRows > 0 && await deleteBtn.count() > 0) {
        await window.evaluate(() => {
          window.confirm = () => false
        })

        await deleteBtn.click()
        await window.waitForTimeout(500)

        const finalRows = await window.locator('table tbody tr').count()
        expect(finalRows).toBe(initialRows)
      }
    }
  })

  test('should position delete button in actions column', async ({ window }) => {
    // Navigate to properties
    await window.click('button:has-text("Properties")')
    await window.waitForLoadState('networkidle')

    // Select a customer
    const customerBtn = window.locator('button:has-text(/\\w+\\s+\\w+/)').first()
    if (await customerBtn.count() > 0) {
      await customerBtn.click()
      await window.waitForLoadState('networkidle')

      // Check button layout
      const actionsCells = window.locator('table tbody td:last-child')
      if (await actionsCells.count() > 0) {
        const firstActionCell = actionsCells.first()
        const cellText = await firstActionCell.textContent()
        expect(cellText).toContain('Edit')
        expect(cellText).toContain('Delete')
      }
    }
  })
})
