import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
import { Customer, CustomerDBRow } from '../shared/types'

let db: Database.Database | null = null

export function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const userDataPath = app.getPath('userData')
      const dbPath = path.join(userDataPath, 'sweepcrm.db')
      db = new Database(dbPath) // No encryption for now
      // For now, let's create a dummy table to ensure connection works
      db.exec(`
        CREATE TABLE IF NOT EXISTS customers (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT,
          first_name TEXT NOT NULL,
          last_name TEXT NOT NULL,
          phone TEXT,
          email TEXT,
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TRIGGER IF NOT EXISTS update_customers_timestamp 
        AFTER UPDATE ON customers
        BEGIN
          UPDATE customers SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
        END;

        CREATE TABLE IF NOT EXISTS properties (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          customer_id INTEGER NOT NULL,
          address_line_1 TEXT NOT NULL,
          address_line_2 TEXT,
          town TEXT NOT NULL,
          postcode TEXT NOT NULL,
          notes TEXT,
          service_interval_months INTEGER DEFAULT 12,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
        );

        CREATE TRIGGER IF NOT EXISTS update_properties_timestamp 
        AFTER UPDATE ON properties
        BEGIN
          UPDATE properties SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
        END;

        CREATE TABLE IF NOT EXISTS jobs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          property_id INTEGER NOT NULL,
          date_completed DATE NOT NULL,
          cost DECIMAL(10, 2),
          certificate_number TEXT,
          status TEXT DEFAULT 'completed', -- 'scheduled', 'completed', 'cancelled'
          notes TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
        );

        CREATE TRIGGER IF NOT EXISTS update_jobs_timestamp 
        AFTER UPDATE ON jobs
        BEGIN
          UPDATE jobs SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
        END;
      `)
      console.log('Initial database schema created or already exists.')
      seedDatabase()
      resolve()
    } catch (error) {
      console.error('Failed to initialize database:', error)
      reject(error)
    }
  })
}

function seedDatabase(): void {
  if (!db) return

  const customerCount = db.prepare('SELECT COUNT(*) as count FROM customers').get() as {
    count: number
  }
  if (customerCount.count > 0) return

  console.log('Seeding database...')
  const insertCustomer = db.prepare(`
    INSERT INTO customers (title, first_name, last_name, phone, email, notes)
    VALUES (@title, @first_name, @last_name, @phone, @email, @notes)
  `)

  const insertProperty = db.prepare(`
    INSERT INTO properties (customer_id, address_line_1, address_line_2, town, postcode, notes, service_interval_months)
    VALUES (@customer_id, @address_line_1, @address_line_2, @town, @postcode, @notes, @service_interval_months)
  `)

  const insertJob = db.prepare(`
    INSERT INTO jobs (property_id, date_completed, cost, certificate_number, status, notes)
    VALUES (@property_id, @date_completed, @cost, @certificate_number, @status, @notes)
  `)

  const createTransaction = db.transaction(() => {
    // Customer 1
    const info1 = insertCustomer.run({
      title: 'Mr',
      first_name: 'John',
      last_name: 'Doe',
      phone: '07700900123',
      email: 'john.doe@example.com',
      notes: 'Prefer morning appointments'
    })
    const cust1Id = info1.lastInsertRowid

    const prop1 = insertProperty.run({
      customer_id: cust1Id,
      address_line_1: '123 High Street',
      address_line_2: '',
      town: 'Sweeptown',
      postcode: 'SW1 1AA',
      notes: 'Side gate code 1234',
      service_interval_months: 12
    })

    insertJob.run({
      property_id: prop1.lastInsertRowid,
      date_completed: '2023-10-15',
      cost: 65.0,
      certificate_number: 'CERT001',
      status: 'completed',
      notes: 'Standard sweep'
    })

    // Customer 2
    const info2 = insertCustomer.run({
      title: 'Mrs',
      first_name: 'Jane',
      last_name: 'Smith',
      phone: '07700900456',
      email: 'jane.smith@example.com',
      notes: ''
    })

    insertProperty.run({
      customer_id: info2.lastInsertRowid,
      address_line_1: '456 Low Road',
      address_line_2: 'Flat 2',
      town: 'Sweeptown',
      postcode: 'SW1 1AB',
      notes: 'Ring doorbell',
      service_interval_months: 6
    })
  })

  createTransaction()
  console.log('Database seeded.')
}

export function getDb(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return db
}

export function getCustomerById(id: number): CustomerDBRow | null {
  if (!db) {
    throw new Error('Database not initialized.')
  }
  const row = db.prepare('SELECT * FROM customers WHERE id = ?').get(id) as
    | CustomerDBRow
    | undefined
  return row || null
}

interface DBOperationResult {
  success: boolean
  changes?: number
  error?: string
}

export function updateCustomer(customer: Customer): DBOperationResult {
  if (!db) {
    throw new Error('Database not initialized.')
  }
  if (!customer.id) {
    return { success: false, error: 'Customer ID is required for update.' }
  }

  try {
    const stmt = db.prepare(`
      UPDATE customers
      SET first_name = @first_name,
          last_name = @last_name,
          email = @email,
          phone = @phone,
          notes = @notes,
                title = @title,
                      updated_at = CURRENT_TIMESTAMP
                WHERE id = @id
              `)
          
              const nameParts = customer.name.split(' ')
              const firstName = nameParts[0] || ''
              const lastName = nameParts.slice(1).join(' ') || ''
          
              const info = stmt.run({
                id: customer.id,
                first_name: firstName,
                last_name: lastName,
                email: customer.email,
                phone: customer.phone,
                notes: customer.address, // Address is stored in notes
                title: '' // Default title since it's not in Customer interface
              })
          
              return { success: true, changes: info.changes }
            } catch (error) {
              console.error('Error updating customer in database:', error)
              return { success: false, error: (error as Error).message }
            }
          }
export function closeDatabase(): void {
  if (db) {
    db.close()
    console.log('Database closed.')
    db = null
  }
}
