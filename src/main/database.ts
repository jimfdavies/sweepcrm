import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'

let db: Database.Database | null = null

export function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const userDataPath = app.getPath('userData')
      const dbPath = path.join(userDataPath, 'sweepcrm.db')
      console.log(`[DB] Attempting to initialize database at: ${dbPath}`)
      db = new Database(dbPath) // No encryption for now
      console.log('[DB] Database connection established.')
      // For now, let's create a dummy table to ensure connection works
      db.exec(`
        CREATE TABLE IF NOT EXISTS test_table (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT
        );
      `)
      console.log('[DB] Test table created or already exists.')
      resolve()
    } catch (error) {
      console.error('[DB] Failed to initialize database:', error)
      reject(error)
    }
  })
}

export function getDb(): Database.Database {
  if (!db) {
    throw new Error('Database not initialized. Call initializeDatabase() first.')
  }
  return db
}

export function closeDatabase(): void {
  if (db) {
    db.close()
    console.log('Database closed.')
    db = null
  }
}
