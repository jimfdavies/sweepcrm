import type Database from 'sql.js'

/**
 * SQL schema for SweepCRM database.
 * Defines tables for customers, properties, and jobs (sweeps).
 */

export const SCHEMA_STATEMENTS = [
  // Customers table
  `CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // Properties table (multiple per customer, e.g., landlords with multiple properties)
  `CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    address_line_1 TEXT NOT NULL,
    address_line_2 TEXT,
    town TEXT NOT NULL,
    postcode TEXT NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
  )`,

  // Jobs table (sweeping history)
  `CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL,
    date_completed DATE NOT NULL,
    cost INTEGER,
    certificate_number TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
  )`,

  // Create indexes for performance
  `CREATE INDEX IF NOT EXISTS idx_properties_customer_id ON properties(customer_id)`,
  `CREATE INDEX IF NOT EXISTS idx_jobs_property_id ON jobs(property_id)`,
  `CREATE INDEX IF NOT EXISTS idx_jobs_date_completed ON jobs(date_completed)`,
  `CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone)`,
  `CREATE INDEX IF NOT EXISTS idx_properties_postcode ON properties(postcode)`
]

/**
 * Initialize database schema.
 * Creates tables if they don't exist.
 */
export function initializeSchema(db: Database.Database): void {
  try {
    for (const statement of SCHEMA_STATEMENTS) {
      db.run(statement)
    }
    console.log('[DB] Schema initialized successfully')
  } catch (error) {
    console.error('[DB] Failed to initialize schema:', error)
    throw error
  }
}

/**
 * Seed database with sample data for development/testing.
 */
export function seedDatabase(db: Database.Database): void {
  try {
    // Check if data already exists
    const result = db.exec('SELECT COUNT(*) as count FROM customers')
    if (result.length > 0 && result[0].values.length > 0) {
      const count = (result[0].values[0][0] as number) || 0
      if (count > 0) {
        console.log('[DB] Database already seeded, skipping')
        return
      }
    }

    // Insert sample customers
    const customers = [
      ['Mr', 'John', 'Smith', '01234 567890', 'john@example.com', 'Regular customer'],
      ['Mrs', 'Jane', 'Doe', '01234 567891', 'jane@example.com', 'Landlord with 3 properties'],
      ['Mr', 'Robert', 'Johnson', '01234 567892', 'robert@example.com', null]
    ]

    const customerIds: number[] = []
    for (const customer of customers) {
      db.run(
        `INSERT INTO customers (title, first_name, last_name, phone, email, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        customer
      )
      // Get last inserted ID
      const lastId = db.exec('SELECT last_insert_rowid() as id')
      if (lastId.length > 0 && lastId[0].values.length > 0) {
        customerIds.push(lastId[0].values[0][0] as number)
      }
    }

    console.log(`[DB] Seeded ${customerIds.length} customers`)

    // Insert sample properties
    const properties = [
      [customerIds[0], '10 Main Street', null, 'London', 'SW1A 1AA', 'Victorian townhouse'],
      [customerIds[1], '42 Oak Lane', 'Apartment 3B', 'Manchester', 'M1 1AA', 'Access code 1234'],
      [customerIds[1], '100 Elm Road', null, 'Manchester', 'M2 1AA', 'Dog on premises'],
      [customerIds[2], '5 Birch Avenue', null, 'Birmingham', 'B1 1AA', null]
    ]

    const propertyIds: number[] = []
    for (const property of properties) {
      db.run(
        `INSERT INTO properties (customer_id, address_line_1, address_line_2, town, postcode, notes)
         VALUES (?, ?, ?, ?, ?, ?)`,
        property
      )
      const lastId = db.exec('SELECT last_insert_rowid() as id')
      if (lastId.length > 0 && lastId[0].values.length > 0) {
        propertyIds.push(lastId[0].values[0][0] as number)
      }
    }

    console.log(`[DB] Seeded ${propertyIds.length} properties`)

    // Insert sample jobs
    const jobs = [
      [propertyIds[0], '2024-11-04', 15000, 'CERT-2024-001', 'Bird nest removed'],
      [propertyIds[0], '2023-11-05', 15000, 'CERT-2023-001', null],
      [propertyIds[1], '2024-10-15', 12000, 'CERT-2024-002', 'Standard sweep'],
      [propertyIds[2], '2024-12-01', 18000, 'CERT-2024-003', 'Heavy soot removal'],
      [propertyIds[3], '2024-01-10', 15000, 'CERT-2024-004', null]
    ]

    for (const job of jobs) {
      db.run(
        `INSERT INTO jobs (property_id, date_completed, cost, certificate_number, notes)
         VALUES (?, ?, ?, ?, ?)`,
        job
      )
    }

    console.log(`[DB] Seeded ${jobs.length} jobs`)
  } catch (error) {
    console.error('[DB] Failed to seed database:', error)
    throw error
  }
}
