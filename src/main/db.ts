import Database from 'better-sqlite3'
import { join } from 'path'
import { app } from 'electron'
import { existsSync, mkdirSync } from 'fs'
import { DatabaseRequest, DatabaseResponse } from '../shared/ipc.types'

let db: Database.Database | null = null

/**
 * Get the database file path
 * Uses different app names for dev vs test to keep databases separate
 */
const getDbPath = (): string => {
  const isPlaywrightTest = process.env.PLAYWRIGHT_TEST === 'true'
  const appName = isPlaywrightTest ? 'SweepCRM-Test' : 'SweepCRM'
  
  // Use explicit path construction instead of app.getPath('userData')
  // to ensure consistent app name regardless of how Electron is launched
  const appData = join(app.getPath('home'), 'Library', 'Application Support', appName)
  const dbDir = join(appData, 'db')

  // Create directory if it doesn't exist
  if (!existsSync(dbDir)) {
    mkdirSync(dbDir, { recursive: true })
  }

  return join(dbDir, 'sweepcrm.db')
}

/**
 * Initialize the SQLite database
 */
export const initializeDatabase = (): void => {
  try {
    const dbPath = getDbPath()
    db = new Database(dbPath)

    // Enable foreign keys
    db.pragma('foreign_keys = ON')

    // Create tables
    createTables()
    console.log('[DB] Database initialized at', dbPath)
  } catch (error) {
    console.error('[DB] Failed to initialize database:', error)
    throw error
  }
}

/**
 * Create database tables
 */
const createTables = (): void => {
  if (!db) throw new Error('Database not initialized')

  // Customers table
  db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id TEXT PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      address TEXT,
      notes TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Properties table
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      customerId TEXT NOT NULL,
      address TEXT NOT NULL,
      squareFeet INTEGER,
      chimneyCount INTEGER DEFAULT 1,
      lastCleanedDate TEXT,
      notes TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
    )
  `)

  // Service logs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS serviceLogs (
      id TEXT PRIMARY KEY,
      propertyId TEXT NOT NULL,
      serviceType TEXT NOT NULL,
      serviceDate TEXT NOT NULL,
      cost REAL,
      notes TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (propertyId) REFERENCES properties(id) ON DELETE CASCADE
    )
  `)
}

/**
 * Handle database requests
 */
export const handleDatabaseRequest = (request: DatabaseRequest): DatabaseResponse => {
  if (!db) {
    return {
      success: false,
      error: 'Database not initialized'
    }
  }

  try {
    switch (request.operation) {
      case 'create':
        return handleCreate(request)
      case 'read':
        return handleRead(request)
      case 'update':
        return handleUpdate(request)
      case 'delete':
        return handleDelete(request)
      case 'list':
        return handleList(request)
      default:
        return {
          success: false,
          error: `Unknown operation: ${request.operation}`
        }
    }
  } catch (error) {
    console.error('[DB] Operation failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

const handleCreate = (request: DatabaseRequest): DatabaseResponse => {
  if (!db || !request.data) {
    return { success: false, error: 'Invalid request' }
  }

  const { table, data } = request
  const columns = Object.keys(data)
  const placeholders = columns.map(() => '?').join(', ')
  const values = Object.values(data)

  try {
    const stmt = db.prepare(`INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`)
    stmt.run(...values)
    return { success: true, data: { id: data.id } }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Insert failed' }
  }
}

const handleRead = (request: DatabaseRequest): DatabaseResponse => {
  if (!db || !request.id) {
    return { success: false, error: 'Invalid request' }
  }

  const { table, id } = request

  try {
    const stmt = db.prepare(`SELECT * FROM ${table} WHERE id = ?`)
    const row = stmt.get(id) as Record<string, unknown>

    if (!row) {
      return { success: false, error: 'Not found' }
    }

    return { success: true, data: row }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Read failed' }
  }
}

const handleUpdate = (request: DatabaseRequest): DatabaseResponse => {
  if (!db || !request.id || !request.data) {
    return { success: false, error: 'Invalid request' }
  }

  const { table, id, data } = request
  const updates = Object.keys(data)
    .map(key => `${key} = ?`)
    .join(', ')
  const values = [...Object.values(data), id]

  try {
    const stmt = db.prepare(`UPDATE ${table} SET ${updates} WHERE id = ?`)
    stmt.run(...values)
    return { success: true, data: { id } }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Update failed' }
  }
}

const handleDelete = (request: DatabaseRequest): DatabaseResponse => {
  if (!db || !request.id) {
    return { success: false, error: 'Invalid request' }
  }

  const { table, id } = request

  try {
    const stmt = db.prepare(`DELETE FROM ${table} WHERE id = ?`)
    stmt.run(id)
    return { success: true }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Delete failed' }
  }
}

const handleList = (request: DatabaseRequest): DatabaseResponse => {
  if (!db) {
    return { success: false, error: 'Invalid request' }
  }

  const { table, filters } = request
  let query = `SELECT * FROM ${table}`
  const values: unknown[] = []

  if (filters) {
    const whereClause = Object.keys(filters)
      .map(key => {
        values.push(filters[key])
        return `${key} = ?`
      })
      .join(' AND ')
    query += ` WHERE ${whereClause}`
  }

  try {
    const stmt = db.prepare(query)
    const results = stmt.all(...values) as Record<string, unknown>[]
    return { success: true, data: results }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'List failed' }
  }
}

/**
 * Close the database connection
 */
export const closeDatabase = (): void => {
  if (db) {
    db.close()
    db = null
    console.log('[DB] Database closed')
  }
}

/**
 * Reset the database (for testing)
 */
export const resetDatabase = (): void => {
  try {
    if (db) {
      db.exec('DELETE FROM serviceLogs')
      db.exec('DELETE FROM properties')
      db.exec('DELETE FROM customers')
    }
    console.log('[DB] Database reset')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('[DB] Error resetting database:', error)
    }
  }
}
