import Database from 'better-sqlite3-multiple-ciphers'
import path from 'path'
import fs from 'fs'
import { app } from 'electron'
import { schema } from './schema'

let db: Database.Database | null = null

export function initDB(password: string): boolean {
  try {
    const userDataPath = app.getPath('userData')
    const dbPath = path.join(userDataPath, 'sweepcrm.db')
    const isNew = !fs.existsSync(dbPath)

    console.log('Opening database at:', dbPath)

    db = new Database(dbPath)

    // Set encryption key
    db.pragma(`key='${password}'`)

    // Test connection (will throw if password wrong)
    db.prepare('SELECT count(*) FROM sqlite_master').get()

    if (isNew) {
      console.log('Initializing new database schema...')
      db.exec(schema)
    }

    return true
  } catch (error) {
    console.error('Failed to open database:', error)
    if (db) {
      try {
        db.close()
      } catch {
        /* ignore */
      }
    }
    db = null
    return false
  }
}

export function getDB(): Database.Database {
  if (!db) throw new Error('Database not initialized')
  return db
}

export function closeDB(): void {
  if (db) {
    db.close()
    db = null
  }
}
