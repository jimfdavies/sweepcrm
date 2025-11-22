import { describe, it, expect, beforeEach } from 'vitest'
import Database from 'better-sqlite3-multiple-ciphers'
import { createTestDB } from '../utils/test-helpers'

describe('Database Module', () => {
  describe('In-Memory Database Tests', () => {
    let testDb: Database.Database

    beforeEach(() => {
      testDb = createTestDB()
    })

    it('should create database with schema', () => {
      // Verify tables exist
      const tables = testDb
        .prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
        .all() as Array<{ name: string }>

      const tableNames = tables.map((t) => t.name)

      expect(tableNames).toContain('customers')
      expect(tableNames).toContain('properties')
      expect(tableNames).toContain('jobs')
      expect(tableNames).toContain('reminder_history')
    })

    it('should insert and retrieve a customer', () => {
      const customer = {
        title: 'Mr',
        first_name: 'Test',
        last_name: 'User',
        phone: '123-456-7890',
        email: 'test@example.com'
      }

      const stmt = testDb.prepare(`
        INSERT INTO customers (title, first_name, last_name, phone, email)
        VALUES (@title, @first_name, @last_name, @phone, @email)
      `)
      const info = stmt.run(customer)

      expect(info.changes).toBe(1)
      expect(info.lastInsertRowid).toBeDefined()

      // Retrieve the customer
      const retrieved = testDb
        .prepare('SELECT * FROM customers WHERE id = ?')
        .get(info.lastInsertRowid)

      expect(retrieved).toMatchObject(customer)
    })
  })

  describe('Database Operations', () => {
    let testDb: Database.Database

    beforeEach(() => {
      testDb = createTestDB()
    })

    it('should perform CRUD operations on customers', () => {
      // Create
      const insertStmt = testDb.prepare(`
        INSERT INTO customers (title, first_name, last_name, phone, email)
        VALUES (?, ?, ?, ?, ?)
      `)
      const info = insertStmt.run('Mrs', 'Jane', 'Smith', '555-0000', 'jane@example.com')
      const customerId = Number(info.lastInsertRowid)

      // Read
      const customer = testDb.prepare('SELECT * FROM customers WHERE id = ?').get(customerId)
      expect(customer).toBeDefined()
      expect((customer as any).first_name).toBe('Jane')

      // Update
      const updateStmt = testDb.prepare('UPDATE customers SET phone = ? WHERE id = ?')
      updateStmt.run('555-1111', customerId)

      const updated = testDb.prepare('SELECT * FROM customers WHERE id = ?').get(customerId) as any
      expect(updated.phone).toBe('555-1111')

      // Delete
      const deleteStmt = testDb.prepare('DELETE FROM customers WHERE id = ?')
      deleteStmt.run(customerId)

      const deleted = testDb.prepare('SELECT * FROM customers WHERE id = ?').get(customerId)
      expect(deleted).toBeUndefined()
    })

    it('should enforce foreign key constraints', () => {
      // Try to insert a property without a customer
      const stmt = testDb.prepare(`
        INSERT INTO properties (customer_id, address_line_1, address_line_2, town, postcode, notes)
        VALUES (?, ?, ?, ?, ?, ?)
      `)

      // This should fail due to foreign key constraint
      expect(() => {
        stmt.run(999, '123 Main St', '', 'Springfield', 'SP1 1AA', '')
      }).toThrow()
    })
  })
})
