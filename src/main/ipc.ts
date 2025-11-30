import { ipcMain } from 'electron'
import { getDb } from './database'
import { CreateCustomerDTO } from '../shared/types'

export function registerIpcHandlers(): void {
  ipcMain.handle('create-customer', async (_, customer: CreateCustomerDTO) => {
    try {
      const db = getDb()
      const stmt = db.prepare(`
        INSERT INTO customers (first_name, last_name, email, phone, notes, title)
        VALUES (@first_name, @last_name, @email, @phone, @notes, @title)
      `)

      // Simple name splitting for now, can be improved
      const nameParts = customer.name.split(' ')
      const firstName = nameParts[0] || ''
      const lastName = nameParts.slice(1).join(' ') || ''

      const info = stmt.run({
        first_name: firstName,
        last_name: lastName,
        email: customer.email,
        phone: customer.phone,
        notes: customer.address, // Storing address in notes for now as per schema mismatch
        title: '' // Default title
      })

      return { success: true, id: info.lastInsertRowid }
    } catch (error) {
      console.error('Failed to create customer:', error)
      return { success: false, error: (error as Error).message }
    }
  })
}
