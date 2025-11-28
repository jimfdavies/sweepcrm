import { ipcMain, dialog, app } from 'electron'
// import { is } from '@electron-toolkit/utils'
import { getDB, closeDB } from '../db/db'
import fs from 'fs'
import path from 'path'

export function setupIPC(): void {
  // Get database path for display
  ipcMain.handle('db:getPath', () => {
    return path.join(app.getPath('userData'), 'sweepcrm.db')
  })

  ipcMain.handle('db:getCustomers', (_, search: string) => {
    const db = getDB()
    if (!search) {
      return db.prepare('SELECT * FROM customers ORDER BY last_name, first_name').all()
    }
    return db
      .prepare(
        `
      SELECT * FROM customers 
      WHERE first_name LIKE @search OR last_name LIKE @search OR phone LIKE @search
      ORDER BY last_name, first_name
    `
      )
      .all({ search: `%${search}%` })
  })

  ipcMain.handle('db:createCustomer', (_, customer) => {
    const db = getDB()
    const stmt = db.prepare(`
      INSERT INTO customers (title, first_name, last_name, phone, email)
      VALUES (@title, @first_name, @last_name, @phone, @email)
    `)
    const info = stmt.run(customer)
    return info.lastInsertRowid
  })

  ipcMain.handle('db:updateCustomer', (_, customer) => {
    const db = getDB()
    const stmt = db.prepare(`
      UPDATE customers 
      SET title = @title, first_name = @first_name, last_name = @last_name, phone = @phone, email = @email
      WHERE id = @id
    `)
    return stmt.run(customer).changes
  })

  ipcMain.handle('db:deleteCustomer', (_, id) => {
    const db = getDB()
    return db.prepare('DELETE FROM customers WHERE id = ?').run(id).changes
  })

  ipcMain.handle('db:getCustomer', (_, id) => {
    const db = getDB()
    return db.prepare('SELECT * FROM customers WHERE id = ?').get(id)
  })

  // Properties
  ipcMain.handle('db:getProperties', (_, customerId) => {
    const db = getDB()
    return db.prepare('SELECT * FROM properties WHERE customer_id = ?').all(customerId)
  })

  ipcMain.handle('db:createProperty', (_, property) => {
    const db = getDB()
    const stmt = db.prepare(`
      INSERT INTO properties (customer_id, address_line_1, address_line_2, town, postcode, notes)
      VALUES (@customer_id, @address_line_1, @address_line_2, @town, @postcode, @notes)
    `)
    const info = stmt.run(property)
    return info.lastInsertRowid
  })

  ipcMain.handle('db:updateProperty', (_, property) => {
    const db = getDB()
    const stmt = db.prepare(`
      UPDATE properties 
      SET address_line_1 = @address_line_1, address_line_2 = @address_line_2, town = @town, postcode = @postcode, notes = @notes
      WHERE id = @id
    `)
    return stmt.run(property).changes
  })

  ipcMain.handle('db:deleteProperty', (_, id) => {
    const db = getDB()
    return db.prepare('DELETE FROM properties WHERE id = ?').run(id).changes
  })

  // Jobs
  ipcMain.handle('db:getJobs', (_, propertyId) => {
    const db = getDB()
    return db
      .prepare('SELECT * FROM jobs WHERE property_id = ? ORDER BY date_completed DESC')
      .all(propertyId)
  })

  ipcMain.handle('db:createJob', (_, job) => {
    const db = getDB()
    const stmt = db.prepare(`
      INSERT INTO jobs (property_id, date_completed, cost, certificate_number, notes)
      VALUES (@property_id, @date_completed, @cost, @certificate_number, @notes)
    `)
    const info = stmt.run(job)
    return info.lastInsertRowid
  })

  ipcMain.handle('db:updateJob', (_, job) => {
    const db = getDB()
    const stmt = db.prepare(`
      UPDATE jobs 
      SET date_completed = @date_completed, cost = @cost, certificate_number = @certificate_number, notes = @notes
      WHERE id = @id
    `)
    return stmt.run(job).changes
  })

  ipcMain.handle('db:deleteJob', (_, id) => {
    const db = getDB()
    return db.prepare('DELETE FROM jobs WHERE id = ?').run(id).changes
  })

  // Reminders
  ipcMain.handle('db:getReminders', (_, { month, year }) => {
    const db = getDB()
    // Find properties where the latest job was in the specified month/year
    // We want customers who were LAST swept in the target month/year
    const startStr = `${year}-${month.toString().padStart(2, '0')}-01`
    const endStr = `${year}-${month.toString().padStart(2, '0')}-31` // Simple upper bound, SQLite handles date comparison stringly

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

    return stmt.all({ start: startStr, end: endStr })
  })

  ipcMain.handle('db:recordReminders', (_, { propertyIds, method }) => {
    const db = getDB()
    const stmt = db.prepare('INSERT INTO reminder_history (property_id, method) VALUES (?, ?)')

    const transaction = db.transaction((ids: number[]) => {
      for (const id of ids) {
        stmt.run(id, method)
      }
    })

    transaction(propertyIds)
    return propertyIds.length
  })

  // Backup & Restore
  ipcMain.handle('db:backup', async () => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Backup Database',
      defaultPath: `sweepcrm_backup_${new Date().toISOString().split('T')[0]}.db`,
      filters: [{ name: 'Database', extensions: ['db'] }]
    })

    if (canceled || !filePath) return false

    try {
      const dbPath = path.join(app.getPath('userData'), 'sweepcrm.db')
      fs.copyFileSync(dbPath, filePath)
      return true
    } catch (err) {
      console.error('Backup failed:', err)
      return false
    }
  })

  ipcMain.handle('db:restore', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      title: 'Restore Database',
      filters: [{ name: 'Database', extensions: ['db'] }],
      properties: ['openFile']
    })

    if (canceled || filePaths.length === 0) return false

    const backupPath = filePaths[0]
    const dbPath = path.join(app.getPath('userData'), 'sweepcrm.db')

    // Close current connection
    closeDB()

    // Replace file
    // Wait a bit to ensure file handle is released
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      fs.copyFileSync(backupPath, dbPath)

      // In production, automatically restart the app
      // In dev mode, just return success and let user manually restart
      if (app.isPackaged) {
        app.relaunch()
        app.exit(0)
      }

      return true
    } catch (err) {
      console.error('Restore failed:', err)
      return false
    }
  })

  ipcMain.handle('db:exportReminders', async (_, { content, filename }) => {
    const { canceled, filePath } = await dialog.showSaveDialog({
      title: 'Export Reminders',
      defaultPath: filename,
      filters: [{ name: 'CSV', extensions: ['csv'] }]
    })

    if (canceled || !filePath) return false

    try {
      fs.writeFileSync(filePath, content, 'utf-8')
      return true
    } catch (err) {
      console.error('Export failed:', err)
      return false
    }
  })
}
