import { ipcMain } from 'electron'
import { getDb, getCustomerById, updateCustomer } from './database'
import { CreateCustomerDTO, Customer, CustomerDBRow } from '../shared/types'

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

  ipcMain.handle('get-customer-by-id', async (_, id: number) => {
    try {
      const row: CustomerDBRow | null = getCustomerById(id)
      if (!row) {
        return null
      }
      // Map database row to Customer interface, handling name splitting and address from notes
      const customer: Customer = {
        id: row.id,
        name: `${row.first_name} ${row.last_name}`.trim(),
        email: row.email,
        phone: row.phone,
        address: row.notes || '', // Address is stored in notes
        createdAt: row.created_at,
        updatedAt: row.updated_at
      }
      return customer
    } catch (error) {
      console.error(`Failed to get customer with id ${id}:`, error)
      return null
    }
  })

  ipcMain.handle('update-customer', async (_, customer: Customer) => {
    try {
      if (!customer.id) {
        throw new Error('Customer ID is required for update.')
      }
      const result = updateCustomer(customer)
      return result
    } catch (error) {
      console.error('Failed to update customer:', error)
      return { success: false, error: (error as Error).message }
    }
  })
}
