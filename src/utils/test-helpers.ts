import Database from 'better-sqlite3-multiple-ciphers'
import { schema } from '../db/schema'

/**
 * Create an in-memory test database with the app schema
 * Note: Encryption is not supported for in-memory databases
 * @returns Database instance
 */
export function createTestDB(): Database.Database {
  const db = new Database(':memory:')

  // Initialize schema
  db.exec(schema)

  return db
}

/**
 * Sample customer data for tests
 */
export const testCustomer = {
  title: 'Mr',
  first_name: 'John',
  last_name: 'Doe',
  phone: '555-1234',
  email: 'john.doe@example.com'
}

/**
 * Sample property data for tests
 */
export const testProperty = {
  customer_id: 1,
  address_line_1: '123 Main St',
  address_line_2: 'Apt 4',
  town: 'Springfield',
  postcode: 'SP1 1AA',
  notes: 'Test property notes'
}

/**
 * Sample job data for tests
 */
export const testJob = {
  property_id: 1,
  date_completed: '2024-01-15',
  cost: 150.0,
  certificate_number: 'CERT-12345',
  notes: 'Annual chimney sweep'
}

/**
 * Insert a test customer and return the ID
 */
export function insertTestCustomer(db: Database.Database, customer = testCustomer): number {
  const stmt = db.prepare(`
    INSERT INTO customers (title, first_name, last_name, phone, email)
    VALUES (@title, @first_name, @last_name, @phone, @email)
  `)
  const info = stmt.run(customer)
  return Number(info.lastInsertRowid)
}

/**
 * Insert a test property and return the ID
 */
export function insertTestProperty(db: Database.Database, property = testProperty): number {
  const stmt = db.prepare(`
    INSERT INTO properties (customer_id, address_line_1, address_line_2, town, postcode, notes)
    VALUES (@customer_id, @address_line_1, @address_line_2, @town, @postcode, @notes)
  `)
  const info = stmt.run(property)
  return Number(info.lastInsertRowid)
}

/**
 * Insert a test job and return the ID
 */
export function insertTestJob(db: Database.Database, job = testJob): number {
  const stmt = db.prepare(`
    INSERT INTO jobs (property_id, date_completed, cost, certificate_number, notes)
    VALUES (@property_id, @date_completed, @cost, @certificate_number, @notes)
  `)
  const info = stmt.run(job)
  return Number(info.lastInsertRowid)
}
