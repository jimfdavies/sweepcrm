import { describe, it, expect, beforeEach } from 'vitest'
import Database from 'better-sqlite3-multiple-ciphers'
import {
  createTestDB,
  insertTestCustomer,
  insertTestProperty,
  insertTestJob
} from '../utils/test-helpers'

/**
 * These tests verify the database operations that power the IPC handlers.
 * We test the actual database queries rather than mocking the IPC layer.
 */
describe('IPC Database Operations', () => {
  let db: Database.Database

  beforeEach(() => {
    db = createTestDB()
  })

  describe('Customer Operations', () => {
    it('should get all customers', () => {
      // Insert test customers
      insertTestCustomer(db, {
        title: 'Mr',
        first_name: 'John',
        last_name: 'Doe',
        phone: '111',
        email: 'john@test.com'
      })
      insertTestCustomer(db, {
        title: 'Mrs',
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '222',
        email: 'jane@test.com'
      })

      const customers = db.prepare('SELECT * FROM customers ORDER BY last_name, first_name').all()

      expect(customers).toHaveLength(2)
      expect(customers[0]).toMatchObject({ first_name: 'John', last_name: 'Doe' })
    })

    it('should search customers by name', () => {
      insertTestCustomer(db, {
        title: 'Mr',
        first_name: 'John',
        last_name: 'Doe',
        phone: '111',
        email: 'john@test.com'
      })
      insertTestCustomer(db, {
        title: 'Mrs',
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '222',
        email: 'jane@test.com'
      })

      const results = db
        .prepare(
          `
        SELECT * FROM customers 
        WHERE first_name LIKE @search OR last_name LIKE @search OR phone LIKE @search
        ORDER BY last_name, first_name
      `
        )
        .all({ search: '%Jane%' })

      expect(results).toHaveLength(1)
      expect(results[0]).toMatchObject({ first_name: 'Jane' })
    })

    it('should create a customer', () => {
      const customer = {
        title: 'Dr',
        first_name: 'Sarah',
        last_name: 'Johnson',
        phone: '555-9999',
        email: 'sarah@example.com'
      }

      const stmt = db.prepare(`
        INSERT INTO customers (title, first_name, last_name, phone, email)
        VALUES (@title, @first_name, @last_name, @phone, @email)
      `)
      const info = stmt.run(customer)

      expect(info.changes).toBe(1)
      expect(info.lastInsertRowid).toBeGreaterThan(0)

      // Verify it was inserted
      const inserted = db.prepare('SELECT * FROM customers WHERE id = ?').get(info.lastInsertRowid)
      expect(inserted).toMatchObject(customer)
    })

    it('should update a customer', () => {
      const customerId = insertTestCustomer(db)

      const stmt = db.prepare(`
        UPDATE customers 
        SET title = @title, first_name = @first_name, last_name = @last_name, phone = @phone, email = @email
        WHERE id = @id
      `)
      const result = stmt.run({
        id: customerId,
        title: 'Dr',
        first_name: 'John',
        last_name: 'Updated',
        phone: '999-9999',
        email: 'updated@example.com'
      })

      expect(result.changes).toBe(1)

      const updated = db.prepare('SELECT * FROM customers WHERE id = ?').get(customerId) as any
      expect(updated.last_name).toBe('Updated')
      expect(updated.phone).toBe('999-9999')
    })

    it('should delete a customer', () => {
      const customerId = insertTestCustomer(db)

      const result = db.prepare('DELETE FROM customers WHERE id = ?').run(customerId)
      expect(result.changes).toBe(1)

      const deleted = db.prepare('SELECT * FROM customers WHERE id = ?').get(customerId)
      expect(deleted).toBeUndefined()
    })
  })

  describe('Property Operations', () => {
    it('should get properties for a customer', () => {
      const customerId = insertTestCustomer(db)
      insertTestProperty(db, {
        customer_id: customerId,
        address_line_1: '123 Main',
        address_line_2: '',
        town: 'Town',
        postcode: 'P1',
        notes: ''
      })
      insertTestProperty(db, {
        customer_id: customerId,
        address_line_1: '456 Oak',
        address_line_2: '',
        town: 'City',
        postcode: 'P2',
        notes: ''
      })

      const properties = db
        .prepare('SELECT * FROM properties WHERE customer_id = ?')
        .all(customerId)

      expect(properties).toHaveLength(2)
    })

    it('should create a property', () => {
      const customerId = insertTestCustomer(db)

      const property = {
        customer_id: customerId,
        address_line_1: '789 Pine St',
        address_line_2: 'Suite 100',
        town: 'Springfield',
        postcode: 'SP2 2BB',
        notes: 'Corner property'
      }

      const stmt = db.prepare(`
        INSERT INTO properties (customer_id, address_line_1, address_line_2, town, postcode, notes)
        VALUES (@customer_id, @address_line_1, @address_line_2, @town, @postcode, @notes)
      `)
      const info = stmt.run(property)

      expect(info.changes).toBe(1)
      expect(info.lastInsertRowid).toBeGreaterThan(0)
    })

    it('should update a property', () => {
      const customerId = insertTestCustomer(db)
      const propertyId = insertTestProperty(db, {
        customer_id: customerId,
        address_line_1: 'Old Address',
        address_line_2: '',
        town: 'Old Town',
        postcode: 'OLD',
        notes: ''
      })

      const stmt = db.prepare(`
        UPDATE properties 
        SET address_line_1 = @address_line_1, address_line_2 = @address_line_2, town = @town, postcode = @postcode, notes = @notes
        WHERE id = @id
      `)
      const result = stmt.run({
        id: propertyId,
        address_line_1: 'New Address',
        address_line_2: 'Apt 5',
        town: 'New Town',
        postcode: 'NEW',
        notes: 'Updated'
      })

      expect(result.changes).toBe(1)

      const updated = db.prepare('SELECT * FROM properties WHERE id = ?').get(propertyId) as any
      expect(updated.address_line_1).toBe('New Address')
    })

    it('should delete a property', () => {
      const customerId = insertTestCustomer(db)
      const propertyId = insertTestProperty(db, {
        customer_id: customerId,
        address_line_1: 'Test',
        address_line_2: '',
        town: 'Test',
        postcode: 'TST',
        notes: ''
      })

      const result = db.prepare('DELETE FROM properties WHERE id = ?').run(propertyId)
      expect(result.changes).toBe(1)
    })
  })

  describe('Job Operations', () => {
    it('should get jobs for a property', () => {
      const customerId = insertTestCustomer(db)
      const propertyId = insertTestProperty(db, {
        customer_id: customerId,
        address_line_1: 'Test',
        address_line_2: '',
        town: 'Test',
        postcode: 'TST',
        notes: ''
      })

      insertTestJob(db, {
        property_id: propertyId,
        date_completed: '2024-01-15',
        cost: 100,
        certificate_number: 'C1',
        notes: ''
      })
      insertTestJob(db, {
        property_id: propertyId,
        date_completed: '2024-02-20',
        cost: 120,
        certificate_number: 'C2',
        notes: ''
      })

      const jobs = db
        .prepare('SELECT * FROM jobs WHERE property_id = ? ORDER BY date_completed DESC')
        .all(propertyId)

      expect(jobs).toHaveLength(2)
      // Should be ordered by date descending
      expect(jobs[0]).toMatchObject({ date_completed: '2024-02-20' })
    })

    it('should create a job', () => {
      const customerId = insertTestCustomer(db)
      const propertyId = insertTestProperty(db, {
        customer_id: customerId,
        address_line_1: 'Test',
        address_line_2: '',
        town: 'Test',
        postcode: 'TST',
        notes: ''
      })

      const job = {
        property_id: propertyId,
        date_completed: '2024-03-15',
        cost: 175.5,
        certificate_number: 'CERT-2024-001',
        notes: 'Annual chimney sweep and inspection'
      }

      const stmt = db.prepare(`
        INSERT INTO jobs (property_id, date_completed, cost, certificate_number, notes)
        VALUES (@property_id, @date_completed, @cost, @certificate_number, @notes)
      `)
      const info = stmt.run(job)

      expect(info.changes).toBe(1)
      expect(info.lastInsertRowid).toBeGreaterThan(0)
    })

    it('should update a job', () => {
      const customerId = insertTestCustomer(db)
      const propertyId = insertTestProperty(db, {
        customer_id: customerId,
        address_line_1: 'Test',
        address_line_2: '',
        town: 'Test',
        postcode: 'TST',
        notes: ''
      })
      const jobId = insertTestJob(db, {
        property_id: propertyId,
        date_completed: '2024-01-01',
        cost: 100,
        certificate_number: 'OLD',
        notes: ''
      })

      const stmt = db.prepare(`
        UPDATE jobs 
        SET date_completed = @date_completed, cost = @cost, certificate_number = @certificate_number, notes = @notes
        WHERE id = @id
      `)
      const result = stmt.run({
        id: jobId,
        date_completed: '2024-01-02',
        cost: 150,
        certificate_number: 'NEW',
        notes: 'Updated job'
      })

      expect(result.changes).toBe(1)

      const updated = db.prepare('SELECT * FROM jobs WHERE id = ?').get(jobId) as any
      expect(updated.cost).toBe(150)
      expect(updated.certificate_number).toBe('NEW')
    })

    it('should delete a job', () => {
      const customerId = insertTestCustomer(db)
      const propertyId = insertTestProperty(db, {
        customer_id: customerId,
        address_line_1: 'Test',
        address_line_2: '',
        town: 'Test',
        postcode: 'TST',
        notes: ''
      })
      const jobId = insertTestJob(db, {
        property_id: propertyId,
        date_completed: '2024-01-01',
        cost: 100,
        certificate_number: 'DEL',
        notes: ''
      })

      const result = db.prepare('DELETE FROM jobs WHERE id = ?').run(jobId)
      expect(result.changes).toBe(1)
    })
  })

  describe('Reminder Operations', () => {
    it('should get reminders for a specific month/year', () => {
      // Create test data
      const customerId = insertTestCustomer(db, {
        title: 'Mr',
        first_name: 'Test',
        last_name: 'Customer',
        phone: '555-0000',
        email: 'test@example.com'
      })
      const propertyId = insertTestProperty(db, {
        customer_id: customerId,
        address_line_1: '123 Test St',
        address_line_2: '',
        town: 'Testville',
        postcode: 'T1 1TT',
        notes: ''
      })

      // Insert a job completed in January 2024
      insertTestJob(db, {
        property_id: propertyId,
        date_completed: '2024-01-15',
        cost: 150,
        certificate_number: 'CERT-001',
        notes: ''
      })

      // Query for January 2024 reminders
      const month = 1
      const year = 2024
      const startStr = `${year}-${month.toString().padStart(2, '0')}-01`
      const endStr = `${year}-${month.toString().padStart(2, '0')}-31`

      const stmt = db.prepare(`
        WITH LatestJobs AS (
          SELECT property_id, MAX(date_completed) as last_date
          FROM jobs
          GROUP BY property_id
        ),
        LatestReminders AS (
          SELECT property_id, MAX(date_sent) as last_reminder_date
          FROM reminder_history
          GROUP BY property_id
        )
        SELECT 
          c.title, c.first_name, c.last_name, c.phone, c.email,
          p.address_line_1, p.address_line_2, p.town, p.postcode,
          j.date_completed as last_sweep_date,
          j.id as job_id,
          p.id as property_id,
          lr.last_reminder_date
        FROM LatestJobs lj
        JOIN jobs j ON j.property_id = lj.property_id AND j.date_completed = lj.last_date
        JOIN properties p ON p.id = lj.property_id
        JOIN customers c ON c.id = p.customer_id
        LEFT JOIN LatestReminders lr ON lr.property_id = p.id
        WHERE j.date_completed BETWEEN @start AND @end
        ORDER BY j.date_completed ASC
      `)

      const reminders = stmt.all({ start: startStr, end: endStr })

      expect(reminders).toHaveLength(1)
      expect(reminders[0]).toMatchObject({
        first_name: 'Test',
        last_name: 'Customer',
        last_sweep_date: '2024-01-15'
      })
    })

    it('should record reminder history', () => {
      const customerId = insertTestCustomer(db)
      const propertyId = insertTestProperty(db, {
        customer_id: customerId,
        address_line_1: 'Test',
        address_line_2: '',
        town: 'Test',
        postcode: 'TST',
        notes: ''
      })

      const stmt = db.prepare('INSERT INTO reminder_history (property_id, method) VALUES (?, ?)')
      const info = stmt.run(propertyId, 'email')

      expect(info.changes).toBe(1)

      // Verify it was recorded
      const history = db
        .prepare('SELECT * FROM reminder_history WHERE property_id = ?')
        .all(propertyId)
      expect(history).toHaveLength(1)
      expect(history[0]).toMatchObject({ property_id: propertyId, method: 'email' })
    })
  })
})
