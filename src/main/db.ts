import initSqlJs, { Database } from 'sql.js'
import { DatabaseRequest, DatabaseResponse } from '../shared/ipc.types'

let db: Database | null = null

/**
 * Initialize the SQLite database
 */
export const initializeDatabase = async (): Promise<void> => {
  try {
    const SQL = await initSqlJs({
      locateFile: (file: string) => `https://sql.js.org/dist/${file}`
    })
    db = new SQL.Database()

    // Create tables
    createTables()
    console.log('[DB] Database initialized')
  } catch (error) {
    console.error('[DB] Failed to initialize database:', error)
    // Don't throw - let the app start anyway
  }
}

/**
 * Create database tables
 */
const createTables = (): void => {
  if (!db) throw new Error('Database not initialized')

  // Customers table
  db.run(`
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
  db.run(`
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
      FOREIGN KEY (customerId) REFERENCES customers(id)
    )
  `)

  // Service logs table
  db.run(`
    CREATE TABLE IF NOT EXISTS serviceLogs (
      id TEXT PRIMARY KEY,
      propertyId TEXT NOT NULL,
      serviceType TEXT NOT NULL,
      serviceDate TEXT NOT NULL,
      cost REAL,
      notes TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (propertyId) REFERENCES properties(id)
    )
  `)
}

/**
 * Handle database requests
 */
export const handleDatabaseRequest = async (request: DatabaseRequest): Promise<DatabaseResponse> => {
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
  const columns = Object.keys(data).join(', ')
  const values = Object.values(data).map(v => (typeof v === 'boolean' ? (v ? 1 : 0) : v)) as (
    | string
    | number
    | Uint8Array
    | null
  )[]
  const placeholders = values.map(() => '?').join(', ')

  db.run(`INSERT INTO ${table} (${columns}) VALUES (${placeholders})`, values)
  return { success: true, data: { id: data.id } }
}

const handleRead = (request: DatabaseRequest): DatabaseResponse => {
  if (!db || !request.id) {
    return { success: false, error: 'Invalid request' }
  }

  const { table, id } = request
  const stmt = db.prepare(`SELECT * FROM ${table} WHERE id = ?`)
  stmt.bind([id])

  if (stmt.step()) {
    const row = stmt.getAsObject()
    stmt.free()
    return { success: true, data: row }
  }

  stmt.free()
  return { success: false, error: 'Not found' }
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
    .map(v => (typeof v === 'boolean' ? (v ? 1 : 0) : v)) as (string | number | Uint8Array | null)[]

  db.run(`UPDATE ${table} SET ${updates} WHERE id = ?`, values)
  return { success: true, data: { id } }
}

const handleDelete = (request: DatabaseRequest): DatabaseResponse => {
  if (!db || !request.id) {
    return { success: false, error: 'Invalid request' }
  }

  const { table, id } = request
  db.run(`DELETE FROM ${table} WHERE id = ?`, [id])
  return { success: true }
}

const handleList = (request: DatabaseRequest): DatabaseResponse => {
  if (!db) {
    return { success: false, error: 'Invalid request' }
  }

  const { table, filters } = request
  let query = `SELECT * FROM ${table}`
  const values: (string | number | Uint8Array | null)[] = []

  if (filters) {
    const whereClause = Object.keys(filters)
      .map(key => {
        const val = filters[key]
        const sqlVal = typeof val === 'boolean' ? (val ? 1 : 0) : val
        values.push(sqlVal as string | number | Uint8Array | null)
        return `${key} = ?`
      })
      .join(' AND ')
    query += ` WHERE ${whereClause}`
  }

  const stmt = db.prepare(query)
  stmt.bind(values)

  const results = []
  while (stmt.step()) {
    results.push(stmt.getAsObject())
  }
  stmt.free()

  return { success: true, data: results }
}
