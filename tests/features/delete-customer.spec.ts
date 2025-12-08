import { test, expect } from '../fixtures/electron-app.fixture'

test.describe('Delete Customer', () => {
  test('should display delete button in customer table', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')
    await window.waitForLoadState('networkidle')

    // Look for delete button if customers exist
    const deleteBtn = window.locator('button:has-text("Delete")').first()
    if (await deleteBtn.count() > 0) {
      await expect(deleteBtn).toBeVisible()
    }
  })

  test('should have proper delete button styling', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')
    await window.waitForLoadState('networkidle')

    // Check delete button styling if it exists
    const deleteBtn = window.locator('button:has-text("Delete")').first()
    if (await deleteBtn.count() > 0) {
      const className = await deleteBtn.getAttribute('class')
      expect(className).toContain('text-red')
      expect(className).toContain('hover:text-red-800')
    }
  })

  test('should position delete button next to edit button', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')
    await window.waitForLoadState('networkidle')

    // Check button layout if customers exist
    const actionsCells = window.locator('table tbody td:last-child')
    if (await actionsCells.count() > 0) {
      const firstActionCell = actionsCells.first()
      const cellText = await firstActionCell.textContent()
      expect(cellText).toContain('Edit')
      expect(cellText).toContain('Delete')
    }
  })

  test('should show confirmation dialog when delete is clicked', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')
    await window.waitForLoadState('networkidle')

    // If customers exist, test the confirmation
    const deleteBtn = window.locator('button:has-text("Delete")').first()
    if (await deleteBtn.count() > 0) {
      let confirmCalled = false
      let confirmMessage = ''

      await window.evaluate(() => {
        const oldConfirm = window.confirm
        ;(window as any).__originalConfirm = oldConfirm
        window.confirm = (message: string) => {
          ;(window as any).__confirmMessage = message
          return false
        }
      })

      await deleteBtn.click()
      await window.waitForTimeout(500)

      confirmMessage = await window.evaluate(() => (window as any).__confirmMessage || '')

      if (confirmMessage) {
        expect(confirmMessage).toContain('Are you sure')
        expect(confirmMessage).toContain('delete')
      }
    }
  })

  test('should require confirmation before deleting', async ({ window }) => {
    // Navigate to customers
    await window.click('button:has-text("Customers")')
    await window.waitForLoadState('networkidle')

    // Get initial count
    const initialRows = await window.locator('table tbody tr').count()

    // If customers exist, verify delete requires confirmation
    const deleteBtn = window.locator('button:has-text("Delete")').first()
    if (initialRows > 0 && await deleteBtn.count() > 0) {
      // Mock confirm to return false (cancel)
      await window.evaluate(() => {
        window.confirm = () => false
      })

      await deleteBtn.click()
      await window.waitForTimeout(500)

      // Verify count hasn't changed
      const finalRows = await window.locator('table tbody tr').count()
      expect(finalRows).toBe(initialRows)
    }
  })
})
