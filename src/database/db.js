const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

// In development, store db in project root. In production, use userData.
const isDev = process.env.NODE_ENV === 'development';
const dbPath = isDev 
  ? path.join(__dirname, '../../sweepcrm.db')
  : path.join(app.getPath('userData'), 'sweepcrm.db');

let db;

function getDb() {
  if (!db) {
    db = new Database(dbPath, { verbose: console.log });
    db.pragma('journal_mode = WAL');
  }
  return db;
}

function initDatabase() {
  const db = getDb();
  
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create Customers Table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // Create Properties Table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      address_line_1 TEXT NOT NULL,
      address_line_2 TEXT,
      town TEXT NOT NULL,
      postcode TEXT NOT NULL,
      notes TEXT,
      FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
    )
  `).run();

  // Create Jobs Table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER NOT NULL,
      date_completed DATE NOT NULL,
      cost INTEGER,
      certificate_number TEXT,
      notes TEXT,
      FOREIGN KEY (property_id) REFERENCES properties (id) ON DELETE CASCADE
    )
  `).run();

  console.log('Database initialized successfully.');
}

module.exports = { getDb, initDatabase };
