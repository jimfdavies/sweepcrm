import initSqlJs from 'sql.js'
import { app } from 'electron'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { initializeSchema, seedDatabase } from './schema'

let db: any = null
let SQL: any = null

/**
 * Get or create database connection.
 * Database file stored in app user data directory.
 */
export async function getDatabase(): Promise<any> {
  if (db) {
    return db
  }

  if (!SQL) {
    SQL = await initSqlJs()
  }

  const dbPath = resolve(app.getPath('userData'), 'sweepcrm.db')
  console.log(`[DB] Opening database at ${dbPath}`)

  try {
    let data: Buffer | undefined
    if (existsSync(dbPath)) {
      data = readFileSync(dbPath)
    }

    // Create or open database
    db = new SQL.Database(data)

    // Initialize schema
    initializeSchema(db)

    // Seed with sample data if needed
    seedDatabase(db)

    // Save to disk
    saveDatabase()

    console.log('[DB] Database initialized successfully')
    return db
  } catch (error) {
    console.error('[DB] Failed to initialize database:', error)
    throw error
  }
}

/**
 * Save database to disk.
 */
export function saveDatabase(): void {
  if (!db) {
    return
  }

  try {
    const data = db.export()
    const buffer = Buffer.from(data)
    const dbPath = resolve(app.getPath('userData'), 'sweepcrm.db')
    writeFileSync(dbPath, buffer)
    console.log('[DB] Database saved to disk')
  } catch (error) {
    console.error('[DB] Failed to save database:', error)
    throw error
  }
}

/**
 * Close database connection.
 */
export function closeDatabase(): void {
  if (db) {
    try {
      saveDatabase()
      db.close()
      db = null
      console.log('[DB] Database closed')
    } catch (error) {
      console.error('[DB] Error closing database:', error)
    }
  }
}

/**
 * Reset database (for testing).
 */
export function resetDatabase(): void {
  closeDatabase()
  const dbPath = resolve(app.getPath('userData'), 'sweepcrm.db')
  try {
    if (existsSync(dbPath)) {
      require('fs').unlinkSync(dbPath)
    }
    console.log('[DB] Database reset')
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      console.error('[DB] Error resetting database:', error)
    }
  }
}

export { initializeSchema, seedDatabase } from './schema'
